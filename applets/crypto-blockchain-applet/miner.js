/**
 * Mining controller (main thread)
 * Manages Web Worker for proof-of-work mining
 */

export class Miner {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.worker = null;
    this.mining = false;
    this.throttle = 0; // Mining throttle in ms (0 = no throttle)
    this.currentBlock = null;
    this.miningStartTime = null;

    // Callbacks
    this.onProgress = null;
    this.onComplete = null;
    this.onError = null;
  }

  /**
   * Set mining throttle (delay between hash attempts)
   * @param {number} ms - Milliseconds to delay (0-100)
   */
  setThrottle(ms) {
    this.throttle = Math.max(0, Math.min(100, ms));
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
    this.mining = true;

    // Use Web Worker if available
    if (this.isWorkerSupported()) {
      await this.mineWithWorker();
    } else {
      // Fallback to main thread
      console.warn('Web Workers not supported, mining on main thread');
      this.mineOnMainThread();
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
      return this.hash('');
    }
    const txIds = transactions.map(tx => tx.id).join('');
    return this.hash(txIds);
  }

  /**
   * Hash data (using SHA-256 from crypto-utils)
   */
  hash(data) {
    // Import needed - will be handled by module system
    // For now, we'll use a simple hash
    const message = typeof data === 'string' ? data : JSON.stringify(data);

    // This should use the SHA-256 from crypto-utils
    // For worker communication, we send block data as object
    return message;
  }

  /**
   * Mine using Web Worker
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
            throttle: this.throttle
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

          // Add block to blockchain
          this.addMinedBlock();

          // Report completion
          if (this.onComplete) {
            this.onComplete({
              block: this.currentBlock,
              attempts,
              hashRate,
              timeMs
            });
          }

          // Cleanup
          this.stopMining();
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
   * Mine on main thread (fallback)
   */
  mineOnMainThread() {
    // This is a simplified version that runs in chunks
    // to avoid blocking the UI completely
    let nonce = 0;
    let attempts = 0;
    const chunkSize = 1000; // Hash attempts per chunk

    const mineChunk = () => {
      if (!this.mining) return;

      const chunkStart = Date.now();

      for (let i = 0; i < chunkSize; i++) {
        this.currentBlock.nonce = nonce;
        const hash = this.calculateBlockHash();
        attempts++;

        if (this.meetsRequired(hash, this.currentBlock.difficulty)) {
          // Found valid block!
          this.currentBlock.hash = hash;
          this.addMinedBlock();

          const totalTime = Date.now() - this.miningStartTime;
          if (this.onComplete) {
            this.onComplete({
              block: this.currentBlock,
              attempts,
              hashRate: Math.round(attempts / (totalTime / 1000)),
              timeMs: totalTime
            });
          }

          this.stopMining();
          return;
        }

        nonce++;
      }

      // Report progress
      const elapsed = Date.now() - this.miningStartTime;
      const hashRate = Math.round(attempts / (elapsed / 1000));

      if (this.onProgress && attempts % 5000 === 0) {
        this.onProgress({
          attempts,
          hashRate,
          elapsed,
          currentHash: this.currentBlock.hash,
          nonce,
          blockIndex: this.currentBlock.index,
          difficulty: this.currentBlock.difficulty
        });
      }

      // Schedule next chunk
      setTimeout(mineChunk, this.throttle);
    };

    mineChunk();
  }

  /**
   * Calculate hash of current block
   */
  calculateBlockHash() {
    // Import SHA-256 from crypto-utils
    // This will be handled properly with modules
    const blockData = {
      index: this.currentBlock.index,
      timestamp: this.currentBlock.timestamp,
      merkleRoot: this.currentBlock.merkleRoot,
      previousHash: this.currentBlock.previousHash,
      difficulty: this.currentBlock.difficulty,
      nonce: this.currentBlock.nonce
    };

    // Placeholder - will use imported sha256
    return JSON.stringify(blockData);
  }

  /**
   * Check if hash meets difficulty
   */
  meetsRequired(hash, difficulty) {
    const prefix = '0'.repeat(difficulty);
    return hash.startsWith(prefix);
  }

  /**
   * Add mined block to blockchain
   */
  addMinedBlock() {
    // Import Block class
    // Convert our block data to Block instance
    const { Block } = require('./blockchain.js'); // Will be handled by module system

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

    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    this.currentBlock = null;
    this.miningStartTime = null;
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

    return {
      mining: true,
      blockIndex: this.currentBlock.index,
      difficulty: this.currentBlock.difficulty,
      elapsed: Date.now() - this.miningStartTime,
      throttle: this.throttle
    };
  }
}
