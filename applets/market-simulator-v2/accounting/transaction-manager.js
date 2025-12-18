/**
 * Transaction Manager
 * Transaction creation, validation, and recording
 * Ensures double-entry bookkeeping integrity (debits = credits)
 */

import { accountExists } from './chart-of-accounts.js';
import { validateTransaction } from '../utils/validation.js';
import { eventBus } from '../core/event-bus.js';
import { stateManager } from '../core/state-manager.js';

export class TransactionManager {
  constructor(firmId) {
    this.firmId = firmId;
    this.transactionCounter = 0;
  }

  /**
   * Create and record a transaction
   * @param {Array} entries - Array of {account, debit, credit}
   * @param {string} description - Transaction description
   * @param {Object} date - Transaction date
   * @param {Object} metadata - Optional metadata
   * @returns {Object} Created transaction or null if invalid
   */
  createTransaction(entries, description, date, metadata = {}) {
    // Generate transaction ID
    const txId = this._generateTransactionId();

    // Build transaction object
    const transaction = {
      id: txId,
      firmId: this.firmId,
      date: { ...date },
      timestamp: Date.now(),
      description,
      entries: entries.map(e => ({
        account: e.account,
        debit: e.debit || 0,
        credit: e.credit || 0
      })),
      metadata: { ...metadata }
    };

    // Validate transaction
    const validation = validateTransaction(transaction);
    if (!validation.valid) {
      console.error(`Transaction validation failed: ${validation.error}`);
      return null;
    }

    // Additional validation: check all accounts exist
    for (const entry of transaction.entries) {
      if (!accountExists(entry.account)) {
        console.error(`Account does not exist: ${entry.account}`);
        return null;
      }
    }

    // Record transaction
    this._recordTransaction(transaction);

    // Emit event
    eventBus.emit('transaction:created', {
      firmId: this.firmId,
      transaction
    });

    return transaction;
  }

  /**
   * Create a simple two-entry transaction
   * @param {string} debitAccount - Account to debit
   * @param {string} creditAccount - Account to credit
   * @param {number} amount - Transaction amount
   * @param {string} description - Description
   * @param {Object} date - Date
   * @param {Object} metadata - Optional metadata
   * @returns {Object} Created transaction
   */
  createSimpleTransaction(debitAccount, creditAccount, amount, description, date, metadata = {}) {
    const entries = [
      { account: debitAccount, debit: amount, credit: 0 },
      { account: creditAccount, debit: 0, credit: amount }
    ];

    return this.createTransaction(entries, description, date, metadata);
  }

  /**
   * Record cash receipt
   * @param {number} amount - Amount received
   * @param {string} fromAccount - Source account (revenue, receivable, etc.)
   * @param {string} description - Description
   * @param {Object} date - Date
   * @returns {Object} Transaction
   */
  recordCashReceipt(amount, fromAccount, description, date) {
    return this.createSimpleTransaction(
      'Cash',
      fromAccount,
      amount,
      description,
      date,
      { type: 'cash_receipt' }
    );
  }

  /**
   * Record cash payment
   * @param {number} amount - Amount paid
   * @param {string} toAccount - Destination account (expense, payable, etc.)
   * @param {string} description - Description
   * @param {Object} date - Date
   * @returns {Object} Transaction
   */
  recordCashPayment(amount, toAccount, description, date) {
    return this.createSimpleTransaction(
      toAccount,
      'Cash',
      amount,
      description,
      date,
      { type: 'cash_payment' }
    );
  }

  /**
   * Record sale (on credit)
   * @param {number} amount - Sale amount
   * @param {number} cost - Cost of goods sold
   * @param {string} description - Description
   * @param {Object} date - Date
   * @returns {Array} Array of transactions [revenue, cogs]
   */
  recordSale(amount, cost, description, date) {
    const transactions = [];

    // Record revenue
    const revenueTx = this.createSimpleTransaction(
      'Accounts Receivable',
      'Sales Revenue',
      amount,
      description,
      date,
      { type: 'sale' }
    );
    if (revenueTx) transactions.push(revenueTx);

    // Record cost of goods sold
    if (cost > 0) {
      const cogsTx = this.createTransaction(
        [
          { account: 'Cost of Goods Sold', debit: cost, credit: 0 },
          { account: 'Inventory - Finished Goods', debit: 0, credit: cost }
        ],
        `COGS for ${description}`,
        date,
        { type: 'cogs', relatedTx: revenueTx?.id }
      );
      if (cogsTx) transactions.push(cogsTx);
    }

    return transactions;
  }

  /**
   * Record cash sale
   * @param {number} amount - Sale amount
   * @param {number} cost - Cost of goods sold
   * @param {string} description - Description
   * @param {Object} date - Date
   * @returns {Array} Array of transactions
   */
  recordCashSale(amount, cost, description, date) {
    const transactions = [];

    // Record cash revenue
    const revenueTx = this.createSimpleTransaction(
      'Cash',
      'Sales Revenue',
      amount,
      description,
      date,
      { type: 'cash_sale' }
    );
    if (revenueTx) transactions.push(revenueTx);

    // Record cost of goods sold
    if (cost > 0) {
      const cogsTx = this.createTransaction(
        [
          { account: 'Cost of Goods Sold', debit: cost, credit: 0 },
          { account: 'Inventory - Finished Goods', debit: 0, credit: cost }
        ],
        `COGS for ${description}`,
        date,
        { type: 'cogs', relatedTx: revenueTx?.id }
      );
      if (cogsTx) transactions.push(cogsTx);
    }

    return transactions;
  }

  /**
   * Record purchase of inventory (on credit)
   * @param {number} amount - Purchase amount
   * @param {string} inventoryAccount - Which inventory account
   * @param {string} description - Description
   * @param {Object} date - Date
   * @returns {Object} Transaction
   */
  recordPurchase(amount, inventoryAccount, description, date) {
    return this.createSimpleTransaction(
      inventoryAccount,
      'Accounts Payable',
      amount,
      description,
      date,
      { type: 'purchase' }
    );
  }

  /**
   * Record cash purchase of inventory
   * @param {number} amount - Purchase amount
   * @param {string} inventoryAccount - Which inventory account
   * @param {string} description - Description
   * @param {Object} date - Date
   * @returns {Object} Transaction
   */
  recordCashPurchase(amount, inventoryAccount, description, date) {
    return this.createSimpleTransaction(
      inventoryAccount,
      'Cash',
      amount,
      description,
      date,
      { type: 'cash_purchase' }
    );
  }

  /**
   * Record property purchase
   * @param {number} amount - Purchase price
   * @param {string} description - Description
   * @param {Object} date - Date
   * @param {boolean} cash - True if cash purchase, false if financed
   * @returns {Object} Transaction
   */
  recordPropertyPurchase(amount, description, date, cash = true) {
    const creditAccount = cash ? 'Cash' : 'Notes Payable';
    return this.createSimpleTransaction(
      'Real Estate',
      creditAccount,
      amount,
      description,
      date,
      { type: 'property_purchase', cash }
    );
  }

  /**
   * Record property sale
   * @param {number} salePrice - Sale price
   * @param {number} bookValue - Book value of property
   * @param {string} description - Description
   * @param {Object} date - Date
   * @returns {Array} Array of transactions
   */
  recordPropertySale(salePrice, bookValue, description, date) {
    const transactions = [];
    const gainLoss = salePrice - bookValue;

    if (gainLoss >= 0) {
      // Gain on sale
      const tx = this.createTransaction(
        [
          { account: 'Cash', debit: salePrice, credit: 0 },
          { account: 'Real Estate', debit: 0, credit: bookValue },
          { account: 'Gain on Sale of Assets', debit: 0, credit: gainLoss }
        ],
        description,
        date,
        { type: 'property_sale', gain: true }
      );
      if (tx) transactions.push(tx);
    } else {
      // Loss on sale
      const loss = Math.abs(gainLoss);
      const tx = this.createTransaction(
        [
          { account: 'Cash', debit: salePrice, credit: 0 },
          { account: 'Loss on Sale of Assets', debit: loss, credit: 0 },
          { account: 'Real Estate', debit: 0, credit: bookValue }
        ],
        description,
        date,
        { type: 'property_sale', gain: false }
      );
      if (tx) transactions.push(tx);
    }

    return transactions;
  }

  /**
   * Record owner investment (capital contribution)
   * @param {number} amount - Investment amount
   * @param {string} description - Description
   * @param {Object} date - Date
   * @returns {Object} Transaction
   */
  recordOwnerInvestment(amount, description, date) {
    return this.createSimpleTransaction(
      'Cash',
      "Owner's Capital",
      amount,
      description,
      date,
      { type: 'capital_investment' }
    );
  }

  /**
   * Record the transaction in journal and ledger
   * @private
   * @param {Object} transaction - Transaction to record
   */
  _recordTransaction(transaction) {
    const accounting = stateManager.getFirmAccounting(this.firmId);

    if (!accounting) {
      console.error(`No accounting found for firm: ${this.firmId}`);
      return;
    }

    // Record in journal (if journal is an object with entries array)
    if (Array.isArray(accounting.journal)) {
      accounting.journal.push(transaction);
    } else if (accounting.journal && typeof accounting.journal.recordEntry === 'function') {
      accounting.journal.recordEntry(transaction);
    }

    // Post to ledger (if ledger has postTransaction method)
    if (accounting.ledger && typeof accounting.ledger.postTransaction === 'function') {
      accounting.ledger.postTransaction(transaction);
    }
  }

  /**
   * Generate unique transaction ID
   * @private
   * @returns {string} Transaction ID
   */
  _generateTransactionId() {
    this.transactionCounter++;
    return `tx_${this.firmId}_${Date.now()}_${this.transactionCounter}`;
  }

  /**
   * Get transaction history for firm
   * @returns {Array} All transactions
   */
  getTransactionHistory() {
    const accounting = stateManager.getFirmAccounting(this.firmId);
    if (!accounting) return [];

    if (Array.isArray(accounting.journal)) {
      return accounting.journal;
    } else if (accounting.journal && typeof accounting.journal.getAllEntries === 'function') {
      return accounting.journal.getAllEntries();
    }

    return [];
  }
}

/**
 * Create transaction manager for a firm
 * @param {string} firmId - Firm ID
 * @returns {TransactionManager} Transaction manager instance
 */
export function createTransactionManager(firmId) {
  return new TransactionManager(firmId);
}
