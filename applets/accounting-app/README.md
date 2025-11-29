# Accounting App

A lightweight, real-time accounting application built with vanilla HTML, CSS, and JavaScript.

## Overview

This single-page web application provides small business accounting capabilities with real-time financial statement generation. All data is stored in-memory and managed through an exportable/importable session key system - no backend or database required.

## Features

### Chart of Accounts Management
- Add, edit, and delete accounts
- Support for five account types:
  - Assets
  - Liabilities
  - Equity
  - Revenue
  - Expenses
- Set opening balances for each account
- Real-time balance calculations

### Transaction Entry
- Double-entry bookkeeping system
- Transaction fields:
  - Date
  - Description
  - Debit account
  - Credit account
  - Amount
- Edit and delete transactions
- Filter transactions by:
  - Date range
  - Account
- Validation to ensure proper double-entry (debit ≠ credit)

### Financial Statements

All statements are generated in real-time from your transactions:

**Balance Sheet**
- Assets, Liabilities, and Equity
- As of any specified date
- Automatic balance calculations

**Income Statement**
- Revenue and Expenses
- For any date range
- Net income calculation

**Cash Flow Statement**
- Operating, Investing, and Financing activities
- For any date range
- Simplified cash flow analysis

### Session Key System

**No Persistence Between Sessions**
- Application starts fresh on every page load
- No localStorage, cookies, or external storage

**Session Key Management**
- Copy session key to save your complete business state
- Paste session key to restore all data
- Session key includes:
  - Complete chart of accounts
  - All transactions
  - User preferences
  - Timestamp of last update

**How to Use**
1. Work on your accounting data
2. Click "Copy Session Key" to save your work as a text string
3. Store the key somewhere safe (text file, password manager, etc.)
4. When you return, paste the key and click "Load Session" to restore everything

## Technical Details

### Stack
- Pure HTML5, CSS3, and JavaScript (ES6+)
- No frameworks or libraries
- No build process required

### Browser Compatibility
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires JavaScript enabled

### Data Format
- Session keys use base64-encoded JSON
- All calculations happen client-side
- No network requests (runs completely offline)

## Default Accounts

The app comes pre-loaded with 15 standard accounts:

**Assets**
- 1000 - Cash
- 1100 - Accounts Receivable
- 1200 - Inventory
- 1500 - Equipment

**Liabilities**
- 2000 - Accounts Payable
- 2100 - Notes Payable

**Equity**
- 3000 - Common Stock
- 3100 - Retained Earnings

**Revenue**
- 4000 - Sales Revenue
- 4100 - Service Revenue

**Expenses**
- 5000 - Cost of Goods Sold
- 5100 - Rent Expense
- 5200 - Utilities Expense
- 5300 - Salaries Expense
- 5400 - Supplies Expense

## Usage Tips

1. **Regular Backups**: Copy your session key frequently to avoid losing work
2. **Multiple Businesses**: Use different session keys for different businesses
3. **Data Validation**: The app validates transactions to ensure proper double-entry bookkeeping
4. **Unsaved Changes**: You'll be warned before leaving the page if you have unsaved changes
5. **Mobile Friendly**: Responsive design works on tablets and phones

## Limitations

- No data persistence between sessions (by design)
- Cash flow statement is simplified (operating activities only)
- No multi-currency support
- No user authentication
- No collaborative editing
- No automatic backups

## Example Workflow

1. **Set Up**: Review the default chart of accounts and add/modify as needed
2. **Record Transactions**: Add your business transactions using double-entry format
3. **Review Statements**: Check Balance Sheet, Income Statement, and Cash Flow
4. **Save Work**: Copy your session key before closing the browser
5. **Resume Later**: Paste your session key to continue where you left off

## File Structure

```
accounting-app/
├── index.html       # Main application structure
├── style.css        # Minimal styling
├── script.js        # Application logic
└── README.md        # This file
```

## Deployment

This app is deployed via GitHub Pages at:
`https://nhoffie.github.io/applets/accounting-app/`

## License

Part of [nhoffie.github.io](https://nhoffie.github.io)

## Support

For issues or questions, please open an issue on the [GitHub repository](https://github.com/nhoffie/nhoffie.github.io).
