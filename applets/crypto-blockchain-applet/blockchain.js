/**
 * Core Blockchain Implementation
 * Educational cryptocurrency blockchain with proof-of-work
 */

import { sha256, meetsRequired, countLeadingZeros, generateTxId } from './crypto-utils.js';

/**
 * Block class representing a single block in the blockchain
 */
export class Block {
  constructor(index, timestamp, transactions, previousHash = '', difficulty = 4) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.difficulty = difficulty;
    this.nonce = 0;
    this.merkleRoot = this.calculateMerkleRoot();
    this.hash = this.calculateHash();
  }

  /**
   * Calculate hash of block
   */
  calculateHash() {
    const blockData = {
      index: this.index,
      timestamp: this.timestamp,
      merkleRoot: this.merkleRoot,
      previousHash: this.previousHash,
      difficulty: this.difficulty,
      nonce: this.nonce
    };
    return sha256(blockData);
  }

  /**
   * Calculate simplified Merkle root (hash of all transactions)
   */
  calculateMerkleRoot() {
    if (this.transactions.length === 0) {
      return sha256('');
    }
    const txIds = this.transactions.map(tx => tx.id).join('');
    return sha256(txIds);
  }

  /**
   * Mine block with proof-of-work
   * @param {Function} progressCallback - Called periodically with progress info
   * @returns {Object} - Mining result with nonce and attempts
   */
  mineBlock(progressCallback = null) {
    const startTime = Date.now();
    let attempts = 0;
    const reportInterval = 10000; // Report every 10k attempts

    while (!meetsRequired(this.hash, this.difficulty)) {
      this.nonce++;
      this.hash = this.calculateHash();
      attempts++;

      if (progressCallback && attempts % reportInterval === 0) {
        const elapsed = Date.now() - startTime;
        const hashRate = attempts / (elapsed / 1000);
        progressCallback({
          attempts,
          hashRate: Math.round(hashRate),
          elapsed,
          currentHash: this.hash
        });
      }
    }

    const totalTime = Date.now() - startTime;
    return {
      nonce: this.nonce,
      attempts,
      hashRate: Math.round(attempts / (totalTime / 1000)),
      timeMs: totalTime
    };
  }

  /**
   * Validate this block
   */
  isValid() {
    // Check hash matches block data
    if (this.hash !== this.calculateHash()) {
      return { valid: false, reason: 'Hash does not match block data' };
    }

    // Check hash meets difficulty
    if (!meetsRequired(this.hash, this.difficulty)) {
      return { valid: false, reason: 'Hash does not meet difficulty requirement' };
    }

    // Check merkle root
    if (this.merkleRoot !== this.calculateMerkleRoot()) {
      return { valid: false, reason: 'Merkle root does not match transactions' };
    }

    return { valid: true };
  }

  /**
   * Serialize block to JSON
   */
  toJSON() {
    return {
      index: this.index,
      timestamp: this.timestamp,
      transactions: this.transactions,
      previousHash: this.previousHash,
      difficulty: this.difficulty,
      nonce: this.nonce,
      merkleRoot: this.merkleRoot,
      hash: this.hash
    };
  }

  /**
   * Create block from JSON
   */
  static fromJSON(data) {
    const block = new Block(
      data.index,
      data.timestamp,
      data.transactions,
      data.previousHash,
      data.difficulty
    );
    block.nonce = data.nonce;
    block.merkleRoot = data.merkleRoot;
    block.hash = data.hash;
    return block;
  }
}

/**
 * Blockchain configuration
 */
export class BlockchainConfig {
  constructor(options = {}) {
    this.blockTimeTarget = options.blockTimeTarget || 10000; // 10 seconds default
    this.initialDifficulty = options.initialDifficulty || 4;
    this.blockReward = options.blockReward || 50;
    this.rewardHalvingInterval = options.rewardHalvingInterval || 0; // 0 = no halving
    this.maxSupply = options.maxSupply || 0; // 0 = unlimited
    this.difficultyAdjustmentInterval = options.difficultyAdjustmentInterval || 10;
    this.genesisMessage = options.genesisMessage || 'Genesis Block - Educational Blockchain';
    this.minTransactionFee = options.minTransactionFee || 0.0001;
    this.maxDifficultyChange = options.maxDifficultyChange || 4; // Max 4x change per adjustment
  }

  /**
   * Get current block reward based on height
   */
  getBlockReward(height) {
    if (this.rewardHalvingInterval === 0) {
      return this.blockReward;
    }

    const halvings = Math.floor(height / this.rewardHalvingInterval);
    if (halvings >= 64) return 0; // After 64 halvings, reward is effectively 0

    return this.blockReward / Math.pow(2, halvings);
  }

  toJSON() {
    return {
      blockTimeTarget: this.blockTimeTarget,
      initialDifficulty: this.initialDifficulty,
      blockReward: this.blockReward,
      rewardHalvingInterval: this.rewardHalvingInterval,
      maxSupply: this.maxSupply,
      difficultyAdjustmentInterval: this.difficultyAdjustmentInterval,
      genesisMessage: this.genesisMessage,
      minTransactionFee: this.minTransactionFee,
      maxDifficultyChange: this.maxDifficultyChange
    };
  }

  static fromJSON(data) {
    return new BlockchainConfig(data);
  }
}

/**
 * Main Blockchain class
 */
export class Blockchain {
  constructor(config = new BlockchainConfig()) {
    this.config = config;
    this.chain = [];
    this.difficulty = config.initialDifficulty;
    this.mempool = []; // Pending transactions
  }

  /**
   * Create the genesis block
   */
  createGenesisBlock() {
    const genesisTransaction = {
      id: generateTxId({
        inputs: [],
        outputs: [{ address: 'genesis', amount: 0 }],
        timestamp: Date.now()
      }),
      inputs: [],
      outputs: [{ address: 'genesis', amount: 0 }],
      timestamp: Date.now(),
      data: this.config.genesisMessage
    };

    const genesisBlock = new Block(
      0,
      Date.now(),
      [genesisTransaction],
      '0',
      this.difficulty
    );

    // Genesis block is pre-mined
    genesisBlock.hash = genesisBlock.calculateHash();

    this.chain.push(genesisBlock);
    return genesisBlock;
  }

  /**
   * Get latest block
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Get block by index
   */
  getBlock(index) {
    return this.chain[index];
  }

  /**
   * Add a transaction to mempool
   */
  addTransaction(transaction) {
    // Validate transaction
    const validation = this.validateTransaction(transaction);
    if (!validation.valid) {
      throw new Error(`Invalid transaction: ${validation.reason}`);
    }

    this.mempool.push(transaction);
    return transaction.id;
  }

  /**
   * Mine a new block with pending transactions
   * @param {string} minerAddress - Address to receive mining reward
   * @param {Function} progressCallback - Called during mining
   */
  mineBlock(minerAddress, progressCallback = null) {
    // Create coinbase transaction
    const blockReward = this.config.getBlockReward(this.chain.length);
    const fees = this.calculateMempoolFees();
    const coinbase = this.createCoinbaseTransaction(minerAddress, blockReward + fees);

    // Select transactions from mempool
    const transactions = [coinbase, ...this.mempool];

    // Create new block
    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      transactions,
      this.getLatestBlock().hash,
      this.difficulty
    );

    // Mine the block
    const miningResult = newBlock.mineBlock(progressCallback);

    // Add block to chain
    this.chain.push(newBlock);

    // Clear mempool of included transactions
    this.mempool = [];

    // Adjust difficulty if needed
    this.adjustDifficulty();

    return {
      block: newBlock,
      miningResult
    };
  }

  /**
   * Create coinbase transaction (mining reward)
   */
  createCoinbaseTransaction(minerAddress, amount) {
    const tx = {
      inputs: [],
      outputs: [{ address: minerAddress, amount }],
      timestamp: Date.now(),
      isCoinbase: true
    };
    tx.id = generateTxId(tx);
    return tx;
  }

  /**
   * Calculate total fees in mempool
   */
  calculateMempoolFees() {
    let totalFees = 0;
    for (const tx of this.mempool) {
      const inputSum = tx.inputs.reduce((sum, input) => {
        const prevTx = this.getTransaction(input.txId);
        if (prevTx) {
          return sum + prevTx.outputs[input.outputIndex].amount;
        }
        return sum;
      }, 0);

      const outputSum = tx.outputs.reduce((sum, output) => sum + output.amount, 0);
      const fee = inputSum - outputSum;
      if (fee > 0) totalFees += fee;
    }
    return totalFees;
  }

  /**
   * Adjust difficulty based on recent block times
   */
  adjustDifficulty() {
    const interval = this.config.difficultyAdjustmentInterval;

    // Only adjust at intervals
    if (this.chain.length % interval !== 0) {
      return;
    }

    // Need at least interval + 1 blocks
    if (this.chain.length < interval + 1) {
      return;
    }

    // Calculate actual time for last interval blocks
    const recentBlocks = this.chain.slice(-interval);
    const oldestBlock = this.chain[this.chain.length - interval - 1];
    const actualTime = recentBlocks[recentBlocks.length - 1].timestamp - oldestBlock.timestamp;

    // Calculate expected time
    const expectedTime = this.config.blockTimeTarget * interval;

    // Calculate ratio
    const ratio = actualTime / expectedTime;

    // Adjust difficulty
    const oldDifficulty = this.difficulty;

    if (ratio > 1.5) {
      // Blocks too slow, decrease difficulty
      this.difficulty = Math.max(1, this.difficulty - 1);
    } else if (ratio < 0.5) {
      // Blocks too fast, increase difficulty
      this.difficulty = this.difficulty + 1;
    } else {
      // Fine-tune based on ratio
      if (ratio > 1.2) {
        this.difficulty = Math.max(1, this.difficulty - 1);
      } else if (ratio < 0.8) {
        this.difficulty = this.difficulty + 1;
      }
    }

    // Clamp difficulty change
    const maxChange = this.config.maxDifficultyChange;
    if (this.difficulty > oldDifficulty * maxChange) {
      this.difficulty = oldDifficulty * maxChange;
    }
    if (this.difficulty < oldDifficulty / maxChange) {
      this.difficulty = Math.max(1, Math.floor(oldDifficulty / maxChange));
    }

    console.log(`Difficulty adjusted: ${oldDifficulty} -> ${this.difficulty} (ratio: ${ratio.toFixed(2)})`);
  }

  /**
   * Validate a transaction
   */
  validateTransaction(transaction) {
    // Check transaction has ID
    if (!transaction.id) {
      return { valid: false, reason: 'Transaction missing ID' };
    }

    // Verify transaction ID
    const expectedId = generateTxId(transaction);
    if (transaction.id !== expectedId) {
      return { valid: false, reason: 'Transaction ID does not match transaction data' };
    }

    // Coinbase transactions are special
    if (transaction.isCoinbase) {
      if (transaction.inputs.length !== 0) {
        return { valid: false, reason: 'Coinbase transaction must have no inputs' };
      }
      return { valid: true };
    }

    // Regular transaction must have inputs and outputs
    if (!transaction.inputs || transaction.inputs.length === 0) {
      return { valid: false, reason: 'Transaction must have inputs' };
    }
    if (!transaction.outputs || transaction.outputs.length === 0) {
      return { valid: false, reason: 'Transaction must have outputs' };
    }

    // Verify inputs reference valid outputs
    let inputSum = 0;
    for (const input of transaction.inputs) {
      const prevTx = this.getTransaction(input.txId);
      if (!prevTx) {
        return { valid: false, reason: `Input references non-existent transaction ${input.txId}` };
      }

      if (input.outputIndex >= prevTx.outputs.length) {
        return { valid: false, reason: 'Input references non-existent output index' };
      }

      // Check if output already spent
      if (this.isOutputSpent(input.txId, input.outputIndex, transaction.id)) {
        return { valid: false, reason: 'Double-spend detected' };
      }

      inputSum += prevTx.outputs[input.outputIndex].amount;
    }

    // Calculate output sum
    const outputSum = transaction.outputs.reduce((sum, output) => sum + output.amount, 0);

    // Verify input >= output (difference is fee)
    if (inputSum < outputSum) {
      return { valid: false, reason: 'Output sum exceeds input sum' };
    }

    return { valid: true };
  }

  /**
   * Get transaction by ID
   */
  getTransaction(txId) {
    // Search all blocks
    for (const block of this.chain) {
      const tx = block.transactions.find(t => t.id === txId);
      if (tx) return tx;
    }

    // Search mempool
    return this.mempool.find(t => t.id === txId);
  }

  /**
   * Check if an output has been spent
   */
  isOutputSpent(txId, outputIndex, excludeTxId = null) {
    // Check all transactions in blockchain
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (excludeTxId && tx.id === excludeTxId) continue;

        for (const input of tx.inputs || []) {
          if (input.txId === txId && input.outputIndex === outputIndex) {
            return true;
          }
        }
      }
    }

    // Check mempool
    for (const tx of this.mempool) {
      if (excludeTxId && tx.id === excludeTxId) continue;

      for (const input of tx.inputs || []) {
        if (input.txId === txId && input.outputIndex === outputIndex) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Validate entire blockchain
   */
  isChainValid() {
    // Check genesis block
    if (this.chain.length === 0) {
      return { valid: false, reason: 'Blockchain is empty' };
    }

    // Validate each block
    for (let i = 0; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];

      // Validate block itself
      const blockValidation = currentBlock.isValid();
      if (!blockValidation.valid) {
        return {
          valid: false,
          reason: `Block ${i} is invalid: ${blockValidation.reason}`,
          blockIndex: i
        };
      }

      // Check previous hash link (skip genesis)
      if (i > 0) {
        const previousBlock = this.chain[i - 1];
        if (currentBlock.previousHash !== previousBlock.hash) {
          return {
            valid: false,
            reason: `Block ${i} has invalid previous hash`,
            blockIndex: i
          };
        }
      }

      // Validate all transactions in block
      for (const tx of currentBlock.transactions) {
        const txValidation = this.validateTransaction(tx);
        if (!txValidation.valid) {
          return {
            valid: false,
            reason: `Block ${i} contains invalid transaction: ${txValidation.reason}`,
            blockIndex: i,
            txId: tx.id
          };
        }
      }
    }

    return { valid: true };
  }

  /**
   * Get total supply (all coins mined)
   */
  getTotalSupply() {
    let total = 0;
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.isCoinbase) {
          total += tx.outputs.reduce((sum, output) => sum + output.amount, 0);
        }
      }
    }
    return total;
  }

  /**
   * Get average block time
   */
  getAverageBlockTime(lastN = null) {
    if (this.chain.length < 2) return 0;

    const blocks = lastN ? this.chain.slice(-lastN) : this.chain;
    if (blocks.length < 2) return 0;

    const totalTime = blocks[blocks.length - 1].timestamp - blocks[0].timestamp;
    return totalTime / (blocks.length - 1);
  }

  /**
   * Export blockchain to JSON
   */
  toJSON() {
    return {
      version: '1.0',
      config: this.config.toJSON(),
      chain: this.chain.map(block => block.toJSON()),
      mempool: this.mempool,
      difficulty: this.difficulty,
      exportDate: new Date().toISOString()
    };
  }

  /**
   * Import blockchain from JSON
   */
  static fromJSON(data) {
    const config = BlockchainConfig.fromJSON(data.config);
    const blockchain = new Blockchain(config);

    blockchain.chain = data.chain.map(blockData => Block.fromJSON(blockData));
    blockchain.mempool = data.mempool || [];
    blockchain.difficulty = data.difficulty;

    return blockchain;
  }
}
