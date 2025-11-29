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
    settings: {
        companyName: 'My Business',
        lastUpdated: new Date().toISOString()
    },
    nextAccountId: 16,
    nextTransactionId: 1
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
    const tbody = document.getElementById('accountsTableBody');
    tbody.innerHTML = '';

    // Calculate current balances
    const balances = calculateAccountBalances();

    // Define the order of account types
    const accountTypeOrder = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];
    const accountTypeLabels = {
        'Asset': 'ASSETS',
        'Liability': 'LIABILITIES',
        'Equity': 'EQUITY',
        'Revenue': 'REVENUE',
        'Expense': 'EXPENSES'
    };

    // Group accounts by type
    accountTypeOrder.forEach(type => {
        const accountsOfType = appState.accounts
            .filter(account => account.type === type)
            .sort((a, b) => a.number.localeCompare(b.number));

        if (accountsOfType.length > 0) {
            // Add type header row
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <td colspan="5" class="account-type-header ${type.toLowerCase()}">${accountTypeLabels[type]}</td>
            `;
            tbody.appendChild(headerRow);

            // Add accounts of this type
            accountsOfType.forEach(account => {
                const balance = balances[account.id] || 0;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${escapeHtml(account.number)}</td>
                    <td>${escapeHtml(account.name)}</td>
                    <td>${escapeHtml(account.type)}</td>
                    <td class="number">${formatCurrency(balance)}</td>
                    <td>
                        <button class="btn" onclick="editAccount(${account.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteAccount(${account.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
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
        const debitAccount = appState.accounts.find(a => a.id === transaction.debitAccount);
        const creditAccount = appState.accounts.find(a => a.id === transaction.creditAccount);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(transaction.date)}</td>
            <td>${escapeHtml(transaction.description)}</td>
            <td>${debitAccount ? escapeHtml(debitAccount.name) : 'Unknown'}</td>
            <td>${creditAccount ? escapeHtml(creditAccount.name) : 'Unknown'}</td>
            <td class="number">${formatCurrency(transaction.amount)}</td>
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

    const transactionData = {
        date: document.getElementById('transactionDate').value,
        description: document.getElementById('transactionDescription').value,
        debitAccount,
        creditAccount,
        amount
    };

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
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionId').value = '';
    document.getElementById('cancelTransactionBtn').classList.add('hidden');
    setDefaultTransactionDate();
    render();
}

function editTransaction(transactionId) {
    const transaction = appState.transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    document.getElementById('transactionId').value = transaction.id;
    document.getElementById('transactionDate').value = transaction.date;
    document.getElementById('transactionDescription').value = transaction.description;
    document.getElementById('debitAccount').value = transaction.debitAccount;
    document.getElementById('creditAccount').value = transaction.creditAccount;
    document.getElementById('transactionAmount').value = transaction.amount;
    document.getElementById('cancelTransactionBtn').classList.remove('hidden');

    // Scroll to form
    document.getElementById('transactionForm').scrollIntoView({ behavior: 'smooth' });
}

function cancelTransactionEdit() {
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionId').value = '';
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

    // Clear existing options
    debitSelect.innerHTML = '<option value="">Select account...</option>';
    creditSelect.innerHTML = '<option value="">Select account...</option>';
    filterSelect.innerHTML = '<option value="">All accounts</option>';

    // Add account options
    appState.accounts.forEach(account => {
        const optionText = `${account.number} - ${account.name}`;

        const debitOption = new Option(optionText, account.id);
        const creditOption = new Option(optionText, account.id);
        const filterOption = new Option(optionText, account.id);

        debitSelect.add(debitOption);
        creditSelect.add(creditOption);
        filterSelect.add(filterOption);
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

    // Transaction form
    document.getElementById('transactionForm').addEventListener('submit', saveTransaction);
    document.getElementById('cancelTransactionBtn').addEventListener('click', cancelTransactionEdit);

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
