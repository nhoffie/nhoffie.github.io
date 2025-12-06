// ====================================
// APPLICATION STATE
// ====================================

let appState = {
    accounts: [
        { id: 1, number: '1000', name: 'Cash', type: 'Asset', openingBalance: 0 },
        { id: 2, number: '1100', name: 'Accounts Receivable', type: 'Asset', openingBalance: 0 },
        { id: 3, number: '1200', name: 'Inventory', type: 'Asset', openingBalance: 0 },
        { id: 4, number: '1300', name: 'Real Estate', type: 'Asset', openingBalance: 0 },
        { id: 5, number: '1500', name: 'Equipment', type: 'Asset', openingBalance: 0 },
        { id: 6, number: '2000', name: 'Accounts Payable', type: 'Liability', openingBalance: 0 },
        { id: 7, number: '2100', name: 'Notes Payable', type: 'Liability', openingBalance: 0 },
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
        { id: 18, number: '5500', name: 'Losses on Commodity Sales', type: 'Expense', openingBalance: 0 }
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
        { id: 1, name: 'Power', description: 'Electrical energy units', price: 50.00 },
        { id: 2, name: 'Water', description: 'Fresh water units', price: 25.00 }
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
    nextAccountId: 19,
    nextTransactionId: 1,
    nextTransactionTypeId: 11,
    nextCommodityId: 3,
    nextTradeId: 1
};

let hasUnsavedChanges = false;

// ====================================
// SESSION KEY MANAGEMENT
// ====================================

function encodeSessionKey() {
    try {
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
        appState = restoredState;
        hasUnsavedChanges = false;
        keyInput.value = '';
        showStatus('restoreStatus', 'Data restored successfully!', 'success');
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

function renderCommoditiesList() {
    const container = document.getElementById('commoditiesList');
    if (!container) return;

    const cashBalance = getCashBalance();

    container.innerHTML = `
        <div class="cash-balance">
            <strong>Available Cash:</strong> ${formatCurrency(cashBalance)}
        </div>
    `;

    appState.commodities.forEach(commodity => {
        const quantity = getTotalQuantity(commodity.id);

        const commodityCard = document.createElement('div');
        commodityCard.className = 'commodity-card';
        commodityCard.innerHTML = `
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
        `;

        container.appendChild(commodityCard);
    });

    // Add event listeners for quantity inputs
    appState.commodities.forEach(commodity => {
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
    });
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

            square.className = `map-square ${owned ? 'owned' : 'available'}`;
            square.dataset.x = x;
            square.dataset.y = y;
            square.title = owned ? `Owned property (${x}, ${y})` : `Available (${x}, ${y}) - ${formatCurrency(appState.map.pricePerSquare)}`;

            if (!owned) {
                square.addEventListener('click', () => {
                    if (confirm(`Purchase property at (${x}, ${y}) for ${formatCurrency(appState.map.pricePerSquare)}?`)) {
                        if (purchaseProperty(x, y)) {
                            render();
                            showMapStatus(`Successfully purchased property at (${x}, ${y})!`, 'success');
                        }
                    }
                });
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
        ? appState.transactions.filter(t => t.date <= asOfDate)
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
            <div class="statement-item">
                <span>No financing activities recorded</span>
                <span>${formatCurrency(0)}</span>
            </div>
            <div class="statement-subtotal">
                <span>Net Cash from Financing Activities</span>
                <span>${formatCurrency(0)}</span>
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

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function getFirstDayOfMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
}

function getPreviousDay(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
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
