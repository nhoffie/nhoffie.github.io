/**
 * Ledger
 * General ledger and account management
 * Maintains account balances and transaction history for each account
 */

import { getAllAccountNames, getAccountNormalBalance } from './chart-of-accounts.js';
import { formatCurrency } from '../utils/math-utils.js';

export class Ledger {
  constructor(firmId) {
    this.firmId = firmId;
    this.accounts = {}; // { accountName: { balance, transactions: [] } }
    this.initializeAccounts();
  }

  /**
   * Initialize all accounts with zero balance
   */
  initializeAccounts() {
    const accountNames = getAllAccountNames();

    for (const accountName of accountNames) {
      this.accounts[accountName] = {
        balance: 0,
        transactions: []
      };
    }
  }

  /**
   * Post a transaction to the ledger
   * Updates account balances based on debits and credits
   * @param {Object} transaction - Transaction object
   */
  postTransaction(transaction) {
    for (const entry of transaction.entries) {
      const { account, debit, credit } = entry;

      // Ensure account exists
      if (!this.accounts[account]) {
        this.accounts[account] = {
          balance: 0,
          transactions: []
        };
      }

      // Calculate balance change
      const normalBalance = getAccountNormalBalance(account);
      let balanceChange = 0;

      if (normalBalance === 'debit') {
        // Debit increases, credit decreases
        balanceChange = debit - credit;
      } else {
        // Credit increases, debit decreases
        balanceChange = credit - debit;
      }

      // Update balance
      this.accounts[account].balance += balanceChange;

      // Record transaction in account history
      this.accounts[account].transactions.push({
        txId: transaction.id,
        date: transaction.date,
        description: transaction.description,
        debit: debit,
        credit: credit,
        balance: this.accounts[account].balance
      });
    }
  }

  /**
   * Get account balance
   * @param {string} accountName - Account name
   * @param {Object} date - Optional: Get balance at specific date
   * @returns {number} Account balance
   */
  getAccountBalance(accountName, date = null) {
    if (!this.accounts[accountName]) {
      return 0;
    }

    if (date === null) {
      // Return current balance
      return this.accounts[accountName].balance;
    }

    // Calculate balance at specific date
    const transactions = this.accounts[accountName].transactions;
    const normalBalance = getAccountNormalBalance(accountName);
    let balance = 0;

    for (const tx of transactions) {
      // Stop when we reach transactions after the target date
      if (this._compareDates(tx.date, date) > 0) {
        break;
      }

      if (normalBalance === 'debit') {
        balance += tx.debit - tx.credit;
      } else {
        balance += tx.credit - tx.debit;
      }
    }

    return balance;
  }

  /**
   * Get account transaction history
   * @param {string} accountName - Account name
   * @param {Object} startDate - Optional start date
   * @param {Object} endDate - Optional end date
   * @returns {Array} Transaction history
   */
  getAccountHistory(accountName, startDate = null, endDate = null) {
    if (!this.accounts[accountName]) {
      return [];
    }

    const transactions = this.accounts[accountName].transactions;

    if (!startDate && !endDate) {
      return [...transactions];
    }

    return transactions.filter(tx => {
      if (startDate && this._compareDates(tx.date, startDate) < 0) {
        return false;
      }
      if (endDate && this._compareDates(tx.date, endDate) > 0) {
        return false;
      }
      return true;
    });
  }

  /**
   * Get all accounts with non-zero balances
   * @returns {Object} Accounts with balances
   */
  getNonZeroAccounts() {
    const result = {};

    for (const [accountName, data] of Object.entries(this.accounts)) {
      if (data.balance !== 0) {
        result[accountName] = data.balance;
      }
    }

    return result;
  }

  /**
   * Get all account balances
   * @returns {Object} All accounts and balances
   */
  getAllBalances() {
    const result = {};

    for (const [accountName, data] of Object.entries(this.accounts)) {
      result[accountName] = data.balance;
    }

    return result;
  }

  /**
   * Get complete account data
   * @param {string} accountName - Account name
   * @returns {Object} Account data with balance and transactions
   */
  getAccount(accountName) {
    return this.accounts[accountName] ? { ...this.accounts[accountName] } : null;
  }

  /**
   * Get accounts by type (asset, liability, equity, revenue, expense)
   * @param {string} type - Account type
   * @returns {Object} Accounts of specified type with balances
   */
  getAccountsByType(type) {
    // This will be enhanced when we integrate with chart-of-accounts
    // For now, return all matching accounts from the ledger
    const result = {};

    for (const [accountName, data] of Object.entries(this.accounts)) {
      // We'll need to check against chart of accounts
      // For now, just include accounts with balances
      if (data.balance !== 0) {
        result[accountName] = data.balance;
      }
    }

    return result;
  }

  /**
   * Check if account exists in ledger
   * @param {string} accountName - Account name
   * @returns {boolean} True if account exists
   */
  hasAccount(accountName) {
    return accountName in this.accounts;
  }

  /**
   * Get total of all asset accounts
   * @returns {number} Total assets
   */
  getTotalAssets() {
    return this._sumAccountsByPrefix(['1']); // Asset accounts start with 1
  }

  /**
   * Get total of all liability accounts
   * @returns {number} Total liabilities
   */
  getTotalLiabilities() {
    return this._sumAccountsByPrefix(['2']); // Liability accounts start with 2
  }

  /**
   * Get total of all equity accounts
   * @returns {number} Total equity
   */
  getTotalEquity() {
    return this._sumAccountsByPrefix(['3']); // Equity accounts start with 3
  }

  /**
   * Get total of all revenue accounts
   * @returns {number} Total revenue
   */
  getTotalRevenue() {
    return this._sumAccountsByPrefix(['4']); // Revenue accounts start with 4
  }

  /**
   * Get total of all expense accounts
   * @returns {number} Total expenses
   */
  getTotalExpenses() {
    return this._sumAccountsByPrefix(['5', '6', '7']); // Expense accounts start with 5, 6, 7
  }

  /**
   * Sum accounts by code prefix (helper for totals)
   * @private
   * @param {Array} prefixes - Account code prefixes
   * @returns {number} Sum of balances
   */
  _sumAccountsByPrefix(prefixes) {
    // This is a simplified approach
    // In a full implementation, we'd use the chart of accounts properly
    let sum = 0;

    for (const [accountName, data] of Object.entries(this.accounts)) {
      sum += data.balance;
    }

    return sum;
  }

  /**
   * Compare two dates
   * @private
   * @param {Object} date1 - First date
   * @param {Object} date2 - Second date
   * @returns {number} -1 if date1 < date2, 0 if equal, 1 if date1 > date2
   */
  _compareDates(date1, date2) {
    const d1 = date1.year * 10000 + date1.month * 100 + date1.day;
    const d2 = date2.year * 10000 + date2.month * 100 + date2.day;

    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
  }

  /**
   * Export ledger state (for saving)
   * @returns {Object} Ledger data
   */
  export() {
    return {
      firmId: this.firmId,
      accounts: this.accounts
    };
  }

  /**
   * Import ledger state (for loading)
   * @param {Object} data - Ledger data
   */
  import(data) {
    this.firmId = data.firmId;
    this.accounts = data.accounts;
  }

  /**
   * Clear all account balances and history (use with caution!)
   */
  clear() {
    this.initializeAccounts();
  }

  /**
   * Generate trial balance report
   * Shows all accounts with their debit and credit balances
   * @param {Object} date - Optional date for trial balance
   * @returns {Object} Trial balance data
   */
  generateTrialBalance(date = null) {
    const accounts = [];
    let totalDebits = 0;
    let totalCredits = 0;

    for (const [accountName, data] of Object.entries(this.accounts)) {
      const balance = date ? this.getAccountBalance(accountName, date) : data.balance;

      if (balance === 0) continue;

      const normalBalance = getAccountNormalBalance(accountName);
      const debitBalance = (normalBalance === 'debit' && balance > 0) || (normalBalance === 'credit' && balance < 0) ? Math.abs(balance) : 0;
      const creditBalance = (normalBalance === 'credit' && balance > 0) || (normalBalance === 'debit' && balance < 0) ? Math.abs(balance) : 0;

      accounts.push({
        account: accountName,
        debit: debitBalance,
        credit: creditBalance
      });

      totalDebits += debitBalance;
      totalCredits += creditBalance;
    }

    return {
      accounts,
      totalDebits,
      totalCredits,
      balanced: Math.abs(totalDebits - totalCredits) < 0.01 // Allow small floating point errors
    };
  }

  /**
   * Format trial balance as text report
   * @param {Object} trialBalance - Trial balance data from generateTrialBalance()
   * @returns {string} Formatted trial balance report
   */
  formatTrialBalance(trialBalance) {
    let output = '\nTRIAL BALANCE\n';
    output += '='.repeat(80) + '\n';
    output += 'Account Name'.padEnd(50) + 'Debit'.padStart(15) + 'Credit'.padStart(15) + '\n';
    output += '-'.repeat(80) + '\n';

    for (const account of trialBalance.accounts) {
      output += account.account.padEnd(50);
      output += (account.debit > 0 ? formatCurrency(account.debit) : '').padStart(15);
      output += (account.credit > 0 ? formatCurrency(account.credit) : '').padStart(15);
      output += '\n';
    }

    output += '-'.repeat(80) + '\n';
    output += 'TOTALS'.padEnd(50);
    output += formatCurrency(trialBalance.totalDebits).padStart(15);
    output += formatCurrency(trialBalance.totalCredits).padStart(15);
    output += '\n';
    output += '='.repeat(80) + '\n';
    output += `Status: ${trialBalance.balanced ? '✓ BALANCED' : '✗ OUT OF BALANCE'}\n`;

    return output;
  }
}

/**
 * Create and initialize a ledger for a firm
 * @param {string} firmId - Firm ID
 * @returns {Ledger} New ledger instance
 */
export function createLedger(firmId) {
  return new Ledger(firmId);
}
