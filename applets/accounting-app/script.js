// ====================================
// APPLICATION STATE
// ====================================

let appState = {
    accounts: [
        { id: 1, number: '1000', name: 'Cash', type: 'Asset', openingBalance: 0 },
        { id: 2, number: '1100', name: 'Accounts Receivable', type: 'Asset', openingBalance: 0 },
        { id: 3, number: '1200', name: 'Inventory', type: 'Asset', openingBalance: 0 },
        { id: 4, number: '1300', name: 'Real Estate', type: 'Asset', openingBalance: 0 },
        { id: 22, number: '1400', name: 'Buildings', type: 'Asset', openingBalance: 0 },
        { id: 5, number: '1500', name: 'Equipment', type: 'Asset', openingBalance: 0 },
        { id: 6, number: '2000', name: 'Accounts Payable', type: 'Liability', openingBalance: 0 },
        { id: 7, number: '2100', name: 'Notes Payable', type: 'Liability', openingBalance: 0 },
        { id: 19, number: '2200', name: 'Bank Loans Payable - Principal', type: 'Liability', openingBalance: 0 },
        { id: 21, number: '2210', name: 'Bank Loans Payable - Interest', type: 'Liability', openingBalance: 0 },
        { id: 8, number: '3000', name: 'Common Stock', type: 'Equity', openingBalance: 0 },
        { id: 9, number: '3100', name: 'Retained Earnings', type: 'Equity', openingBalance: 0 },
        { id: 10, number: '4000', name: 'Sales Revenue', type: 'Revenue', openingBalance: 0 },
        { id: 11, number: '4100', name: 'Service Revenue', type: 'Revenue', openingBalance: 0 },
        { id: 12, number: '4200', name: 'Gains on Commodity Sales', type: 'Revenue', openingBalance: 0 },
        { id: 13, number: '5000', name: 'Cost of Goods Sold', type: 'Expense', openingBalance: 0 },
        { id: 14, number: '5100', name: 'Rent Expense', type: 'Expense', openingBalance: 0 },
        { id: 15, number: '5200', name: 'Utilities Expense', type: 'Expense', openingBalance: 0 },
        { id: 16, number: '5300', name: 'Salaries Expense', type: 'Expense', openingBalance: 0 },
        { id: 17, number: '5400', name: 'Supplies Expense', type: 'Expense', openingBalance: 0 },
        { id: 18, number: '5500', name: 'Losses on Commodity Sales', type: 'Expense', openingBalance: 0 },
        { id: 20, number: '5600', name: 'Interest Expense', type: 'Expense', openingBalance: 0 }
    ],
    transactions: [],
    transactionTypes: [
        {
            id: 1,
            name: 'Owner Investment',
            entries: [
                { account: 1, type: 'debit' },  // Cash
                { account: 7, type: 'credit' }  // Common Stock
            ]
        },
        {
            id: 2,
            name: 'Cash Sale',
            entries: [
                { account: 1, type: 'debit' },  // Cash
                { account: 9, type: 'credit' }  // Sales Revenue
            ]
        },
        {
            id: 3,
            name: 'Credit Sale',
            entries: [
                { account: 2, type: 'debit' },  // Accounts Receivable
                { account: 9, type: 'credit' }  // Sales Revenue
            ]
        },
        {
            id: 4,
            name: 'Collect Payment',
            entries: [
                { account: 1, type: 'debit' },  // Cash
                { account: 2, type: 'credit' }  // Accounts Receivable
            ]
        },
        {
            id: 5,
            name: 'Purchase Inventory (Cash)',
            entries: [
                { account: 3, type: 'debit' },  // Inventory
                { account: 1, type: 'credit' }  // Cash
            ]
        },
        {
            id: 6,
            name: 'Purchase Inventory (Credit)',
            entries: [
                { account: 3, type: 'debit' },  // Inventory
                { account: 5, type: 'credit' }  // Accounts Payable
            ]
        },
        {
            id: 7,
            name: 'Pay Supplier',
            entries: [
                { account: 5, type: 'debit' },  // Accounts Payable
                { account: 1, type: 'credit' }  // Cash
            ]
        },
        {
            id: 8,
            name: 'Pay Rent',
            entries: [
                { account: 13, type: 'debit' },  // Rent Expense
                { account: 1, type: 'credit' }   // Cash
            ]
        },
        {
            id: 9,
            name: 'Pay Utilities',
            entries: [
                { account: 14, type: 'debit' },  // Utilities Expense
                { account: 1, type: 'credit' }   // Cash
            ]
        },
        {
            id: 10,
            name: 'Pay Salaries',
            entries: [
                { account: 15, type: 'debit' },  // Salaries Expense
                { account: 1, type: 'credit' }   // Cash
            ]
        }
    ],
    commodities: [
        { id: 1, name: 'Power', description: 'Electrical energy units', buyPrice: 5.50, sellPrice: 5.00 },
        { id: 2, name: 'Water', description: 'Fresh water units', buyPrice: 2.75, sellPrice: 2.50 },
        { id: 3, name: 'Lumber', description: 'Construction-grade lumber', buyPrice: 18.50, sellPrice: 16.50 },
        { id: 4, name: 'Steel', description: 'Structural steel beams', buyPrice: 45.00, sellPrice: 40.00 },
        { id: 5, name: 'Concrete', description: 'Ready-mix concrete', buyPrice: 18.50, sellPrice: 16.50 },
        { id: 6, name: 'Raw Logs', description: 'Unprocessed timber logs', buyPrice: 6.60, sellPrice: 6.00 },
        { id: 7, name: 'Iron Ore', description: 'Raw iron ore for smelting', buyPrice: 8.80, sellPrice: 8.00 },
        { id: 8, name: 'Sand', description: 'Construction-grade sand', buyPrice: 2.20, sellPrice: 2.00 },
        { id: 9, name: 'Gravel', description: 'Construction-grade gravel', buyPrice: 3.30, sellPrice: 3.00 },
        { id: 10, name: 'Coal', description: 'Fuel for power generation and smelting', buyPrice: 5.50, sellPrice: 5.00 },
        { id: 11, name: 'Oil', description: 'Petroleum fuel for power generation', buyPrice: 13.20, sellPrice: 12.00 },
        { id: 12, name: 'Natural Gas', description: 'Clean-burning fuel for power', buyPrice: 8.80, sellPrice: 8.00 }
    ],
    portfolio: {
        // Structure: { commodityId: { lots: [{ quantity, costBasis, purchaseDate, purchaseId }] } }
    },
    trades: [],
    map: {
        gridSize: 20, // 20x20 grid
        pricePerSquare: 500,
        ownedSquares: []
    },
    settings: {
        companyName: 'My Business',
        adminMode: false,
        lastUpdated: new Date().toISOString()
    },
    simulation: {
        startRealTime: Date.now(), // Real-world timestamp when simulation started
        lastSaveRealTime: Date.now(), // Real-world timestamp when last saved
        simulationTime: 0, // Elapsed simulation time in milliseconds since Day 1, 00:00:00
        paused: false // Whether time progression is paused
    },
    loans: [],
    // Structure: { id, principal, interestRate, termMonths, suggestedMonthlyPayment, principalBalance, accruedInterestBalance, issueDate, maturityDate, lastInterestAccrualDate, status }
    shares: [],
    // Structure: { id, numberOfShares, pricePerShare, totalValue, issueDate, holder }
    buildings: [],
    // Structure: { id, type, x, y, status, startDate, completionDate, cost, interior: { grid: 4x4 array } }
    constructionQueue: [],
    // Structure: { buildingId, completionDate }
    employees: [],
    // Structure: { id, name, wage, skillLevel, assignedBuildingId, hireDate, nextPaymentDate }
    productionQueue: [],
    // Structure: { id, buildingId, equipmentId, productType, productId, recipeId, quantity, startTime, estimatedCompletionTime, actualCompletionTime, status, materialsConsumed, outputs, assignedEmployees, continuous, transactionId }
    nextAccountId: 23,
    nextTransactionId: 1,
    nextTransactionTypeId: 11,
    nextCommodityId: 13,
    nextTradeId: 1,
    nextLoanId: 1,
    nextShareIssuanceId: 1,
    nextBuildingId: 1,
    nextEmployeeId: 1,
    nextProductionId: 1,
    nextEquipmentId: 1
};

let hasUnsavedChanges = false;

// ====================================
// TRANSACTION MANAGER & GENERAL LEDGER
// ====================================

/**
 * TransactionManager - Centralized transaction creation and validation
 * Ensures all transactions follow double-entry rules and have proper timestamps
 */
class TransactionManager {
    constructor(appState) {
        this.appState = appState;
    }

    /**
     * Create and post a transaction
     * @param {Object} params - Transaction parameters
     * @param {string} params.description - Transaction description
     * @param {Array} params.entries - Array of {accountId, type, amount}
     * @param {Object} params.metadata - Optional metadata for traceability
     * @returns {Object} Posted transaction or null if validation failed
     */
    createTransaction({ description, entries, metadata = {} }) {
        // Generate timestamp
        const timestamp = new Date().toISOString();
        const simMs = getCurrentSimulationTime();
        const simTime = msToCalendarTime(simMs);
        const simDate = `Y${simTime.year}-M${simTime.month}-D${simTime.day}`;
        const simTimeStr = `${String(simTime.hour).padStart(2, '0')}:${String(simTime.minute).padStart(2, '0')}:${String(simTime.second).padStart(2, '0')}`;

        // Create transaction object
        const transaction = {
            id: this.appState.nextTransactionId++,
            timestamp: timestamp,
            simDate: simDate,
            simTime: simTimeStr,
            simMs: simMs, // Store milliseconds for sorting
            description: description,
            status: 'posted',
            entries: entries,
            metadata: metadata,
            audit: {
                createdBy: metadata.createdBy || 'system',
                createdAt: timestamp,
                voidedBy: null,
                voidedAt: null,
                voidReason: null
            }
        };

        // Validate transaction
        const validation = this.validateTransaction(transaction);
        if (!validation.valid) {
            console.error('Transaction validation failed:', validation.errors);
            return { success: false, errors: validation.errors };
        }

        // Post transaction
        this.appState.transactions.push(transaction);

        // Update general ledger
        if (window.generalLedger) {
            window.generalLedger.postTransaction(transaction);
        }

        // Validate balance sheet
        if (window.generalLedger) {
            const balanceCheck = window.generalLedger.validateBalanceSheet();
            if (!balanceCheck.balanced) {
                console.warn('Balance sheet is out of balance after transaction!', balanceCheck);
            }
        }

        hasUnsavedChanges = true;
        return { success: true, transaction: transaction };
    }

    /**
     * Create a simple two-account transaction
     * @param {string} description - Transaction description
     * @param {number} debitAccountId - Account to debit
     * @param {number} creditAccountId - Account to credit
     * @param {number} amount - Transaction amount
     * @param {Object} metadata - Optional metadata
     */
    createSimpleTransaction(description, debitAccountId, creditAccountId, amount, metadata = {}) {
        return this.createTransaction({
            description: description,
            entries: [
                { accountId: debitAccountId, type: 'debit', amount: amount },
                { accountId: creditAccountId, type: 'credit', amount: amount }
            ],
            metadata: metadata
        });
    }

    /**
     * Validate a transaction
     * @param {Object} transaction - Transaction to validate
     * @returns {Object} Validation result with valid flag and errors array
     */
    validateTransaction(transaction) {
        const errors = [];

        // Check required fields
        if (!transaction.description) {
            errors.push('Description is required');
        }

        if (!transaction.entries || transaction.entries.length < 2) {
            errors.push('Transaction must have at least 2 entries');
        }

        // Validate entries
        let debitTotal = 0;
        let creditTotal = 0;

        transaction.entries.forEach((entry, index) => {
            // Check account exists
            const account = this.appState.accounts.find(a => a.id === entry.accountId);
            if (!account) {
                errors.push(`Entry ${index + 1}: Account ID ${entry.accountId} not found`);
            }

            // Check amount is positive
            if (!entry.amount || entry.amount <= 0) {
                errors.push(`Entry ${index + 1}: Amount must be positive`);
            }

            // Check type is valid
            if (entry.type !== 'debit' && entry.type !== 'credit') {
                errors.push(`Entry ${index + 1}: Type must be 'debit' or 'credit'`);
            }

            // Sum debits and credits
            if (entry.type === 'debit') {
                debitTotal += entry.amount;
            } else if (entry.type === 'credit') {
                creditTotal += entry.amount;
            }
        });

        // Check debits = credits (allow small rounding difference)
        if (Math.abs(debitTotal - creditTotal) > 0.01) {
            errors.push(`Debits (${debitTotal.toFixed(2)}) must equal credits (${creditTotal.toFixed(2)})`);
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Void a transaction (mark as void, don't delete)
     * @param {number} transactionId - ID of transaction to void
     * @param {string} reason - Reason for voiding
     * @param {string} voidedBy - Who voided it (user/system)
     */
    voidTransaction(transactionId, reason, voidedBy = 'user') {
        const transaction = this.appState.transactions.find(t => t.id === transactionId);
        if (!transaction) {
            return { success: false, error: 'Transaction not found' };
        }

        if (transaction.status === 'void') {
            return { success: false, error: 'Transaction already voided' };
        }

        transaction.status = 'void';
        transaction.audit.voidedBy = voidedBy;
        transaction.audit.voidedAt = new Date().toISOString();
        transaction.audit.voidReason = reason;

        // Update general ledger
        if (window.generalLedger) {
            window.generalLedger.invalidateCache();
        }

        hasUnsavedChanges = true;
        return { success: true };
    }

    /**
     * Get transactions by date range
     * @param {string} startDate - Start date (simDate format)
     * @param {string} endDate - End date (simDate format)
     * @param {boolean} includeVoided - Whether to include voided transactions
     */
    getTransactionsByDateRange(startDate, endDate, includeVoided = false) {
        return this.appState.transactions.filter(t => {
            if (!includeVoided && t.status === 'void') return false;
            if (startDate && compareDates(t.simDate, startDate) < 0) return false;
            if (endDate && compareDates(t.simDate, endDate) > 0) return false;
            return true;
        });
    }
}

/**
 * GeneralLedger - Manages account balances with caching and incremental updates
 */
class GeneralLedger {
    constructor(appState) {
        this.appState = appState;
        this.balanceCache = null;
        this.cacheTimestamp = null;
        this.lastProcessedTransactionId = 0;
    }

    /**
     * Get account balances as of a specific date
     * @param {string} asOfDate - Date in simDate format (null for current)
     * @returns {Object} Balances by account ID
     */
    getBalances(asOfDate = null) {
        // If requesting current balances and cache is valid, use cache
        if (!asOfDate && this.balanceCache && this.isCacheValid()) {
            return { ...this.balanceCache };
        }

        // Calculate balances
        const balances = this.calculateBalances(asOfDate);

        // Cache if current balances
        if (!asOfDate) {
            this.balanceCache = balances;
            this.cacheTimestamp = Date.now();
            this.lastProcessedTransactionId = this.appState.nextTransactionId - 1;
        }

        return balances;
    }

    /**
     * Calculate balances from scratch
     * @param {string} asOfDate - Date in simDate format (null for all transactions)
     */
    calculateBalances(asOfDate = null) {
        const balances = {};

        // Initialize with opening balances
        this.appState.accounts.forEach(account => {
            balances[account.id] = account.openingBalance || 0;
        });

        // Filter transactions
        const transactions = asOfDate
            ? this.appState.transactions.filter(t => {
                return t.status !== 'void' && compareDates(t.simDate || t.date, asOfDate) <= 0;
            })
            : this.appState.transactions.filter(t => t.status !== 'void');

        // Apply transactions
        transactions.forEach(transaction => {
            this.applyTransactionToBalances(transaction, balances);
        });

        return balances;
    }

    /**
     * Apply a single transaction to balance object
     * @param {Object} transaction - Transaction to apply
     * @param {Object} balances - Balances object to update
     */
    applyTransactionToBalances(transaction, balances) {
        // Handle new format with entries array
        if (transaction.entries) {
            transaction.entries.forEach(entry => {
                const account = this.appState.accounts.find(a => a.id === entry.accountId);
                if (!account) return;

                if (!balances[entry.accountId]) balances[entry.accountId] = 0;

                const amount = entry.amount;

                if (entry.type === 'debit') {
                    // Debit increases: Assets, Expenses
                    // Debit decreases: Liabilities, Equity, Revenue
                    if (account.type === 'Asset' || account.type === 'Expense') {
                        balances[entry.accountId] += amount;
                    } else {
                        balances[entry.accountId] -= amount;
                    }
                } else {
                    // Credit increases: Liabilities, Equity, Revenue
                    // Credit decreases: Assets, Expenses
                    if (account.type === 'Liability' || account.type === 'Equity' || account.type === 'Revenue') {
                        balances[entry.accountId] += amount;
                    } else {
                        balances[entry.accountId] -= amount;
                    }
                }
            });
        }
        // Handle legacy format
        else if (transaction.debitAccount && transaction.creditAccount) {
            const debitAccount = this.appState.accounts.find(a => a.id === transaction.debitAccount);
            const creditAccount = this.appState.accounts.find(a => a.id === transaction.creditAccount);

            if (!debitAccount || !creditAccount) return;

            if (!balances[transaction.debitAccount]) balances[transaction.debitAccount] = 0;
            if (!balances[transaction.creditAccount]) balances[transaction.creditAccount] = 0;

            // Apply debit
            if (debitAccount.type === 'Asset' || debitAccount.type === 'Expense') {
                balances[transaction.debitAccount] += transaction.amount;
            } else {
                balances[transaction.debitAccount] -= transaction.amount;
            }

            // Apply credit
            if (creditAccount.type === 'Liability' || creditAccount.type === 'Equity' || creditAccount.type === 'Revenue') {
                balances[transaction.creditAccount] += transaction.amount;
            } else {
                balances[transaction.creditAccount] -= transaction.amount;
            }
        }
    }

    /**
     * Post a transaction and update cache incrementally
     * @param {Object} transaction - Transaction that was just posted
     */
    postTransaction(transaction) {
        if (this.balanceCache) {
            this.applyTransactionToBalances(transaction, this.balanceCache);
            this.lastProcessedTransactionId = transaction.id;
        }
    }

    /**
     * Check if cache is still valid
     */
    isCacheValid() {
        // Cache is valid if no transactions were added, edited, or voided
        return this.lastProcessedTransactionId === this.appState.nextTransactionId - 1;
    }

    /**
     * Invalidate cache (call when transactions are modified)
     */
    invalidateCache() {
        this.balanceCache = null;
        this.cacheTimestamp = null;
        this.lastProcessedTransactionId = 0;
    }

    /**
     * Validate that the balance sheet balances
     * @returns {Object} Validation result with balanced flag and totals
     */
    validateBalanceSheet() {
        const balances = this.getBalances();

        let totalAssets = 0;
        let totalLiabilities = 0;
        let totalEquity = 0;

        this.appState.accounts.forEach(account => {
            const balance = balances[account.id] || 0;

            if (account.type === 'Asset') {
                totalAssets += balance;
            } else if (account.type === 'Liability') {
                totalLiabilities += balance;
            } else if (account.type === 'Equity') {
                totalEquity += balance;
            }
        });

        const difference = Math.abs(totalAssets - (totalLiabilities + totalEquity));
        const balanced = difference < 0.01; // Allow 1 cent rounding error

        return {
            balanced: balanced,
            totalAssets: totalAssets,
            totalLiabilities: totalLiabilities,
            totalEquity: totalEquity,
            difference: difference
        };
    }

    /**
     * Get balance for a specific account
     * @param {number} accountId - Account ID
     * @param {string} asOfDate - Optional date
     */
    getAccountBalance(accountId, asOfDate = null) {
        const balances = this.getBalances(asOfDate);
        return balances[accountId] || 0;
    }
}

// Initialize global instances
let transactionManager = null;
let generalLedger = null;

function initializeFinancialSystem() {
    // Migrate legacy transactions to new format
    migrateLegacyTransactions();

    // Initialize managers
    transactionManager = new TransactionManager(appState);
    generalLedger = new GeneralLedger(appState);

    // Make available globally
    window.transactionManager = transactionManager;
    window.generalLedger = generalLedger;
}

/**
 * Migrate legacy transactions to new format with timestamps and status
 */
function migrateLegacyTransactions() {
    let migrationCount = 0;

    appState.transactions.forEach(transaction => {
        let needsMigration = false;

        // Add timestamp if missing
        if (!transaction.timestamp) {
            transaction.timestamp = new Date().toISOString();
            needsMigration = true;
        }

        // Add simulation date/time if missing
        if (!transaction.simDate && transaction.date) {
            transaction.simDate = transaction.date;
            needsMigration = true;
        }

        // Add simTime if missing
        if (!transaction.simTime) {
            transaction.simTime = '00:00:00';
            needsMigration = true;
        }

        // Add simMs if missing (try to parse from simDate)
        if (!transaction.simMs && transaction.simDate) {
            const parts = transaction.simDate.match(/Y(\d+)-M(\d+)-D(\d+)/);
            if (parts) {
                const year = parseInt(parts[1]);
                const month = parseInt(parts[2]);
                const day = parseInt(parts[3]);
                transaction.simMs = calendarTimeToMs(year, month, day, 0, 0, 0);
                needsMigration = true;
            }
        }

        // Add status if missing
        if (!transaction.status) {
            transaction.status = 'posted';
            needsMigration = true;
        }

        // Convert simple format to entries format
        if (transaction.debitAccount && transaction.creditAccount && !transaction.entries) {
            transaction.entries = [
                { accountId: transaction.debitAccount, type: 'debit', amount: transaction.amount },
                { accountId: transaction.creditAccount, type: 'credit', amount: transaction.amount }
            ];
            needsMigration = true;
        }

        // Convert old entry format (account) to new format (accountId)
        if (transaction.entries) {
            transaction.entries.forEach(entry => {
                if (entry.account && !entry.accountId) {
                    entry.accountId = entry.account;
                    needsMigration = true;
                }
            });
        }

        // Add audit trail if missing
        if (!transaction.audit) {
            transaction.audit = {
                createdBy: 'system',
                createdAt: transaction.timestamp || new Date().toISOString(),
                voidedBy: null,
                voidedAt: null,
                voidReason: null
            };
            needsMigration = true;
        }

        // Add metadata if missing
        if (!transaction.metadata) {
            transaction.metadata = {
                source: 'legacy'
            };
            needsMigration = true;
        }

        if (needsMigration) {
            migrationCount++;
        }
    });

    if (migrationCount > 0) {
        console.log(`Migrated ${migrationCount} legacy transactions to new format`);
        hasUnsavedChanges = true;
    }
}

// ====================================
// SESSION KEY MANAGEMENT
// ====================================

function encodeSessionKey() {
    try {
        // Update simulation time before saving
        const currentSimTime = getCurrentSimulationTime();
        appState.simulation.simulationTime = currentSimTime;
        appState.simulation.lastSaveRealTime = Date.now();
        appState.settings.lastUpdated = new Date().toISOString();

        const jsonString = JSON.stringify(appState);
        // Use base64 encoding for simplicity
        return btoa(encodeURIComponent(jsonString));
    } catch (error) {
        console.error('Error encoding session key:', error);
        return null;
    }
}

function decodeSessionKey(key) {
    try {
        const jsonString = decodeURIComponent(atob(key));
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error decoding session key:', error);
        return null;
    }
}

function copySessionKey() {
    const key = encodeSessionKey();
    if (!key) {
        showStatus('copyStatus', 'Failed to generate key!', 'error');
        return;
    }

    navigator.clipboard.writeText(key).then(() => {
        showStatus('copyStatus', 'Key copied!', 'success');
        hasUnsavedChanges = false;
    }).catch(err => {
        showStatus('copyStatus', 'Failed to copy!', 'error');
        console.error('Copy failed:', err);
    });
}

function restoreSessionKey() {
    const keyInput = document.getElementById('restoreKeyInput');
    const key = keyInput.value.trim();

    if (!key) {
        showStatus('restoreStatus', 'Please enter a session key', 'error');
        return;
    }

    const restoredState = decodeSessionKey(key);
    if (!restoredState) {
        showStatus('restoreStatus', 'Invalid session key!', 'error');
        return;
    }

    if (confirm('This will replace all current data. Continue?')) {
        // Calculate time elapsed since session was saved
        const realTimeElapsed = Date.now() - restoredState.simulation.lastSaveRealTime;

        // Add elapsed time to simulation time (apply 60x time scale for offline progression)
        const simulationTimeElapsed = realTimeElapsed * SIMULATION_CONFIG.TIME_SCALE;
        restoredState.simulation.simulationTime += simulationTimeElapsed;
        restoredState.simulation.lastSaveRealTime = Date.now();

        appState = restoredState;

        // Backward compatibility: add missing properties for older session keys
        if (!appState.shares) {
            appState.shares = [];
        }
        if (!appState.nextShareIssuanceId) {
            appState.nextShareIssuanceId = 1;
        }

        // Update old loan structure to new structure
        if (appState.loans) {
            appState.loans.forEach(loan => {
                if (loan.monthlyPayment && !loan.suggestedMonthlyPayment) {
                    loan.suggestedMonthlyPayment = loan.monthlyPayment;
                }
                if (!loan.lastInterestAccrualDate && loan.issueDate) {
                    loan.lastInterestAccrualDate = loan.issueDate;
                }
                // Migrate from remainingBalance to principalBalance + accruedInterestBalance
                if (loan.remainingBalance !== undefined && loan.principalBalance === undefined) {
                    loan.principalBalance = loan.remainingBalance;
                    loan.accruedInterestBalance = 0;
                }
                // Remove old properties
                delete loan.monthlyPayment;
                delete loan.nextPaymentDate;
                delete loan.remainingBalance;
            });
        }

        // Ensure new account exists for interest payable
        if (!appState.accounts.find(a => a.number === '2210')) {
            appState.accounts.push({
                id: 21,
                number: '2210',
                name: 'Bank Loans Payable - Interest',
                type: 'Liability',
                openingBalance: 0
            });
        }
        // Update old "Bank Loans Payable" account name to "Bank Loans Payable - Principal"
        const oldLoansAccount = appState.accounts.find(a => a.number === '2200');
        if (oldLoansAccount && oldLoansAccount.name === 'Bank Loans Payable') {
            oldLoansAccount.name = 'Bank Loans Payable - Principal';
        }

        // Add Buildings account if it doesn't exist
        if (!appState.accounts.find(a => a.number === '1400')) {
            appState.accounts.push({
                id: 22,
                number: '1400',
                name: 'Buildings',
                type: 'Asset',
                openingBalance: 0
            });
        }

        // Add construction commodities if they don't exist
        if (!appState.commodities.find(c => c.id === 3)) {
            appState.commodities.push({ id: 3, name: 'Lumber', description: 'Construction-grade lumber', price: 10.00 });
        }
        if (!appState.commodities.find(c => c.id === 4)) {
            appState.commodities.push({ id: 4, name: 'Steel', description: 'Structural steel beams', price: 20.00 });
        }
        if (!appState.commodities.find(c => c.id === 5)) {
            appState.commodities.push({ id: 5, name: 'Concrete', description: 'Ready-mix concrete', price: 15.00 });
        }

        // Add buildings array if it doesn't exist
        if (!appState.buildings) {
            appState.buildings = [];
        }
        if (!appState.constructionQueue) {
            appState.constructionQueue = [];
        }
        if (!appState.nextBuildingId) {
            appState.nextBuildingId = 1;
        }

        // Add employees array if it doesn't exist
        if (!appState.employees) {
            appState.employees = [];
        }
        if (!appState.nextEmployeeId) {
            appState.nextEmployeeId = 1;
        }

        hasUnsavedChanges = false;
        keyInput.value = '';
        showStatus('restoreStatus', 'Data restored successfully!', 'success');

        // Reinitialize financial system with restored data
        initializeFinancialSystem();

        // Restart the clock with the updated time
        startSimulationClock();
        render();
    }
}

function showStatus(elementId, message, type) {
    const statusElement = document.getElementById(elementId);
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;

    setTimeout(() => {
        statusElement.textContent = '';
        statusElement.className = 'status-message';
    }, 3000);
}

// ====================================
// ADMIN MODE
// ====================================

function toggleAdminMode() {
    appState.settings.adminMode = !appState.settings.adminMode;
    hasUnsavedChanges = true;
    render();
    updateAdminModeUI();
}

function updateAdminModeUI() {
    const adminToggle = document.getElementById('adminModeToggle');
    const adminTab = document.querySelector('[data-tab="admin"]');

    if (adminToggle) {
        adminToggle.checked = appState.settings.adminMode;
    }

    // Show/hide admin tab
    if (adminTab) {
        if (appState.settings.adminMode) {
            adminTab.classList.remove('hidden');
        } else {
            adminTab.classList.add('hidden');
            // If admin tab is active, switch to accounts tab
            if (adminTab.classList.contains('active')) {
                document.querySelector('[data-tab="accounts"]').click();
            }
        }
    }
}

// ====================================
// TAB NAVIGATION
// ====================================

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            // Trigger rendering for the specific tab
            if (targetTab === 'balance-sheet') {
                updateStatementEndDates();
                renderBalanceSheet();
            } else if (targetTab === 'income-statement') {
                updateStatementEndDates();
                renderIncomeStatement();
            } else if (targetTab === 'cash-flow') {
                updateStatementEndDates();
                renderCashFlowStatement();
            } else if (targetTab === 'commodities') {
                renderCommoditiesMarket();
            } else if (targetTab === 'map') {
                renderMap();
            } else if (targetTab === 'finance') {
                renderFinancialManagement();
            }
        });
    });
}

// ====================================
// CHART OF ACCOUNTS
// ====================================

function renderAccounts() {
    // Calculate current balances
    const balances = calculateAccountBalances();

    // Define table body mappings
    const tableBodies = {
        'Asset': document.getElementById('assetsTableBody'),
        'Liability': document.getElementById('liabilitiesTableBody'),
        'Equity': document.getElementById('equityTableBody'),
        'Revenue': document.getElementById('revenueTableBody'),
        'Expense': document.getElementById('expensesTableBody')
    };

    // Clear all table bodies
    Object.values(tableBodies).forEach(tbody => {
        if (tbody) tbody.innerHTML = '';
    });

    // Helper function to create account row
    const createAccountRow = (account, balance) => {
        const row = document.createElement('tr');
        const actionsHtml = appState.settings.adminMode ? `
            <td>
                <button class="btn" onclick="editAccount(${account.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteAccount(${account.id})">Delete</button>
            </td>
        ` : '<td>-</td>';

        row.innerHTML = `
            <td>${escapeHtml(account.number)}</td>
            <td>${escapeHtml(account.name)}</td>
            <td class="number">${formatCurrency(balance)}</td>
            ${actionsHtml}
        `;
        return row;
    };

    // Group and render accounts by type
    ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].forEach(type => {
        const accountsOfType = appState.accounts
            .filter(account => account.type === type)
            .sort((a, b) => a.number.localeCompare(b.number));

        const tbody = tableBodies[type];
        if (tbody) {
            accountsOfType.forEach(account => {
                const balance = balances[account.id] || 0;
                const row = createAccountRow(account, balance);
                tbody.appendChild(row);
            });

            // Add empty state if no accounts
            if (accountsOfType.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = '<td colspan="4" style="text-align: center; color: #999;">No accounts</td>';
                tbody.appendChild(emptyRow);
            }
        }
    });

    // Update account dropdowns
    updateAccountDropdowns();
}

function showAccountForm(accountId = null) {
    const formContainer = document.getElementById('accountFormContainer');
    const form = document.getElementById('accountForm');
    const formTitle = document.getElementById('accountFormTitle');

    if (accountId) {
        const account = appState.accounts.find(a => a.id === accountId);
        if (!account) return;

        formTitle.textContent = 'Edit Account';
        document.getElementById('accountId').value = account.id;
        document.getElementById('accountNumber').value = account.number;
        document.getElementById('accountName').value = account.name;
        document.getElementById('accountType').value = account.type;
        document.getElementById('openingBalance').value = account.openingBalance;
    } else {
        formTitle.textContent = 'Add Account';
        form.reset();
        document.getElementById('accountId').value = '';
    }

    formContainer.classList.remove('hidden');
}

function hideAccountForm() {
    document.getElementById('accountFormContainer').classList.add('hidden');
    document.getElementById('accountForm').reset();
}

function saveAccount(event) {
    event.preventDefault();

    const accountId = document.getElementById('accountId').value;
    const accountData = {
        number: document.getElementById('accountNumber').value,
        name: document.getElementById('accountName').value,
        type: document.getElementById('accountType').value,
        openingBalance: parseFloat(document.getElementById('openingBalance').value) || 0
    };

    if (accountId) {
        // Edit existing account
        const account = appState.accounts.find(a => a.id === parseInt(accountId));
        if (account) {
            Object.assign(account, accountData);
        }
    } else {
        // Add new account
        appState.accounts.push({
            id: appState.nextAccountId++,
            ...accountData
        });
    }

    hasUnsavedChanges = true;
    hideAccountForm();
    render();
}

function editAccount(accountId) {
    showAccountForm(accountId);
}

function deleteAccount(accountId) {
    // Check if account is used in transactions
    const isUsed = appState.transactions.some(
        t => t.debitAccount === accountId || t.creditAccount === accountId
    );

    if (isUsed) {
        alert('Cannot delete account that is used in transactions!');
        return;
    }

    if (confirm('Are you sure you want to delete this account?')) {
        appState.accounts = appState.accounts.filter(a => a.id !== accountId);
        hasUnsavedChanges = true;
        render();
    }
}

// ====================================
// TRANSACTION TYPES
// ====================================

let typeEntryCounter = 0;

function renderTransactionTypes() {
    const tbody = document.getElementById('transactionTypesTableBody');
    tbody.innerHTML = '';

    appState.transactionTypes.forEach(type => {
        const entriesDisplay = type.entries.map(entry => {
            const account = appState.accounts.find(a => a.id === entry.account);
            const accountName = account ? account.name : 'Unknown';
            const entryType = entry.type === 'debit' ? 'DR' : 'CR';
            return `${entryType}: ${accountName}`;
        }).join(', ');

        const actionsHtml = appState.settings.adminMode ? `
            <td>
                <button class="btn" onclick="editTransactionType(${type.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteTransactionType(${type.id})">Delete</button>
            </td>
        ` : '<td>-</td>';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(type.name)}</td>
            <td>${entriesDisplay}</td>
            ${actionsHtml}
        `;
        tbody.appendChild(row);
    });

    if (appState.transactionTypes.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="3" style="text-align: center;">No transaction types defined. Create one to simplify recurring transactions.</td>';
        tbody.appendChild(row);
    }

    // Update transaction type dropdown
    updateTransactionTypeDropdown();
}

function addTypeEntryRow(account = '', entryType = 'debit') {
    typeEntryCounter++;
    const container = document.getElementById('typeAccountEntries');
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry-row';
    entryDiv.dataset.entryId = typeEntryCounter;

    entryDiv.innerHTML = `
        <select class="entry-account" required>
            <option value="">Select account...</option>
            ${appState.accounts.map(acc =>
                `<option value="${acc.id}" ${acc.id == account ? 'selected' : ''}>${acc.number} - ${acc.name}</option>`
            ).join('')}
        </select>
        <select class="entry-type" required>
            <option value="debit" ${entryType === 'debit' ? 'selected' : ''}>Debit</option>
            <option value="credit" ${entryType === 'credit' ? 'selected' : ''}>Credit</option>
        </select>
        <button type="button" class="btn btn-danger" onclick="removeTypeEntryRow(${typeEntryCounter})">Remove</button>
    `;

    container.appendChild(entryDiv);
}

function removeTypeEntryRow(entryId) {
    const entry = document.querySelector(`[data-entry-id="${entryId}"]`);
    if (entry) entry.remove();
}

function showTransactionTypeForm(typeId = null) {
    const formContainer = document.getElementById('transactionTypeFormContainer');
    const form = document.getElementById('transactionTypeForm');
    const formTitle = document.getElementById('transactionTypeFormTitle');
    const container = document.getElementById('typeAccountEntries');

    // Clear existing entries
    container.innerHTML = '';
    typeEntryCounter = 0;

    if (typeId) {
        const type = appState.transactionTypes.find(t => t.id === typeId);
        if (!type) return;

        formTitle.textContent = 'Edit Transaction Type';
        document.getElementById('transactionTypeId').value = type.id;
        document.getElementById('typeName').value = type.name;

        // Add existing entries
        type.entries.forEach(entry => {
            addTypeEntryRow(entry.account, entry.type);
        });
    } else {
        formTitle.textContent = 'Add Transaction Type';
        document.getElementById('transactionTypeId').value = '';
        document.getElementById('typeName').value = '';

        // Add two default entries (one debit, one credit)
        addTypeEntryRow('', 'debit');
        addTypeEntryRow('', 'credit');
    }

    formContainer.classList.remove('hidden');
}

function hideTransactionTypeForm() {
    document.getElementById('transactionTypeFormContainer').classList.add('hidden');
    document.getElementById('transactionTypeForm').reset();
}

function saveTransactionType(event) {
    event.preventDefault();

    const typeId = document.getElementById('transactionTypeId').value;
    const name = document.getElementById('typeName').value;

    // Collect all entries
    const entries = [];
    const entryRows = document.querySelectorAll('#typeAccountEntries .entry-row');

    if (entryRows.length < 2) {
        alert('Transaction type must have at least 2 account entries!');
        return;
    }

    entryRows.forEach(row => {
        const account = parseInt(row.querySelector('.entry-account').value);
        const type = row.querySelector('.entry-type').value;

        if (!account) {
            alert('All entries must have an account selected!');
            return;
        }

        entries.push({ account, type });
    });

    if (entries.length < 2) {
        return; // Validation failed
    }

    // Check that we have at least one debit and one credit
    const hasDebit = entries.some(e => e.type === 'debit');
    const hasCredit = entries.some(e => e.type === 'credit');

    if (!hasDebit || !hasCredit) {
        alert('Transaction type must have at least one debit and one credit entry!');
        return;
    }

    const typeData = {
        name,
        entries
    };

    if (typeId) {
        // Edit existing type
        const type = appState.transactionTypes.find(t => t.id === parseInt(typeId));
        if (type) {
            Object.assign(type, typeData);
        }
    } else {
        // Add new type
        appState.transactionTypes.push({
            id: appState.nextTransactionTypeId++,
            ...typeData
        });
    }

    hasUnsavedChanges = true;
    hideTransactionTypeForm();
    render();
}

function editTransactionType(typeId) {
    showTransactionTypeForm(typeId);
}

function deleteTransactionType(typeId) {
    if (confirm('Are you sure you want to delete this transaction type?')) {
        appState.transactionTypes = appState.transactionTypes.filter(t => t.id !== typeId);
        hasUnsavedChanges = true;
        render();
    }
}

function updateTransactionTypeDropdown() {
    const select = document.getElementById('transactionType');
    if (!select) return;

    // Clear existing options except the first one
    select.innerHTML = '<option value="">Custom Transaction</option>';

    // Add transaction type options
    appState.transactionTypes.forEach(type => {
        const option = new Option(type.name, type.id);
        select.add(option);
    });
}

function onTransactionTypeChange() {
    const typeId = parseInt(document.getElementById('transactionType').value);
    const simpleForm = document.getElementById('simpleTransactionForm');
    const multiForm = document.getElementById('multiEntryTransactionForm');
    const debitInput = document.getElementById('debitAccount');
    const creditInput = document.getElementById('creditAccount');
    const amountInput = document.getElementById('transactionAmount');

    if (!typeId) {
        // Custom transaction - show simple form
        simpleForm.classList.remove('hidden');
        multiForm.classList.add('hidden');
        debitInput.disabled = false;
        creditInput.disabled = false;
        debitInput.required = true;
        creditInput.required = true;
        amountInput.required = true;
        return;
    }

    // Find the transaction type
    const type = appState.transactionTypes.find(t => t.id === typeId);
    if (!type) return;

    // Check if it's a simple type (1 debit, 1 credit) or multi-entry
    const debits = type.entries.filter(e => e.type === 'debit');
    const credits = type.entries.filter(e => e.type === 'credit');

    if (debits.length === 1 && credits.length === 1) {
        // Simple type - use simple form
        simpleForm.classList.remove('hidden');
        multiForm.classList.add('hidden');
        debitInput.value = debits[0].account;
        creditInput.value = credits[0].account;
        debitInput.disabled = true;
        creditInput.disabled = true;
        debitInput.required = true;
        creditInput.required = true;
        amountInput.required = true;
    } else {
        // Multi-entry type - use multi-entry form
        simpleForm.classList.add('hidden');
        multiForm.classList.remove('hidden');
        debitInput.required = false;
        creditInput.required = false;
        amountInput.required = false;

        // Populate multi-entry form
        const container = document.getElementById('transactionEntries');
        container.innerHTML = '';

        type.entries.forEach((entry, index) => {
            const account = appState.accounts.find(a => a.id === entry.account);
            if (!account) return;

            const entryDiv = document.createElement('div');
            entryDiv.className = 'transaction-entry-row';
            entryDiv.innerHTML = `
                <span class="entry-type-badge ${entry.type}">${entry.type.toUpperCase()}</span>
                <span class="entry-label">${account.number} - ${account.name}</span>
                <input type="number" step="0.01" min="0" class="entry-amount" data-entry-type="${entry.type}" data-account-id="${entry.account}" placeholder="Amount" required>
            `;
            container.appendChild(entryDiv);
        });

        // Add event listeners to update balance
        container.querySelectorAll('.entry-amount').forEach(input => {
            input.addEventListener('input', updateTransactionBalance);
        });

        updateTransactionBalance();
    }
}

function updateTransactionBalance() {
    const inputs = document.querySelectorAll('#transactionEntries .entry-amount');
    let debitsTotal = 0;
    let creditsTotal = 0;

    inputs.forEach(input => {
        const amount = parseFloat(input.value) || 0;
        if (input.dataset.entryType === 'debit') {
            debitsTotal += amount;
        } else {
            creditsTotal += amount;
        }
    });

    document.getElementById('debitsTotal').textContent = formatCurrency(debitsTotal);
    document.getElementById('creditsTotal').textContent = formatCurrency(creditsTotal);

    const difference = Math.abs(debitsTotal - creditsTotal);
    const differenceEl = document.getElementById('balanceDifference');
    differenceEl.textContent = formatCurrency(difference);

    if (difference < 0.01) {
        differenceEl.classList.add('balanced');
    } else {
        differenceEl.classList.remove('balanced');
    }
}

// ====================================
// TRANSACTIONS
// ====================================

function renderTransactions() {
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '';

    // Get filter values
    const filterStartDate = document.getElementById('filterStartDate').value;
    const filterEndDate = document.getElementById('filterEndDate').value;
    const filterAccount = parseInt(document.getElementById('filterAccount').value);

    // Filter transactions
    let filteredTransactions = [...appState.transactions];

    if (filterStartDate) {
        filteredTransactions = filteredTransactions.filter(t => t.date >= filterStartDate);
    }
    if (filterEndDate) {
        filteredTransactions = filteredTransactions.filter(t => t.date <= filterEndDate);
    }
    if (filterAccount) {
        filteredTransactions = filteredTransactions.filter(
            t => t.debitAccount === filterAccount || t.creditAccount === filterAccount
        );
    }

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    filteredTransactions.forEach(transaction => {
        let debitDisplay, creditDisplay, amountDisplay;

        if (transaction.entries) {
            // Multi-entry transaction
            const debits = transaction.entries.filter(e => e.type === 'debit');
            const credits = transaction.entries.filter(e => e.type === 'credit');

            debitDisplay = debits.map(e => {
                const acc = appState.accounts.find(a => a.id === e.account);
                return acc ? `${acc.name} (${formatCurrency(e.amount)})` : 'Unknown';
            }).join(', ');

            creditDisplay = credits.map(e => {
                const acc = appState.accounts.find(a => a.id === e.account);
                return acc ? `${acc.name} (${formatCurrency(e.amount)})` : 'Unknown';
            }).join(', ');

            const total = debits.reduce((sum, e) => sum + e.amount, 0);
            amountDisplay = formatCurrency(total);
        } else {
            // Simple transaction
            const debitAccount = appState.accounts.find(a => a.id === transaction.debitAccount);
            const creditAccount = appState.accounts.find(a => a.id === transaction.creditAccount);

            debitDisplay = debitAccount ? escapeHtml(debitAccount.name) : 'Unknown';
            creditDisplay = creditAccount ? escapeHtml(creditAccount.name) : 'Unknown';
            amountDisplay = formatCurrency(transaction.amount);
        }

        const actionsHtml = appState.settings.adminMode ? `
            <td>
                <button class="btn" onclick="editTransaction(${transaction.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteTransaction(${transaction.id})">Delete</button>
            </td>
        ` : '<td>-</td>';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(transaction.date)}</td>
            <td>${escapeHtml(transaction.description)}</td>
            <td>${debitDisplay}</td>
            <td>${creditDisplay}</td>
            <td class="number">${amountDisplay}</td>
            ${actionsHtml}
        `;
        tbody.appendChild(row);
    });

    if (filteredTransactions.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" style="text-align: center;">No transactions found</td>';
        tbody.appendChild(row);
    }
}

function saveTransaction(event) {
    event.preventDefault();

    const transactionId = document.getElementById('transactionId').value;
    const date = document.getElementById('transactionDate').value;
    const description = document.getElementById('transactionDescription').value;
    const multiForm = document.getElementById('multiEntryTransactionForm');

    let transactionData;

    // Check if using multi-entry form
    if (!multiForm.classList.contains('hidden')) {
        // Multi-entry transaction
        const entries = [];
        const entryInputs = document.querySelectorAll('#transactionEntries .entry-amount');

        entryInputs.forEach(input => {
            const amount = parseFloat(input.value);
            if (amount && amount > 0) {
                entries.push({
                    account: parseInt(input.dataset.accountId),
                    type: input.dataset.entryType,
                    amount
                });
            }
        });

        if (entries.length < 2) {
            alert('Multi-entry transaction must have at least 2 entries with amounts!');
            return;
        }

        // Validate debits = credits
        const debitsTotal = entries.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0);
        const creditsTotal = entries.filter(e => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0);

        if (Math.abs(debitsTotal - creditsTotal) > 0.01) {
            alert(`Debits (${formatCurrency(debitsTotal)}) must equal credits (${formatCurrency(creditsTotal)})!`);
            return;
        }

        transactionData = {
            date,
            description,
            entries
        };
    } else {
        // Simple transaction
        const debitAccount = parseInt(document.getElementById('debitAccount').value);
        const creditAccount = parseInt(document.getElementById('creditAccount').value);
        const amount = parseFloat(document.getElementById('transactionAmount').value);

        // Validation
        if (debitAccount === creditAccount) {
            alert('Debit and credit accounts must be different!');
            return;
        }

        if (amount <= 0) {
            alert('Amount must be greater than zero!');
            return;
        }

        transactionData = {
            date,
            description,
            debitAccount,
            creditAccount,
            amount
        };
    }

    if (transactionId) {
        // Edit existing transaction (legacy mode)
        const transaction = appState.transactions.find(t => t.id === parseInt(transactionId));
        if (transaction) {
            Object.assign(transaction, transactionData);
            // Invalidate cache since we modified a transaction
            if (window.generalLedger) {
                window.generalLedger.invalidateCache();
            }
        }
        hasUnsavedChanges = true;
    } else {
        // Add new transaction using TransactionManager
        if (window.transactionManager) {
            // Convert to new format with accountId
            let entries;
            if (transactionData.entries) {
                // Multi-entry transaction - convert account to accountId
                entries = transactionData.entries.map(e => ({
                    accountId: e.account,
                    type: e.type,
                    amount: e.amount
                }));
            } else {
                // Simple transaction - convert to entries format
                entries = [
                    { accountId: transactionData.debitAccount, type: 'debit', amount: transactionData.amount },
                    { accountId: transactionData.creditAccount, type: 'credit', amount: transactionData.amount }
                ];
            }

            const result = window.transactionManager.createTransaction({
                description: description,
                entries: entries,
                metadata: {
                    createdBy: 'user',
                    source: 'manual_entry'
                }
            });

            if (!result.success) {
                alert('Transaction validation failed:\n' + result.errors.join('\n'));
                return;
            }
        } else {
            // Fallback to legacy mode if TransactionManager not available
            appState.transactions.push({
                id: appState.nextTransactionId++,
                ...transactionData
            });
            hasUnsavedChanges = true;
        }
    }

    cancelTransactionEdit();
    render();
}

function editTransaction(transactionId) {
    const transaction = appState.transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    document.getElementById('transactionId').value = transaction.id;
    document.getElementById('transactionDate').value = transaction.date;
    document.getElementById('transactionDescription').value = transaction.description;
    document.getElementById('transactionType').value = ''; // Reset to custom
    document.getElementById('debitAccount').value = transaction.debitAccount;
    document.getElementById('creditAccount').value = transaction.creditAccount;
    document.getElementById('debitAccount').disabled = false;
    document.getElementById('creditAccount').disabled = false;
    document.getElementById('transactionAmount').value = transaction.amount;
    document.getElementById('cancelTransactionBtn').classList.remove('hidden');

    // Scroll to form
    document.getElementById('transactionForm').scrollIntoView({ behavior: 'smooth' });
}

function cancelTransactionEdit() {
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionId').value = '';
    document.getElementById('transactionType').value = '';
    document.getElementById('debitAccount').disabled = false;
    document.getElementById('creditAccount').disabled = false;
    document.getElementById('cancelTransactionBtn').classList.add('hidden');
    setDefaultTransactionDate();
}

function deleteTransaction(transactionId) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        appState.transactions = appState.transactions.filter(t => t.id !== transactionId);
        hasUnsavedChanges = true;
        render();
    }
}

function clearFilters() {
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';
    document.getElementById('filterAccount').value = '';
    renderTransactions();
}

function updateAccountDropdowns() {
    const debitSelect = document.getElementById('debitAccount');
    const creditSelect = document.getElementById('creditAccount');
    const filterSelect = document.getElementById('filterAccount');
    const typeDebitSelect = document.getElementById('typeDebitAccount');
    const typeCreditSelect = document.getElementById('typeCreditAccount');

    // Clear existing options
    debitSelect.innerHTML = '<option value="">Select account...</option>';
    creditSelect.innerHTML = '<option value="">Select account...</option>';
    filterSelect.innerHTML = '<option value="">All accounts</option>';

    if (typeDebitSelect) typeDebitSelect.innerHTML = '<option value="">Select account...</option>';
    if (typeCreditSelect) typeCreditSelect.innerHTML = '<option value="">Select account...</option>';

    // Add account options
    appState.accounts.forEach(account => {
        const optionText = `${account.number} - ${account.name}`;

        const debitOption = new Option(optionText, account.id);
        const creditOption = new Option(optionText, account.id);
        const filterOption = new Option(optionText, account.id);

        debitSelect.add(debitOption);
        creditSelect.add(creditOption);
        filterSelect.add(filterOption);

        if (typeDebitSelect) typeDebitSelect.add(new Option(optionText, account.id));
        if (typeCreditSelect) typeCreditSelect.add(new Option(optionText, account.id));
    });
}

// ====================================
// COMMODITIES TRADING
// ====================================

function getCashAccount() {
    return appState.accounts.find(a => a.number === '1000');
}

function getInventoryAccount() {
    return appState.accounts.find(a => a.number === '1200');
}

function getGainsAccount() {
    return appState.accounts.find(a => a.number === '4200');
}

function getLossesAccount() {
    return appState.accounts.find(a => a.number === '5500');
}

function getCashBalance() {
    const balances = calculateAccountBalances();
    const cashAccount = getCashAccount();
    return cashAccount ? (balances[cashAccount.id] || 0) : 0;
}

function getPortfolioCommodity(commodityId) {
    if (!appState.portfolio[commodityId]) {
        appState.portfolio[commodityId] = { lots: [] };
    }
    return appState.portfolio[commodityId];
}

function getTotalQuantity(commodityId) {
    const portfolio = getPortfolioCommodity(commodityId);
    return portfolio.lots.reduce((sum, lot) => sum + lot.quantity, 0);
}

function getAverageCostBasis(commodityId) {
    const portfolio = getPortfolioCommodity(commodityId);
    const totalQuantity = getTotalQuantity(commodityId);
    if (totalQuantity === 0) return 0;

    const totalCost = portfolio.lots.reduce((sum, lot) => sum + (lot.quantity * lot.costBasis), 0);
    return totalCost / totalQuantity;
}

function buyCommodity(commodityId, quantity) {
    const commodity = appState.commodities.find(c => c.id === commodityId);
    if (!commodity) {
        alert('Commodity not found!');
        return false;
    }

    const totalCost = quantity * commodity.buyPrice;
    const cashBalance = getCashBalance();

    if (totalCost > cashBalance) {
        alert(`Insufficient cash! You need ${formatCurrency(totalCost)} but only have ${formatCurrency(cashBalance)}`);
        return false;
    }

    // Get accounts
    const cashAccount = getCashAccount();
    const inventoryAccount = getInventoryAccount();

    if (!cashAccount || !inventoryAccount) {
        alert('Required accounts not found!');
        return false;
    }

    // Create transaction using TransactionManager: Debit Inventory, Credit Cash
    const result = window.transactionManager.createSimpleTransaction(
        `Purchase ${quantity} units of ${commodity.name} @ ${formatCurrency(commodity.buyPrice)}/unit`,
        inventoryAccount.id,  // debit
        cashAccount.id,       // credit
        totalCost,
        {
            type: 'commodity_purchase',
            commodityId: commodityId,
            quantity: quantity,
            unitPrice: commodity.buyPrice,
            tradeId: appState.nextTradeId
        }
    );

    if (!result.success) {
        alert('Failed to create transaction: ' + result.errors.join(', '));
        return false;
    }

    // Add to portfolio using FIFO (create new lot)
    const portfolio = getPortfolioCommodity(commodityId);
    portfolio.lots.push({
        quantity: quantity,
        costBasis: commodity.buyPrice,
        purchaseDate: getTodayDate(),
        purchaseId: appState.nextTradeId
    });

    // Record trade
    appState.trades.push({
        id: appState.nextTradeId++,
        type: 'buy',
        commodityId: commodityId,
        quantity: quantity,
        price: commodity.buyPrice,
        totalValue: totalCost,
        date: getTodayDate(),
        transactionId: result.transaction.id
    });

    hasUnsavedChanges = true;
    return true;
}

function sellCommodity(commodityId, quantity) {
    const commodity = appState.commodities.find(c => c.id === commodityId);
    if (!commodity) {
        alert('Commodity not found!');
        return false;
    }

    const availableQuantity = getTotalQuantity(commodityId);
    if (quantity > availableQuantity) {
        alert(`Insufficient inventory! You have ${availableQuantity} units but trying to sell ${quantity}`);
        return false;
    }

    // Calculate proceeds
    const totalProceeds = quantity * commodity.sellPrice;

    // Get accounts
    const cashAccount = getCashAccount();
    const inventoryAccount = getInventoryAccount();
    const gainsAccount = getGainsAccount();
    const lossesAccount = getLossesAccount();

    if (!cashAccount || !inventoryAccount || !gainsAccount || !lossesAccount) {
        alert('Required accounts not found!');
        return false;
    }

    // Calculate cost basis using FIFO
    const portfolio = getPortfolioCommodity(commodityId);
    let remainingToSell = quantity;
    let totalCostBasis = 0;
    const soldLots = [];

    for (let i = 0; i < portfolio.lots.length && remainingToSell > 0; i++) {
        const lot = portfolio.lots[i];
        const quantityFromLot = Math.min(lot.quantity, remainingToSell);

        totalCostBasis += quantityFromLot * lot.costBasis;
        soldLots.push({
            lotIndex: i,
            quantity: quantityFromLot,
            costBasis: lot.costBasis
        });

        remainingToSell -= quantityFromLot;
    }

    // Calculate gain/loss
    const gainLoss = totalProceeds - totalCostBasis;
    const isGain = gainLoss >= 0;

    // Create multi-entry transaction using TransactionManager
    const entries = [
        // Debit Cash for proceeds
        { accountId: cashAccount.id, type: 'debit', amount: totalProceeds },
        // Credit Inventory for cost basis
        { accountId: inventoryAccount.id, type: 'credit', amount: totalCostBasis }
    ];

    // Add gain or loss entry
    if (Math.abs(gainLoss) > 0.01) {
        if (isGain) {
            // Credit Gains
            entries.push({ accountId: gainsAccount.id, type: 'credit', amount: Math.abs(gainLoss) });
        } else {
            // Debit Losses
            entries.push({ accountId: lossesAccount.id, type: 'debit', amount: Math.abs(gainLoss) });
        }
    }

    const result = window.transactionManager.createTransaction({
        description: `Sale ${quantity} units of ${commodity.name} @ ${formatCurrency(commodity.sellPrice)}/unit (${isGain ? 'Gain' : 'Loss'}: ${formatCurrency(Math.abs(gainLoss))})`,
        entries: entries,
        metadata: {
            type: 'commodity_sale',
            commodityId: commodityId,
            quantity: quantity,
            unitPrice: commodity.sellPrice,
            totalProceeds: totalProceeds,
            costBasis: totalCostBasis,
            gainLoss: gainLoss,
            tradeId: appState.nextTradeId
        }
    });

    if (!result.success) {
        alert('Failed to create transaction: ' + result.errors.join(', '));
        return false;
    }

    // Update portfolio - remove sold quantities using FIFO
    soldLots.forEach(sold => {
        const lot = portfolio.lots[sold.lotIndex];
        lot.quantity -= sold.quantity;
    });

    // Remove empty lots
    portfolio.lots = portfolio.lots.filter(lot => lot.quantity > 0);

    // Record trade
    appState.trades.push({
        id: appState.nextTradeId++,
        type: 'sell',
        commodityId: commodityId,
        quantity: quantity,
        price: commodity.sellPrice,
        totalValue: totalProceeds,
        costBasis: totalCostBasis,
        gainLoss: gainLoss,
        date: getTodayDate(),
        transactionId: result.transaction.id
    });

    hasUnsavedChanges = true;
    return true;
}

function getPortfolioSummary() {
    const summary = [];

    appState.commodities.forEach(commodity => {
        const quantity = getTotalQuantity(commodity.id);
        if (quantity > 0 || true) { // Show all commodities
            const avgCost = getAverageCostBasis(commodity.id);
            const currentValue = quantity * commodity.sellPrice;
            const totalCost = quantity * avgCost;
            const unrealizedGainLoss = currentValue - totalCost;
            const percentGainLoss = totalCost > 0 ? (unrealizedGainLoss / totalCost) * 100 : 0;

            summary.push({
                commodity: commodity,
                quantity: quantity,
                avgCost: avgCost,
                currentPrice: commodity.sellPrice,
                currentValue: currentValue,
                totalCost: totalCost,
                unrealizedGainLoss: unrealizedGainLoss,
                percentGainLoss: percentGainLoss
            });
        }
    });

    return summary;
}

function renderCommoditiesMarket() {
    renderCommoditiesList();
    renderPortfolio();
    renderTradeHistory();
    renderProductionAnalytics();
}

let selectedCommodityId = 1; // Default to first commodity

function renderCommoditiesList() {
    const container = document.getElementById('commoditiesList');
    if (!container) return;

    const cashBalance = getCashBalance();

    // Create commodity selector
    let selectorHtml = `
        <div class="cash-balance">
            <strong>Available Cash:</strong> ${formatCurrency(cashBalance)}
        </div>
        <div class="commodity-selector">
            <label for="commoditySelect"><strong>Select Commodity:</strong></label>
            <select id="commoditySelect" class="commodity-select">
    `;

    appState.commodities.forEach(commodity => {
        selectorHtml += `<option value="${commodity.id}" ${commodity.id === selectedCommodityId ? 'selected' : ''}>${commodity.name} - Buy: ${formatCurrency(commodity.buyPrice)} / Sell: ${formatCurrency(commodity.sellPrice)}</option>`;
    });

    selectorHtml += `
            </select>
        </div>
    `;

    container.innerHTML = selectorHtml;

    // Add change listener to selector
    const selector = document.getElementById('commoditySelect');
    if (selector) {
        selector.addEventListener('change', (e) => {
            selectedCommodityId = parseInt(e.target.value);
            renderSelectedCommodity();
        });
    }

    // Render the selected commodity details
    renderSelectedCommodity();
}

function renderSelectedCommodity() {
    const container = document.getElementById('commoditiesList');
    if (!container) return;

    const commodity = appState.commodities.find(c => c.id === selectedCommodityId);
    if (!commodity) return;

    const quantity = getTotalQuantity(commodity.id);

    // Find or create the details container
    let detailsContainer = document.getElementById('commodityDetails');
    if (!detailsContainer) {
        detailsContainer = document.createElement('div');
        detailsContainer.id = 'commodityDetails';
        detailsContainer.className = 'commodity-details';
        container.appendChild(detailsContainer);
    }

    detailsContainer.innerHTML = `
        <div class="commodity-card-single">
            <div class="commodity-header">
                <h4>${escapeHtml(commodity.name)}</h4>
                <div class="commodity-price">
                    <div>Buy: ${formatCurrency(commodity.buyPrice)}<span class="price-unit">/unit</span></div>
                    <div>Sell: ${formatCurrency(commodity.sellPrice)}<span class="price-unit">/unit</span></div>
                </div>
            </div>
            <p class="commodity-description">${escapeHtml(commodity.description)}</p>
            <div class="commodity-inventory">In Portfolio: <strong>${quantity} units</strong></div>

            <div class="commodity-actions">
                <div class="trade-section">
                    <h5>Buy</h5>
                    <div class="trade-controls">
                        <input type="number" id="buy-quantity-${commodity.id}" min="1" step="1" value="1" class="quantity-input">
                        <div class="trade-total" id="buy-total-${commodity.id}">${formatCurrency(commodity.buyPrice)}</div>
                        <button class="btn btn-primary" onclick="executeBuy(${commodity.id})">Buy</button>
                    </div>
                </div>

                <div class="trade-section">
                    <h5>Sell</h5>
                    <div class="trade-controls">
                        <input type="number" id="sell-quantity-${commodity.id}" min="1" step="1" value="1" max="${quantity}" class="quantity-input" ${quantity === 0 ? 'disabled' : ''}>
                        <div class="trade-total" id="sell-total-${commodity.id}">${formatCurrency(commodity.sellPrice)}</div>
                        <button class="btn btn-danger" onclick="executeSell(${commodity.id})" ${quantity === 0 ? 'disabled' : ''}>Sell</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add event listeners for quantity inputs
    const buyInput = document.getElementById(`buy-quantity-${commodity.id}`);
    const sellInput = document.getElementById(`sell-quantity-${commodity.id}`);
    const buyTotal = document.getElementById(`buy-total-${commodity.id}`);
    const sellTotal = document.getElementById(`sell-total-${commodity.id}`);

    if (buyInput) {
        buyInput.addEventListener('input', () => {
            const quantity = parseFloat(buyInput.value) || 0;
            buyTotal.textContent = formatCurrency(quantity * commodity.buyPrice);
        });
    }

    if (sellInput) {
        sellInput.addEventListener('input', () => {
            const quantity = parseFloat(sellInput.value) || 0;
            sellTotal.textContent = formatCurrency(quantity * commodity.sellPrice);
        });
    }
}

function renderPortfolio() {
    const container = document.getElementById('portfolioView');
    if (!container) return;

    const summary = getPortfolioSummary();
    const totalValue = summary.reduce((sum, item) => sum + item.currentValue, 0);
    const totalCost = summary.reduce((sum, item) => sum + item.totalCost, 0);
    const totalGainLoss = totalValue - totalCost;
    const totalPercentGainLoss = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    let html = `
        <table class="portfolio-table">
            <thead>
                <tr>
                    <th>Commodity</th>
                    <th>Quantity</th>
                    <th>Avg Cost</th>
                    <th>Current Price</th>
                    <th>Market Value</th>
                    <th>Total Cost</th>
                    <th>Unrealized G/L</th>
                    <th>G/L %</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (summary.filter(s => s.quantity > 0).length === 0) {
        html += `
            <tr>
                <td colspan="8" style="text-align: center; color: #999;">No commodities in portfolio</td>
            </tr>
        `;
    } else {
        summary.filter(s => s.quantity > 0).forEach(item => {
            const glClass = item.unrealizedGainLoss >= 0 ? 'positive' : 'negative';
            html += `
                <tr>
                    <td>${escapeHtml(item.commodity.name)}</td>
                    <td class="number">${item.quantity}</td>
                    <td class="number">${formatCurrency(item.avgCost)}</td>
                    <td class="number">${formatCurrency(item.currentPrice)}</td>
                    <td class="number">${formatCurrency(item.currentValue)}</td>
                    <td class="number">${formatCurrency(item.totalCost)}</td>
                    <td class="number ${glClass}">${formatCurrency(item.unrealizedGainLoss)}</td>
                    <td class="number ${glClass}">${item.percentGainLoss.toFixed(2)}%</td>
                </tr>
            `;
        });

        const totalGlClass = totalGainLoss >= 0 ? 'positive' : 'negative';
        html += `
            <tr class="portfolio-total">
                <td colspan="4"><strong>TOTAL PORTFOLIO</strong></td>
                <td class="number"><strong>${formatCurrency(totalValue)}</strong></td>
                <td class="number"><strong>${formatCurrency(totalCost)}</strong></td>
                <td class="number ${totalGlClass}"><strong>${formatCurrency(totalGainLoss)}</strong></td>
                <td class="number ${totalGlClass}"><strong>${totalPercentGainLoss.toFixed(2)}%</strong></td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

function renderTradeHistory() {
    const container = document.getElementById('tradeHistory');
    if (!container) return;

    // Get recent trades (last 20)
    const recentTrades = [...appState.trades]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 20);

    let html = `
        <table class="trades-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Commodity</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total Value</th>
                    <th>Gain/Loss</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (recentTrades.length === 0) {
        html += `
            <tr>
                <td colspan="7" style="text-align: center; color: #999;">No trades yet</td>
            </tr>
        `;
    } else {
        recentTrades.forEach(trade => {
            const commodity = appState.commodities.find(c => c.id === trade.commodityId);
            const typeClass = trade.type === 'buy' ? 'trade-buy' : 'trade-sell';
            const typeDisplay = trade.type === 'buy' ? 'BUY' : 'SELL';

            let gainLossDisplay = '-';
            let glClass = '';
            if (trade.type === 'sell' && trade.gainLoss !== undefined) {
                glClass = trade.gainLoss >= 0 ? 'positive' : 'negative';
                gainLossDisplay = formatCurrency(trade.gainLoss);
            }

            html += `
                <tr>
                    <td>${escapeHtml(trade.date)}</td>
                    <td><span class="trade-type-badge ${typeClass}">${typeDisplay}</span></td>
                    <td>${commodity ? escapeHtml(commodity.name) : 'Unknown'}</td>
                    <td class="number">${trade.quantity}</td>
                    <td class="number">${formatCurrency(trade.price)}</td>
                    <td class="number">${formatCurrency(trade.totalValue)}</td>
                    <td class="number ${glClass}">${gainLossDisplay}</td>
                </tr>
            `;
        });
    }

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

function renderProductionAnalytics() {
    const container = document.getElementById('productionAnalytics');
    if (!container) {
        // Container doesn't exist in HTML yet - need to add it
        return;
    }

    // Calculate profitability for all recipes
    const recipeAnalytics = Object.values(PRODUCTION_RECIPES).map(recipe => {
        const profitability = calculateRecipeProfitability(recipe);
        return {
            recipe,
            profitability
        };
    });

    // Sort by profit per hour (descending)
    recipeAnalytics.sort((a, b) => b.profitability.profitPerHour - a.profitability.profitPerHour);

    let html = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 15px;">
            <h3 style="margin: 0 0 12px 0; color: #333;">📊 Production Economics Dashboard</h3>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #666;">Compare all production recipes to make informed decisions</p>

            <table class="trades-table" style="font-size: 12px;">
                <thead>
                    <tr>
                        <th style="text-align: left;">Recipe</th>
                        <th style="text-align: center;">Time</th>
                        <th style="text-align: right;">Input Cost</th>
                        <th style="text-align: right;">Output Value</th>
                        <th style="text-align: right;">Profit/Batch</th>
                        <th style="text-align: right; background: #e7f3ff;">💰 Profit/Hour</th>
                        <th style="text-align: center;">ROI</th>
                        <th style="text-align: center;">Ranking</th>
                    </tr>
                </thead>
                <tbody>
    `;

    recipeAnalytics.forEach((item, index) => {
        const { recipe, profitability } = item;
        const profitColor = profitability.profitPerBatch >= 0 ? '#28a745' : '#dc3545';
        const roiDisplay = profitability.roi === Infinity ? '∞%' : profitability.roi.toFixed(0) + '%';

        // Ranking medals
        let rankingDisplay = '';
        if (index === 0) rankingDisplay = '🥇';
        else if (index === 1) rankingDisplay = '🥈';
        else if (index === 2) rankingDisplay = '🥉';
        else rankingDisplay = `#${index + 1}`;

        const inputs = Object.keys(recipe.inputs).length > 0
            ? Object.entries(recipe.inputs).map(([mat, qty]) => `${qty} ${mat}`).join(', ')
            : 'None';

        const outputs = Object.entries(recipe.outputs).map(([mat, qty]) => `${qty} ${mat}`).join(', ');

        html += `
            <tr style="border-left: 3px solid ${profitColor};">
                <td style="text-align: left;">
                    <strong>${escapeHtml(recipe.name)}</strong><br/>
                    <span style="font-size: 10px; color: #666;">
                        ${escapeHtml(inputs)} → ${escapeHtml(outputs)}
                    </span>
                </td>
                <td style="text-align: center;">${profitability.productionTimeHours.toFixed(1)}h</td>
                <td style="text-align: right; color: #dc3545;">${formatCurrency(profitability.inputCost)}</td>
                <td style="text-align: right; color: #28a745;">${formatCurrency(profitability.outputValue)}</td>
                <td style="text-align: right; font-weight: bold; color: ${profitColor};">${formatCurrency(profitability.profitPerBatch)}</td>
                <td style="text-align: right; font-weight: bold; background: #e7f3ff; color: #007bff;">${formatCurrency(profitability.profitPerHour)}</td>
                <td style="text-align: center;">${roiDisplay}</td>
                <td style="text-align: center; font-size: 16px;">${rankingDisplay}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>

            <div style="margin-top: 12px; font-size: 11px; color: #666; padding: 8px; background: white; border-radius: 3px;">
                <strong>💡 Tips:</strong>
                • Higher profit/hour = better efficiency |
                • ROI shows capital efficiency |
                • All recipes are profitable! Choose based on available materials and capital.
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function executeBuy(commodityId) {
    const quantityInput = document.getElementById(`buy-quantity-${commodityId}`);
    const quantity = parseFloat(quantityInput.value);

    if (!quantity || quantity <= 0) {
        alert('Please enter a valid quantity!');
        return;
    }

    if (buyCommodity(commodityId, quantity)) {
        quantityInput.value = '1';
        render();

        const commodity = appState.commodities.find(c => c.id === commodityId);
        showCommodityStatus(`Successfully purchased ${quantity} units of ${commodity.name}!`, 'success');
    }
}

function executeSell(commodityId) {
    const quantityInput = document.getElementById(`sell-quantity-${commodityId}`);
    const quantity = parseFloat(quantityInput.value);

    if (!quantity || quantity <= 0) {
        alert('Please enter a valid quantity!');
        return;
    }

    if (sellCommodity(commodityId, quantity)) {
        quantityInput.value = '1';
        render();

        const commodity = appState.commodities.find(c => c.id === commodityId);
        showCommodityStatus(`Successfully sold ${quantity} units of ${commodity.name}!`, 'success');
    }
}

function showCommodityStatus(message, type) {
    const statusEl = document.getElementById('commodityStatus');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;

    setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = 'status-message';
    }, 3000);
}

// ====================================
// MAP / REAL ESTATE
// ====================================

function getRealEstateAccount() {
    return appState.accounts.find(a => a.number === '1300');
}

function isSquareOwned(x, y) {
    return appState.map.ownedSquares.some(square => square.x === x && square.y === y);
}

function purchaseProperty(x, y) {
    // Check if already owned
    if (isSquareOwned(x, y)) {
        alert('You already own this property!');
        return false;
    }

    // Check if within grid bounds
    if (x < 0 || x >= appState.map.gridSize || y < 0 || y >= appState.map.gridSize) {
        alert('Property is outside the map!');
        return false;
    }

    const price = appState.map.pricePerSquare;
    const cashBalance = getCashBalance();

    if (price > cashBalance) {
        alert(`Insufficient cash! You need ${formatCurrency(price)} but only have ${formatCurrency(cashBalance)}`);
        return false;
    }

    // Get accounts
    const cashAccount = getCashAccount();
    const realEstateAccount = getRealEstateAccount();

    if (!cashAccount || !realEstateAccount) {
        alert('Required accounts not found!');
        return false;
    }

    // Create transaction using TransactionManager: Debit Real Estate, Credit Cash
    const result = window.transactionManager.createSimpleTransaction(
        `Purchase property at (${x}, ${y}) for ${formatCurrency(price)}`,
        realEstateAccount.id,  // debit
        cashAccount.id,        // credit
        price,
        {
            type: 'property_purchase',
            coordinates: { x, y },
            pricePerSquare: price
        }
    );

    if (!result.success) {
        alert('Failed to create transaction: ' + result.errors.join(', '));
        return false;
    }

    // Add to owned squares
    appState.map.ownedSquares.push({
        x: x,
        y: y,
        purchaseDate: getTodayDate(),
        purchasePrice: price,
        transactionId: result.transaction.id
    });

    hasUnsavedChanges = true;
    return true;
}

function renderMap() {
    const container = document.getElementById('mapGrid');
    if (!container) return;

    const cashBalance = getCashBalance();
    const ownedCount = appState.map.ownedSquares.length;
    const totalValue = ownedCount * appState.map.pricePerSquare;
    const prodStats = getProductionStatistics();

    // Production Dashboard
    let dashboardHtml = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0;">📊 Production Dashboard</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 10px;">
                <div style="background: white; padding: 10px; border-radius: 3px; border-left: 4px solid #007bff;">
                    <div style="font-size: 24px; font-weight: bold; color: #007bff;">${prodStats.totalActive}</div>
                    <div style="font-size: 12px; color: #666;">Active Productions</div>
                </div>
                <div style="background: white; padding: 10px; border-radius: 3px; border-left: 4px solid #28a745;">
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">${prodStats.totalCompleted}</div>
                    <div style="font-size: 12px; color: #666;">Total Completed</div>
                </div>
                <div style="background: white; padding: 10px; border-radius: 3px; border-left: 4px solid ${prodStats.lowStockMaterials.length > 0 ? '#dc3545' : '#28a745'};">
                    <div style="font-size: 24px; font-weight: bold; color: ${prodStats.lowStockMaterials.length > 0 ? '#dc3545' : '#28a745'};">${prodStats.lowStockMaterials.length}</div>
                    <div style="font-size: 12px; color: #666;">Low Stock Materials</div>
                </div>
            </div>
    `;

    // Low stock warnings
    if (prodStats.lowStockMaterials.length > 0) {
        dashboardHtml += `
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; border-radius: 3px; margin-bottom: 10px;">
                <strong>⚠️ Material Warnings:</strong>
                <div style="margin-top: 5px; font-size: 12px;">
        `;
        prodStats.lowStockMaterials.forEach(mat => {
            dashboardHtml += `<span style="display: inline-block; margin-right: 10px; padding: 3px 6px; background: white; border-radius: 3px;">${mat.name}: ${mat.quantity} units</span>`;
        });
        dashboardHtml += `
                </div>
            </div>
        `;
    }

    // Recent completions
    if (prodStats.recentCompletions.length > 0) {
        dashboardHtml += `
            <div style="background: white; padding: 10px; border-radius: 3px; border: 1px solid #dee2e6;">
                <strong>✅ Recent Completions</strong>
                <div style="margin-top: 5px; max-height: 150px; overflow-y: auto;">
        `;
        prodStats.recentCompletions.slice(0, 5).forEach(job => {
            const building = appState.buildings.find(b => b.id === job.buildingId);
            const location = building ? `(${building.x}, ${building.y})` : '';
            let itemName = '';

            if (job.productType === 'equipment') {
                const equipDef = getEquipmentDefinition(job.productId);
                itemName = equipDef ? equipDef.name : job.productId;
            } else if (job.productType === 'commodity') {
                const recipe = Object.values(PRODUCTION_RECIPES).find(r => r.id === job.recipeId);
                itemName = recipe ? recipe.name : job.recipeId;
            }

            dashboardHtml += `
                <div style="font-size: 11px; padding: 3px 0; border-bottom: 1px solid #f0f0f0;">
                    <span style="color: #666;">${formatSimulationTime(job.actualCompletionTime)}</span> -
                    <strong>${itemName}</strong> ${location}
                </div>
            `;
        });
        dashboardHtml += `
                </div>
            </div>
        `;
    }

    dashboardHtml += `</div>`;

    // Update stats
    const statsHtml = `
        ${dashboardHtml}
        <div class="map-stats">
            <div class="stat-item">
                <span class="stat-label">Properties Owned:</span>
                <span class="stat-value">${ownedCount} squares</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Total Real Estate Value:</span>
                <span class="stat-value">${formatCurrency(totalValue)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Available Cash:</span>
                <span class="stat-value">${formatCurrency(cashBalance)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Price per Square:</span>
                <span class="stat-value">${formatCurrency(appState.map.pricePerSquare)}</span>
            </div>
        </div>
    `;

    document.getElementById('mapStats').innerHTML = statsHtml;

    // Render grid
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${appState.map.gridSize}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${appState.map.gridSize}, 1fr)`;

    for (let y = 0; y < appState.map.gridSize; y++) {
        for (let x = 0; x < appState.map.gridSize; x++) {
            const square = document.createElement('div');
            const owned = isSquareOwned(x, y);
            const building = appState.buildings.find(b => b.x === x && b.y === y && b.status !== 'demolished');

            square.className = `map-square ${owned ? 'owned' : 'available'}`;
            if (building) {
                square.classList.add(building.status === 'under_construction' ? 'building-construction' : 'building-completed');
            }
            square.dataset.x = x;
            square.dataset.y = y;

            let title = owned ? `Owned property (${x}, ${y})` : `Available (${x}, ${y}) - ${formatCurrency(appState.map.pricePerSquare)}`;
            if (building) {
                const status = building.status === 'under_construction' ?
                    `🏗 Under Construction (${building.completionDate})` : '🏢 Warehouse';
                title += `\n${status}`;
            }
            square.title = title;

            if (!owned) {
                square.addEventListener('click', () => {
                    if (confirm(`Purchase property at (${x}, ${y}) for ${formatCurrency(appState.map.pricePerSquare)}?`)) {
                        if (purchaseProperty(x, y)) {
                            render();
                            showMapStatus(`Successfully purchased property at (${x}, ${y})!`, 'success');
                        }
                    }
                });
            } else {
                square.addEventListener('click', () => {
                    showBuildingManagement(x, y);
                });
            }

            // Display building icon
            if (building) {
                const icon = document.createElement('div');
                icon.className = 'building-icon';
                icon.textContent = building.status === 'under_construction' ? '🏗' : '🏢';
                square.appendChild(icon);
            }

            container.appendChild(square);
        }
    }
}

function showMapStatus(message, type) {
    const statusEl = document.getElementById('mapStatus');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;

    setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = 'status-message';
    }, 3000);
}

// Show building management dialog
function showBuildingManagement(x, y) {
    const building = appState.buildings.find(b => b.x === x && b.y === y && b.status !== 'demolished');
    const buildingDef = building ? BUILDING_TYPES[building.type] : null;

    let content = `<h3>Property Management (${x}, ${y})</h3>`;

    if (building) {
        const statusText = building.status === 'under_construction' ?
            `🏗 Under Construction - Completes: ${building.completionDate}` :
            `🏢 ${buildingDef.name} - Complete`;

        content += `
            <div class="building-info">
                <p><strong>Status:</strong> ${statusText}</p>
                <p><strong>Construction Cost:</strong> ${formatCurrency(building.cost)}</p>
            </div>
        `;

        if (building.status === 'completed') {
            // Show production stats
            const prodStats = getProductionStatistics();
            const buildingStats = prodStats.byBuilding[building.id] || { active: 0, completed: 0, equipmentBusy: 0, equipmentIdle: 0 };
            const equipment = getWarehouseEquipment(building.id);

            if (equipment.length > 0 || buildingStats.active > 0 || buildingStats.completed > 0) {
                content += `
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">
                        <h4 style="margin-top: 0;">📊 Production Summary</h4>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 13px;">
                            <div>
                                <strong>Equipment:</strong> ${equipment.length} total<br/>
                                <span style="color: #28a745;">● Idle: ${buildingStats.equipmentIdle}</span> |
                                <span style="color: #ffc107;">● Busy: ${buildingStats.equipmentBusy}</span>
                            </div>
                            <div>
                                <strong>Productions:</strong><br/>
                                <span style="color: #007bff;">● Active: ${buildingStats.active}</span> |
                                <span style="color: #6c757d;">● Completed: ${buildingStats.completed}</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Show employees
            const employees = getEmployeesByBuilding(building.id);
            content += `
                <div class="employee-section">
                    <h4>👥 Employees (${employees.length})</h4>
            `;

            if (employees.length > 0) {
                content += `<div class="employee-list">`;
                for (const employee of employees) {
                    const nextPayment = formatSimulationTime(employee.nextPaymentDate);
                    content += `
                        <div class="employee-card">
                            <div class="employee-info">
                                <strong>${escapeHtml(employee.name)}</strong>
                                <div class="employee-details">
                                    <span>Wage: ${formatCurrency(employee.wage)}/24hrs</span>
                                    <span>Skill: ${employee.skillLevel}/10</span>
                                    <span>Next Payment: ${nextPayment}</span>
                                </div>
                            </div>
                            <button class="btn btn-sm btn-danger" onclick="if(fireEmployee(${employee.id})) { render(); closeBuildingDialog(); showBuildingManagement(${x}, ${y}); }">Fire</button>
                        </div>
                    `;
                }
                content += `</div>`;
            } else {
                content += `<p class="help-text">No employees currently assigned to this building.</p>`;
            }

            content += `
                    <div class="hire-section">
                        <h4>Hire New Employee</h4>
                        <p class="help-text">Select a skill level to hire an employee:</p>
                        <div class="skill-level-options">
            `;

            // Generate skill level cards
            for (const skill of SKILL_LEVELS) {
                content += `
                    <div class="skill-level-card" onclick="if(hireEmployee(${building.id}, ${skill.level})) { render(); closeBuildingDialog(); showBuildingManagement(${x}, ${y}); }">
                        <div class="skill-level-header">
                            <span class="skill-level-name">${skill.name}</span>
                            <span class="skill-level-number">Level ${skill.level}</span>
                        </div>
                        <div class="skill-level-wage">${formatCurrency(skill.wage)}/24hrs</div>
                        <div class="skill-level-description">${skill.description}</div>
                    </div>
                `;
            }

            content += `
                        </div>
                    </div>
                </div>
            `;

            content += `
                <div class="building-actions">
                    <button class="btn" onclick="showBuildingInterior(${building.id})">Manage Interior</button>
                    <button class="btn btn-danger" onclick="if(demolishBuilding(${building.id})) { closeBuildingDialog(); render(); }">Demolish Building</button>
                </div>
            `;
        }
    } else {
        // Show construction options
        const materials = BUILDING_TYPES.WAREHOUSE.materials;
        const portfolio = appState.portfolio;

        const lumberQty = portfolio[3] && portfolio[3].lots ? portfolio[3].lots.reduce((s, l) => s + l.quantity, 0) : 0;
        const steelQty = portfolio[4] && portfolio[4].lots ? portfolio[4].lots.reduce((s, l) => s + l.quantity, 0) : 0;
        const concreteQty = portfolio[5] && portfolio[5].lots ? portfolio[5].lots.reduce((s, l) => s + l.quantity, 0) : 0;

        content += `
            <h4>Build Warehouse</h4>
            <div class="construction-requirements">
                <p><strong>Required Materials:</strong></p>
                <ul>
                    <li>Lumber: ${materials.lumber} (Have: ${lumberQty})</li>
                    <li>Steel: ${materials.steel} (Have: ${steelQty})</li>
                    <li>Concrete: ${materials.concrete} (Have: ${concreteQty})</li>
                </ul>
                <p><strong>Construction Time:</strong> ${BUILDING_TYPES.WAREHOUSE.constructionDays} days</p>
                <button class="btn btn-primary" onclick="if(startConstruction(${x}, ${y}, 'WAREHOUSE')) { closeBuildingDialog(); render(); }">
                    Start Construction
                </button>
            </div>
        `;
    }

    content += `<button class="btn" onclick="closeBuildingDialog()">Close</button>`;

    const dialog = document.createElement('div');
    dialog.id = 'buildingDialog';
    dialog.className = 'modal-overlay';
    dialog.innerHTML = `<div class="modal-content">${content}</div>`;
    document.body.appendChild(dialog);
}

function closeBuildingDialog() {
    const dialog = document.getElementById('buildingDialog');
    if (dialog) dialog.remove();

    const interiorDialog = document.getElementById('interiorDialog');
    if (interiorDialog) interiorDialog.remove();
}

function showBuildingInterior(buildingId) {
    const building = appState.buildings.find(b => b.id === buildingId);
    if (!building || !building.interior) return;

    const gridSize = building.interior.grid.length;
    const employees = getEmployeesByBuilding(buildingId);
    const equipment = getWarehouseEquipment(buildingId);
    const activeProductions = getActiveProductions(buildingId);

    let content = `<h3>🏢 Warehouse Interior - Building #${buildingId}</h3>`;

    // Building info
    content += `<div style="margin-bottom: 15px;">`;
    content += `<p><strong>Location:</strong> (${building.x}, ${building.y}) | `;
    content += `<strong>Employees:</strong> ${employees.length} | `;
    content += `<strong>Equipment:</strong> ${equipment.length}/${gridSize * gridSize}</p>`;
    content += `</div>`;

    // Equipment grid
    content += `<h4>Equipment Grid</h4>`;
    content += `<div class="interior-grid" style="display: grid; grid-template-columns: repeat(${gridSize}, 70px); gap: 5px; margin-bottom: 20px;">`;

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const equipmentId = building.interior.grid[y][x];
            let cellContent = '';
            let cellStyle = 'width: 70px; height: 70px; border: 2px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 11px; text-align: center; background: #f9f9f9;';

            if (equipmentId) {
                const equip = equipment.find(e => e.id === equipmentId);
                if (equip) {
                    const equipDef = getEquipmentDefinition(equip.type);
                    const statusColor = equip.status === 'producing' ? '#ffe6cc' : '#e6f3ff';
                    cellStyle = `width: 70px; height: 70px; border: 2px solid #007bff; display: flex; align-items: center; justify-content: center; font-size: 11px; text-align: center; background: ${statusColor}; cursor: pointer;`;
                    cellContent = `<div title="${equipDef.name} - ${equip.status}">${equipDef.name.substring(0, 8)}<br/>${equip.status === 'producing' ? '⚙️' : '✓'}</div>`;
                }
            }

            content += `<div class="interior-cell" style="${cellStyle}">${cellContent}</div>`;
        }
    }

    content += `</div>`;

    // Production section
    content += `<h4>Production</h4>`;
    content += `<div style="margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px;">`;

    if (activeProductions.length > 0) {
        content += `<p><strong>Active Productions (${activeProductions.length}):</strong></p>`;
        activeProductions.forEach(prod => {
            const currentTime = getCurrentSimulationTime();
            const progress = ((currentTime - prod.startTime) / (prod.estimatedCompletionTime - prod.startTime)) * 100;
            const progressClamped = Math.min(Math.max(progress, 0), 100);

            content += `<div style="margin: 10px 0; padding: 8px; background: white; border-left: 4px solid #007bff;">`;
            content += `<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">`;
            content += `<strong>${prod.productType === 'equipment' ? '🔧 ' : '📦 '}${prod.productId}</strong>`;
            content += `<span style="font-size: 12px; color: #666;">${progressClamped.toFixed(1)}%</span>`;
            content += `</div>`;
            content += `<div style="width: 100%; height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden;">`;
            content += `<div style="width: ${progressClamped}%; height: 100%; background: linear-gradient(90deg, #007bff, #00aaff); transition: width 0.3s;"></div>`;
            content += `</div>`;
            content += `<div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 12px; color: #666;">`;
            content += `<span>Est. completion: ${formatSimulationTime(prod.estimatedCompletionTime)}</span>`;
            content += `<button class="btn btn-sm" onclick="handleCancelProduction(${prod.id})" style="font-size: 11px; padding: 2px 8px;">Cancel (50% refund)</button>`;
            content += `</div>`;
            content += `</div>`;
        });
    } else {
        content += `<p style="color: #666;">No active productions</p>`;
    }

    content += `</div>`;

    // Crafting section
    content += `<h4>Craft Equipment</h4>`;
    content += `<div style="padding: 10px; background: #f5f5f5; border-radius: 5px;">`;

    if (employees.length === 0) {
        content += `<p style="color: #d9534f;">⚠️ No employees assigned to this warehouse. Hire employees to start crafting.</p>`;
    } else {
        const lumberQty = getTotalQuantity(getCommodityIdByName('lumber'));
        const hasLumber = lumberQty >= 10;

        content += `<div style="padding: 10px; background: white; border-radius: 5px; margin-bottom: 10px;">`;
        content += `<div style="display: flex; justify-content: space-between; align-items: center;">`;
        content += `<div>`;
        content += `<strong>🔨 Workbench</strong><br/>`;
        content += `<span style="font-size: 12px; color: #666;">Materials: 10 Lumber (You have: ${lumberQty})</span><br/>`;
        content += `<span style="font-size: 12px; color: #666;">Base time: 4 hours | Employees: ${employees.length} (avg skill: ${calculateAverageSkill(employees).toFixed(1)})</span>`;
        content += `</div>`;
        content += `<div>`;
        if (hasLumber) {
            content += `<button class="btn" onclick="handleCraftWorkbench(${buildingId})" style="background: #28a745; color: white;">Craft Workbench</button>`;
        } else {
            content += `<button class="btn" disabled style="background: #ccc;">Need More Lumber</button>`;
        }
        content += `</div>`;
        content += `</div>`;
        content += `</div>`;

        content += `<p style="font-size: 12px; color: #666; margin-top: 10px;">💡 Tip: The workbench is required to craft other equipment types.</p>`;
    }

    content += `</div>`;

    // Equipment catalog section (for equipment that requires other equipment)
    content += `<h4>Equipment Catalog</h4>`;
    content += `<div style="padding: 10px; background: #f5f5f5; border-radius: 5px; max-height: 400px; overflow-y: auto;">`;

    if (employees.length === 0) {
        content += `<p style="color: #666;">Hire employees to start producing equipment.</p>`;
    } else {
        const hasWorkbench = equipment.some(e => e.type === 'workbench');

        // Get all equipment types except workbench
        const availableEquipmentTypes = Object.values(EQUIPMENT_TYPES).filter(e => !e.canCraftWithoutEquipment);

        availableEquipmentTypes.forEach(equipDef => {
            const meetsPrereqs = hasRequiredEquipment(buildingId, equipDef.requiresEquipment);
            const hasMaterials = hasRequiredMaterials(equipDef.materials);
            const availableProducers = equipDef.requiresEquipment.length > 0
                ? getAvailableEquipmentByType(buildingId, equipDef.requiresEquipment[0])
                : [];

            const canProduce = meetsPrereqs && hasMaterials && availableProducers.length > 0;

            // Build material list display
            const materialsDisplay = Object.entries(equipDef.materials)
                .map(([mat, qty]) => {
                    const commodityId = getCommodityIdByName(mat);
                    const have = commodityId ? getTotalQuantity(commodityId) : 0;
                    const hasEnough = have >= qty;
                    const color = hasEnough ? '#28a745' : '#dc3545';
                    return `<span style="color: ${color};">${mat}: ${have}/${qty}</span>`;
                })
                .join(', ');

            // Build prerequisites display
            const prereqDisplay = equipDef.requiresEquipment
                .map(req => {
                    const reqDef = getEquipmentDefinition(req);
                    const hasIt = equipment.some(e => e.type === req);
                    const icon = hasIt ? '✓' : '✗';
                    const color = hasIt ? '#28a745' : '#dc3545';
                    return `<span style="color: ${color};">${icon} ${reqDef.name}</span>`;
                })
                .join(', ');

            const bgColor = canProduce ? 'white' : '#f9f9f9';
            const borderColor = canProduce ? '#28a745' : '#ccc';

            content += `<div style="padding: 10px; background: ${bgColor}; border-left: 4px solid ${borderColor}; margin-bottom: 10px; border-radius: 3px;">`;
            content += `<div style="display: flex; justify-content: space-between; align-items: center;">`;
            content += `<div style="flex: 1;">`;
            content += `<strong>🔧 ${equipDef.name}</strong><br/>`;
            content += `<span style="font-size: 11px; color: #666;">${equipDef.description}</span><br/>`;
            content += `<span style="font-size: 11px;">Materials: ${materialsDisplay}</span><br/>`;
            content += `<span style="font-size: 11px;">Requires: ${prereqDisplay}</span><br/>`;
            content += `<span style="font-size: 11px; color: #666;">Base time: ${(equipDef.productionTime / (60 * 60 * 1000)).toFixed(1)} hours</span>`;

            if (!meetsPrereqs) {
                content += `<br/><span style="font-size: 11px; color: #dc3545;">⚠️ Missing prerequisites</span>`;
            } else if (availableProducers.length === 0) {
                const reqDef = getEquipmentDefinition(equipDef.requiresEquipment[0]);
                content += `<br/><span style="font-size: 11px; color: #ffc107;">⚠️ ${reqDef.name} is busy</span>`;
            }

            content += `</div>`;
            content += `<div>`;

            if (canProduce) {
                content += `<button class="btn" onclick="handleCraftEquipment(${buildingId}, '${equipDef.id}')" style="background: #28a745; color: white; font-size: 12px;">Craft</button>`;
            } else {
                content += `<button class="btn" disabled style="background: #ccc; font-size: 12px;">Cannot Craft</button>`;
            }

            content += `</div>`;
            content += `</div>`;
            content += `</div>`;
        });
    }

    content += `</div>`;

    // Commodity production section
    content += `<h4>Commodity Production</h4>`;
    content += `<div style="padding: 10px; background: #f5f5f5; border-radius: 5px; max-height: 400px; overflow-y: auto;">`;

    if (employees.length === 0) {
        content += `<p style="color: #666;">Hire employees to start producing commodities.</p>`;
    } else {
        // Group recipes by equipment type
        const recipesByEquipment = {};
        Object.values(PRODUCTION_RECIPES).forEach(recipe => {
            if (!recipesByEquipment[recipe.equipmentRequired]) {
                recipesByEquipment[recipe.equipmentRequired] = [];
            }
            recipesByEquipment[recipe.equipmentRequired].push(recipe);
        });

        // Show recipes for each equipment type the player has
        let hasAnyProducingEquipment = false;
        Object.entries(recipesByEquipment).forEach(([equipType, recipes]) => {
            const playerEquipment = equipment.filter(e => e.type === equipType);

            if (playerEquipment.length > 0) {
                hasAnyProducingEquipment = true;
                const equipDef = getEquipmentDefinition(equipType);

                content += `<div style="margin-bottom: 15px;">`;
                content += `<h5 style="margin-bottom: 8px;">🏭 ${equipDef.name}</h5>`;

                playerEquipment.forEach(equip => {
                    const isIdle = equip.status === 'idle';
                    const statusColor = isIdle ? '#28a745' : '#ffc107';
                    const statusText = isIdle ? 'Idle' : 'Busy';

                    content += `<div style="padding: 8px; background: white; border-left: 3px solid ${statusColor}; margin-bottom: 8px;">`;
                    content += `<div style="font-weight: bold; font-size: 12px; margin-bottom: 5px;">Equipment #${equip.id} - ${statusText}</div>`;

                    if (isIdle) {
                        recipes.forEach(recipe => {
                            const hasMaterials = Object.keys(recipe.inputs).length === 0 || hasRequiredMaterials(recipe.inputs);

                            // Build material display
                            const inputsDisplay = Object.keys(recipe.inputs).length > 0
                                ? Object.entries(recipe.inputs)
                                    .map(([mat, qty]) => {
                                        const commodityId = getCommodityIdByName(mat);
                                        const have = commodityId ? getTotalQuantity(commodityId) : 0;
                                        const color = have >= qty ? '#28a745' : '#dc3545';
                                        return `<span style="color: ${color};">${mat}: ${have}/${qty}</span>`;
                                    })
                                    .join(', ')
                                : 'None';

                            const outputsDisplay = Object.entries(recipe.outputs)
                                .map(([com, qty]) => `${qty} ${com}`)
                                .join(', ');

                            // Calculate profitability metrics
                            const profitability = calculateRecipeProfitability(recipe);
                            const profitColor = profitability.profitPerBatch >= 0 ? '#28a745' : '#dc3545';
                            const roiDisplay = profitability.roi === Infinity ? '∞' : profitability.roi.toFixed(0) + '%';

                            content += `<div style="margin: 5px 0; padding: 8px; background: #f9f9f9; border-radius: 3px; border-left: 3px solid ${profitColor}; font-size: 11px;">`;
                            content += `<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">`;

                            // Left side - Recipe details
                            content += `<div style="flex: 1;">`;
                            content += `<strong style="font-size: 12px;">${recipe.name}</strong><br/>`;
                            content += `<div style="color: #666; margin-top: 3px;">`;
                            content += `📥 Inputs: ${inputsDisplay}<br/>`;
                            content += `📤 Outputs: ${outputsDisplay}<br/>`;
                            content += `⏱️ Time: ${profitability.productionTimeHours.toFixed(1)} hours`;
                            content += `</div>`;
                            content += `</div>`;

                            // Middle - Economics dashboard
                            content += `<div style="background: white; padding: 6px 10px; border-radius: 3px; border: 1px solid #ddd; min-width: 140px;">`;
                            content += `<div style="font-weight: bold; font-size: 10px; color: #666; margin-bottom: 3px;">📊 ECONOMICS</div>`;
                            content += `<div style="font-size: 10px; line-height: 1.5;">`;
                            content += `Cost: <span style="color: #dc3545;">${formatCurrency(profitability.inputCost)}</span><br/>`;
                            content += `Value: <span style="color: #28a745;">${formatCurrency(profitability.outputValue)}</span><br/>`;
                            content += `<strong style="color: ${profitColor};">Profit: ${formatCurrency(profitability.profitPerBatch)}</strong><br/>`;
                            content += `<div style="background: #f0f0f0; padding: 2px 4px; margin-top: 2px; border-radius: 2px;">`;
                            content += `<strong style="color: #007bff;">${formatCurrency(profitability.profitPerHour)}/hr</strong> | ROI: ${roiDisplay}`;
                            content += `</div>`;
                            content += `</div>`;
                            content += `</div>`;

                            // Right side - Action buttons
                            content += `<div style="display: flex; flex-direction: column; gap: 3px; min-width: 90px;">`;

                            if (hasMaterials) {
                                content += `<button class="btn" onclick="handleStartCommodityProduction(${buildingId}, ${equip.id}, '${recipe.id}', false)" style="background: #007bff; color: white; font-size: 10px; padding: 5px 10px; white-space: nowrap;">▶️ Start</button>`;
                                content += `<button class="btn" onclick="handleStartCommodityProduction(${buildingId}, ${equip.id}, '${recipe.id}', true)" style="background: #28a745; color: white; font-size: 10px; padding: 5px 10px; white-space: nowrap;">🔄 Continuous</button>`;
                            } else {
                                content += `<button class="btn" disabled style="background: #ccc; font-size: 10px; padding: 5px 10px;">❌ Need Materials</button>`;
                            }

                            content += `</div>`;
                            content += `</div>`;
                            content += `</div>`;
                        });
                    } else {
                        content += `<div style="font-size: 11px; color: #666; margin-top: 5px;">Currently producing...</div>`;
                    }

                    content += `</div>`;
                });

                content += `</div>`;
            }
        });

        if (!hasAnyProducingEquipment) {
            content += `<p style="color: #666;">No production equipment installed. Craft equipment from the catalog above.</p>`;
        }
    }

    content += `</div>`;

    content += `<button class="btn" onclick="closeBuildingDialog()" style="margin-top: 15px;">Close</button>`;

    const dialog = document.createElement('div');
    dialog.id = 'interiorDialog';
    dialog.className = 'modal-overlay';
    dialog.innerHTML = `<div class="modal-content" style="max-width: 800px;">${content}</div>`;
    document.body.appendChild(dialog);
}

// Handle craft workbench button click
function handleCraftWorkbench(buildingId) {
    const result = startWorkbenchCraft(buildingId);

    if (result.success) {
        alert(`Workbench crafting started! Estimated completion: ${result.estimatedCompletion}`);
        closeBuildingDialog();
        render(); // Refresh display
    } else {
        alert(`Error: ${result.error}`);
    }
}

// Handle craft equipment button click
function handleCraftEquipment(buildingId, equipmentType) {
    const result = startEquipmentProduction(buildingId, equipmentType);

    if (result.success) {
        const equipDef = getEquipmentDefinition(equipmentType);
        alert(`${equipDef.name} production started! Estimated completion: ${result.estimatedCompletion}`);
        closeBuildingDialog();
        render(); // Refresh display
    } else {
        alert(`Error: ${result.error}`);
    }
}

// Handle start commodity production button click
function handleStartCommodityProduction(buildingId, equipmentId, recipeId, continuous) {
    const result = startCommodityProduction(buildingId, equipmentId, recipeId, continuous);

    if (result.success) {
        const recipe = Object.values(PRODUCTION_RECIPES).find(r => r.id === recipeId);
        const mode = continuous ? ' (Continuous Mode)' : '';
        alert(`${recipe.name} started${mode}! Estimated completion: ${result.estimatedCompletion}`);
        closeBuildingDialog();
        render(); // Refresh display
    } else {
        alert(`Error: ${result.error}`);
    }
}

// Handle cancel production button click
function handleCancelProduction(productionId) {
    if (!confirm('Cancel this production? You will receive 50% of materials back.')) {
        return;
    }

    const result = cancelProduction(productionId);

    if (result.success) {
        alert(`Production cancelled. Refunded $${result.refundAmount.toFixed(2)} worth of materials.`);
        closeBuildingDialog();
        render(); // Refresh display
    } else {
        alert(`Error: ${result.error}`);
    }
}

// ====================================
// LOAN MANAGEMENT SYSTEM
// ====================================

// Helper function to add months to a date string
function addMonthsToDate(dateString, months) {
    const parts = dateString.match(/Y(\d+)-M(\d+)-D(\d+)/);
    if (!parts) return dateString;

    let year = parseInt(parts[1]);
    let month = parseInt(parts[2]);
    let day = parseInt(parts[3]);

    month += months;

    while (month > 12) {
        month -= 12;
        year++;
    }

    return `Y${year}-M${month}-D${day}`;
}

// Calculate company's creditworthiness and determine loan terms
function calculateCreditworthiness() {
    const balances = calculateAccountBalances();

    const cashBalance = balances[1] || 0; // Cash account
    const totalCurrentAssets = (balances[1] || 0) + (balances[2] || 0) + (balances[3] || 0); // Cash + AR + Inventory
    const totalCurrentLiabilities = (balances[6] || 0) + (balances[7] || 0); // AP + Notes Payable
    const realEstateValue = balances[4] || 0; // Real Estate
    const loansPrincipal = balances[19] || 0; // Bank Loans Payable - Principal
    const loansInterest = balances[21] || 0; // Bank Loans Payable - Interest
    const totalLoans = loansPrincipal + loansInterest;

    // Calculate total assets and total liabilities
    const totalAssets = totalCurrentAssets + realEstateValue;
    const totalLiabilities = totalCurrentLiabilities + totalLoans;

    const currentRatio = totalCurrentLiabilities > 0 ? totalCurrentAssets / totalCurrentLiabilities : 10;
    const debtToAssetRatio = totalAssets > 0 ? totalLiabilities / totalAssets : 0;

    // Calculate credit score (0-100) - for display purposes
    let creditScore = 50; // Base score

    // Current ratio factor (0-25 points)
    if (currentRatio >= 2.0) creditScore += 25;
    else if (currentRatio >= 1.5) creditScore += 20;
    else if (currentRatio >= 1.0) creditScore += 15;
    else if (currentRatio >= 0.5) creditScore += 5;

    // Debt to asset ratio factor (0-25 points)
    if (debtToAssetRatio <= 0.3) creditScore += 25;
    else if (debtToAssetRatio <= 0.5) creditScore += 20;
    else if (debtToAssetRatio <= 0.7) creditScore += 10;
    else if (debtToAssetRatio <= 0.9) creditScore += 5;

    // Cash factor (0-15 points)
    if (cashBalance >= 50000) creditScore += 15;
    else if (cashBalance >= 25000) creditScore += 10;
    else if (cashBalance >= 10000) creditScore += 5;

    // Real estate factor (0-10 points)
    if (realEstateValue >= 20000) creditScore += 10;
    else if (realEstateValue >= 10000) creditScore += 7;
    else if (realEstateValue >= 5000) creditScore += 4;

    creditScore = Math.min(100, Math.max(0, creditScore));

    // Maximum loan formula: (0.75 × Total Assets) - Total Liabilities
    const maxLoanAmount = Math.max(0, Math.floor((totalAssets * 0.75) - totalLiabilities));

    // Interest rate formula: 3% + (Debt-to-Asset Ratio × 17%)
    // This reflects risk - higher debt ratio means higher interest rate
    const baseRate = 3.0;
    const rateRange = 17.0;
    const interestRate = baseRate + (Math.min(1.0, debtToAssetRatio) * rateRange);

    return {
        creditScore,
        maxLoanAmount,
        interestRate: parseFloat(interestRate.toFixed(2)),
        currentRatio: parseFloat(currentRatio.toFixed(2)),
        debtToAssetRatio: parseFloat(debtToAssetRatio.toFixed(3)),
        cashBalance,
        totalAssets,
        totalLiabilities
    };
}

// Apply for and receive a bank loan
function applyForLoan(principal, termMonths) {
    const creditInfo = calculateCreditworthiness();

    if (principal > creditInfo.maxLoanAmount) {
        alert(`Loan amount exceeds maximum allowed (${formatCurrency(creditInfo.maxLoanAmount)}). Your creditworthiness limits your borrowing capacity.`);
        return false;
    }

    if (principal < 1000) {
        alert('Minimum loan amount is $1,000.');
        return false;
    }

    const interestRate = creditInfo.interestRate / 100;
    const monthlyRate = interestRate / 12;
    const suggestedMonthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);

    const cashAccount = getCashAccount();
    const loansPayableAccount = appState.accounts.find(a => a.number === '2200');

    const issueDate = getTodayDate();

    // Create loan record
    const loan = {
        id: appState.nextLoanId++,
        principal,
        interestRate: creditInfo.interestRate,
        termMonths,
        suggestedMonthlyPayment: parseFloat(suggestedMonthlyPayment.toFixed(2)),
        principalBalance: principal,
        accruedInterestBalance: 0,
        issueDate,
        maturityDate: addMonthsToDate(issueDate, termMonths),
        lastInterestAccrualDate: issueDate,
        status: 'active'
    };

    appState.loans.push(loan);

    // Record transaction using TransactionManager: Debit Cash, Credit Bank Loans Payable
    const result = window.transactionManager.createSimpleTransaction(
        `Bank loan received - ${termMonths} months @ ${creditInfo.interestRate}% APR`,
        cashAccount.id,            // debit Cash
        loansPayableAccount.id,    // credit Bank Loans Payable
        principal,
        {
            type: 'loan_disbursement',
            loanId: loan.id,
            principal: principal,
            interestRate: creditInfo.interestRate,
            termMonths: termMonths,
            maturityDate: loan.maturityDate
        }
    );

    if (!result.success) {
        // Rollback loan creation
        appState.loans = appState.loans.filter(l => l.id !== loan.id);
        alert('Failed to create transaction: ' + result.errors.join(', '));
        return false;
    }

    hasUnsavedChanges = true;

    return true;
}

// Accrue monthly interest on a loan (compounds by adding to balance)
function accrueInterestOnLoan(loanId) {
    const loan = appState.loans.find(l => l.id === loanId);
    if (!loan || loan.status !== 'active') {
        return false;
    }

    const today = getTodayDate();
    const monthlyRate = (loan.interestRate / 100) / 12;

    // Calculate months elapsed since last accrual
    const lastAccrual = loan.lastInterestAccrualDate;
    const monthsElapsed = getMonthsBetweenDates(lastAccrual, today);

    if (monthsElapsed < 1) {
        // Not enough time has passed
        return false;
    }

    const loansPrincipalAccount = appState.accounts.find(a => a.number === '2200');
    const loansInterestAccount = appState.accounts.find(a => a.number === '2210');
    const interestExpenseAccount = appState.accounts.find(a => a.number === '5600');

    // Accrue interest for each month
    for (let i = 0; i < monthsElapsed; i++) {
        // Interest compounds on the total outstanding balance (principal + accrued interest)
        const outstandingBalance = loan.principalBalance + loan.accruedInterestBalance;
        const interestAmount = outstandingBalance * monthlyRate;
        const accrualDate = addMonthsToDate(lastAccrual, i + 1);

        // Record transaction using TransactionManager: Debit Interest Expense, Credit Bank Loans Payable - Interest
        const result = window.transactionManager.createSimpleTransaction(
            `Loan #${loanId} - Interest accrued for month`,
            interestExpenseAccount.id,  // debit Interest Expense
            loansInterestAccount.id,    // credit Bank Loans Payable - Interest
            parseFloat(interestAmount.toFixed(2)),
            {
                type: 'interest_accrual',
                loanId: loanId,
                outstandingBalance: outstandingBalance,
                monthlyRate: monthlyRate,
                accrualDate: accrualDate
            }
        );

        if (!result.success) {
            console.error('Failed to record interest accrual:', result.errors);
            // Continue with other months even if one fails
        }

        // Add interest to accrued interest balance (compound)
        loan.accruedInterestBalance += interestAmount;
    }

    // Update last accrual date
    loan.lastInterestAccrualDate = addMonthsToDate(lastAccrual, monthsElapsed);
    hasUnsavedChanges = true;
    return true;
}

// Make a loan payment (user-specified amount)
function makeLoanPayment(loanId, paymentAmount) {
    const loan = appState.loans.find(l => l.id === loanId);
    if (!loan || loan.status !== 'active') {
        alert('Loan not found or already paid off.');
        return false;
    }

    if (paymentAmount < 0.01) {
        alert('Payment amount must be at least $0.01.');
        return false;
    }

    const cashBalance = getCashBalance();
    if (cashBalance < paymentAmount) {
        alert(`Insufficient cash to make payment. Available: ${formatCurrency(cashBalance)}`);
        return false;
    }

    // First, accrue any pending interest
    accrueInterestOnLoan(loanId);

    const cashAccount = getCashAccount();
    const loansPrincipalAccount = appState.accounts.find(a => a.number === '2200');
    const loansInterestAccount = appState.accounts.find(a => a.number === '2210');

    const paymentDate = getTodayDate();
    const totalBalance = loan.principalBalance + loan.accruedInterestBalance;
    const actualPayment = Math.min(paymentAmount, totalBalance);

    let remainingPayment = actualPayment;

    // First, pay down accrued interest
    if (loan.accruedInterestBalance > 0 && remainingPayment > 0) {
        const interestPayment = Math.min(remainingPayment, loan.accruedInterestBalance);

        // Record transaction using TransactionManager: Debit Bank Loans Payable - Interest, Credit Cash
        const result = window.transactionManager.createSimpleTransaction(
            `Loan #${loanId} payment - Interest paid`,
            loansInterestAccount.id,  // debit Bank Loans Payable - Interest
            cashAccount.id,           // credit Cash
            parseFloat(interestPayment.toFixed(2)),
            {
                type: 'loan_payment_interest',
                loanId: loanId,
                interestPaid: interestPayment,
                paymentDate: paymentDate
            }
        );

        if (!result.success) {
            alert('Failed to record interest payment: ' + result.errors.join(', '));
            return false;
        }

        loan.accruedInterestBalance -= interestPayment;
        remainingPayment -= interestPayment;
    }

    // Then, pay down principal
    if (loan.principalBalance > 0 && remainingPayment > 0) {
        const principalPayment = Math.min(remainingPayment, loan.principalBalance);

        // Record transaction using TransactionManager: Debit Bank Loans Payable - Principal, Credit Cash
        const result = window.transactionManager.createSimpleTransaction(
            `Loan #${loanId} payment - Principal reduction`,
            loansPrincipalAccount.id,  // debit Bank Loans Payable - Principal
            cashAccount.id,            // credit Cash
            parseFloat(principalPayment.toFixed(2)),
            {
                type: 'loan_payment_principal',
                loanId: loanId,
                principalPaid: principalPayment,
                paymentDate: paymentDate
            }
        );

        if (!result.success) {
            alert('Failed to record principal payment: ' + result.errors.join(', '));
            return false;
        }

        loan.principalBalance -= principalPayment;
    }

    // Mark loan as paid if both balances are near zero
    if (loan.principalBalance <= 0.01 && loan.accruedInterestBalance <= 0.01) {
        loan.principalBalance = 0;
        loan.accruedInterestBalance = 0;
        loan.status = 'paid';
    }

    hasUnsavedChanges = true;
    return true;
}

// Helper function to calculate months between two dates
function getMonthsBetweenDates(date1, date2) {
    const parts1 = date1.match(/Y(\d+)-M(\d+)-D(\d+)/);
    const parts2 = date2.match(/Y(\d+)-M(\d+)-D(\d+)/);

    if (!parts1 || !parts2) return 0;

    const year1 = parseInt(parts1[1]);
    const month1 = parseInt(parts1[2]);
    const year2 = parseInt(parts2[1]);
    const month2 = parseInt(parts2[2]);

    return (year2 - year1) * 12 + (month2 - month1);
}

// ====================================
// BUILDING CONSTRUCTION & MANAGEMENT
// ====================================

// Building type definitions
const BUILDING_TYPES = {
    WAREHOUSE: {
        name: 'Single-Floor Warehouse',
        materials: { lumber: 50, steel: 30, concrete: 40 },
        constructionDays: 14,  // 14 simulation days
        interiorSize: 4  // 4x4 grid
    }
};

// Equipment type definitions
const EQUIPMENT_TYPES = {
    WORKBENCH: {
        id: 'workbench',
        name: 'Workbench',
        description: 'Basic crafting station for producing equipment',
        materials: { lumber: 10 },
        productionTime: 4 * 60 * 60 * 1000,  // 4 simulation hours base time
        canCraftWithoutEquipment: true,
        requiresEquipment: [],
        gridSize: 1,
        category: 'crafting',
        produces: ['equipment']
    },
    LUMBER_MILL: {
        id: 'lumber_mill',
        name: 'Lumber Mill',
        description: 'Processes raw logs into lumber',
        materials: { lumber: 20, steel: 5 },
        productionTime: 8 * 60 * 60 * 1000,  // 8 hours
        canCraftWithoutEquipment: false,
        requiresEquipment: ['workbench'],
        gridSize: 1,
        category: 'production',
        produces: ['lumber']
    },
    FOUNDRY: {
        id: 'foundry',
        name: 'Foundry',
        description: 'Smelts ore into steel',
        materials: { lumber: 15, steel: 10, concrete: 5 },
        productionTime: 12 * 60 * 60 * 1000,  // 12 hours
        canCraftWithoutEquipment: false,
        requiresEquipment: ['workbench'],
        gridSize: 1,
        category: 'production',
        produces: ['steel']
    },
    CONCRETE_MIXER: {
        id: 'concrete_mixer',
        name: 'Concrete Mixer',
        description: 'Mixes sand, gravel, and water into concrete',
        materials: { lumber: 10, steel: 15 },
        productionTime: 10 * 60 * 60 * 1000,  // 10 hours
        canCraftWithoutEquipment: false,
        requiresEquipment: ['workbench'],
        gridSize: 1,
        category: 'production',
        produces: ['concrete']
    },
    POWER_GENERATOR: {
        id: 'power_generator',
        name: 'Power Generator',
        description: 'Generates electrical power from fuel',
        materials: { lumber: 20, steel: 30, concrete: 10 },
        productionTime: 16 * 60 * 60 * 1000,  // 16 hours
        canCraftWithoutEquipment: false,
        requiresEquipment: ['workbench', 'foundry'],
        gridSize: 1,
        category: 'utility',
        produces: ['power']
    },
    WATER_PUMP: {
        id: 'water_pump',
        name: 'Water Pump',
        description: 'Pumps and purifies water',
        materials: { lumber: 10, steel: 20 },
        productionTime: 8 * 60 * 60 * 1000,  // 8 hours
        canCraftWithoutEquipment: false,
        requiresEquipment: ['workbench'],
        gridSize: 1,
        category: 'utility',
        produces: ['water']
    },
    STORAGE_RACK: {
        id: 'storage_rack',
        name: 'Storage Rack',
        description: 'Provides organized storage space',
        materials: { lumber: 15, steel: 5 },
        productionTime: 6 * 60 * 60 * 1000,  // 6 hours
        canCraftWithoutEquipment: false,
        requiresEquipment: ['workbench'],
        gridSize: 1,
        category: 'utility',
        produces: []
    },
    ASSEMBLY_LINE: {
        id: 'assembly_line',
        name: 'Assembly Line',
        description: 'Automated production line for complex manufacturing',
        materials: { lumber: 25, steel: 40, concrete: 15 },
        productionTime: 20 * 60 * 60 * 1000,  // 20 hours
        canCraftWithoutEquipment: false,
        requiresEquipment: ['workbench', 'foundry'],
        gridSize: 1,
        category: 'production',
        produces: ['complex_products']
    },
    FORGE: {
        id: 'forge',
        name: 'Forge',
        description: 'Crafts tools and metal equipment',
        materials: { lumber: 12, steel: 15, concrete: 8 },
        productionTime: 10 * 60 * 60 * 1000,  // 10 hours
        canCraftWithoutEquipment: false,
        requiresEquipment: ['workbench'],
        gridSize: 1,
        category: 'crafting',
        produces: ['tools', 'equipment']
    }
};

// Production recipes for commodities
const PRODUCTION_RECIPES = {
    LUMBER: {
        id: 'lumber',
        name: 'Lumber Production',
        description: 'Process raw logs into construction-grade lumber',
        equipmentRequired: 'lumber_mill',
        inputs: { 'raw logs': 2 },
        outputs: { lumber: 3 },
        baseProductionTime: 2 * 60 * 60 * 1000,  // 2 hours per batch
        batchSize: 1
    },
    STEEL: {
        id: 'steel',
        name: 'Steel Production',
        description: 'Smelt iron ore with coal into steel',
        equipmentRequired: 'foundry',
        inputs: { 'iron ore': 3, coal: 1 },
        outputs: { steel: 3 },
        baseProductionTime: 4 * 60 * 60 * 1000,  // 4 hours
        batchSize: 1
    },
    CONCRETE: {
        id: 'concrete',
        name: 'Concrete Production',
        description: 'Mix sand, gravel, and water into concrete',
        equipmentRequired: 'concrete_mixer',
        inputs: { sand: 2, gravel: 2, water: 1 },
        outputs: { concrete: 2 },
        baseProductionTime: 1 * 60 * 60 * 1000,  // 1 hour
        batchSize: 1
    },
    POWER: {
        id: 'power',
        name: 'Power Generation',
        description: 'Generate electrical power from coal',
        equipmentRequired: 'power_generator',
        inputs: { coal: 1 },
        outputs: { power: 3 },
        baseProductionTime: 30 * 60 * 1000,  // 30 minutes
        batchSize: 1
    },
    POWER_OIL: {
        id: 'power_oil',
        name: 'Power Generation (Oil)',
        description: 'Generate electrical power from oil',
        equipmentRequired: 'power_generator',
        inputs: { oil: 1 },
        outputs: { power: 4 },
        baseProductionTime: 30 * 60 * 1000,  // 30 minutes
        batchSize: 1
    },
    POWER_GAS: {
        id: 'power_gas',
        name: 'Power Generation (Natural Gas)',
        description: 'Generate electrical power from natural gas',
        equipmentRequired: 'power_generator',
        inputs: { 'natural gas': 1 },
        outputs: { power: 3 },
        baseProductionTime: 30 * 60 * 1000,  // 30 minutes
        batchSize: 1
    },
    WATER: {
        id: 'water',
        name: 'Water Production',
        description: 'Pump and purify water',
        equipmentRequired: 'water_pump',
        inputs: {},  // No inputs required
        outputs: { water: 5 },
        baseProductionTime: 1 * 60 * 60 * 1000,  // 1 hour
        batchSize: 1
    }
};

// ====================================
// EQUIPMENT MANAGEMENT FUNCTIONS
// ====================================

// Get equipment definition by type
function getEquipmentDefinition(equipmentType) {
    const typeKey = equipmentType.toUpperCase();
    return EQUIPMENT_TYPES[typeKey] || null;
}

// Get commodity ID by name (case-insensitive)
function getCommodityIdByName(commodityName) {
    const commodity = appState.commodities.find(c => c.name.toLowerCase() === commodityName.toLowerCase());
    return commodity ? commodity.id : null;
}

// Calculate recipe profitability for production economics dashboard
function calculateRecipeProfitability(recipe) {
    // Calculate input costs (what we pay to buy materials)
    let inputCost = 0;
    for (const [materialName, quantity] of Object.entries(recipe.inputs)) {
        const commodityId = getCommodityIdByName(materialName);
        if (commodityId) {
            const commodity = appState.commodities.find(c => c.id === commodityId);
            if (commodity) {
                inputCost += quantity * commodity.buyPrice;
            }
        }
    }

    // Calculate output value (what we receive when selling products)
    let outputValue = 0;
    for (const [commodityName, quantity] of Object.entries(recipe.outputs)) {
        const commodityId = getCommodityIdByName(commodityName);
        if (commodityId) {
            const commodity = appState.commodities.find(c => c.id === commodityId);
            if (commodity) {
                outputValue += quantity * commodity.sellPrice;
            }
        }
    }

    // Calculate profitability metrics
    const profitPerBatch = outputValue - inputCost;
    const productionTimeHours = recipe.baseProductionTime / (60 * 60 * 1000);
    const profitPerHour = productionTimeHours > 0 ? profitPerBatch / productionTimeHours : 0;
    const roi = inputCost > 0 ? (profitPerBatch / inputCost) * 100 : Infinity;

    return {
        inputCost,
        outputValue,
        profitPerBatch,
        profitPerHour,
        roi,
        productionTimeHours
    };
}

// Check if equipment can be placed at grid location
function canPlaceEquipment(buildingId, gridX, gridY, equipmentType) {
    const building = appState.buildings.find(b => b.id === buildingId);
    if (!building) return { success: false, error: 'Building not found' };

    if (building.status !== 'completed') {
        return { success: false, error: 'Building is not completed' };
    }

    const equipmentDef = getEquipmentDefinition(equipmentType);
    if (!equipmentDef) return { success: false, error: 'Invalid equipment type' };

    // Check grid bounds
    const gridSize = building.interior.grid.length;
    if (gridX < 0 || gridX >= gridSize || gridY < 0 || gridY >= gridSize) {
        return { success: false, error: 'Grid position out of bounds' };
    }

    // Check if grid cell is occupied
    if (building.interior.grid[gridY][gridX] !== null) {
        return { success: false, error: 'Grid position is occupied' };
    }

    return { success: true };
}

// Place equipment in warehouse grid
function placeEquipment(buildingId, gridX, gridY, equipmentType) {
    const canPlace = canPlaceEquipment(buildingId, gridX, gridY, equipmentType);
    if (!canPlace.success) return canPlace;

    const building = appState.buildings.find(b => b.id === buildingId);
    const equipmentDef = getEquipmentDefinition(equipmentType);

    const equipment = {
        id: appState.nextEquipmentId++,
        type: equipmentDef.id,
        gridX: gridX,
        gridY: gridY,
        installDate: getTodayDate(),
        status: 'idle',  // idle, producing, broken
        currentProduction: null
    };

    building.interior.equipment.push(equipment);
    building.interior.grid[gridY][gridX] = equipment.id;

    hasUnsavedChanges = true;
    return { success: true, equipment: equipment };
}

// Remove equipment from warehouse
function removeEquipment(buildingId, equipmentId) {
    const building = appState.buildings.find(b => b.id === buildingId);
    if (!building) return { success: false, error: 'Building not found' };

    const equipmentIndex = building.interior.equipment.findIndex(e => e.id === equipmentId);
    if (equipmentIndex === -1) return { success: false, error: 'Equipment not found' };

    const equipment = building.interior.equipment[equipmentIndex];

    // Check if equipment is currently producing
    if (equipment.status === 'producing') {
        return { success: false, error: 'Cannot remove equipment while producing' };
    }

    // Remove from grid
    building.interior.grid[equipment.gridY][equipment.gridX] = null;

    // Remove from equipment array
    building.interior.equipment.splice(equipmentIndex, 1);

    hasUnsavedChanges = true;
    return { success: true };
}

// Get all equipment in a warehouse
function getWarehouseEquipment(buildingId) {
    const building = appState.buildings.find(b => b.id === buildingId);
    if (!building) return [];

    // Initialize equipment array if it doesn't exist (backward compatibility)
    if (!building.interior.equipment) {
        building.interior.equipment = [];
    }

    return building.interior.equipment;
}

// Get available (idle) equipment of a specific type in a building
function getAvailableEquipmentByType(buildingId, equipmentType) {
    const equipment = getWarehouseEquipment(buildingId);
    return equipment.filter(e => e.type === equipmentType && e.status === 'idle');
}

// Get all available (idle) equipment in a building
function getAvailableEquipment(buildingId) {
    const equipment = getWarehouseEquipment(buildingId);
    return equipment.filter(e => e.status === 'idle');
}

// Check if building has required equipment types
function hasRequiredEquipment(buildingId, requiredTypes) {
    if (!requiredTypes || requiredTypes.length === 0) return true;

    const equipment = getWarehouseEquipment(buildingId);
    const equipmentTypes = new Set(equipment.map(e => e.type));

    return requiredTypes.every(type => equipmentTypes.has(type));
}

// Get equipment by ID across all buildings
function getEquipmentById(buildingId, equipmentId) {
    const building = appState.buildings.find(b => b.id === buildingId);
    if (!building) return null;

    return building.interior.equipment.find(e => e.id === equipmentId) || null;
}

// Auto-place equipment in first available grid spot
function autoPlaceEquipment(buildingId, equipmentType) {
    const building = appState.buildings.find(b => b.id === buildingId);
    if (!building) return { success: false, error: 'Building not found' };

    const gridSize = building.interior.grid.length;

    // Find first empty grid cell
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (building.interior.grid[y][x] === null) {
                return placeEquipment(buildingId, x, y, equipmentType);
            }
        }
    }

    return { success: false, error: 'No available grid space' };
}

// ====================================
// PRODUCTION SYSTEM
// ====================================

// Calculate average skill level of employees
function calculateAverageSkill(employees) {
    if (!employees || employees.length === 0) return 1;
    const totalSkill = employees.reduce((sum, emp) => sum + emp.skillLevel, 0);
    return totalSkill / employees.length;
}

// Calculate production time based on employees and skills
function calculateProductionTime(baseTime, employeeCount, avgSkillLevel) {
    if (employeeCount === 0) return baseTime * 5; // Much slower with no employees

    // Skill multiplier: 0.7 at level 1, up to 2.5 at level 10
    const skillMultiplier = 0.7 + (avgSkillLevel * 0.18);

    // Employee count has diminishing returns (square root)
    const employeeMultiplier = Math.sqrt(employeeCount);

    // Combined multiplier
    const totalMultiplier = employeeMultiplier * skillMultiplier;

    // Minimum time is 20% of base time (even with many skilled workers)
    const calculatedTime = baseTime / totalMultiplier;
    return Math.max(calculatedTime, baseTime * 0.2);
}

// Check if required materials are available in inventory
function hasRequiredMaterials(materialsDict) {
    for (const [materialName, quantity] of Object.entries(materialsDict)) {
        const commodityId = getCommodityIdByName(materialName);
        if (!commodityId) return false;

        const totalQty = getTotalQuantity(commodityId);
        if (totalQty < quantity) return false;
    }
    return true;
}

// Consume materials from inventory using FIFO
function consumeMaterials(materialsDict) {
    const consumedMaterials = {};
    let totalCost = 0;

    for (const [materialName, quantity] of Object.entries(materialsDict)) {
        const commodityId = getCommodityIdByName(materialName);
        if (!commodityId) {
            console.error(`Commodity not found: ${materialName}`);
            continue;
        }

        const portfolio = appState.portfolio[commodityId];
        if (!portfolio || !portfolio.lots) {
            console.error(`No inventory for commodity: ${materialName}`);
            continue;
        }

        let remaining = quantity;
        let costBasis = 0;

        // Consume using FIFO
        while (remaining > 0 && portfolio.lots.length > 0) {
            const lot = portfolio.lots[0];
            const toConsume = Math.min(remaining, lot.quantity);

            costBasis += toConsume * lot.costBasis;
            lot.quantity -= toConsume;
            remaining -= toConsume;

            if (lot.quantity <= 0) {
                portfolio.lots.shift(); // Remove empty lot
            }
        }

        consumedMaterials[materialName] = quantity;
        totalCost += costBasis;
    }

    return { materials: consumedMaterials, totalCost: totalCost };
}

// Start workbench crafting (can be done without equipment)
function startWorkbenchCraft(buildingId) {
    const building = appState.buildings.find(b => b.id === buildingId);
    if (!building) {
        return { success: false, error: 'Building not found' };
    }

    if (building.status !== 'completed') {
        return { success: false, error: 'Building is not completed yet' };
    }

    const employees = getEmployeesByBuilding(buildingId);
    if (employees.length === 0) {
        return { success: false, error: 'No employees assigned to this warehouse' };
    }

    const equipmentDef = EQUIPMENT_TYPES.WORKBENCH;

    // Check materials
    if (!hasRequiredMaterials(equipmentDef.materials)) {
        return { success: false, error: 'Insufficient materials (need 10 Lumber)' };
    }

    // Consume materials
    const consumed = consumeMaterials(equipmentDef.materials);

    // Calculate production time
    const avgSkill = calculateAverageSkill(employees);
    const productionTime = calculateProductionTime(
        equipmentDef.productionTime,
        employees.length,
        avgSkill
    );

    const currentTime = getCurrentSimulationTime();

    // Create production job
    const productionJob = {
        id: appState.nextProductionId++,
        buildingId: buildingId,
        equipmentId: null, // null for workbench crafting
        productType: 'equipment',
        productId: 'workbench',
        recipeId: null,
        quantity: 1,
        startTime: currentTime,
        estimatedCompletionTime: currentTime + productionTime,
        actualCompletionTime: null,
        status: 'in_progress',
        materialsConsumed: consumed.materials,
        materialsCost: consumed.totalCost,
        outputs: { workbench: 1 },
        assignedEmployees: employees.map(e => e.id),
        continuous: false,
        transactionId: null
    };

    // Record accounting transaction (debit Equipment, credit Inventory)
    const equipmentAccount = appState.accounts.find(a => a.number === '1500');
    const inventoryAccount = appState.accounts.find(a => a.number === '1200');

    const transaction = {
        id: appState.nextTransactionId++,
        date: getTodayDate(),
        description: `Started crafting Workbench at ${building.type} (${building.x}, ${building.y})`,
        debitAccount: equipmentAccount.id,
        creditAccount: inventoryAccount.id,
        amount: parseFloat(consumed.totalCost.toFixed(2))
    };

    appState.transactions.push(transaction);
    productionJob.transactionId = transaction.id;

    appState.productionQueue.push(productionJob);
    hasUnsavedChanges = true;

    return {
        success: true,
        productionId: productionJob.id,
        estimatedCompletion: formatSimulationTime(productionJob.estimatedCompletionTime)
    };
}

// Start equipment production (requires existing equipment)
function startEquipmentProduction(buildingId, equipmentType) {
    const building = appState.buildings.find(b => b.id === buildingId);
    if (!building) {
        return { success: false, error: 'Building not found' };
    }

    if (building.status !== 'completed') {
        return { success: false, error: 'Building is not completed yet' };
    }

    const employees = getEmployeesByBuilding(buildingId);
    if (employees.length === 0) {
        return { success: false, error: 'No employees assigned to this warehouse' };
    }

    const equipmentDef = getEquipmentDefinition(equipmentType);
    if (!equipmentDef) {
        return { success: false, error: 'Invalid equipment type' };
    }

    // Check if equipment can be crafted without other equipment
    if (equipmentDef.canCraftWithoutEquipment) {
        return { success: false, error: 'Use startWorkbenchCraft() for workbench production' };
    }

    // Validate prerequisites
    if (!hasRequiredEquipment(buildingId, equipmentDef.requiresEquipment)) {
        const missing = equipmentDef.requiresEquipment.join(', ');
        return { success: false, error: `Missing required equipment: ${missing}` };
    }

    // Find available equipment of the required type
    const requiredEquipmentType = equipmentDef.requiresEquipment[0]; // Use first required type
    const availableEquipment = getAvailableEquipmentByType(buildingId, requiredEquipmentType);

    if (availableEquipment.length === 0) {
        const equipDef = getEquipmentDefinition(requiredEquipmentType);
        return { success: false, error: `No available ${equipDef.name} (all are busy)` };
    }

    // Check materials
    if (!hasRequiredMaterials(equipmentDef.materials)) {
        const materialsNeeded = Object.entries(equipmentDef.materials)
            .map(([mat, qty]) => `${qty} ${mat}`)
            .join(', ');
        return { success: false, error: `Insufficient materials (need ${materialsNeeded})` };
    }

    // Consume materials
    const consumed = consumeMaterials(equipmentDef.materials);

    // Calculate production time
    const avgSkill = calculateAverageSkill(employees);
    const productionTime = calculateProductionTime(
        equipmentDef.productionTime,
        employees.length,
        avgSkill
    );

    const currentTime = getCurrentSimulationTime();
    const selectedEquipment = availableEquipment[0]; // Use first available equipment

    // Create production job
    const productionJob = {
        id: appState.nextProductionId++,
        buildingId: buildingId,
        equipmentId: selectedEquipment.id,
        productType: 'equipment',
        productId: equipmentDef.id,
        recipeId: null,
        quantity: 1,
        startTime: currentTime,
        estimatedCompletionTime: currentTime + productionTime,
        actualCompletionTime: null,
        status: 'in_progress',
        materialsConsumed: consumed.materials,
        materialsCost: consumed.totalCost,
        outputs: { [equipmentDef.id]: 1 },
        assignedEmployees: employees.map(e => e.id),
        continuous: false,
        transactionId: null
    };

    // Mark equipment as busy
    selectedEquipment.status = 'producing';
    selectedEquipment.currentProduction = productionJob.id;

    // Record accounting transaction (debit Equipment, credit Inventory)
    const equipmentAccount = appState.accounts.find(a => a.number === '1500');
    const inventoryAccount = appState.accounts.find(a => a.number === '1200');

    const transaction = {
        id: appState.nextTransactionId++,
        date: getTodayDate(),
        description: `Started crafting ${equipmentDef.name} at ${building.type} (${building.x}, ${building.y})`,
        debitAccount: equipmentAccount.id,
        creditAccount: inventoryAccount.id,
        amount: parseFloat(consumed.totalCost.toFixed(2))
    };

    appState.transactions.push(transaction);
    productionJob.transactionId = transaction.id;

    appState.productionQueue.push(productionJob);
    hasUnsavedChanges = true;

    return {
        success: true,
        productionId: productionJob.id,
        estimatedCompletion: formatSimulationTime(productionJob.estimatedCompletionTime),
        usingEquipment: selectedEquipment.id
    };
}

// Start commodity production (equipment produces commodities)
function startCommodityProduction(buildingId, equipmentId, recipeId, continuous = false) {
    const building = appState.buildings.find(b => b.id === buildingId);
    if (!building) {
        return { success: false, error: 'Building not found' };
    }

    if (building.status !== 'completed') {
        return { success: false, error: 'Building is not completed yet' };
    }

    const employees = getEmployeesByBuilding(buildingId);
    if (employees.length === 0) {
        return { success: false, error: 'No employees assigned to this warehouse' };
    }

    const recipe = Object.values(PRODUCTION_RECIPES).find(r => r.id === recipeId);
    if (!recipe) {
        return { success: false, error: 'Invalid recipe' };
    }

    const equipment = getEquipmentById(buildingId, equipmentId);
    if (!equipment) {
        return { success: false, error: 'Equipment not found' };
    }

    // Validate equipment type matches recipe
    if (equipment.type !== recipe.equipmentRequired) {
        return { success: false, error: 'Wrong equipment type for this recipe' };
    }

    // Check if equipment is available
    if (equipment.status !== 'idle') {
        return { success: false, error: 'Equipment is currently busy' };
    }

    // Check input materials (if any)
    if (Object.keys(recipe.inputs).length > 0) {
        if (!hasRequiredMaterials(recipe.inputs)) {
            const materialsNeeded = Object.entries(recipe.inputs)
                .map(([mat, qty]) => `${qty} ${mat}`)
                .join(', ');
            return { success: false, error: `Insufficient materials (need ${materialsNeeded})` };
        }
    }

    // Consume input materials
    let materialsCost = 0;
    let consumedMaterials = {};
    if (Object.keys(recipe.inputs).length > 0) {
        const consumed = consumeMaterials(recipe.inputs);
        materialsCost = consumed.totalCost;
        consumedMaterials = consumed.materials;
    }

    // Calculate production time
    const avgSkill = calculateAverageSkill(employees);
    const productionTime = calculateProductionTime(
        recipe.baseProductionTime,
        employees.length,
        avgSkill
    );

    const currentTime = getCurrentSimulationTime();

    // Create production job
    const productionJob = {
        id: appState.nextProductionId++,
        buildingId: buildingId,
        equipmentId: equipment.id,
        productType: 'commodity',
        productId: null,
        recipeId: recipe.id,
        quantity: 1,
        startTime: currentTime,
        estimatedCompletionTime: currentTime + productionTime,
        actualCompletionTime: null,
        status: 'in_progress',
        materialsConsumed: consumedMaterials,
        materialsCost: materialsCost,
        outputs: recipe.outputs,
        assignedEmployees: employees.map(e => e.id),
        continuous: continuous,
        transactionId: null
    };

    // Mark equipment as busy
    equipment.status = 'producing';
    equipment.currentProduction = productionJob.id;

    // Record accounting transaction (debit Inventory for inputs if any)
    if (materialsCost > 0) {
        const inventoryAccount = appState.accounts.find(a => a.number === '1200');

        const transaction = {
            id: appState.nextTransactionId++,
            date: getTodayDate(),
            description: `Started ${recipe.name} at ${building.type} (${building.x}, ${building.y})`,
            debitAccount: inventoryAccount.id,
            creditAccount: inventoryAccount.id,  // Net zero for now, will adjust on completion
            amount: 0  // Cost basis tracked internally
        };

        appState.transactions.push(transaction);
        productionJob.transactionId = transaction.id;
    }

    appState.productionQueue.push(productionJob);
    hasUnsavedChanges = true;

    return {
        success: true,
        productionId: productionJob.id,
        estimatedCompletion: formatSimulationTime(productionJob.estimatedCompletionTime),
        usingEquipment: equipment.id,
        continuous: continuous
    };
}

// Check production progress and complete finished jobs
function checkProductionProgress() {
    const currentTime = getCurrentSimulationTime();

    // Keep checking until no more jobs are ready to complete
    // This is critical for admin time-skip: if you skip 10 hours and a 2-hour
    // production is on continuous mode, it should complete 5 times, not just once!
    let completedAny = true;
    let iterations = 0;
    const maxIterations = 1000; // Safety limit to prevent infinite loops

    while (completedAny && iterations < maxIterations) {
        completedAny = false;
        iterations++;

        // Check all jobs - use filter to avoid issues with array modification during iteration
        const jobsToComplete = appState.productionQueue.filter(job =>
            job.status === 'in_progress' && currentTime >= job.estimatedCompletionTime
        );

        if (jobsToComplete.length > 0) {
            completedAny = true;
            jobsToComplete.forEach(job => {
                completeProduction(job);
            });
        }
    }

    if (iterations >= maxIterations) {
        console.warn('checkProductionProgress: Hit max iterations safety limit');
    }
}

// Complete a production job
function completeProduction(productionJob) {
    productionJob.status = 'completed';
    productionJob.actualCompletionTime = getCurrentSimulationTime();

    const equipment = productionJob.equipmentId ? getEquipmentById(productionJob.buildingId, productionJob.equipmentId) : null;

    // Handle equipment production
    if (productionJob.productType === 'equipment') {
        const equipmentType = productionJob.productId;

        // Auto-place equipment in warehouse
        const result = autoPlaceEquipment(productionJob.buildingId, equipmentType);

        if (result.success) {
            console.log(`Equipment ${equipmentType} completed and placed in warehouse`);
        } else {
            console.warn(`Equipment ${equipmentType} completed but could not be placed: ${result.error}`);
            // Equipment is still completed, just not placed yet
        }

        // Mark equipment as idle
        if (equipment) {
            equipment.status = 'idle';
            equipment.currentProduction = null;
        }
    }

    // Handle commodity production
    if (productionJob.productType === 'commodity') {
        // Add outputs to inventory with cost basis = input material costs
        for (const [commodityName, quantity] of Object.entries(productionJob.outputs)) {
            const commodityId = getCommodityIdByName(commodityName);
            if (!commodityId) {
                console.error(`Commodity not found: ${commodityName}`);
                continue;
            }

            // Cost basis = material cost / output quantity
            const costBasis = productionJob.materialsCost / quantity;

            if (!appState.portfolio[commodityId]) {
                appState.portfolio[commodityId] = { lots: [] };
            }

            appState.portfolio[commodityId].lots.push({
                quantity: quantity,
                costBasis: costBasis,
                purchaseDate: getTodayDate(),
                purchaseId: `production-${productionJob.id}`
            });
        }

        // Check for continuous production
        if (productionJob.continuous && equipment) {
            const recipe = Object.values(PRODUCTION_RECIPES).find(r => r.id === productionJob.recipeId);

            // Check if we still have materials
            const hasMaterials = Object.keys(recipe.inputs).length === 0 || hasRequiredMaterials(recipe.inputs);

            if (hasMaterials) {
                // CRITICAL FIX: Set equipment to idle BEFORE restarting
                // Otherwise startCommodityProduction() will fail with "Equipment is currently busy"
                equipment.status = 'idle';
                equipment.currentProduction = null;

                // Auto-restart production
                const result = startCommodityProduction(
                    productionJob.buildingId,
                    equipment.id,
                    productionJob.recipeId,
                    true  // Keep continuous mode
                );

                if (result.success) {
                    console.log(`Continuous production: restarted ${recipe.name}`);
                } else {
                    // Restart failed - equipment already idle from above
                    console.warn(`Continuous production stopped: ${result.error}`);
                }
            } else {
                // Not enough materials, stop continuous production
                equipment.status = 'idle';
                equipment.currentProduction = null;
                console.log(`Continuous production stopped: insufficient materials`);
            }
        } else {
            // Mark equipment as idle (non-continuous or no equipment)
            if (equipment) {
                equipment.status = 'idle';
                equipment.currentProduction = null;
            }
        }
    }

    hasUnsavedChanges = true;
}

// Cancel a production job
function cancelProduction(productionId) {
    const jobIndex = appState.productionQueue.findIndex(p => p.id === productionId);
    if (jobIndex === -1) {
        return { success: false, error: 'Production job not found' };
    }

    const job = appState.productionQueue[jobIndex];

    if (job.status !== 'in_progress') {
        return { success: false, error: 'Can only cancel in-progress jobs' };
    }

    // Refund 50% of materials
    const inventoryAccount = appState.accounts.find(a => a.number === '1200');
    const equipmentAccount = appState.accounts.find(a => a.number === '1500');

    const refundAmount = job.materialsCost * 0.5;

    for (const [materialName, quantity] of Object.entries(job.materialsConsumed)) {
        const commodityId = getCommodityIdByName(materialName);
        if (!commodityId) continue;

        const refundQty = Math.floor(quantity * 0.5);
        const commodity = appState.commodities.find(c => c.id === commodityId);

        if (!appState.portfolio[commodityId]) {
            appState.portfolio[commodityId] = { lots: [] };
        }

        appState.portfolio[commodityId].lots.push({
            quantity: refundQty,
            costBasis: commodity.buyPrice,
            purchaseDate: getTodayDate(),
            purchaseId: `cancel-${productionId}`
        });
    }

    // Record refund transaction
    const transaction = {
        id: appState.nextTransactionId++,
        date: getTodayDate(),
        description: `Cancelled production: ${job.productType} ${job.productId} - 50% materials refunded`,
        debitAccount: inventoryAccount.id,
        creditAccount: equipmentAccount.id,
        amount: parseFloat(refundAmount.toFixed(2))
    };

    appState.transactions.push(transaction);

    // Mark equipment as idle if it was being used
    if (job.equipmentId) {
        const equipment = getEquipmentById(job.buildingId, job.equipmentId);
        if (equipment) {
            equipment.status = 'idle';
            equipment.currentProduction = null;
        }
    }

    job.status = 'cancelled';
    hasUnsavedChanges = true;

    return { success: true, refundAmount: refundAmount };
}

// Get active production jobs for a building
function getActiveProductions(buildingId) {
    return appState.productionQueue.filter(p =>
        p.buildingId === buildingId && p.status === 'in_progress'
    );
}

// Get all production jobs for a building (including completed)
function getAllProductions(buildingId) {
    return appState.productionQueue.filter(p => p.buildingId === buildingId);
}

// Get production statistics for all warehouses
function getProductionStatistics() {
    const stats = {
        totalActive: 0,
        totalCompleted: 0,
        byBuilding: {},
        recentCompletions: [],
        lowStockMaterials: []
    };

    // Count productions
    appState.productionQueue.forEach(job => {
        if (job.status === 'in_progress') {
            stats.totalActive++;
        } else if (job.status === 'completed') {
            stats.totalCompleted++;

            // Track recent completions (last 10)
            if (stats.recentCompletions.length < 10) {
                stats.recentCompletions.push(job);
            }
        }

        // Per-building stats
        if (!stats.byBuilding[job.buildingId]) {
            stats.byBuilding[job.buildingId] = {
                active: 0,
                completed: 0,
                equipmentBusy: 0,
                equipmentIdle: 0
            };
        }

        if (job.status === 'in_progress') {
            stats.byBuilding[job.buildingId].active++;
        } else if (job.status === 'completed') {
            stats.byBuilding[job.buildingId].completed++;
        }
    });

    // Check equipment status per building
    appState.buildings.forEach(building => {
        if (building.status === 'completed' && building.interior && building.interior.equipment) {
            if (!stats.byBuilding[building.id]) {
                stats.byBuilding[building.id] = {
                    active: 0,
                    completed: 0,
                    equipmentBusy: 0,
                    equipmentIdle: 0
                };
            }

            building.interior.equipment.forEach(equip => {
                if (equip.status === 'producing') {
                    stats.byBuilding[building.id].equipmentBusy++;
                } else {
                    stats.byBuilding[building.id].equipmentIdle++;
                }
            });
        }
    });

    // Check for low-stock materials (< 10 units)
    const criticalMaterials = ['lumber', 'steel', 'concrete', 'raw logs', 'iron ore', 'coal', 'sand', 'gravel'];
    criticalMaterials.forEach(matName => {
        const commodityId = getCommodityIdByName(matName);
        if (commodityId) {
            const quantity = getTotalQuantity(commodityId);
            if (quantity < 10 && quantity > 0) {
                stats.lowStockMaterials.push({ name: matName, quantity: quantity });
            }
        }
    });

    // Sort recent completions by time (newest first)
    stats.recentCompletions.sort((a, b) => b.actualCompletionTime - a.actualCompletionTime);

    return stats;
}

// Start construction of a building
function startConstruction(x, y, buildingType) {
    // Check if tile is owned
    const ownedSquare = appState.map.ownedSquares.find(s => s.x === x && s.y === y);
    if (!ownedSquare) {
        alert('You must own this tile to build on it.');
        return false;
    }

    // Check if there's already a building here
    const existingBuilding = appState.buildings.find(b => b.x === x && b.y === y && b.status !== 'demolished');
    if (existingBuilding) {
        alert('There is already a building on this tile.');
        return false;
    }

    const buildingDef = BUILDING_TYPES[buildingType];
    if (!buildingDef) {
        alert('Invalid building type.');
        return false;
    }

    // Check if we have the materials in inventory
    for (const [materialName, quantity] of Object.entries(buildingDef.materials)) {
        const commodity = appState.commodities.find(c => c.name.toLowerCase() === materialName.toLowerCase());
        if (!commodity) continue;

        const portfolio = appState.portfolio[commodity.id];
        const totalQuantity = portfolio ? portfolio.lots.reduce((sum, lot) => sum + lot.quantity, 0) : 0;

        if (totalQuantity < quantity) {
            alert(`Insufficient ${materialName}. Required: ${quantity}, Available: ${totalQuantity}`);
            return false;
        }
    }

    // Calculate total material cost (using FIFO cost basis)
    let totalCost = 0;
    const materialsUsed = [];

    for (const [materialName, quantity] of Object.entries(buildingDef.materials)) {
        const commodity = appState.commodities.find(c => c.name.toLowerCase() === materialName.toLowerCase());
        if (!commodity) continue;

        const { cost, lots } = consumeCommodityFIFO(commodity.id, quantity);
        totalCost += cost;
        materialsUsed.push({ commodityId: commodity.id, quantity, cost, lots });
    }

    // Create building
    const building = {
        id: appState.nextBuildingId++,
        type: buildingType,
        x,
        y,
        status: 'under_construction',
        startDate: getTodayDate(),
        completionDate: addDaysToDate(getTodayDate(), buildingDef.constructionDays),
        cost: totalCost,
        interior: {
            grid: Array(buildingDef.interiorSize).fill(null).map(() => Array(buildingDef.interiorSize).fill(null)),
            equipment: []
        }
    };

    appState.buildings.push(building);
    appState.constructionQueue.push({ buildingId: building.id, completionDate: building.completionDate });

    // Record transaction using TransactionManager: consume inventory, add to buildings
    const inventoryAccount = appState.accounts.find(a => a.number === '1200');
    const buildingsAccount = appState.accounts.find(a => a.number === '1400');

    const result = window.transactionManager.createSimpleTransaction(
        `Started construction: ${buildingDef.name} at (${x}, ${y})`,
        buildingsAccount.id,   // debit Buildings
        inventoryAccount.id,   // credit Inventory
        parseFloat(totalCost.toFixed(2)),
        {
            type: 'building_construction',
            buildingId: building.id,
            buildingType: buildingType,
            coordinates: { x, y },
            materials: materialsUsed,
            completionDate: building.completionDate
        }
    );

    if (!result.success) {
        // Rollback building creation
        appState.buildings = appState.buildings.filter(b => b.id !== building.id);
        appState.constructionQueue = appState.constructionQueue.filter(c => c.buildingId !== building.id);
        alert('Failed to create transaction: ' + result.errors.join(', '));
        return false;
    }
    hasUnsavedChanges = true;

    return true;
}

// Helper: Consume commodity using FIFO and return cost + updated lots
function consumeCommodityFIFO(commodityId, quantity) {
    const portfolio = appState.portfolio[commodityId];
    if (!portfolio || !portfolio.lots || portfolio.lots.length === 0) {
        return { cost: 0, lots: [] };
    }

    let remaining = quantity;
    let totalCost = 0;
    const consumedLots = [];

    while (remaining > 0 && portfolio.lots.length > 0) {
        const lot = portfolio.lots[0];
        const takeQuantity = Math.min(remaining, lot.quantity);

        totalCost += takeQuantity * lot.costBasis;
        consumedLots.push({ ...lot, quantity: takeQuantity });

        lot.quantity -= takeQuantity;
        remaining -= takeQuantity;

        if (lot.quantity <= 0) {
            portfolio.lots.shift();
        }
    }

    return { cost: totalCost, lots: consumedLots };
}

// Add days to a date
function addDaysToDate(dateString, days) {
    const parts = dateString.match(/Y(\d+)-M(\d+)-D(\d+)/);
    if (!parts) return dateString;

    let year = parseInt(parts[1]);
    let month = parseInt(parts[2]);
    let day = parseInt(parts[3]);

    day += days;

    while (day > SIMULATION_CONFIG.DAYS_PER_MONTH) {
        day -= SIMULATION_CONFIG.DAYS_PER_MONTH;
        month++;
        if (month > SIMULATION_CONFIG.MONTHS_PER_YEAR) {
            month = 1;
            year++;
        }
    }

    return `Y${year}-M${month}-D${day}`;
}

// Check and complete buildings
function checkConstructionProgress() {
    const today = getTodayDate();

    appState.constructionQueue = appState.constructionQueue.filter(item => {
        if (compareDates(today, item.completionDate) >= 0) {
            // Construction is complete
            const building = appState.buildings.find(b => b.id === item.buildingId);
            if (building) {
                building.status = 'completed';
            }
            return false; // Remove from queue
        }
        return true; // Keep in queue
    });
}

// Demolish a building
function demolishBuilding(buildingId) {
    const building = appState.buildings.find(b => b.id === buildingId);
    if (!building) {
        alert('Building not found.');
        return false;
    }

    if (building.status === 'under_construction') {
        alert('Cannot demolish a building that is still under construction.');
        return false;
    }

    if (!confirm(`Demolish ${BUILDING_TYPES[building.type].name}? This will return materials to inventory.`)) {
        return false;
    }

    const buildingDef = BUILDING_TYPES[building.type];

    // Return materials to inventory (50% recovery rate)
    const inventoryAccount = appState.accounts.find(a => a.number === '1200');
    const buildingsAccount = appState.accounts.find(a => a.number === '1400');

    let totalRecoveredValue = 0;

    for (const [materialName, quantity] of Object.entries(buildingDef.materials)) {
        const commodity = appState.commodities.find(c => c.name.toLowerCase() === materialName.toLowerCase());
        if (!commodity) continue;

        const recoveredQty = Math.floor(quantity * 0.5); // 50% recovery
        const recoveredValue = recoveredQty * commodity.buyPrice;

        // Add to portfolio
        if (!appState.portfolio[commodity.id]) {
            appState.portfolio[commodity.id] = { lots: [] };
        }

        appState.portfolio[commodity.id].lots.push({
            quantity: recoveredQty,
            costBasis: commodity.buyPrice,
            purchaseDate: getTodayDate(),
            purchaseId: `demolish-${buildingId}`
        });

        totalRecoveredValue += recoveredValue;
    }

    // Record transaction: debit inventory, credit buildings
    const transaction = {
        id: appState.nextTransactionId++,
        date: getTodayDate(),
        description: `Demolished ${buildingDef.name} at (${building.x}, ${building.y}) - Materials recovered`,
        debitAccount: inventoryAccount.id,
        creditAccount: buildingsAccount.id,
        amount: parseFloat(totalRecoveredValue.toFixed(2))
    };

    appState.transactions.push(transaction);

    // Remove all employees from the demolished building
    appState.employees = appState.employees.filter(e => e.assignedBuildingId !== buildingId);

    // Remove all equipment from the demolished building
    if (building.interior && building.interior.equipment) {
        building.interior.equipment = [];
        // Clear grid references
        const gridSize = building.interior.grid.length;
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                building.interior.grid[y][x] = null;
            }
        }
    }

    // Cancel any active production jobs for this building
    appState.productionQueue = appState.productionQueue.filter(p => p.buildingId !== buildingId);

    building.status = 'demolished';
    hasUnsavedChanges = true;

    return true;
}

// ====================================
// EMPLOYEE MANAGEMENT
// ====================================

// Generate a random employee name
function generateEmployeeName() {
    const firstNames = [
        'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
        'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
        'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
        'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
        'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
        'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
        'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
        'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
        'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna'
    ];

    const lastNames = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
        'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
        'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
        'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
        'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
        'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
        'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
        'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy'
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${firstName} ${lastName}`;
}

// Define available skill levels and their corresponding wages
const SKILL_LEVELS = [
    { level: 1, name: 'Novice', wage: 50, description: 'Entry-level, minimal experience' },
    { level: 2, name: 'Beginner', wage: 75, description: 'Basic skills, learning' },
    { level: 3, name: 'Junior', wage: 125, description: 'Developing competence' },
    { level: 4, name: 'Competent', wage: 175, description: 'Reliable and capable' },
    { level: 5, name: 'Skilled', wage: 250, description: 'Proficient in their role' },
    { level: 6, name: 'Advanced', wage: 350, description: 'Advanced expertise' },
    { level: 7, name: 'Senior', wage: 500, description: 'Highly experienced' },
    { level: 8, name: 'Expert', wage: 700, description: 'Top-tier professional' },
    { level: 9, name: 'Master', wage: 1000, description: 'Industry leader' },
    { level: 10, name: 'Elite', wage: 1500, description: 'Best of the best' }
];

// Get skill level info by level number
function getSkillLevelInfo(level) {
    return SKILL_LEVELS.find(s => s.level === level) || SKILL_LEVELS[0];
}

// Hire an employee at a building
function hireEmployee(buildingId, skillLevel) {
    const building = appState.buildings.find(b => b.id === buildingId);
    if (!building) {
        alert('Building not found.');
        return false;
    }

    if (building.status !== 'completed') {
        alert('Can only hire employees at completed buildings.');
        return false;
    }

    const skillInfo = getSkillLevelInfo(skillLevel);
    const wage = skillInfo.wage;

    const cashBalance = getCashBalance();
    if (cashBalance < wage) {
        alert(`Insufficient cash to pay first wage. Need ${formatCurrency(wage)}, have ${formatCurrency(cashBalance)}.`);
        return false;
    }

    // Create employee
    const employee = {
        id: appState.nextEmployeeId++,
        name: generateEmployeeName(),
        wage: parseFloat(wage),
        skillLevel: skillLevel,
        assignedBuildingId: buildingId,
        hireDate: getTodayDate(),
        nextPaymentDate: addTime(getCurrentSimulationTime(), 24 * 60 * 60 * 1000) // 24 hours from now
    };

    appState.employees.push(employee);

    // Pay first wage immediately
    const cashAccount = appState.accounts.find(a => a.number === '1000');
    const salariesAccount = appState.accounts.find(a => a.number === '5300');

    const transaction = {
        id: appState.nextTransactionId++,
        date: getTodayDate(),
        description: `Hired ${employee.name} - First wage payment (${skillInfo.name}, ${formatCurrency(wage)}/24hrs, Skill ${employee.skillLevel})`,
        debitAccount: salariesAccount.id,
        creditAccount: cashAccount.id,
        amount: wage
    };

    appState.transactions.push(transaction);
    hasUnsavedChanges = true;

    return true;
}

// Fire an employee
function fireEmployee(employeeId) {
    const employeeIndex = appState.employees.findIndex(e => e.id === employeeId);
    if (employeeIndex === -1) {
        alert('Employee not found.');
        return false;
    }

    const employee = appState.employees[employeeIndex];

    if (!confirm(`Fire ${employee.name}? They will stop working immediately.`)) {
        return false;
    }

    appState.employees.splice(employeeIndex, 1);
    hasUnsavedChanges = true;

    return true;
}

// Get employees assigned to a building
function getEmployeesByBuilding(buildingId) {
    return appState.employees.filter(e => e.assignedBuildingId === buildingId);
}

// Process wage payments for all employees
function processWagePayments() {
    const currentTime = getCurrentSimulationTime();
    const cashAccount = appState.accounts.find(a => a.number === '1000');
    const salariesAccount = appState.accounts.find(a => a.number === '5300');

    for (const employee of appState.employees) {
        // Check if payment is due
        if (currentTime >= employee.nextPaymentDate) {
            const cashBalance = getCashBalance();

            if (cashBalance >= employee.wage) {
                // Pay the employee using TransactionManager
                const result = window.transactionManager.createSimpleTransaction(
                    `Wage payment - ${employee.name} (${formatCurrency(employee.wage)}/24hrs)`,
                    salariesAccount.id,  // debit Salaries Expense
                    cashAccount.id,      // credit Cash
                    employee.wage,
                    {
                        type: 'wage_payment',
                        employeeId: employee.id,
                        employeeName: employee.name,
                        wage: employee.wage,
                        paymentPeriod: '24hrs'
                    }
                );

                if (!result.success) {
                    console.error(`Failed to record wage payment for ${employee.name}:`, result.errors);
                    // Employee quits due to payment system failure
                    const employeeIndex = appState.employees.findIndex(e => e.id === employee.id);
                    if (employeeIndex !== -1) {
                        appState.employees.splice(employeeIndex, 1);
                        hasUnsavedChanges = true;
                    }
                    continue;
                }

                // Schedule next payment (24 hours later)
                employee.nextPaymentDate = addTime(employee.nextPaymentDate, 24 * 60 * 60 * 1000);
                hasUnsavedChanges = true;
            } else {
                // Not enough cash - employee quits
                console.log(`${employee.name} quit due to non-payment!`);
                const employeeIndex = appState.employees.findIndex(e => e.id === employee.id);
                if (employeeIndex !== -1) {
                    appState.employees.splice(employeeIndex, 1);
                    hasUnsavedChanges = true;
                }
            }
        }
    }
}

// Helper to add time to a timestamp
function addTime(timestamp, milliseconds) {
    return timestamp + milliseconds;
}

// ====================================
// EQUITY MANAGEMENT
// ====================================

// Issue shares to raise capital
function issueShares(numberOfShares, pricePerShare, holder = 'Owner') {
    if (numberOfShares < 1) {
        alert('Must issue at least 1 share.');
        return false;
    }

    if (pricePerShare < 0.01) {
        alert('Share price must be at least $0.01.');
        return false;
    }

    const totalValue = numberOfShares * pricePerShare;
    const issueDate = getTodayDate();

    const shareIssuance = {
        id: appState.nextShareIssuanceId++,
        numberOfShares,
        pricePerShare,
        totalValue,
        issueDate,
        holder
    };

    appState.shares.push(shareIssuance);

    // Find accounts
    const cashAccount = appState.accounts.find(a => a.number === '1000');
    const commonStockAccount = appState.accounts.find(a => a.number === '3000');

    // Record transaction using TransactionManager: Debit Cash, Credit Common Stock
    const result = window.transactionManager.createSimpleTransaction(
        `Issued ${numberOfShares} shares at ${formatCurrency(pricePerShare)} per share to ${holder}`,
        cashAccount.id,        // debit Cash
        commonStockAccount.id, // credit Common Stock
        totalValue,
        {
            type: 'equity_issuance',
            shareIssuanceId: shareIssuance.id,
            numberOfShares: numberOfShares,
            pricePerShare: pricePerShare,
            holder: holder
        }
    );

    if (!result.success) {
        // Rollback share issuance
        appState.shares = appState.shares.filter(s => s.id !== shareIssuance.id);
        alert('Failed to create transaction: ' + result.errors.join(', '));
        return false;
    }

    hasUnsavedChanges = true;
    return true;
}

// Get total shares outstanding and total equity value
function getSharesSummary() {
    const totalShares = appState.shares.reduce((sum, issuance) => sum + issuance.numberOfShares, 0);
    const totalEquityValue = appState.shares.reduce((sum, issuance) => sum + issuance.totalValue, 0);

    // Get Common Stock account balance
    const balances = calculateAccountBalances();
    const commonStockBalance = balances[8] || 0; // Common Stock account ID 8

    return {
        totalShares,
        totalEquityValue,
        commonStockBalance,
        averagePricePerShare: totalShares > 0 ? totalEquityValue / totalShares : 0
    };
}

// Calculate suggested payment based on current balance and remaining term
function calculateCurrentSuggestedPayment(loan) {
    const today = getTodayDate();
    const remainingMonths = getMonthsBetweenDates(today, loan.maturityDate);
    const totalBalance = loan.principalBalance + loan.accruedInterestBalance;

    // If loan is past maturity or has very few months left, suggest paying full balance
    if (remainingMonths <= 0) {
        return totalBalance;
    }

    // Calculate amortized payment based on current balance and remaining term
    const monthlyRate = (loan.interestRate / 100) / 12;

    // If interest rate is 0, just divide evenly
    if (monthlyRate === 0) {
        return totalBalance / remainingMonths;
    }

    // Standard amortization formula: P * [r(1+r)^n] / [(1+r)^n - 1]
    // where P = current balance, r = monthly rate, n = remaining months
    const suggestedPayment = totalBalance *
        (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
        (Math.pow(1 + monthlyRate, remainingMonths) - 1);

    return parseFloat(suggestedPayment.toFixed(2));
}

// Render financial management section
function renderFinancialManagement() {
    const container = document.getElementById('financeContent');
    if (!container) return;

    container.innerHTML = `
        <div class="finance-sections">
            <!-- Loan Management Section -->
            <div class="finance-section">
                <h3 class="section-title">Bank Loans</h3>
                <div id="loanManagementContent"></div>
            </div>

            <!-- Equity Management Section -->
            <div class="finance-section">
                <h3 class="section-title">Equity & Shares</h3>
                <div id="equityContent"></div>
            </div>

            <!-- Placeholder for future sections -->
            <!--
            <div class="finance-section">
                <h3 class="section-title">Corporate Bonds</h3>
                <div id="bondsContent"></div>
            </div>
            -->
        </div>
    `;

    // Render management content
    renderLoanManagement();
    renderEquityManagement();
}

// Render loan management content
function renderLoanManagement() {
    const container = document.getElementById('loanManagementContent');
    if (!container) return;

    // Auto-accrue interest on all active loans if needed
    appState.loans
        .filter(loan => loan.status === 'active')
        .forEach(loan => {
            accrueInterestOnLoan(loan.id);
        });

    const creditInfo = calculateCreditworthiness();

    // Loans section
    const loansHtml = appState.loans
        .filter(loan => loan.status === 'active')
        .map(loan => {
            const monthsSinceAccrual = getMonthsBetweenDates(loan.lastInterestAccrualDate, getTodayDate());
            const suggestedPayment = calculateCurrentSuggestedPayment(loan);
            const totalBalance = loan.principalBalance + loan.accruedInterestBalance;
            return `
            <tr>
                <td>#${loan.id}</td>
                <td>${formatCurrency(loan.principal)}</td>
                <td>${loan.interestRate}%</td>
                <td>${loan.termMonths} mo.</td>
                <td>
                    <div class="balance-breakdown">
                        <div>Principal: ${formatCurrency(loan.principalBalance)}</div>
                        <div>Interest: ${formatCurrency(loan.accruedInterestBalance)}</div>
                        <div><strong>Total: ${formatCurrency(totalBalance)}</strong></div>
                    </div>
                </td>
                <td>${loan.lastInterestAccrualDate}</td>
                <td>${monthsSinceAccrual} mo.</td>
                <td>
                    <div class="payment-input-group">
                        <input type="number" id="paymentAmount_${loan.id}" min="0.01" step="0.01" placeholder="${formatCurrency(suggestedPayment)}" class="payment-input">
                        <button class="btn btn-sm" onclick="const amt = parseFloat(document.getElementById('paymentAmount_${loan.id}').value); if(amt && makeLoanPayment(${loan.id}, amt)) { render(); }">Pay</button>
                    </div>
                    <small class="suggested-payment">Suggested: ${formatCurrency(suggestedPayment)}</small>
                </td>
            </tr>
            `;
        }).join('') || '<tr><td colspan="8">No active loans</td></tr>';

    container.innerHTML = `
        <div class="loan-overview">
            <h4>Company Financial Health</h4>
            <div class="loan-stats">
                <div class="stat-card">
                    <div class="stat-label">Total Assets</div>
                    <div class="stat-value">${formatCurrency(creditInfo.totalAssets)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Liabilities</div>
                    <div class="stat-value">${formatCurrency(creditInfo.totalLiabilities)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Debt-to-Asset Ratio</div>
                    <div class="stat-value">${creditInfo.debtToAssetRatio}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Current Ratio</div>
                    <div class="stat-value">${creditInfo.currentRatio}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Cash Balance</div>
                    <div class="stat-value">${formatCurrency(creditInfo.cashBalance)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Credit Score</div>
                    <div class="stat-value">${creditInfo.creditScore}/100</div>
                </div>
            </div>
        </div>

        <div class="loan-formulas">
            <div class="formula-card">
                <h5>Maximum Loan Calculation</h5>
                <div class="formula-display">
                    <div class="formula-line">
                        <span class="formula-label">Formula:</span>
                        <code>(0.75 × Total Assets) - Total Liabilities</code>
                    </div>
                    <div class="formula-line">
                        <span class="formula-label">Calculation:</span>
                        <code>(0.75 × ${formatCurrency(creditInfo.totalAssets)}) - ${formatCurrency(creditInfo.totalLiabilities)}</code>
                    </div>
                    <div class="formula-line">
                        <span class="formula-label">Result:</span>
                        <strong>${formatCurrency(creditInfo.maxLoanAmount)}</strong>
                    </div>
                </div>
            </div>

            <div class="formula-card">
                <h5>Interest Rate Calculation</h5>
                <div class="formula-display">
                    <div class="formula-line">
                        <span class="formula-label">Formula:</span>
                        <code>3% + (Debt-to-Asset Ratio × 17%)</code>
                    </div>
                    <div class="formula-line">
                        <span class="formula-label">Calculation:</span>
                        <code>3% + (${creditInfo.debtToAssetRatio} × 17%)</code>
                    </div>
                    <div class="formula-line">
                        <span class="formula-label">Result:</span>
                        <strong>${creditInfo.interestRate}% APR</strong>
                    </div>
                </div>
                <p class="formula-note">Higher debt-to-asset ratio = higher risk = higher interest rate</p>
            </div>
        </div>

        <div class="loan-section">
            <h4>Apply for Bank Loan</h4>
            <div class="loan-application">
                <div class="form-row">
                    <div class="form-group">
                        <label for="loanAmount">Loan Amount (Max: ${formatCurrency(creditInfo.maxLoanAmount)}):</label>
                        <input type="number" id="loanAmount" min="1000" step="1000" placeholder="e.g., 10000">
                    </div>
                    <div class="form-group">
                        <label for="loanTerm">Term (months):</label>
                        <select id="loanTerm">
                            <option value="12">12 months</option>
                            <option value="24">24 months</option>
                            <option value="36">36 months</option>
                            <option value="60">60 months</option>
                            <option value="120">120 months (10 years)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary" onclick="if(applyForLoan(parseFloat(document.getElementById('loanAmount').value), parseInt(document.getElementById('loanTerm').value))) { render(); document.getElementById('loanAmount').value = ''; }">Apply for Loan</button>
                    </div>
                </div>
                <p class="help-text">Loans are approved based on your company's financial position. The interest rate of ${creditInfo.interestRate}% reflects your current debt-to-asset ratio of ${creditInfo.debtToAssetRatio}.</p>
            </div>

            <h4>Outstanding Loans</h4>
            <div class="loan-info-box">
                <strong>How Loan Interest Works:</strong>
                <p>Interest automatically accrues monthly and compounds on your total outstanding balance (principal + accrued interest). The principal and interest are tracked separately in different liability accounts. When you make a payment, it first pays down any accrued interest, then reduces the principal. The "Suggested" payment is dynamically calculated based on your current total balance and remaining time to pay off the loan by its maturity date.</p>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Principal</th>
                        <th>Rate (APR)</th>
                        <th>Term</th>
                        <th>Current Balance</th>
                        <th>Last Interest Accrual</th>
                        <th>Months Since</th>
                        <th>Payment Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${loansHtml}
                </tbody>
            </table>
        </div>
    `;
}

// Render equity management content
function renderEquityManagement() {
    const container = document.getElementById('equityContent');
    if (!container) return;

    const sharesSummary = getSharesSummary();

    // Share issuances table
    const sharesHtml = appState.shares
        .map(issuance => `
            <tr>
                <td>#${issuance.id}</td>
                <td>${issuance.numberOfShares}</td>
                <td>${formatCurrency(issuance.pricePerShare)}</td>
                <td>${formatCurrency(issuance.totalValue)}</td>
                <td>${issuance.holder}</td>
                <td>${issuance.issueDate}</td>
            </tr>
        `).join('') || '<tr><td colspan="6">No shares issued yet</td></tr>';

    container.innerHTML = `
        <div class="equity-overview">
            <h4>Company Equity Summary</h4>
            <div class="equity-stats">
                <div class="stat-card">
                    <div class="stat-label">Total Shares Outstanding</div>
                    <div class="stat-value">${sharesSummary.totalShares.toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Equity Value</div>
                    <div class="stat-value">${formatCurrency(sharesSummary.totalEquityValue)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Common Stock Balance</div>
                    <div class="stat-value">${formatCurrency(sharesSummary.commonStockBalance)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Average Price Per Share</div>
                    <div class="stat-value">${formatCurrency(sharesSummary.averagePricePerShare)}</div>
                </div>
            </div>
        </div>

        <div class="equity-section">
            <h4>Issue New Shares</h4>
            <div class="equity-issuance">
                <p class="help-text">Contribute capital to the company in exchange for shares of stock. The capital increases the company's cash and equity accounts.</p>
                <div class="form-row">
                    <div class="form-group">
                        <label for="shareQuantity">Number of Shares:</label>
                        <input type="number" id="shareQuantity" min="1" step="1" placeholder="e.g., 100">
                    </div>
                    <div class="form-group">
                        <label for="sharePrice">Price Per Share:</label>
                        <input type="number" id="sharePrice" min="0.01" step="0.01" placeholder="e.g., 10.00">
                    </div>
                    <div class="form-group">
                        <label for="shareHolder">Issue To:</label>
                        <select id="shareHolder">
                            <option value="Owner">Owner</option>
                            <option value="Public">Public</option>
                            <option value="Investor">Investor</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary" onclick="if(issueShares(parseInt(document.getElementById('shareQuantity').value), parseFloat(document.getElementById('sharePrice').value), document.getElementById('shareHolder').value)) { render(); document.getElementById('shareQuantity').value = ''; document.getElementById('sharePrice').value = ''; }">Issue Shares</button>
                    </div>
                </div>
                <div id="sharePreview" class="share-preview hidden">
                    <strong>Total Capital Raised:</strong> <span id="sharePreviewAmount">$0.00</span>
                </div>
            </div>

            <h4>Share Issuance History</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Shares</th>
                        <th>Price/Share</th>
                        <th>Total Value</th>
                        <th>Issued To</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${sharesHtml}
                </tbody>
            </table>
        </div>
    `;

    // Add event listeners for share preview
    const quantityInput = document.getElementById('shareQuantity');
    const priceInput = document.getElementById('sharePrice');
    const previewDiv = document.getElementById('sharePreview');
    const previewAmount = document.getElementById('sharePreviewAmount');

    const updatePreview = () => {
        const quantity = parseInt(quantityInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const total = quantity * price;

        if (quantity > 0 && price > 0) {
            previewDiv.classList.remove('hidden');
            previewAmount.textContent = formatCurrency(total);
        } else {
            previewDiv.classList.add('hidden');
        }
    };

    quantityInput.addEventListener('input', updatePreview);
    priceInput.addEventListener('input', updatePreview);
}

// ====================================
// CALCULATIONS
// ====================================

function calculateAccountBalances(asOfDate = null) {
    // Use GeneralLedger if available (new system), otherwise fall back to legacy calculation
    if (window.generalLedger) {
        return window.generalLedger.getBalances(asOfDate);
    }

    // Legacy calculation (for backward compatibility during migration)
    const balances = {};

    // Initialize with opening balances
    appState.accounts.forEach(account => {
        balances[account.id] = account.openingBalance;
    });

    // Filter transactions by date if specified
    const relevantTransactions = asOfDate
        ? appState.transactions.filter(t => compareDates(t.date || t.simDate, asOfDate) <= 0)
        : appState.transactions;

    // Apply transactions
    relevantTransactions.forEach(transaction => {
        if (transaction.entries) {
            // Multi-entry transaction
            transaction.entries.forEach(entry => {
                const account = appState.accounts.find(a => a.id === entry.account || a.id === entry.accountId);
                if (!account) return;

                const accountId = entry.account || entry.accountId;
                if (!balances[accountId]) balances[accountId] = 0;

                if (entry.type === 'debit') {
                    // Debit increases: Assets, Expenses
                    // Debit decreases: Liabilities, Equity, Revenue
                    if (account.type === 'Asset' || account.type === 'Expense') {
                        balances[accountId] += entry.amount;
                    } else {
                        balances[accountId] -= entry.amount;
                    }
                } else {
                    // Credit increases: Liabilities, Equity, Revenue
                    // Credit decreases: Assets, Expenses
                    if (account.type === 'Liability' || account.type === 'Equity' || account.type === 'Revenue') {
                        balances[accountId] += entry.amount;
                    } else {
                        balances[accountId] -= entry.amount;
                    }
                }
            });
        } else {
            // Simple transaction
            if (!balances[transaction.debitAccount]) balances[transaction.debitAccount] = 0;
            if (!balances[transaction.creditAccount]) balances[transaction.creditAccount] = 0;

            const debitAccount = appState.accounts.find(a => a.id === transaction.debitAccount);
            const creditAccount = appState.accounts.find(a => a.id === transaction.creditAccount);

            if (!debitAccount || !creditAccount) return;

            // Debit increases: Assets, Expenses
            // Debit decreases: Liabilities, Equity, Revenue
            if (debitAccount.type === 'Asset' || debitAccount.type === 'Expense') {
                balances[transaction.debitAccount] += transaction.amount;
            } else {
                balances[transaction.debitAccount] -= transaction.amount;
            }

            // Credit increases: Liabilities, Equity, Revenue
            // Credit decreases: Assets, Expenses
            if (creditAccount.type === 'Liability' || creditAccount.type === 'Equity' || creditAccount.type === 'Revenue') {
                balances[transaction.creditAccount] += transaction.amount;
            } else {
                balances[transaction.creditAccount] -= transaction.amount;
            }
        }
    });

    return balances;
}

function getAccountsByType(type, balances) {
    return appState.accounts
        .filter(a => a.type === type)
        .map(account => ({
            ...account,
            balance: balances[account.id] || 0
        }))
        .sort((a, b) => a.number.localeCompare(b.number));
}

// ====================================
// BALANCE SHEET
// ====================================

function renderBalanceSheet() {
    const asOfDate = document.getElementById('balanceSheetDate').value || getTodayDate();
    const balances = calculateAccountBalances(asOfDate);

    const assets = getAccountsByType('Asset', balances);
    const liabilities = getAccountsByType('Liability', balances);
    const equity = getAccountsByType('Equity', balances);

    const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
    const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0);

    // Calculate balance sheet validation
    const difference = Math.abs(totalAssets - (totalLiabilities + totalEquity));
    const balanced = difference < 0.01; // Allow 1 cent rounding error
    const balanceIndicator = balanced
        ? '<span style="color: #28a745; font-weight: bold;">✓ Balanced</span>'
        : `<span style="color: #dc3545; font-weight: bold;">✗ Out of Balance (${formatCurrency(difference)})</span>`;

    const content = document.getElementById('balanceSheetContent');
    content.innerHTML = `
        <div class="statement-section">
            <div class="statement-title">BALANCE SHEET</div>
            <div>As of ${formatDate(asOfDate)}</div>
            <div style="margin-top: 0.5rem; font-size: 0.9rem;">Status: ${balanceIndicator}</div>
        </div>

        <div class="statement-section">
            <div class="statement-category">ASSETS</div>
            ${assets.map(account => `
                <div class="statement-item">
                    <span>${escapeHtml(account.name)}</span>
                    <span>${formatCurrency(account.balance)}</span>
                </div>
            `).join('')}
            <div class="statement-subtotal">
                <span>Total Assets</span>
                <span>${formatCurrency(totalAssets)}</span>
            </div>
        </div>

        <div class="statement-section">
            <div class="statement-category">LIABILITIES</div>
            ${liabilities.map(account => `
                <div class="statement-item">
                    <span>${escapeHtml(account.name)}</span>
                    <span>${formatCurrency(account.balance)}</span>
                </div>
            `).join('')}
            <div class="statement-subtotal">
                <span>Total Liabilities</span>
                <span>${formatCurrency(totalLiabilities)}</span>
            </div>
        </div>

        <div class="statement-section">
            <div class="statement-category">EQUITY</div>
            ${equity.map(account => `
                <div class="statement-item">
                    <span>${escapeHtml(account.name)}</span>
                    <span>${formatCurrency(account.balance)}</span>
                </div>
            `).join('')}
            <div class="statement-subtotal">
                <span>Total Equity</span>
                <span>${formatCurrency(totalEquity)}</span>
            </div>
        </div>

        <div class="statement-total">
            <span>Total Liabilities & Equity</span>
            <span>${formatCurrency(totalLiabilities + totalEquity)}</span>
        </div>
    `;
}

// ====================================
// INCOME STATEMENT
// ====================================

function renderIncomeStatement() {
    const startDate = document.getElementById('incomeStartDate').value || getFirstDayOfMonth();
    const endDate = document.getElementById('incomeEndDate').value || getTodayDate();

    // Calculate balances at start and end of period
    const startBalances = calculateAccountBalances(getPreviousDay(startDate));
    const endBalances = calculateAccountBalances(endDate);

    // Calculate change in balances for revenue and expense accounts
    const revenues = appState.accounts
        .filter(a => a.type === 'Revenue')
        .map(account => ({
            ...account,
            balance: (endBalances[account.id] || 0) - (startBalances[account.id] || 0)
        }))
        .sort((a, b) => a.number.localeCompare(b.number));

    const expenses = appState.accounts
        .filter(a => a.type === 'Expense')
        .map(account => ({
            ...account,
            balance: (endBalances[account.id] || 0) - (startBalances[account.id] || 0)
        }))
        .sort((a, b) => a.number.localeCompare(b.number));

    const totalRevenue = revenues.reduce((sum, a) => sum + a.balance, 0);
    const totalExpenses = expenses.reduce((sum, a) => sum + a.balance, 0);
    const netIncome = totalRevenue - totalExpenses;

    const content = document.getElementById('incomeStatementContent');
    content.innerHTML = `
        <div class="statement-section">
            <div class="statement-title">INCOME STATEMENT</div>
            <div>For the period ${formatDate(startDate)} to ${formatDate(endDate)}</div>
        </div>

        <div class="statement-section">
            <div class="statement-category">REVENUE</div>
            ${revenues.map(account => `
                <div class="statement-item">
                    <span>${escapeHtml(account.name)}</span>
                    <span>${formatCurrency(account.balance)}</span>
                </div>
            `).join('')}
            <div class="statement-subtotal">
                <span>Total Revenue</span>
                <span>${formatCurrency(totalRevenue)}</span>
            </div>
        </div>

        <div class="statement-section">
            <div class="statement-category">EXPENSES</div>
            ${expenses.map(account => `
                <div class="statement-item">
                    <span>${escapeHtml(account.name)}</span>
                    <span>${formatCurrency(account.balance)}</span>
                </div>
            `).join('')}
            <div class="statement-subtotal">
                <span>Total Expenses</span>
                <span>${formatCurrency(totalExpenses)}</span>
            </div>
        </div>

        <div class="statement-total">
            <span>Net Income</span>
            <span>${formatCurrency(netIncome)}</span>
        </div>
    `;
}

// ====================================
// CASH FLOW STATEMENT
// ====================================

function renderCashFlowStatement() {
    const startDate = document.getElementById('cashFlowStartDate').value || getFirstDayOfMonth();
    const endDate = document.getElementById('cashFlowEndDate').value || getTodayDate();

    const startBalances = calculateAccountBalances(getPreviousDay(startDate));
    const endBalances = calculateAccountBalances(endDate);

    // Get cash account(s)
    const cashAccounts = appState.accounts.filter(a =>
        a.name.toLowerCase().includes('cash')
    );

    const cashStart = cashAccounts.reduce((sum, a) => sum + (startBalances[a.id] || 0), 0);
    const cashEnd = cashAccounts.reduce((sum, a) => sum + (endBalances[a.id] || 0), 0);
    const netCashChange = cashEnd - cashStart;

    // Calculate net income for the period
    const revenues = appState.accounts.filter(a => a.type === 'Revenue');
    const expenses = appState.accounts.filter(a => a.type === 'Expense');

    const totalRevenue = revenues.reduce((sum, a) =>
        sum + ((endBalances[a.id] || 0) - (startBalances[a.id] || 0)), 0
    );
    const totalExpenses = expenses.reduce((sum, a) =>
        sum + ((endBalances[a.id] || 0) - (startBalances[a.id] || 0)), 0
    );
    const netIncome = totalRevenue - totalExpenses;

    // Calculate changes in working capital (simplified)
    const arAccounts = appState.accounts.filter(a =>
        a.name.toLowerCase().includes('receivable')
    );
    const apAccounts = appState.accounts.filter(a =>
        a.name.toLowerCase().includes('payable')
    );
    const inventoryAccounts = appState.accounts.filter(a =>
        a.name.toLowerCase().includes('inventory')
    );

    const arChange = arAccounts.reduce((sum, a) =>
        sum + ((endBalances[a.id] || 0) - (startBalances[a.id] || 0)), 0
    );
    const apChange = apAccounts.reduce((sum, a) =>
        sum + ((endBalances[a.id] || 0) - (startBalances[a.id] || 0)), 0
    );
    const inventoryChange = inventoryAccounts.reduce((sum, a) =>
        sum + ((endBalances[a.id] || 0) - (startBalances[a.id] || 0)), 0
    );

    const operatingCash = netIncome - arChange + apChange - inventoryChange;

    // Get financing activities from transactions in the period
    const periodTransactions = appState.transactions.filter(t => {
        return isDateInRange(t.date, startDate, endDate);
    });

    // Categorize financing activities
    const loanProceeds = periodTransactions.filter(t =>
        t.description.includes('Bank loan received')
    );
    const loanPrincipalPayments = periodTransactions.filter(t =>
        t.description.includes('payment - Principal reduction')
    );
    const loanInterestPayments = periodTransactions.filter(t =>
        t.description.includes('payment - Interest paid')
    );
    const stockIssuances = periodTransactions.filter(t =>
        t.description.includes('Issued') && t.description.includes('shares')
    );

    const totalLoanProceeds = loanProceeds.reduce((sum, t) => sum + t.amount, 0);
    const totalLoanPrincipalPayments = loanPrincipalPayments.reduce((sum, t) => sum + t.amount, 0);
    const totalLoanInterestPayments = loanInterestPayments.reduce((sum, t) => sum + t.amount, 0);
    const totalStockIssuances = stockIssuances.reduce((sum, t) => sum + t.amount, 0);

    const netFinancingCash = totalLoanProceeds + totalStockIssuances - totalLoanPrincipalPayments - totalLoanInterestPayments;

    // Categorize investing activities
    const propertyPurchases = periodTransactions.filter(t =>
        t.description.includes('Purchase property at')
    );
    const buildingDemolitions = periodTransactions.filter(t =>
        t.description.includes('Demolished') && t.description.includes('Materials recovered')
    );

    const totalPropertyPurchases = propertyPurchases.reduce((sum, t) => sum + t.amount, 0);
    const totalBuildingDemolitions = buildingDemolitions.reduce((sum, t) => sum + t.amount, 0);

    const netInvestingCash = -totalPropertyPurchases + totalBuildingDemolitions;

    // Build investing activities HTML
    let investingActivitiesHtml = '';

    if (propertyPurchases.length > 0) {
        investingActivitiesHtml += `
            <div class="statement-item">
                <span>Property Purchases</span>
                <span>(${formatCurrency(totalPropertyPurchases)})</span>
            </div>`;
    }

    if (buildingDemolitions.length > 0) {
        investingActivitiesHtml += `
            <div class="statement-item">
                <span>Building Demolitions (Materials Recovered)</span>
                <span>${formatCurrency(totalBuildingDemolitions)}</span>
            </div>`;
    }

    if (investingActivitiesHtml === '') {
        investingActivitiesHtml = `
            <div class="statement-item">
                <span>No investing activities recorded</span>
                <span>${formatCurrency(0)}</span>
            </div>`;
    }

    // Build financing activities HTML
    let financingActivitiesHtml = '';

    if (loanProceeds.length > 0) {
        financingActivitiesHtml += `
            <div class="statement-item">
                <span>Loan Proceeds</span>
                <span>${formatCurrency(totalLoanProceeds)}</span>
            </div>`;
    }

    if (stockIssuances.length > 0) {
        financingActivitiesHtml += `
            <div class="statement-item">
                <span>Stock Issuances</span>
                <span>${formatCurrency(totalStockIssuances)}</span>
            </div>`;
    }

    if (loanPrincipalPayments.length > 0) {
        financingActivitiesHtml += `
            <div class="statement-item">
                <span>Loan Principal Payments</span>
                <span>(${formatCurrency(totalLoanPrincipalPayments)})</span>
            </div>`;
    }

    if (loanInterestPayments.length > 0) {
        financingActivitiesHtml += `
            <div class="statement-item">
                <span>Loan Interest Payments</span>
                <span>(${formatCurrency(totalLoanInterestPayments)})</span>
            </div>`;
    }

    if (financingActivitiesHtml === '') {
        financingActivitiesHtml = `
            <div class="statement-item">
                <span>No financing activities recorded</span>
                <span>${formatCurrency(0)}</span>
            </div>`;
    }

    const content = document.getElementById('cashFlowContent');
    content.innerHTML = `
        <div class="statement-section">
            <div class="statement-title">CASH FLOW STATEMENT</div>
            <div>For the period ${formatDate(startDate)} to ${formatDate(endDate)}</div>
        </div>

        <div class="statement-section">
            <div class="statement-category">OPERATING ACTIVITIES</div>
            <div class="statement-item">
                <span>Net Income</span>
                <span>${formatCurrency(netIncome)}</span>
            </div>
            <div class="statement-item">
                <span>Changes in Accounts Receivable</span>
                <span>${formatCurrency(-arChange)}</span>
            </div>
            <div class="statement-item">
                <span>Changes in Inventory</span>
                <span>${formatCurrency(-inventoryChange)}</span>
            </div>
            <div class="statement-item">
                <span>Changes in Accounts Payable</span>
                <span>${formatCurrency(apChange)}</span>
            </div>
            <div class="statement-subtotal">
                <span>Net Cash from Operating Activities</span>
                <span>${formatCurrency(operatingCash)}</span>
            </div>
        </div>

        <div class="statement-section">
            <div class="statement-category">INVESTING ACTIVITIES</div>
            ${investingActivitiesHtml}
            <div class="statement-subtotal">
                <span>Net Cash from Investing Activities</span>
                <span>${formatCurrency(netInvestingCash)}</span>
            </div>
        </div>

        <div class="statement-section">
            <div class="statement-category">FINANCING ACTIVITIES</div>
            ${financingActivitiesHtml}
            <div class="statement-subtotal">
                <span>Net Cash from Financing Activities</span>
                <span>${formatCurrency(netFinancingCash)}</span>
            </div>
        </div>

        <div class="statement-total">
            <span>Net Change in Cash</span>
            <span>${formatCurrency(netCashChange)}</span>
        </div>

        <div class="statement-section" style="margin-top: 1rem;">
            <div class="statement-item">
                <span>Cash at Beginning of Period</span>
                <span>${formatCurrency(cashStart)}</span>
            </div>
            <div class="statement-item">
                <span>Cash at End of Period</span>
                <span>${formatCurrency(cashEnd)}</span>
            </div>
        </div>
    `;
}

// ====================================
// UTILITY FUNCTIONS
// ====================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// ====================================
// SIMULATION TIME SYSTEM
// ====================================
// Custom calendar: Years × 12 months × 28 days × 24 hours
// Time progresses at 60x speed (1 real second = 1 simulation minute)

const SIMULATION_CONFIG = {
    DAYS_PER_MONTH: 28,
    MONTHS_PER_YEAR: 12,
    HOURS_PER_DAY: 24,
    MINUTES_PER_HOUR: 60,
    SECONDS_PER_MINUTE: 60,
    MS_PER_SECOND: 1000,
    TIME_SCALE: 60  // 1 real second = 60 simulation seconds (1 simulation minute)
};

// Calculate derived constants
SIMULATION_CONFIG.SECONDS_PER_MINUTE = 60;
SIMULATION_CONFIG.SECONDS_PER_HOUR = SIMULATION_CONFIG.SECONDS_PER_MINUTE * SIMULATION_CONFIG.MINUTES_PER_HOUR;
SIMULATION_CONFIG.SECONDS_PER_DAY = SIMULATION_CONFIG.SECONDS_PER_HOUR * SIMULATION_CONFIG.HOURS_PER_DAY;
SIMULATION_CONFIG.SECONDS_PER_MONTH = SIMULATION_CONFIG.SECONDS_PER_DAY * SIMULATION_CONFIG.DAYS_PER_MONTH;
SIMULATION_CONFIG.SECONDS_PER_YEAR = SIMULATION_CONFIG.SECONDS_PER_MONTH * SIMULATION_CONFIG.MONTHS_PER_YEAR;
SIMULATION_CONFIG.MS_PER_DAY = SIMULATION_CONFIG.SECONDS_PER_DAY * SIMULATION_CONFIG.MS_PER_SECOND;
SIMULATION_CONFIG.MS_PER_MONTH = SIMULATION_CONFIG.SECONDS_PER_MONTH * SIMULATION_CONFIG.MS_PER_SECOND;
SIMULATION_CONFIG.MS_PER_YEAR = SIMULATION_CONFIG.SECONDS_PER_YEAR * SIMULATION_CONFIG.MS_PER_SECOND;

let simulationClockInterval = null;

// Convert milliseconds to custom calendar time
function msToCalendarTime(ms) {
    let remainingSeconds = Math.floor(ms / SIMULATION_CONFIG.MS_PER_SECOND);

    const years = Math.floor(remainingSeconds / SIMULATION_CONFIG.SECONDS_PER_YEAR);
    remainingSeconds -= years * SIMULATION_CONFIG.SECONDS_PER_YEAR;

    const months = Math.floor(remainingSeconds / SIMULATION_CONFIG.SECONDS_PER_MONTH);
    remainingSeconds -= months * SIMULATION_CONFIG.SECONDS_PER_MONTH;

    const days = Math.floor(remainingSeconds / SIMULATION_CONFIG.SECONDS_PER_DAY);
    remainingSeconds -= days * SIMULATION_CONFIG.SECONDS_PER_DAY;

    const hours = Math.floor(remainingSeconds / SIMULATION_CONFIG.SECONDS_PER_HOUR);
    remainingSeconds -= hours * SIMULATION_CONFIG.SECONDS_PER_HOUR;

    const minutes = Math.floor(remainingSeconds / SIMULATION_CONFIG.SECONDS_PER_MINUTE);
    remainingSeconds -= minutes * SIMULATION_CONFIG.SECONDS_PER_MINUTE;

    const seconds = remainingSeconds;

    return {
        year: years + 1,   // Year 1+
        month: months + 1, // Month 1-12
        day: days + 1,     // Day 1-28
        hour: hours,       // Hour 0-23
        minute: minutes,   // Minute 0-59
        second: seconds    // Second 0-59
    };
}

// Convert custom calendar time to milliseconds
function calendarTimeToMs(year, month, day, hour, minute, second) {
    const yearMs = (year - 1) * SIMULATION_CONFIG.MS_PER_YEAR;
    const monthMs = (month - 1) * SIMULATION_CONFIG.MS_PER_MONTH;
    const dayMs = (day - 1) * SIMULATION_CONFIG.MS_PER_DAY;
    const hourMs = hour * SIMULATION_CONFIG.SECONDS_PER_HOUR * SIMULATION_CONFIG.MS_PER_SECOND;
    const minuteMs = minute * SIMULATION_CONFIG.SECONDS_PER_MINUTE * SIMULATION_CONFIG.MS_PER_SECOND;
    const secondMs = second * SIMULATION_CONFIG.MS_PER_SECOND;

    return yearMs + monthMs + dayMs + hourMs + minuteMs + secondMs;
}

// Get current simulation time
function getCurrentSimulationTime() {
    if (appState.simulation.paused) {
        return appState.simulation.simulationTime;
    }

    const realTimeElapsed = Date.now() - appState.simulation.lastSaveRealTime;
    const simulationTimeElapsed = realTimeElapsed * SIMULATION_CONFIG.TIME_SCALE;
    return appState.simulation.simulationTime + simulationTimeElapsed;
}

// Format simulation time as string
function formatSimulationTime(ms) {
    const time = msToCalendarTime(ms);
    const hourStr = String(time.hour).padStart(2, '0');
    const minuteStr = String(time.minute).padStart(2, '0');
    const secondStr = String(time.second).padStart(2, '0');
    return `Year ${time.year}, Month ${time.month}, Day ${time.day} - ${hourStr}:${minuteStr}:${secondStr}`;
}

// Format simulation time for short display
function formatSimulationTimeShort(ms) {
    const time = msToCalendarTime(ms);
    const hourStr = String(time.hour).padStart(2, '0');
    const minuteStr = String(time.minute).padStart(2, '0');
    const secondStr = String(time.second).padStart(2, '0');
    return `Y${time.year} M${time.month} D${time.day} ${hourStr}:${minuteStr}:${secondStr}`;
}

// Get current simulation time as formatted string
function getTodayDate() {
    const ms = getCurrentSimulationTime();
    const time = msToCalendarTime(ms);
    return `Y${time.year}-M${time.month}-D${time.day}`;
}

// Format date string for display
function formatDate(dateString) {
    // Handle both old ISO dates and new simulation dates
    if (dateString.includes('-')) {
        if (dateString.startsWith('Y')) {
            // New format: Y1-M1-D15
            const parts = dateString.match(/Y(\d+)-M(\d+)-D(\d+)/);
            if (parts) {
                return `Year ${parts[1]}, Month ${parts[2]}, Day ${parts[3]}`;
            }
        } else if (dateString.startsWith('M')) {
            // Old format without year: M1-D15
            const parts = dateString.match(/M(\d+)-D(\d+)/);
            if (parts) {
                return `Year 1, Month ${parts[1]}, Day ${parts[2]}`;
            }
        } else {
            // Old format: YYYY-MM-DD
            const date = new Date(dateString + 'T00:00:00');
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }
    return dateString;
}

// Get first day of current month
function getFirstDayOfMonth() {
    const ms = getCurrentSimulationTime();
    const time = msToCalendarTime(ms);
    return `Y${time.year}-M${time.month}-D1`;
}

// Get previous day
function getPreviousDay(dateString) {
    if (dateString.startsWith('Y')) {
        const parts = dateString.match(/Y(\d+)-M(\d+)-D(\d+)/);
        if (parts) {
            let year = parseInt(parts[1]);
            let month = parseInt(parts[2]);
            let day = parseInt(parts[3]);

            day--;
            if (day < 1) {
                month--;
                if (month < 1) {
                    year--;
                    if (year < 1) {
                        // Can't go before Y1-M1-D1, so return Y1-M0-D0
                        // This sentinel value is before any real date
                        return 'Y1-M0-D0';
                    }
                    month = SIMULATION_CONFIG.MONTHS_PER_YEAR;
                }
                day = SIMULATION_CONFIG.DAYS_PER_MONTH;
            }

            return `Y${year}-M${month}-D${day}`;
        }
    } else if (dateString.startsWith('M')) {
        // Old format without year: M1-D15 (assume Year 1)
        const parts = dateString.match(/M(\d+)-D(\d+)/);
        if (parts) {
            let year = 1;
            let month = parseInt(parts[1]);
            let day = parseInt(parts[2]);

            day--;
            if (day < 1) {
                month--;
                if (month < 1) {
                    month = SIMULATION_CONFIG.MONTHS_PER_YEAR;
                }
                day = SIMULATION_CONFIG.DAYS_PER_MONTH;
            }

            return `Y${year}-M${month}-D${day}`;
        }
    }
    // Fallback for old format
    const date = new Date(dateString + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
}

// Check if a date is within a range (inclusive)
function isDateInRange(dateString, startDate, endDate) {
    // Parse dates in Y#-M#-D# format
    const parseSimDate = (ds) => {
        const parts = ds.match(/Y(\d+)-M(\d+)-D(\d+)/);
        if (!parts) return null;
        return {
            year: parseInt(parts[1]),
            month: parseInt(parts[2]),
            day: parseInt(parts[3])
        };
    };

    const date = parseSimDate(dateString);
    const start = parseSimDate(startDate);
    const end = parseSimDate(endDate);

    if (!date || !start || !end) return false;

    // Compare years first
    if (date.year < start.year || date.year > end.year) return false;
    if (date.year > start.year && date.year < end.year) return true;

    // Same year as start or end - need to compare months/days
    if (date.year === start.year && date.year === end.year) {
        // All in same year
        if (date.month < start.month || date.month > end.month) return false;
        if (date.month > start.month && date.month < end.month) return true;

        // Need to check days
        if (date.month === start.month && date.month === end.month) {
            return date.day >= start.day && date.day <= end.day;
        }
        if (date.month === start.month) {
            return date.day >= start.day;
        }
        if (date.month === end.month) {
            return date.day <= end.day;
        }
    } else if (date.year === start.year) {
        // Date is in start year
        if (date.month < start.month) return false;
        if (date.month > start.month) return true;
        return date.day >= start.day;
    } else if (date.year === end.year) {
        // Date is in end year
        if (date.month > end.month) return false;
        if (date.month < end.month) return true;
        return date.day <= end.day;
    }

    return true;
}

// Compare two simulation dates (-1 if date1 < date2, 0 if equal, 1 if date1 > date2)
function compareDates(date1, date2) {
    const parseSimDate = (ds) => {
        const parts = ds.match(/Y(\d+)-M(\d+)-D(\d+)/);
        if (!parts) return null;
        return {
            year: parseInt(parts[1]),
            month: parseInt(parts[2]),
            day: parseInt(parts[3])
        };
    };

    const d1 = parseSimDate(date1);
    const d2 = parseSimDate(date2);

    if (!d1 || !d2) return 0;

    // Compare years
    if (d1.year < d2.year) return -1;
    if (d1.year > d2.year) return 1;

    // Same year, compare months
    if (d1.month < d2.month) return -1;
    if (d1.month > d2.month) return 1;

    // Same month, compare days
    if (d1.day < d2.day) return -1;
    if (d1.day > d2.day) return 1;

    return 0;
}

// Update simulation clock (called every second)
function updateSimulationClock() {
    const clockElement = document.getElementById('simulationClock');
    if (clockElement) {
        const currentTime = getCurrentSimulationTime();
        clockElement.textContent = formatSimulationTime(currentTime);

        // Update pause/resume button text
        const pauseBtn = document.getElementById('pauseTimeBtn');
        if (pauseBtn) {
            pauseBtn.textContent = appState.simulation.paused ? '▶ Resume Time' : '⏸ Pause Time';
        }

        // Check construction progress
        checkConstructionProgress();

        // Check production progress
        checkProductionProgress();

        // Process wage payments
        processWagePayments();
    }
}

// Start the simulation clock
function startSimulationClock() {
    if (simulationClockInterval) {
        clearInterval(simulationClockInterval);
    }
    simulationClockInterval = setInterval(updateSimulationClock, 100); // Update 10 times per second for smooth display
    updateSimulationClock(); // Initial update
}

// Stop the simulation clock
function stopSimulationClock() {
    if (simulationClockInterval) {
        clearInterval(simulationClockInterval);
        simulationClockInterval = null;
    }
}

// Pause/Resume time progression
function togglePauseTime() {
    if (appState.simulation.paused) {
        // Resuming - update lastSaveRealTime to now
        appState.simulation.lastSaveRealTime = Date.now();
        appState.simulation.paused = false;
    } else {
        // Pausing - update simulationTime to current value
        appState.simulation.simulationTime = getCurrentSimulationTime();
        appState.simulation.paused = true;
    }
    hasUnsavedChanges = true;
    updateSimulationClock();
}

// Reset time to Year 1, Month 1, Day 1
function resetTime() {
    if (confirm('Reset time to Year 1, Month 1, Day 1, 00:00:00?')) {
        appState.simulation.simulationTime = 0;
        appState.simulation.lastSaveRealTime = Date.now();
        appState.simulation.startRealTime = Date.now();
        hasUnsavedChanges = true;
        updateSimulationClock();
        render();
    }
}

// Adjust time by a specific number of milliseconds (positive = forward, negative = backward)
function adjustTime(milliseconds) {
    // Get current simulation time
    const currentTime = getCurrentSimulationTime();

    // Calculate new time
    let newTime = currentTime + milliseconds;

    // Prevent going before Year 1
    if (newTime < 0) {
        newTime = 0;
        alert('Cannot go before Year 1, Month 1, Day 1, 00:00:00');
    }

    // Update simulation time
    appState.simulation.simulationTime = newTime;
    appState.simulation.lastSaveRealTime = Date.now();
    hasUnsavedChanges = true;

    // Update display
    updateSimulationClock();
    render();
}

// Set specific time (admin mode)
function setSimulationTime() {
    const year = parseInt(document.getElementById('setYear').value);
    const month = parseInt(document.getElementById('setMonth').value);
    const day = parseInt(document.getElementById('setDay').value);
    const hour = parseInt(document.getElementById('setHour').value);
    const minute = parseInt(document.getElementById('setMinute').value);
    const second = parseInt(document.getElementById('setSecond').value);

    // Validate inputs
    if (isNaN(year) || year < 1) {
        alert('Year must be 1 or greater');
        return;
    }
    if (isNaN(month) || month < 1 || month > 12) {
        alert('Month must be between 1 and 12');
        return;
    }
    if (isNaN(day) || day < 1 || day > 28) {
        alert('Day must be between 1 and 28');
        return;
    }
    if (isNaN(hour) || hour < 0 || hour > 23) {
        alert('Hour must be between 0 and 23');
        return;
    }
    if (isNaN(minute) || minute < 0 || minute > 59) {
        alert('Minute must be between 0 and 59');
        return;
    }
    if (isNaN(second) || second < 0 || second > 59) {
        alert('Second must be between 0 and 59');
        return;
    }

    const newTime = calendarTimeToMs(year, month, day, hour, minute, second);
    appState.simulation.simulationTime = newTime;
    appState.simulation.lastSaveRealTime = Date.now();
    hasUnsavedChanges = true;
    updateSimulationClock();
    render();

    showStatus('timeControlStatus', 'Time updated successfully!', 'success');
}

// Populate time control inputs with current time
function populateTimeControlInputs() {
    const currentTime = getCurrentSimulationTime();
    const time = msToCalendarTime(currentTime);

    document.getElementById('setYear').value = time.year;
    document.getElementById('setMonth').value = time.month;
    document.getElementById('setDay').value = time.day;
    document.getElementById('setHour').value = time.hour;
    document.getElementById('setMinute').value = time.minute;
    document.getElementById('setSecond').value = time.second;
}

function setDefaultTransactionDate() {
    document.getElementById('transactionDate').value = getTodayDate();
}

function setDefaultStatementDates() {
    document.getElementById('balanceSheetDate').value = getTodayDate();
    document.getElementById('incomeStartDate').value = getFirstDayOfMonth();
    document.getElementById('incomeEndDate').value = getTodayDate();
    document.getElementById('cashFlowStartDate').value = getFirstDayOfMonth();
    document.getElementById('cashFlowEndDate').value = getTodayDate();
}

// Update end dates for financial statements to current date (preserves user's start dates)
function updateStatementEndDates() {
    const currentDate = getTodayDate();

    // Update balance sheet date (always current date)
    document.getElementById('balanceSheetDate').value = currentDate;

    // Update end dates only (preserve user's start date inputs)
    document.getElementById('incomeEndDate').value = currentDate;
    document.getElementById('cashFlowEndDate').value = currentDate;

    // If start dates are empty, set them to first day of current month
    if (!document.getElementById('incomeStartDate').value) {
        document.getElementById('incomeStartDate').value = getFirstDayOfMonth();
    }
    if (!document.getElementById('cashFlowStartDate').value) {
        document.getElementById('cashFlowStartDate').value = getFirstDayOfMonth();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ====================================
// MAIN RENDER FUNCTION
// ====================================

function render() {
    renderAccounts();
    renderTransactions();
    renderTransactionTypes();

    // Only render financial statements if their tabs are active
    const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
    if (activeTab === 'balance-sheet') {
        renderBalanceSheet();
    } else if (activeTab === 'income-statement') {
        renderIncomeStatement();
    } else if (activeTab === 'cash-flow') {
        renderCashFlowStatement();
    } else if (activeTab === 'commodities') {
        renderCommoditiesMarket();
    } else if (activeTab === 'map') {
        renderMap();
    } else if (activeTab === 'finance') {
        renderFinancialManagement();
    }
}

// ====================================
// EVENT LISTENERS AND INITIALIZATION
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    // Set up tab navigation
    setupTabNavigation();

    // Session key controls
    document.getElementById('copyKeyBtn').addEventListener('click', copySessionKey);
    document.getElementById('restoreKeyBtn').addEventListener('click', restoreSessionKey);

    // Account form
    document.getElementById('addAccountBtn').addEventListener('click', () => showAccountForm());
    document.getElementById('accountForm').addEventListener('submit', saveAccount);
    document.getElementById('cancelAccountBtn').addEventListener('click', hideAccountForm);

    // Transaction type form
    document.getElementById('addTransactionTypeBtn').addEventListener('click', () => showTransactionTypeForm());
    document.getElementById('transactionTypeForm').addEventListener('submit', saveTransactionType);
    document.getElementById('cancelTransactionTypeBtn').addEventListener('click', hideTransactionTypeForm);
    document.getElementById('addEntryBtn').addEventListener('click', () => addTypeEntryRow());

    // Transaction form
    document.getElementById('transactionForm').addEventListener('submit', saveTransaction);
    document.getElementById('cancelTransactionBtn').addEventListener('click', cancelTransactionEdit);
    document.getElementById('transactionType').addEventListener('change', onTransactionTypeChange);

    // Transaction filters
    document.getElementById('filterStartDate').addEventListener('change', renderTransactions);
    document.getElementById('filterEndDate').addEventListener('change', renderTransactions);
    document.getElementById('filterAccount').addEventListener('change', renderTransactions);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);

    // Financial statement date controls
    document.getElementById('balanceSheetDate').addEventListener('change', renderBalanceSheet);
    document.getElementById('incomeStartDate').addEventListener('change', renderIncomeStatement);
    document.getElementById('incomeEndDate').addEventListener('change', renderIncomeStatement);
    document.getElementById('cashFlowStartDate').addEventListener('change', renderCashFlowStatement);
    document.getElementById('cashFlowEndDate').addEventListener('change', renderCashFlowStatement);

    // Set default dates
    setDefaultTransactionDate();
    setDefaultStatementDates();

    // Track changes for unsaved work warning
    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Initialize financial system (TransactionManager and GeneralLedger)
    initializeFinancialSystem();

    // Initial render
    render();

    // Update admin mode UI
    updateAdminModeUI();

    // Start the simulation clock
    startSimulationClock();
});

// ====================================
// COMMODITIES SYSTEM DOCUMENTATION
// ====================================

/*
 * ADDING NEW COMMODITIES
 *
 * To add a new commodity to the trading system:
 *
 * 1. Add the commodity to appState.commodities array:
 *    - Each commodity needs: id, name, description, price
 *    - Use appState.nextCommodityId for the ID and increment it
 *
 *    Example:
 *    appState.commodities.push({
 *        id: appState.nextCommodityId++,
 *        name: 'Gold',
 *        description: 'Precious metal commodity',
 *        price: 100.00
 *    });
 *
 * 2. The system will automatically:
 *    - Display the new commodity in the trading interface
 *    - Track purchases using FIFO cost basis in the portfolio
 *    - Record all transactions using the general Inventory account (1200)
 *    - Calculate gains/losses on sales
 *    - Show the commodity in portfolio view
 *    - Include it in trade history
 *
 * Note: All commodities use the same general Inventory account for bookkeeping.
 * The portfolio tracking system maintains separate FIFO lots for each commodity
 * to properly track cost basis and calculate gains/losses.
 *
 * ACCOUNTING ENTRIES
 *
 * Purchase Transaction:
 *   DR: Inventory (1200) - Asset increases
 *   CR: Cash (1000) - Asset decreases
 *
 * Sale Transaction (with gain):
 *   DR: Cash (1000) - Asset increases (proceeds)
 *   CR: Inventory (1200) - Asset decreases (cost basis)
 *   CR: Gains on Commodity Sales (4200) - Revenue increases (gain amount)
 *
 * Sale Transaction (with loss):
 *   DR: Cash (1000) - Asset increases (proceeds)
 *   DR: Losses on Commodity Sales (5500) - Expense increases (loss amount)
 *   CR: Inventory (1200) - Asset decreases (cost basis)
 *
 * COST BASIS TRACKING
 *
 * The system uses FIFO (First In, First Out) for cost basis tracking:
 * - Each purchase creates a new "lot" with quantity, cost basis, and purchase date
 * - When selling, the oldest lots are sold first
 * - Gains/losses are calculated as: Sale Proceeds - Cost Basis of sold units
 * - Portfolio tracking is separate from the general ledger Inventory account
 *
 * MODIFYING COMMODITY PRICES
 *
 * To change a commodity's price:
 *
 * 1. Find the commodity in appState.commodities
 * 2. Update its buyPrice and/or sellPrice properties
 * 3. Call render() to update the UI
 *
 * Example:
 * const commodity = appState.commodities.find(c => c.name === 'Power');
 * commodity.buyPrice = 4.50;
 * commodity.sellPrice = 5.50;
 * render();
 *
 * Note: Price changes only affect future trades. Existing portfolio lots
 * retain their original cost basis for accurate gain/loss calculations.
 */
