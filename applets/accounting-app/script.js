// ====================================
// APPLICATION STATE
// ====================================

let appState = {
    accounts: [
        { id: 1, number: '1000', name: 'Cash', type: 'Asset', openingBalance: 10000 },
        { id: 2, number: '1100', name: 'Accounts Receivable', type: 'Asset', openingBalance: 5000 },
        { id: 3, number: '1200', name: 'Inventory', type: 'Asset', openingBalance: 8000 },
        { id: 4, number: '1500', name: 'Equipment', type: 'Asset', openingBalance: 15000 },
        { id: 5, number: '2000', name: 'Accounts Payable', type: 'Liability', openingBalance: 3000 },
        { id: 6, number: '2100', name: 'Notes Payable', type: 'Liability', openingBalance: 10000 },
        { id: 7, number: '3000', name: 'Common Stock', type: 'Equity', openingBalance: 20000 },
        { id: 8, number: '3100', name: 'Retained Earnings', type: 'Equity', openingBalance: 5000 },
        { id: 9, number: '4000', name: 'Sales Revenue', type: 'Revenue', openingBalance: 0 },
        { id: 10, number: '4100', name: 'Service Revenue', type: 'Revenue', openingBalance: 0 },
        { id: 11, number: '5000', name: 'Cost of Goods Sold', type: 'Expense', openingBalance: 0 },
        { id: 12, number: '5100', name: 'Rent Expense', type: 'Expense', openingBalance: 0 },
        { id: 13, number: '5200', name: 'Utilities Expense', type: 'Expense', openingBalance: 0 },
        { id: 14, number: '5300', name: 'Salaries Expense', type: 'Expense', openingBalance: 0 },
        { id: 15, number: '5400', name: 'Supplies Expense', type: 'Expense', openingBalance: 0 }
    ],
    transactions: [],
    transactionTypes: [],
    settings: {
        companyName: 'My Business',
        lastUpdated: new Date().toISOString()
    },
    nextAccountId: 16,
    nextTransactionId: 1,
    nextTransactionTypeId: 1
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
        row.innerHTML = `
            <td>${escapeHtml(account.number)}</td>
            <td>${escapeHtml(account.name)}</td>
            <td class="number">${formatCurrency(balance)}</td>
            <td>
                <button class="btn" onclick="editAccount(${account.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteAccount(${account.id})">Delete</button>
            </td>
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

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(type.name)}</td>
            <td>${entriesDisplay}</td>
            <td>
                <button class="btn" onclick="editTransactionType(${type.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteTransactionType(${type.id})">Delete</button>
            </td>
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

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(transaction.date)}</td>
            <td>${escapeHtml(transaction.description)}</td>
            <td>${debitDisplay}</td>
            <td>${creditDisplay}</td>
            <td class="number">${amountDisplay}</td>
            <td>
                <button class="btn" onclick="editTransaction(${transaction.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteTransaction(${transaction.id})">Delete</button>
            </td>
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
});
