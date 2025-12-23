/**
 * Wallet system for managing addresses and transactions
 * Implements UTXO (Unspent Transaction Output) tracking
 */

import { generateAddress, isValidAddress, generateTxId } from './crypto-utils.js';

/**
 * Wallet class for managing cryptocurrency addresses and balances
 */
export class Wallet {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.addresses = []; // Array of addresses owned by this wallet
  }

  /**
   * Create a new address
   * @param {string} label - Optional label for the address
   * @returns {string} - The new address
   */
  createAddress(label = null) {
    const address = generateAddress();
    this.addresses.push({
      address,
      label: label || `Address ${this.addresses.length + 1}`,
      createdAt: Date.now()
    });
    return address;
  }

  /**
   * Get all addresses
   */
  getAddresses() {
    return this.addresses;
  }

  /**
   * Get address by string
   */
  getAddress(addressString) {
    return this.addresses.find(a => a.address === addressString);
  }

  /**
   * Check if address belongs to this wallet
   */
  ownsAddress(addressString) {
    return this.addresses.some(a => a.address === addressString);
  }

  /**
   * Get balance for a specific address
   */
  getAddressBalance(addressString) {
    const utxos = this.getUTXOs(addressString);
    return utxos.reduce((sum, utxo) => sum + utxo.amount, 0);
  }

  /**
   * Get total balance across all addresses
   */
  getTotalBalance() {
    return this.addresses.reduce((sum, addr) => {
      return sum + this.getAddressBalance(addr.address);
    }, 0);
  }

  /**
   * Get all unspent transaction outputs (UTXOs) for an address
   */
  getUTXOs(addressString) {
    const utxos = [];

    // Scan all blocks for outputs to this address
    for (const block of this.blockchain.chain) {
      for (const tx of block.transactions) {
        // Check each output
        for (let outputIndex = 0; outputIndex < tx.outputs.length; outputIndex++) {
          const output = tx.outputs[outputIndex];

          if (output.address === addressString) {
            // Check if this output has been spent
            const isSpent = this.blockchain.isOutputSpent(tx.id, outputIndex);

            if (!isSpent) {
              utxos.push({
                txId: tx.id,
                outputIndex,
                amount: output.amount,
                address: output.address,
                blockIndex: block.index,
                confirmations: this.blockchain.chain.length - block.index
              });
            }
          }
        }
      }
    }

    return utxos;
  }

  /**
   * Get all UTXOs for all wallet addresses
   */
  getAllUTXOs() {
    const allUtxos = [];
    for (const addr of this.addresses) {
      const utxos = this.getUTXOs(addr.address);
      allUtxos.push(...utxos);
    }
    return allUtxos;
  }

  /**
   * Get transaction history for an address
   */
  getAddressHistory(addressString) {
    const history = [];

    for (const block of this.blockchain.chain) {
      for (const tx of block.transactions) {
        let involved = false;
        let type = null;
        let amount = 0;

        // Check if address is in outputs (receiving)
        for (const output of tx.outputs) {
          if (output.address === addressString) {
            involved = true;
            amount += output.amount;
            type = 'received';
          }
        }

        // Check if address is in inputs (sending)
        for (const input of tx.inputs || []) {
          const prevTx = this.blockchain.getTransaction(input.txId);
          if (prevTx && prevTx.outputs[input.outputIndex].address === addressString) {
            involved = true;
            amount -= prevTx.outputs[input.outputIndex].amount;
            type = 'sent';
          }
        }

        if (involved) {
          history.push({
            txId: tx.id,
            type,
            amount,
            timestamp: tx.timestamp,
            blockIndex: block.index,
            confirmations: this.blockchain.chain.length - block.index,
            isCoinbase: tx.isCoinbase || false
          });
        }
      }
    }

    // Sort by block index (newest first)
    history.sort((a, b) => b.blockIndex - a.blockIndex);

    return history;
  }

  /**
   * Get transaction history for all wallet addresses
   */
  getAllHistory() {
    const allHistory = new Map(); // Use map to deduplicate by txId

    for (const addr of this.addresses) {
      const history = this.getAddressHistory(addr.address);
      for (const tx of history) {
        if (!allHistory.has(tx.txId)) {
          allHistory.set(tx.txId, { ...tx, address: addr.address });
        }
      }
    }

    return Array.from(allHistory.values()).sort((a, b) => b.blockIndex - a.blockIndex);
  }

  /**
   * Create a transaction
   * @param {string} fromAddress - Sender address
   * @param {string} toAddress - Recipient address
   * @param {number} amount - Amount to send
   * @param {number} feeRate - Fee rate (optional, default to minimum)
   * @returns {Object} - Created transaction
   */
  createTransaction(fromAddress, toAddress, amount, feeRate = null) {
    // Validate inputs
    if (!this.ownsAddress(fromAddress)) {
      throw new Error('From address not owned by wallet');
    }

    if (!isValidAddress(toAddress)) {
      throw new Error('Invalid recipient address');
    }

    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    // Get UTXOs for sender address
    const utxos = this.getUTXOs(fromAddress);

    if (utxos.length === 0) {
      throw new Error('No UTXOs available for this address');
    }

    // Calculate minimum fee
    const minFee = this.blockchain.config.minTransactionFee;
    const fee = feeRate || minFee;

    // Select UTXOs to cover amount + fee
    const { selectedUtxos, totalInput } = this.selectUTXOs(utxos, amount + fee);

    if (totalInput < amount + fee) {
      throw new Error(`Insufficient balance. Need ${amount + fee}, have ${totalInput}`);
    }

    // Create transaction inputs
    const inputs = selectedUtxos.map(utxo => ({
      txId: utxo.txId,
      outputIndex: utxo.outputIndex,
      address: fromAddress
    }));

    // Create transaction outputs
    const outputs = [
      {
        address: toAddress,
        amount: amount
      }
    ];

    // Add change output if necessary
    const change = totalInput - amount - fee;
    if (change > 0) {
      outputs.push({
        address: fromAddress,
        amount: change
      });
    }

    // Create transaction
    const tx = {
      inputs,
      outputs,
      timestamp: Date.now(),
      isCoinbase: false
    };

    // Generate transaction ID
    tx.id = generateTxId(tx);

    return tx;
  }

  /**
   * Select UTXOs to cover an amount (simple greedy algorithm)
   */
  selectUTXOs(utxos, targetAmount) {
    // Sort UTXOs by amount (largest first)
    const sortedUtxos = [...utxos].sort((a, b) => b.amount - a.amount);

    const selectedUtxos = [];
    let totalInput = 0;

    for (const utxo of sortedUtxos) {
      selectedUtxos.push(utxo);
      totalInput += utxo.amount;

      if (totalInput >= targetAmount) {
        break;
      }
    }

    return { selectedUtxos, totalInput };
  }

  /**
   * Send coins
   * @param {string} fromAddress - Sender address
   * @param {string} toAddress - Recipient address
   * @param {number} amount - Amount to send
   * @returns {string} - Transaction ID
   */
  send(fromAddress, toAddress, amount) {
    const tx = this.createTransaction(fromAddress, toAddress, amount);

    // Add to blockchain mempool
    const txId = this.blockchain.addTransaction(tx);

    return txId;
  }

  /**
   * Get wallet statistics
   */
  getStats() {
    const totalBalance = this.getTotalBalance();
    const addressCount = this.addresses.length;
    const utxoCount = this.getAllUTXOs().length;
    const transactionCount = this.getAllHistory().length;

    // Calculate total received and sent
    let totalReceived = 0;
    let totalSent = 0;

    for (const addr of this.addresses) {
      const history = this.getAddressHistory(addr.address);
      for (const tx of history) {
        if (tx.type === 'received') {
          totalReceived += tx.amount;
        } else if (tx.type === 'sent') {
          totalSent += Math.abs(tx.amount);
        }
      }
    }

    return {
      totalBalance,
      addressCount,
      utxoCount,
      transactionCount,
      totalReceived,
      totalSent
    };
  }

  /**
   * Export wallet data (addresses only, not private keys)
   */
  toJSON() {
    return {
      addresses: this.addresses
    };
  }

  /**
   * Import wallet data
   */
  static fromJSON(data, blockchain) {
    const wallet = new Wallet(blockchain);
    wallet.addresses = data.addresses || [];
    return wallet;
  }
}

/**
 * UTXO Set - efficient tracking of unspent outputs
 */
export class UTXOSet {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.utxos = new Map(); // Key: txId:outputIndex, Value: UTXO data
    this.rebuild();
  }

  /**
   * Rebuild UTXO set from blockchain
   */
  rebuild() {
    this.utxos.clear();

    // Add all outputs
    for (const block of this.blockchain.chain) {
      for (const tx of block.transactions) {
        for (let i = 0; i < tx.outputs.length; i++) {
          const key = `${tx.id}:${i}`;
          this.utxos.set(key, {
            txId: tx.id,
            outputIndex: i,
            amount: tx.outputs[i].amount,
            address: tx.outputs[i].address,
            blockIndex: block.index
          });
        }

        // Remove spent outputs
        for (const input of tx.inputs || []) {
          const key = `${input.txId}:${input.outputIndex}`;
          this.utxos.delete(key);
        }
      }
    }
  }

  /**
   * Get UTXO by key
   */
  get(txId, outputIndex) {
    const key = `${txId}:${outputIndex}`;
    return this.utxos.get(key);
  }

  /**
   * Get all UTXOs for an address
   */
  getForAddress(address) {
    const result = [];
    for (const utxo of this.utxos.values()) {
      if (utxo.address === address) {
        result.push(utxo);
      }
    }
    return result;
  }

  /**
   * Get balance for an address
   */
  getBalance(address) {
    const utxos = this.getForAddress(address);
    return utxos.reduce((sum, utxo) => sum + utxo.amount, 0);
  }

  /**
   * Check if output is unspent
   */
  isUnspent(txId, outputIndex) {
    const key = `${txId}:${outputIndex}`;
    return this.utxos.has(key);
  }

  /**
   * Get total size of UTXO set
   */
  size() {
    return this.utxos.size;
  }

  /**
   * Get all UTXOs
   */
  getAll() {
    return Array.from(this.utxos.values());
  }
}
