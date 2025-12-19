/**
 * Financial Statements
 * Generate Balance Sheet, Income Statement, and Cash Flow Statement
 */

import { CHART_OF_ACCOUNTS, ACCOUNT_TYPES, getAccountByName } from './chart-of-accounts.js';
import { formatCurrency } from '../utils/math-utils.js';
import { formatDate } from '../utils/date-utils.js';

export class FinancialStatements {
  constructor(ledger) {
    this.ledger = ledger;
  }

  /**
   * Generate Balance Sheet
   * Shows financial position at a specific date
   * @param {Object} date - Date for balance sheet
   * @returns {Object} Balance sheet data
   */
  generateBalanceSheet(date = null) {
    const assets = this._categorizeAssets(date);
    const liabilities = this._categorizeLiabilities(date);
    const equity = this._categorizeEquity(date);

    const totalAssets = assets.current.total + assets.nonCurrent.total;
    const totalLiabilities = liabilities.current.total + liabilities.nonCurrent.total;
    const totalEquity = equity.total;

    return {
      date,
      assets: {
        current: assets.current,
        nonCurrent: assets.nonCurrent,
        total: totalAssets
      },
      liabilities: {
        current: liabilities.current,
        nonCurrent: liabilities.nonCurrent,
        total: totalLiabilities
      },
      equity: equity,
      totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
      balanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01
    };
  }

  /**
   * Generate Income Statement
   * Shows profitability over a period
   * @param {Object} startDate - Period start date
   * @param {Object} endDate - Period end date
   * @returns {Object} Income statement data
   */
  generateIncomeStatement(startDate, endDate) {
    const revenue = this._categorizeRevenue(startDate, endDate);
    const expenses = this._categorizeExpenses(startDate, endDate);

    const totalRevenue = revenue.total;
    const totalExpenses = expenses.total;
    const netIncome = totalRevenue - totalExpenses;

    // Calculate gross profit if we have COGS
    const cogs = expenses.items['Cost of Goods Sold'] || 0;
    const grossProfit = totalRevenue - cogs;
    const operatingExpenses = totalExpenses - cogs;

    return {
      startDate,
      endDate,
      revenue: revenue,
      expenses: expenses,
      grossProfit,
      operatingExpenses,
      netIncome
    };
  }

  /**
   * Generate Cash Flow Statement
   * Shows cash inflows and outflows over a period
   * @param {Object} startDate - Period start date
   * @param {Object} endDate - Period end date
   * @returns {Object} Cash flow statement data
   */
  generateCashFlowStatement(startDate, endDate) {
    // Get net income from income statement
    const incomeStatement = this.generateIncomeStatement(startDate, endDate);
    const netIncome = incomeStatement.netIncome;

    // Get beginning and ending cash balances
    const beginningCash = this.ledger.getAccountBalance('Cash', startDate);
    const endingCash = this.ledger.getAccountBalance('Cash', endDate);

    // For simplified version, calculate total cash change
    const netCashFlow = endingCash - beginningCash;

    // Operating activities (simplified)
    const operating = {
      netIncome,
      adjustments: {},
      workingCapitalChanges: {},
      total: netIncome // Simplified
    };

    // Investing activities (property purchases/sales)
    const investing = {
      items: {},
      total: 0
    };

    // Financing activities (loans, capital)
    const financing = {
      items: {},
      total: 0
    };

    return {
      startDate,
      endDate,
      operating,
      investing,
      financing,
      netCashFlow,
      beginningCash,
      endingCash
    };
  }

  /**
   * Categorize assets (current vs non-current)
   * @private
   */
  _categorizeAssets(date) {
    const current = { items: {}, total: 0 };
    const nonCurrent = { items: {}, total: 0 };

    for (const account of CHART_OF_ACCOUNTS.assets) {
      const balance = this.ledger.getAccountBalance(account.name, date);
      if (balance === 0) continue;

      if (account.category === 'current') {
        current.items[account.name] = balance;
        current.total += balance;
      } else {
        nonCurrent.items[account.name] = balance;
        nonCurrent.total += balance;
      }
    }

    return { current, nonCurrent };
  }

  /**
   * Categorize liabilities (current vs non-current)
   * @private
   */
  _categorizeLiabilities(date) {
    const current = { items: {}, total: 0 };
    const nonCurrent = { items: {}, total: 0 };

    for (const account of CHART_OF_ACCOUNTS.liabilities) {
      const balance = this.ledger.getAccountBalance(account.name, date);
      if (balance === 0) continue;

      if (account.category === 'current') {
        current.items[account.name] = balance;
        current.total += balance;
      } else {
        nonCurrent.items[account.name] = balance;
        nonCurrent.total += balance;
      }
    }

    return { current, nonCurrent };
  }

  /**
   * Categorize equity
   * @private
   */
  _categorizeEquity(date) {
    const items = {};
    let total = 0;

    // Add permanent equity accounts
    for (const account of CHART_OF_ACCOUNTS.equity) {
      const balance = this.ledger.getAccountBalance(account.name, date);
      if (balance !== 0) {
        items[account.name] = balance;
        total += balance;
      }
    }

    // Add net income from revenue and expense accounts
    // Revenue accounts have credit balances (increase equity)
    let revenueTotal = 0;
    for (const account of CHART_OF_ACCOUNTS.revenue) {
      const balance = this.ledger.getAccountBalance(account.name, date);
      revenueTotal += balance;
    }

    // Expense accounts have debit balances (decrease equity)
    let expenseTotal = 0;
    for (const account of CHART_OF_ACCOUNTS.expenses) {
      const balance = this.ledger.getAccountBalance(account.name, date);
      expenseTotal += balance;
    }

    // Net income = Revenue - Expenses
    const netIncome = revenueTotal - expenseTotal;
    if (netIncome !== 0) {
      items['Net Income (Current Period)'] = netIncome;
      total += netIncome;
    }

    return { items, total };
  }

  /**
   * Categorize revenue
   * @private
   */
  _categorizeRevenue(startDate, endDate) {
    const items = {};
    let total = 0;

    for (const account of CHART_OF_ACCOUNTS.revenue) {
      // For period statements, we need to calculate the change in balance
      const beginBalance = this.ledger.getAccountBalance(account.name, startDate);
      const endBalance = this.ledger.getAccountBalance(account.name, endDate);
      const periodAmount = endBalance - beginBalance;

      if (periodAmount !== 0) {
        items[account.name] = periodAmount;
        total += periodAmount;
      }
    }

    return { items, total };
  }

  /**
   * Categorize expenses
   * @private
   */
  _categorizeExpenses(startDate, endDate) {
    const items = {};
    let total = 0;

    for (const account of CHART_OF_ACCOUNTS.expenses) {
      // For period statements, we need to calculate the change in balance
      const beginBalance = this.ledger.getAccountBalance(account.name, startDate);
      const endBalance = this.ledger.getAccountBalance(account.name, endDate);
      const periodAmount = endBalance - beginBalance;

      if (periodAmount !== 0) {
        items[account.name] = periodAmount;
        total += periodAmount;
      }
    }

    return { items, total };
  }

  /**
   * Format Balance Sheet as text
   * @param {Object} balanceSheet - Balance sheet data
   * @returns {string} Formatted balance sheet
   */
  formatBalanceSheet(balanceSheet) {
    let output = '';

    output += '═══════════════════════════════════════════════════════════════\n';
    output += '                        BALANCE SHEET\n';
    output += `                     As of ${formatDate(balanceSheet.date || { year: 1, month: 1, day: 1 })}\n`;
    output += '═══════════════════════════════════════════════════════════════\n\n';

    // Assets
    output += 'ASSETS\n';
    output += '───────────────────────────────────────────────────────────────\n';

    output += '\nCurrent Assets:\n';
    for (const [account, amount] of Object.entries(balanceSheet.assets.current.items)) {
      output += `  ${account.padEnd(40)} ${formatCurrency(amount).padStart(15)}\n`;
    }
    output += `${'Total Current Assets'.padEnd(42)} ${formatCurrency(balanceSheet.assets.current.total).padStart(15)}\n`;

    output += '\nNon-Current Assets:\n';
    for (const [account, amount] of Object.entries(balanceSheet.assets.nonCurrent.items)) {
      output += `  ${account.padEnd(40)} ${formatCurrency(amount).padStart(15)}\n`;
    }
    output += `${'Total Non-Current Assets'.padEnd(42)} ${formatCurrency(balanceSheet.assets.nonCurrent.total).padStart(15)}\n`;

    output += `\n${'TOTAL ASSETS'.padEnd(42)} ${formatCurrency(balanceSheet.assets.total).padStart(15)}\n`;

    // Liabilities
    output += '\n\nLIABILITIES & EQUITY\n';
    output += '───────────────────────────────────────────────────────────────\n';

    output += '\nCurrent Liabilities:\n';
    for (const [account, amount] of Object.entries(balanceSheet.liabilities.current.items)) {
      output += `  ${account.padEnd(40)} ${formatCurrency(amount).padStart(15)}\n`;
    }
    output += `${'Total Current Liabilities'.padEnd(42)} ${formatCurrency(balanceSheet.liabilities.current.total).padStart(15)}\n`;

    output += '\nNon-Current Liabilities:\n';
    for (const [account, amount] of Object.entries(balanceSheet.liabilities.nonCurrent.items)) {
      output += `  ${account.padEnd(40)} ${formatCurrency(amount).padStart(15)}\n`;
    }
    output += `${'Total Non-Current Liabilities'.padEnd(42)} ${formatCurrency(balanceSheet.liabilities.nonCurrent.total).padStart(15)}\n`;

    output += `\n${'TOTAL LIABILITIES'.padEnd(42)} ${formatCurrency(balanceSheet.liabilities.total).padStart(15)}\n`;

    // Equity
    output += '\nEquity:\n';
    for (const [account, amount] of Object.entries(balanceSheet.equity.items)) {
      output += `  ${account.padEnd(40)} ${formatCurrency(amount).padStart(15)}\n`;
    }
    output += `${'Total Equity'.padEnd(42)} ${formatCurrency(balanceSheet.equity.total).padStart(15)}\n`;

    output += `\n${'TOTAL LIABILITIES & EQUITY'.padEnd(42)} ${formatCurrency(balanceSheet.totalLiabilitiesAndEquity).padStart(15)}\n`;

    output += '\n═══════════════════════════════════════════════════════════════\n';
    output += `Balanced: ${balanceSheet.balanced ? '✓ YES' : '✗ NO'}\n`;
    output += '═══════════════════════════════════════════════════════════════\n';

    return output;
  }

  /**
   * Format Income Statement as text
   * @param {Object} incomeStatement - Income statement data
   * @returns {string} Formatted income statement
   */
  formatIncomeStatement(incomeStatement) {
    let output = '';

    output += '═══════════════════════════════════════════════════════════════\n';
    output += '                      INCOME STATEMENT\n';
    output += `            ${formatDate(incomeStatement.startDate)} to ${formatDate(incomeStatement.endDate)}\n`;
    output += '═══════════════════════════════════════════════════════════════\n\n';

    // Revenue
    output += 'REVENUE\n';
    output += '───────────────────────────────────────────────────────────────\n';
    for (const [account, amount] of Object.entries(incomeStatement.revenue.items)) {
      output += `  ${account.padEnd(40)} ${formatCurrency(amount).padStart(15)}\n`;
    }
    output += `${'Total Revenue'.padEnd(42)} ${formatCurrency(incomeStatement.revenue.total).padStart(15)}\n`;

    // Expenses
    output += '\n\nEXPENSES\n';
    output += '───────────────────────────────────────────────────────────────\n';
    for (const [account, amount] of Object.entries(incomeStatement.expenses.items)) {
      output += `  ${account.padEnd(40)} ${formatCurrency(amount).padStart(15)}\n`;
    }
    output += `${'Total Expenses'.padEnd(42)} ${formatCurrency(incomeStatement.expenses.total).padStart(15)}\n`;

    // Net Income
    output += '\n═══════════════════════════════════════════════════════════════\n';
    output += `${'NET INCOME'.padEnd(42)} ${formatCurrency(incomeStatement.netIncome).padStart(15)}\n`;
    output += '═══════════════════════════════════════════════════════════════\n';

    return output;
  }

  /**
   * Format Cash Flow Statement as text
   * @param {Object} cashFlow - Cash flow statement data
   * @returns {string} Formatted cash flow statement
   */
  formatCashFlowStatement(cashFlow) {
    let output = '';

    output += '═══════════════════════════════════════════════════════════════\n';
    output += '                   CASH FLOW STATEMENT\n';
    output += `            ${formatDate(cashFlow.startDate)} to ${formatDate(cashFlow.endDate)}\n`;
    output += '═══════════════════════════════════════════════════════════════\n\n';

    // Operating Activities
    output += 'OPERATING ACTIVITIES\n';
    output += '───────────────────────────────────────────────────────────────\n';
    output += `  Net Income${' '.repeat(34)} ${formatCurrency(cashFlow.operating.netIncome).padStart(15)}\n`;
    output += `${'Net Cash from Operating Activities'.padEnd(42)} ${formatCurrency(cashFlow.operating.total).padStart(15)}\n`;

    // Investing Activities
    output += '\n\nINVESTING ACTIVITIES\n';
    output += '───────────────────────────────────────────────────────────────\n';
    output += `${'Net Cash from Investing Activities'.padEnd(42)} ${formatCurrency(cashFlow.investing.total).padStart(15)}\n`;

    // Financing Activities
    output += '\n\nFINANCING ACTIVITIES\n';
    output += '───────────────────────────────────────────────────────────────\n';
    output += `${'Net Cash from Financing Activities'.padEnd(42)} ${formatCurrency(cashFlow.financing.total).padStart(15)}\n`;

    // Net Change
    output += '\n═══════════════════════════════════════════════════════════════\n';
    output += `${'Net Change in Cash'.padEnd(42)} ${formatCurrency(cashFlow.netCashFlow).padStart(15)}\n`;
    output += `${'Beginning Cash Balance'.padEnd(42)} ${formatCurrency(cashFlow.beginningCash).padStart(15)}\n`;
    output += `${'Ending Cash Balance'.padEnd(42)} ${formatCurrency(cashFlow.endingCash).padStart(15)}\n`;
    output += '═══════════════════════════════════════════════════════════════\n';

    return output;
  }
}

/**
 * Create financial statements generator for a ledger
 * @param {Ledger} ledger - Ledger instance
 * @returns {FinancialStatements} Financial statements generator
 */
export function createFinancialStatements(ledger) {
  return new FinancialStatements(ledger);
}
