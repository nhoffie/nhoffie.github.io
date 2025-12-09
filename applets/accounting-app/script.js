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
        { id: 1, name: 'Power', description: 'Electrical energy units', price: 5.00 },
        { id: 2, name: 'Water', description: 'Fresh water units', price: 2.50 },
        { id: 3, name: 'Lumber', description: 'Construction-grade lumber', price: 10.00 },
        { id: 4, name: 'Steel', description: 'Structural steel beams', price: 20.00 },
        { id: 5, name: 'Concrete', description: 'Ready-mix concrete', price: 15.00 }
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
    nextAccountId: 23,
    nextTransactionId: 1,
    nextTransactionTypeId: 11,
    nextCommodityId: 6,
    nextTradeId: 1,
    nextLoanId: 1,
    nextShareIssuanceId: 1,
    nextBuildingId: 1
};

let hasUnsavedChanges = false;

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

        hasUnsavedChanges = false;
        keyInput.value = '';
        showStatus('restoreStatus', 'Data restored successfully!', 'success');

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
                renderBalanceSheet();
            } else if (targetTab === 'income-statement') {
                renderIncomeStatement();
            } else if (targetTab === 'cash-flow') {
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
        // Edit existing transaction
        const transaction = appState.transactions.find(t => t.id === parseInt(transactionId));
        if (transaction) {
            Object.assign(transaction, transactionData);
        }
    } else {
        // Add new transaction
        appState.transactions.push({
            id: appState.nextTransactionId++,
            ...transactionData
        });
    }

    hasUnsavedChanges = true;
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

    const totalCost = quantity * commodity.price;
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

    // Create transaction: Debit Inventory, Credit Cash
    const transaction = {
        id: appState.nextTransactionId++,
        date: getTodayDate(),
        description: `Purchase ${quantity} units of ${commodity.name} @ ${formatCurrency(commodity.price)}/unit`,
        debitAccount: inventoryAccount.id,
        creditAccount: cashAccount.id,
        amount: totalCost
    };

    appState.transactions.push(transaction);

    // Add to portfolio using FIFO (create new lot)
    const portfolio = getPortfolioCommodity(commodityId);
    portfolio.lots.push({
        quantity: quantity,
        costBasis: commodity.price,
        purchaseDate: getTodayDate(),
        purchaseId: appState.nextTradeId
    });

    // Record trade
    appState.trades.push({
        id: appState.nextTradeId++,
        type: 'buy',
        commodityId: commodityId,
        quantity: quantity,
        price: commodity.price,
        totalValue: totalCost,
        date: getTodayDate(),
        transactionId: transaction.id
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
    const totalProceeds = quantity * commodity.price;

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

    // Create multi-entry transaction
    const entries = [
        // Debit Cash for proceeds
        { account: cashAccount.id, type: 'debit', amount: totalProceeds },
        // Credit Inventory for cost basis
        { account: inventoryAccount.id, type: 'credit', amount: totalCostBasis }
    ];

    // Add gain or loss entry
    if (Math.abs(gainLoss) > 0.01) {
        if (isGain) {
            // Credit Gains
            entries.push({ account: gainsAccount.id, type: 'credit', amount: Math.abs(gainLoss) });
        } else {
            // Debit Losses
            entries.push({ account: lossesAccount.id, type: 'debit', amount: Math.abs(gainLoss) });
        }
    }

    const transaction = {
        id: appState.nextTransactionId++,
        date: getTodayDate(),
        description: `Sale ${quantity} units of ${commodity.name} @ ${formatCurrency(commodity.price)}/unit (${isGain ? 'Gain' : 'Loss'}: ${formatCurrency(Math.abs(gainLoss))})`,
        entries: entries
    };

    appState.transactions.push(transaction);

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
        price: commodity.price,
        totalValue: totalProceeds,
        costBasis: totalCostBasis,
        gainLoss: gainLoss,
        date: getTodayDate(),
        transactionId: transaction.id
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
            const currentValue = quantity * commodity.price;
            const totalCost = quantity * avgCost;
            const unrealizedGainLoss = currentValue - totalCost;
            const percentGainLoss = totalCost > 0 ? (unrealizedGainLoss / totalCost) * 100 : 0;

            summary.push({
                commodity: commodity,
                quantity: quantity,
                avgCost: avgCost,
                currentPrice: commodity.price,
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
        selectorHtml += `<option value="${commodity.id}" ${commodity.id === selectedCommodityId ? 'selected' : ''}>${commodity.name} - ${formatCurrency(commodity.price)}/unit</option>`;
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
                <div class="commodity-price">${formatCurrency(commodity.price)}<span class="price-unit">/unit</span></div>
            </div>
            <p class="commodity-description">${escapeHtml(commodity.description)}</p>
            <div class="commodity-inventory">In Portfolio: <strong>${quantity} units</strong></div>

            <div class="commodity-actions">
                <div class="trade-section">
                    <h5>Buy</h5>
                    <div class="trade-controls">
                        <input type="number" id="buy-quantity-${commodity.id}" min="1" step="1" value="1" class="quantity-input">
                        <div class="trade-total" id="buy-total-${commodity.id}">${formatCurrency(commodity.price)}</div>
                        <button class="btn btn-primary" onclick="executeBuy(${commodity.id})">Buy</button>
                    </div>
                </div>

                <div class="trade-section">
                    <h5>Sell</h5>
                    <div class="trade-controls">
                        <input type="number" id="sell-quantity-${commodity.id}" min="1" step="1" value="1" max="${quantity}" class="quantity-input" ${quantity === 0 ? 'disabled' : ''}>
                        <div class="trade-total" id="sell-total-${commodity.id}">${formatCurrency(commodity.price)}</div>
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
            buyTotal.textContent = formatCurrency(quantity * commodity.price);
        });
    }

    if (sellInput) {
        sellInput.addEventListener('input', () => {
            const quantity = parseFloat(sellInput.value) || 0;
            sellTotal.textContent = formatCurrency(quantity * commodity.price);
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

    // Create transaction: Debit Real Estate, Credit Cash
    const transaction = {
        id: appState.nextTransactionId++,
        date: getTodayDate(),
        description: `Purchase property at (${x}, ${y}) for ${formatCurrency(price)}`,
        debitAccount: realEstateAccount.id,
        creditAccount: cashAccount.id,
        amount: price
    };

    appState.transactions.push(transaction);

    // Add to owned squares
    appState.map.ownedSquares.push({
        x: x,
        y: y,
        purchaseDate: getTodayDate(),
        purchasePrice: price,
        transactionId: transaction.id
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

    // Update stats
    const statsHtml = `
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

    let content = `<h3>🏢 Warehouse Interior</h3>`;
    content += `<div class="interior-grid" style="display: grid; grid-template-columns: repeat(${gridSize}, 60px); gap: 5px;">`;

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const item = building.interior.grid[y][x];
            const cellContent = item || '';
            content += `<div class="interior-cell" style="width: 60px; height: 60px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center;">${cellContent}</div>`;
        }
    }

    content += `</div>`;
    content += `<p class="help-text">Interior management coming soon. Equipment placement will be available in a future update.</p>`;
    content += `<button class="btn" onclick="closeBuildingDialog()">Close</button>`;

    const dialog = document.createElement('div');
    dialog.id = 'interiorDialog';
    dialog.className = 'modal-overlay';
    dialog.innerHTML = `<div class="modal-content">${content}</div>`;
    document.body.appendChild(dialog);
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

    // Record transaction: Debit Cash, Credit Bank Loans Payable
    const transaction = {
        id: appState.nextTransactionId++,
        date: issueDate,
        description: `Bank loan received - ${termMonths} months @ ${creditInfo.interestRate}% APR`,
        debitAccount: cashAccount.id,
        creditAccount: loansPayableAccount.id,
        amount: principal
    };

    appState.transactions.push(transaction);
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

        // Record transaction: Debit Interest Expense, Credit Bank Loans Payable - Interest
        const transaction = {
            id: appState.nextTransactionId++,
            date: accrualDate,
            description: `Loan #${loanId} - Interest accrued for month`,
            debitAccount: interestExpenseAccount.id,
            creditAccount: loansInterestAccount.id,
            amount: parseFloat(interestAmount.toFixed(2))
        };

        appState.transactions.push(transaction);

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

        // Record transaction: Debit Bank Loans Payable - Interest, Credit Cash
        const interestTransaction = {
            id: appState.nextTransactionId++,
            date: paymentDate,
            description: `Loan #${loanId} payment - Interest paid`,
            debitAccount: loansInterestAccount.id,
            creditAccount: cashAccount.id,
            amount: parseFloat(interestPayment.toFixed(2))
        };

        appState.transactions.push(interestTransaction);
        loan.accruedInterestBalance -= interestPayment;
        remainingPayment -= interestPayment;
    }

    // Then, pay down principal
    if (loan.principalBalance > 0 && remainingPayment > 0) {
        const principalPayment = Math.min(remainingPayment, loan.principalBalance);

        // Record transaction: Debit Bank Loans Payable - Principal, Credit Cash
        const principalTransaction = {
            id: appState.nextTransactionId++,
            date: paymentDate,
            description: `Loan #${loanId} payment - Principal reduction`,
            debitAccount: loansPrincipalAccount.id,
            creditAccount: cashAccount.id,
            amount: parseFloat(principalPayment.toFixed(2))
        };

        appState.transactions.push(principalTransaction);
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
            grid: Array(buildingDef.interiorSize).fill(null).map(() => Array(buildingDef.interiorSize).fill(null))
        }
    };

    appState.buildings.push(building);
    appState.constructionQueue.push({ buildingId: building.id, completionDate: building.completionDate });

    // Record transactions: consume inventory, add to construction-in-progress
    const inventoryAccount = appState.accounts.find(a => a.number === '1200');
    const buildingsAccount = appState.accounts.find(a => a.number === '1400');

    const transaction = {
        id: appState.nextTransactionId++,
        date: getTodayDate(),
        description: `Started construction: ${buildingDef.name} at (${x}, ${y})`,
        debitAccount: buildingsAccount.id,
        creditAccount: inventoryAccount.id,
        amount: parseFloat(totalCost.toFixed(2))
    };

    appState.transactions.push(transaction);
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
        const recoveredValue = recoveredQty * commodity.price;

        // Add to portfolio
        if (!appState.portfolio[commodity.id]) {
            appState.portfolio[commodity.id] = { lots: [] };
        }

        appState.portfolio[commodity.id].lots.push({
            quantity: recoveredQty,
            costBasis: commodity.price,
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

    building.status = 'demolished';
    hasUnsavedChanges = true;

    return true;
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

    // Record transaction: Debit Cash, Credit Common Stock
    const transaction = {
        id: appState.nextTransactionId++,
        date: issueDate,
        description: `Issued ${numberOfShares} shares at ${formatCurrency(pricePerShare)} per share to ${holder}`,
        debitAccount: cashAccount.id,
        creditAccount: commonStockAccount.id,
        amount: totalValue
    };

    appState.transactions.push(transaction);
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
    const balances = {};

    // Initialize with opening balances
    appState.accounts.forEach(account => {
        balances[account.id] = account.openingBalance;
    });

    // Filter transactions by date if specified
    const relevantTransactions = asOfDate
        ? appState.transactions.filter(t => compareDates(t.date, asOfDate) <= 0)
        : appState.transactions;

    // Apply transactions
    relevantTransactions.forEach(transaction => {
        if (transaction.entries) {
            // Multi-entry transaction
            transaction.entries.forEach(entry => {
                const account = appState.accounts.find(a => a.id === entry.account);
                if (!account) return;

                if (!balances[entry.account]) balances[entry.account] = 0;

                if (entry.type === 'debit') {
                    // Debit increases: Assets, Expenses
                    // Debit decreases: Liabilities, Equity, Revenue
                    if (account.type === 'Asset' || account.type === 'Expense') {
                        balances[entry.account] += entry.amount;
                    } else {
                        balances[entry.account] -= entry.amount;
                    }
                } else {
                    // Credit increases: Liabilities, Equity, Revenue
                    // Credit decreases: Assets, Expenses
                    if (account.type === 'Liability' || account.type === 'Equity' || account.type === 'Revenue') {
                        balances[entry.account] += entry.amount;
                    } else {
                        balances[entry.account] -= entry.amount;
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

    const content = document.getElementById('balanceSheetContent');
    content.innerHTML = `
        <div class="statement-section">
            <div class="statement-title">BALANCE SHEET</div>
            <div>As of ${formatDate(asOfDate)}</div>
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

    const arChange = arAccounts.reduce((sum, a) =>
        sum + ((endBalances[a.id] || 0) - (startBalances[a.id] || 0)), 0
    );
    const apChange = apAccounts.reduce((sum, a) =>
        sum + ((endBalances[a.id] || 0) - (startBalances[a.id] || 0)), 0
    );

    const operatingCash = netIncome - arChange + apChange;

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
            <div class="statement-item">
                <span>No investing activities recorded</span>
                <span>${formatCurrency(0)}</span>
            </div>
            <div class="statement-subtotal">
                <span>Net Cash from Investing Activities</span>
                <span>${formatCurrency(0)}</span>
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

        // Auto-update financial statement end dates to current date
        updateStatementEndDates();

        // Check construction progress
        checkConstructionProgress();
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
 * 2. Update its price property
 * 3. Call render() to update the UI
 *
 * Example:
 * const commodity = appState.commodities.find(c => c.name === 'Power');
 * commodity.price = 55.00;
 * render();
 *
 * Note: Price changes only affect future trades. Existing portfolio lots
 * retain their original cost basis for accurate gain/loss calculations.
 */
