/**
 * Journal
 * Transaction journal and audit trail
 * Provides complete chronological record of all transactions
 */

import { formatDate } from '../utils/date-utils.js';

export class Journal {
  constructor(firmId) {
    this.firmId = firmId;
    this.entries = []; // Chronological list of all transactions
  }

  /**
   * Record a transaction in the journal
   * @param {Object} transaction - Transaction object
   */
  recordEntry(transaction) {
    // Store complete transaction
    this.entries.push({
      ...transaction,
      recordedAt: Date.now() // Real-world timestamp when recorded
    });
  }

  /**
   * Get all journal entries
   * @returns {Array} All journal entries
   */
  getAllEntries() {
    return [...this.entries]; // Return copy to prevent mutation
  }

  /**
   * Get journal entries for a date range
   * @param {Object} startDate - Start date {year, month, day}
   * @param {Object} endDate - End date {year, month, day}
   * @returns {Array} Filtered journal entries
   */
  getEntriesByDateRange(startDate, endDate) {
    return this.entries.filter(entry => {
      const entryDate = entry.date;
      return this._isDateInRange(entryDate, startDate, endDate);
    });
  }

  /**
   * Get journal entries for a specific account
   * @param {string} accountName - Account name
   * @returns {Array} Entries involving the account
   */
  getEntriesByAccount(accountName) {
    return this.entries.filter(entry => {
      return entry.entries.some(e => e.account === accountName);
    });
  }

  /**
   * Search journal by description
   * @param {string} searchTerm - Search term (case-insensitive)
   * @returns {Array} Matching entries
   */
  searchByDescription(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.entries.filter(entry =>
      entry.description.toLowerCase().includes(term)
    );
  }

  /**
   * Get journal entry by transaction ID
   * @param {string} transactionId - Transaction ID
   * @returns {Object|undefined} Journal entry or undefined
   */
  getEntryById(transactionId) {
    return this.entries.find(entry => entry.id === transactionId);
  }

  /**
   * Get recent journal entries
   * @param {number} count - Number of entries to return
   * @returns {Array} Most recent entries
   */
  getRecentEntries(count = 10) {
    return this.entries.slice(-count).reverse();
  }

  /**
   * Get journal entries by metadata filter
   * @param {Object} filter - Metadata filter {key: value}
   * @returns {Array} Matching entries
   */
  getEntriesByMetadata(filter) {
    return this.entries.filter(entry => {
      if (!entry.metadata) return false;

      return Object.entries(filter).every(([key, value]) => {
        return entry.metadata[key] === value;
      });
    });
  }

  /**
   * Get total number of entries
   * @returns {number} Entry count
   */
  getEntryCount() {
    return this.entries.length;
  }

  /**
   * Check if date is within range
   * @private
   * @param {Object} date - Date to check
   * @param {Object} startDate - Start date
   * @param {Object} endDate - End date
   * @returns {boolean} True if in range
   */
  _isDateInRange(date, startDate, endDate) {
    // Convert dates to comparable numbers
    const d = date.year * 10000 + date.month * 100 + date.day;
    const start = startDate.year * 10000 + startDate.month * 100 + startDate.day;
    const end = endDate.year * 10000 + endDate.month * 100 + endDate.day;

    return d >= start && d <= end;
  }

  /**
   * Export journal as array (for saving)
   * @returns {Array} Journal entries
   */
  export() {
    return this.entries;
  }

  /**
   * Import journal from array (for loading)
   * @param {Array} entries - Journal entries
   */
  import(entries) {
    this.entries = entries;
  }

  /**
   * Clear all journal entries (use with caution!)
   */
  clear() {
    this.entries = [];
  }

  /**
   * Generate formatted journal report
   * @param {Object} startDate - Start date (optional)
   * @param {Object} endDate - End date (optional)
   * @returns {string} Formatted journal report
   */
  generateReport(startDate = null, endDate = null) {
    const entries = startDate && endDate
      ? this.getEntriesByDateRange(startDate, endDate)
      : this.entries;

    let report = 'GENERAL JOURNAL\n';
    report += '═══════════════════════════════════════════════════════════════\n\n';

    if (startDate && endDate) {
      report += `Period: ${formatDate(startDate)} to ${formatDate(endDate)}\n\n`;
    }

    for (const entry of entries) {
      report += `Date: ${formatDate(entry.date)}\n`;
      report += `Transaction ID: ${entry.id}\n`;
      report += `Description: ${entry.description}\n\n`;

      // List all entries
      for (const e of entry.entries) {
        const debit = e.debit > 0 ? `$${e.debit.toFixed(2)}` : '';
        const credit = e.credit > 0 ? `$${e.credit.toFixed(2)}` : '';
        report += `  ${e.account.padEnd(30)} ${debit.padStart(12)} ${credit.padStart(12)}\n`;
      }

      report += '\n───────────────────────────────────────────────────────────────\n\n';
    }

    return report;
  }
}

/**
 * Create and initialize a journal for a firm
 * @param {string} firmId - Firm ID
 * @returns {Journal} New journal instance
 */
export function createJournal(firmId) {
  return new Journal(firmId);
}
