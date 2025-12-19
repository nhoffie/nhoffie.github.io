/**
 * Chart of Accounts
 * Account definitions and structure for double-entry bookkeeping
 *
 * Account Structure:
 * - Assets: What the firm owns (debit increases, credit decreases)
 * - Liabilities: What the firm owes (credit increases, debit decreases)
 * - Equity: Owner's stake (credit increases, debit decreases)
 * - Revenue: Income from operations (credit increases, debit decreases)
 * - Expenses: Costs of operations (debit increases, credit decreases)
 */

/**
 * Account Type Definitions
 */
export const ACCOUNT_TYPES = {
  ASSET: 'asset',
  LIABILITY: 'liability',
  EQUITY: 'equity',
  REVENUE: 'revenue',
  EXPENSE: 'expense'
};

/**
 * Complete Chart of Accounts
 */
export const CHART_OF_ACCOUNTS = {
  // ===== ASSETS =====
  assets: [
    // Current Assets (can be converted to cash within 1 year)
    { code: '1000', name: 'Cash', type: ACCOUNT_TYPES.ASSET, category: 'current', normalBalance: 'debit' },
    { code: '1100', name: 'Accounts Receivable', type: ACCOUNT_TYPES.ASSET, category: 'current', normalBalance: 'debit' },
    { code: '1200', name: 'Inventory - Raw Materials', type: ACCOUNT_TYPES.ASSET, category: 'current', normalBalance: 'debit' },
    { code: '1210', name: 'Inventory - Work in Progress', type: ACCOUNT_TYPES.ASSET, category: 'current', normalBalance: 'debit' },
    { code: '1220', name: 'Inventory - Finished Goods', type: ACCOUNT_TYPES.ASSET, category: 'current', normalBalance: 'debit' },
    { code: '1300', name: 'Prepaid Expenses', type: ACCOUNT_TYPES.ASSET, category: 'current', normalBalance: 'debit' },

    // Non-Current Assets (long-term assets)
    { code: '1500', name: 'Real Estate', type: ACCOUNT_TYPES.ASSET, category: 'non-current', normalBalance: 'debit' },
    { code: '1600', name: 'Equipment', type: ACCOUNT_TYPES.ASSET, category: 'non-current', normalBalance: 'debit' },
    { code: '1700', name: 'Accumulated Depreciation', type: ACCOUNT_TYPES.ASSET, category: 'non-current', normalBalance: 'credit', contra: true }
  ],

  // ===== LIABILITIES =====
  liabilities: [
    // Current Liabilities (due within 1 year)
    { code: '2000', name: 'Accounts Payable', type: ACCOUNT_TYPES.LIABILITY, category: 'current', normalBalance: 'credit' },
    { code: '2100', name: 'Wages Payable', type: ACCOUNT_TYPES.LIABILITY, category: 'current', normalBalance: 'credit' },
    { code: '2200', name: 'Interest Payable', type: ACCOUNT_TYPES.LIABILITY, category: 'current', normalBalance: 'credit' },
    { code: '2300', name: 'Taxes Payable', type: ACCOUNT_TYPES.LIABILITY, category: 'current', normalBalance: 'credit' },
    { code: '2400', name: 'Accrued Expenses', type: ACCOUNT_TYPES.LIABILITY, category: 'current', normalBalance: 'credit' },

    // Non-Current Liabilities (due after 1 year)
    { code: '2500', name: 'Notes Payable', type: ACCOUNT_TYPES.LIABILITY, category: 'non-current', normalBalance: 'credit' },
    { code: '2600', name: 'Bonds Payable', type: ACCOUNT_TYPES.LIABILITY, category: 'non-current', normalBalance: 'credit' }
  ],

  // ===== EQUITY =====
  equity: [
    { code: '3000', name: 'Owner\'s Capital', type: ACCOUNT_TYPES.EQUITY, category: 'permanent', normalBalance: 'credit' },
    { code: '3100', name: 'Retained Earnings', type: ACCOUNT_TYPES.EQUITY, category: 'permanent', normalBalance: 'credit' },
    { code: '3200', name: 'Current Year Earnings', type: ACCOUNT_TYPES.EQUITY, category: 'temporary', normalBalance: 'credit' },
    { code: '3900', name: 'Dividends', type: ACCOUNT_TYPES.EQUITY, category: 'temporary', normalBalance: 'debit', contra: true }
  ],

  // ===== REVENUE =====
  revenue: [
    { code: '4000', name: 'Sales Revenue', type: ACCOUNT_TYPES.REVENUE, category: 'operating', normalBalance: 'credit' },
    { code: '4100', name: 'Service Revenue', type: ACCOUNT_TYPES.REVENUE, category: 'operating', normalBalance: 'credit' },
    { code: '4200', name: 'Interest Income', type: ACCOUNT_TYPES.REVENUE, category: 'non-operating', normalBalance: 'credit' },
    { code: '4300', name: 'Gain on Sale of Assets', type: ACCOUNT_TYPES.REVENUE, category: 'non-operating', normalBalance: 'credit' },
    { code: '4900', name: 'Other Revenue', type: ACCOUNT_TYPES.REVENUE, category: 'other', normalBalance: 'credit' }
  ],

  // ===== EXPENSES =====
  expenses: [
    // Cost of Goods Sold
    { code: '5000', name: 'Cost of Goods Sold', type: ACCOUNT_TYPES.EXPENSE, category: 'cogs', normalBalance: 'debit' },

    // Operating Expenses
    { code: '6000', name: 'Wages Expense', type: ACCOUNT_TYPES.EXPENSE, category: 'operating', normalBalance: 'debit' },
    { code: '6100', name: 'Rent Expense', type: ACCOUNT_TYPES.EXPENSE, category: 'operating', normalBalance: 'debit' },
    { code: '6200', name: 'Utilities Expense', type: ACCOUNT_TYPES.EXPENSE, category: 'operating', normalBalance: 'debit' },
    { code: '6300', name: 'Maintenance Expense', type: ACCOUNT_TYPES.EXPENSE, category: 'operating', normalBalance: 'debit' },
    { code: '6400', name: 'Insurance Expense', type: ACCOUNT_TYPES.EXPENSE, category: 'operating', normalBalance: 'debit' },
    { code: '6500', name: 'Supplies Expense', type: ACCOUNT_TYPES.EXPENSE, category: 'operating', normalBalance: 'debit' },
    { code: '6600', name: 'Marketing Expense', type: ACCOUNT_TYPES.EXPENSE, category: 'operating', normalBalance: 'debit' },
    { code: '6700', name: 'Depreciation Expense', type: ACCOUNT_TYPES.EXPENSE, category: 'operating', normalBalance: 'debit' },

    // Non-Operating Expenses
    { code: '7000', name: 'Interest Expense', type: ACCOUNT_TYPES.EXPENSE, category: 'non-operating', normalBalance: 'debit' },
    { code: '7100', name: 'Loss on Sale of Assets', type: ACCOUNT_TYPES.EXPENSE, category: 'non-operating', normalBalance: 'debit' },
    { code: '7200', name: 'Income Tax Expense', type: ACCOUNT_TYPES.EXPENSE, category: 'non-operating', normalBalance: 'debit' },

    // Other Expenses
    { code: '7900', name: 'Other Expense', type: ACCOUNT_TYPES.EXPENSE, category: 'other', normalBalance: 'debit' }
  ]
};

/**
 * Get all accounts as a flat array
 * @returns {Array} All accounts
 */
export function getAllAccounts() {
  return [
    ...CHART_OF_ACCOUNTS.assets,
    ...CHART_OF_ACCOUNTS.liabilities,
    ...CHART_OF_ACCOUNTS.equity,
    ...CHART_OF_ACCOUNTS.revenue,
    ...CHART_OF_ACCOUNTS.expenses
  ];
}

/**
 * Get account by name
 * @param {string} accountName - Account name
 * @returns {Object|undefined} Account object or undefined
 */
export function getAccountByName(accountName) {
  return getAllAccounts().find(account => account.name === accountName);
}

/**
 * Get account by code
 * @param {string} code - Account code
 * @returns {Object|undefined} Account object or undefined
 */
export function getAccountByCode(code) {
  return getAllAccounts().find(account => account.code === code);
}

/**
 * Check if account exists
 * @param {string} accountName - Account name
 * @returns {boolean} True if account exists
 */
export function accountExists(accountName) {
  return getAllAccounts().some(account => account.name === accountName);
}

/**
 * Get accounts by type
 * @param {string} type - Account type (asset, liability, equity, revenue, expense)
 * @returns {Array} Accounts of specified type
 */
export function getAccountsByType(type) {
  return getAllAccounts().filter(account => account.type === type);
}

/**
 * Get accounts by category
 * @param {string} category - Account category
 * @returns {Array} Accounts of specified category
 */
export function getAccountsByCategory(category) {
  return getAllAccounts().filter(account => account.category === category);
}

/**
 * Get account normal balance (debit or credit)
 * @param {string} accountName - Account name
 * @returns {string|undefined} Normal balance ('debit' or 'credit') or undefined
 */
export function getAccountNormalBalance(accountName) {
  const account = getAccountByName(accountName);
  return account ? account.normalBalance : undefined;
}

/**
 * Check if account is a contra account
 * Contra accounts have opposite normal balance to their category
 * @param {string} accountName - Account name
 * @returns {boolean} True if contra account
 */
export function isContraAccount(accountName) {
  const account = getAccountByName(accountName);
  return account ? account.contra === true : false;
}

/**
 * Get all account names as array
 * @returns {string[]} Array of account names
 */
export function getAllAccountNames() {
  return getAllAccounts().map(account => account.name);
}

/**
 * Get all account codes as array
 * @returns {string[]} Array of account codes
 */
export function getAllAccountCodes() {
  return getAllAccounts().map(account => account.code);
}
