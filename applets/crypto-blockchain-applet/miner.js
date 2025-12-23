/**
 * Mining controller (main thread)
 * Supports both controlled hash rate and Web Worker mining
 */

import { sha256 } from './crypto-utils.js';
import { Block } from './blockchain.js';

export class Miner {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.worker = null;
    this.mining = false;
    this.hashRate = 100; // Target hash rate in H/s (0 = unlimited/Web Worker)
    this.currentBlock = null;
    this.miningStartTime = null;
    this.miningTimeout = null;

    // Statistics
    this.attempts = 0;
    this.lastProgressReport = 0;

    // Callbacks
    this.onProgress = null;
    this.onComplete = null;
    this.onError = null;
  }

  /**
   * Set target hash rate
   * @param {number} hashesPerSecond - Target H/s (0 = unlimited, uses Web Worker)
   */
  setHashRate(hashesPerSecond) {
    this.hashRate = Math.max(0, Math.min(100000, hashesPerSecond));
  }

  /**
   * Get target hash rate
   */
  getHashRate() {
    return this.hashRate;
  }

  /**
   * Check if Web Workers are supported
   */
  isWorkerSupported() {
    return typeof Worker !== 'undefined';
  }

  /**
   * Start mining a new block
   * @param {string} minerAddress - Address to receive mining reward
   * @param {Function} onProgress - Progress callback
   * @param {Function} onComplete - Completion callback
   * @param {Function} onError - Error callback
   */
  async startMining(minerAddress, onProgress = null, onComplete = null, onError = null) {
    if (this.mining) {
      throw new Error('Already mining');
    }

    if (!minerAddress) {
      throw new Error('Miner address required');
    }

    this.onProgress = onProgress;
    this.onComplete = onComplete;
    this.onError = onError;

    // Prepare block to mine
    this.currentBlock = this.prepareBlock(minerAddress);
    this.miningStartTime = Date.now();
    this.attempts = 0;
    this.lastProgressReport = 0;
    this.mining = true;

    // Choose mining mode based on hash rate setting
    if (this.hashRate === 0 && this.isWorkerSupported()) {
      // Unlimited mode - use Web Worker
      await this.mineWithWorker();
    } else {
      // Controlled hash rate - use main thread with timing
      this.mineWithControlledRate();
    }
  }

  /**
   * Prepare block for mining
   */
  prepareBlock(minerAddress) {
    // Create coinbase transaction
    const blockReward = this.blockchain.config.getBlockReward(this.blockchain.chain.length);
    const fees = this.blockchain.calculateMempoolFees();
    const coinbase = this.blockchain.createCoinbaseTransaction(minerAddress, blockReward + fees);

    // Select transactions from mempool
    const transactions = [coinbase, ...this.blockchain.mempool];

    // Create block data
    const previousHash = this.blockchain.getLatestBlock().hash;
    const index = this.blockchain.chain.length;
    const timestamp = Date.now();
    const difficulty = this.blockchain.difficulty;

    // Calculate merkle root
    const merkleRoot = this.calculateMerkleRoot(transactions);

    return {
      index,
      timestamp,
      transactions,
      previousHash,
      difficulty,
      merkleRoot,
      nonce: 0,
      hash: null
    };
  }

  /**
   * Calculate merkle root
   */
  calculateMerkleRoot(transactions) {
    if (transactions.length === 0) {
      return sha256('');
    }
    const txIds = transactions.map(tx => tx.id).join('');
    return sha256(txIds);
  }

  /**
   * Mine with controlled hash rate (main thread)
   */
  mineWithControlledRate() {
    // Calculate delay between hash attempts
    const delayMs = this.hashRate > 0 ? (1000 / this.hashRate) : 0;

    // Mining step - try one hash
    const mineStep = () => {
      if (!this.mining) return;

      // Calculate hash for current nonce
      const hash = this.calculateBlockHash();
      this.attempts++;

      // Check if hash meets difficulty
      if (this.meetsRequired(hash, this.currentBlock.difficulty)) {
        // Found valid block!
        this.currentBlock.hash = hash;
        this.completeBlock();
        return;
      }

      // Increment nonce for next attempt
      this.currentBlock.nonce++;

      // Report progress periodically
      const now = Date.now();
      if (now - this.lastProgressReport >= 1000) { // Every second
        this.reportProgress(hash);
        this.lastProgressReport = now;
      }

      // Schedule next hash attempt
      if (delayMs > 0) {
        this.miningTimeout = setTimeout(mineStep, delayMs);
      } else {
        // No delay - use setImmediate equivalent
        this.miningTimeout = setTimeout(mineStep, 0);
      }
    };

    // Start mining
    mineStep();
  }

  /**
   * Mine using Web Worker (unlimited speed)
   */
  async mineWithWorker() {
    return new Promise((resolve, reject) => {
      // Create worker
      this.worker = new Worker('mining-worker.js');

      // Handle messages from worker
      this.worker.addEventListener('message', (event) => {
        const { type, nonce, hash, attempts, hashRate, timeMs, currentHash, elapsed, message } = event.data;

        if (type === 'ready') {
          // Worker is ready, start mining
          const blockData = {
            index: this.currentBlock.index,
            timestamp: this.currentBlock.timestamp,
            merkleRoot: this.currentBlock.merkleRoot,
            previousHash: this.currentBlock.previousHash,
            difficulty: this.currentBlock.difficulty,
            nonce: 0
          };

          this.worker.postMessage({
            type: 'start',
            blockData,
            difficulty: this.currentBlock.difficulty,
            throttle: 0
          });

        } else if (type === 'progress') {
          // Report progress
          if (this.onProgress) {
            this.onProgress({
              attempts,
              hashRate,
              elapsed,
              currentHash,
              nonce,
              blockIndex: this.currentBlock.index,
              difficulty: this.currentBlock.difficulty
            });
          }

        } else if (type === 'found') {
          // Block found!
          this.currentBlock.nonce = nonce;
          this.currentBlock.hash = hash;
          this.attempts = attempts;

          this.completeBlock(hashRate, timeMs);
          resolve();

        } else if (type === 'error') {
          // Error occurred
          if (this.onError) {
            this.onError(new Error(message));
          }

          this.stopMining();
          reject(new Error(message));
        }
      });

      // Handle worker errors
      this.worker.addEventListener('error', (error) => {
        console.error('Worker error:', error);
        if (this.onError) {
          this.onError(error);
        }
        this.stopMining();
        reject(error);
      });
    });
  }

  /**
   * Calculate hash of current block
   */
  calculateBlockHash() {
    const blockData = {
      index: this.currentBlock.index,
      timestamp: this.currentBlock.timestamp,
      merkleRoot: this.currentBlock.merkleRoot,
      previousHash: this.currentBlock.previousHash,
      difficulty: this.currentBlock.difficulty,
      nonce: this.currentBlock.nonce
    };

    return sha256(blockData);
  }

  /**
   * Check if hash meets difficulty requirement
   */
  meetsRequired(hash, difficulty) {
    const prefix = '0'.repeat(difficulty);
    return hash.startsWith(prefix);
  }

  /**
   * Report mining progress
   */
  reportProgress(currentHash) {
    if (!this.onProgress) return;

    const elapsed = Date.now() - this.miningStartTime;
    const actualHashRate = elapsed > 0 ? Math.round(this.attempts / (elapsed / 1000)) : 0;

    this.onProgress({
      attempts: this.attempts,
      hashRate: actualHashRate,
      elapsed,
      currentHash,
      nonce: this.currentBlock.nonce,
      blockIndex: this.currentBlock.index,
      difficulty: this.currentBlock.difficulty
    });
  }

  /**
   * Complete block mining
   */
  completeBlock(hashRate = null, timeMs = null) {
    // Add block to blockchain
    this.addMinedBlock();

    // Calculate statistics
    const totalTime = timeMs || (Date.now() - this.miningStartTime);
    const finalHashRate = hashRate || Math.round(this.attempts / (totalTime / 1000));

    // Report completion
    if (this.onComplete) {
      this.onComplete({
        block: this.currentBlock,
        attempts: this.attempts,
        hashRate: finalHashRate,
        timeMs: totalTime
      });
    }

    // Cleanup
    this.stopMining();
  }

  /**
   * Add mined block to blockchain
   */
  addMinedBlock() {
    const block = new Block(
      this.currentBlock.index,
      this.currentBlock.timestamp,
      this.currentBlock.transactions,
      this.currentBlock.previousHash,
      this.currentBlock.difficulty
    );

    block.nonce = this.currentBlock.nonce;
    block.merkleRoot = this.currentBlock.merkleRoot;
    block.hash = this.currentBlock.hash;

    // Add to chain
    this.blockchain.chain.push(block);

    // Clear mempool
    this.blockchain.mempool = [];

    // Adjust difficulty
    this.blockchain.adjustDifficulty();
  }

  /**
   * Stop mining
   */
  stopMining() {
    this.mining = false;

    // Clear timeout if exists
    if (this.miningTimeout) {
      clearTimeout(this.miningTimeout);
      this.miningTimeout = null;
    }

    // Terminate worker if exists
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    this.currentBlock = null;
    this.miningStartTime = null;
    this.attempts = 0;
  }

  /**
   * Check if currently mining
   */
  isMining() {
    return this.mining;
  }

  /**
   * Get mining status
   */
  getStatus() {
    if (!this.mining) {
      return { mining: false };
    }

    const elapsed = Date.now() - this.miningStartTime;
    const actualHashRate = elapsed > 0 ? Math.round(this.attempts / (elapsed / 1000)) : 0;

    return {
      mining: true,
      blockIndex: this.currentBlock.index,
      difficulty: this.currentBlock.difficulty,
      elapsed,
      attempts: this.attempts,
      hashRate: actualHashRate,
      targetHashRate: this.hashRate
    };
  }
}
