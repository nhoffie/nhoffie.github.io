# Market Economy Simulator V2 - Architecture Document

## Table of Contents
1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)
3. [Module Architecture](#module-architecture)
4. [Core Data Models](#core-data-models)
5. [System Interactions](#system-interactions)
6. [Critical Architectural Decisions](#critical-architectural-decisions)
7. [Implementation Roadmap](#implementation-roadmap)

---

## 1. Project Overview

A self-contained market economy simulator built with vanilla HTML/CSS/JS. Users operate a new firm in an established market with AI competitors, managing production, sales, finances, and real estate while adhering to strict double-entry bookkeeping principles.

**Key Constraints:**
- Pure vanilla JS (no frameworks/libraries)
- Single-page application
- No automatic persistence (session save/load via JSON)
- Closed economy with supply/demand dynamics
- GAAP-compliant accounting

---

## 2. File Structure

```
market-simulator-v2/
├── index.html                      # Main entry point and UI shell
├── style.css                       # All styles
├── README.md                       # User documentation
├── ARCHITECTURE.md                 # This file
│
├── core/
│   ├── simulation-engine.js        # Core simulation loop and time management
│   ├── state-manager.js            # Central state management and coordination
│   └── event-bus.js                # Pub/sub event system for module communication
│
├── accounting/
│   ├── transaction-manager.js      # Transaction creation and validation
│   ├── ledger.js                   # General ledger and account management
│   ├── chart-of-accounts.js        # Account definitions and structure
│   ├── financial-statements.js     # Balance Sheet, Income Statement, Cash Flow
│   └── journal.js                  # Transaction journal and audit trail
│
├── economy/
│   ├── market-system.js            # Supply/demand mechanics and price discovery
│   ├── product-registry.js         # Product definitions and metadata
│   └── production-chains.js        # Production recipes and requirements
│
├── entities/
│   ├── firm.js                     # Firm class (user and AI firms)
│   ├── firm-ai.js                  # AI decision-making logic
│   └── inventory.js                # Inventory management system
│
├── real-estate/
│   ├── property-manager.js         # Property ownership and transactions
│   ├── property-types.js           # Property definitions and capabilities
│   └── facility.js                 # Production facility and retail location logic
│
├── ui/
│   ├── ui-controller.js            # Main UI coordination and routing
│   ├── dashboard.js                # Main dashboard view
│   ├── accounting-view.js          # Financial statements and accounting UI
│   ├── market-view.js              # Market prices and trading interface
│   ├── production-view.js          # Production management interface
│   ├── real-estate-view.js         # Property management interface
│   └── firm-management-view.js     # Firm overview and management
│
├── session/
│   ├── serializer.js               # State serialization/deserialization
│   ├── save-manager.js             # Save/load functionality
│   └── time-reconciliation.js      # Fast-forward simulation on load
│
└── utils/
    ├── date-utils.js               # Calendar and date manipulation
    ├── math-utils.js               # Economic calculations and rounding
    └── validation.js               # Input validation and data integrity
```

**Total Files:** ~28 JavaScript modules + HTML/CSS

**Rationale:**
- **Separation by domain:** Each major system (accounting, economy, real estate) is isolated
- **Easy navigation:** File names clearly indicate their purpose
- **Minimal coupling:** Modules communicate through well-defined interfaces
- **Single responsibility:** Each file has one clear purpose

---

## 3. Module Architecture

### 3.1 Core Layer

#### `simulation-engine.js`
**Responsibility:** Manages simulation time and the main game loop

**Key Functions:**
- `init()` - Initialize simulation
- `start()` - Begin simulation loop
- `pause()` - Pause simulation
- `tick()` - Execute one simulation step
- `advanceTime(days)` - Fast-forward simulation
- `getCurrentDate()` - Get current simulation date
- `setTimeMultiplier(multiplier)` - Adjust simulation speed

**Exports:** `SimulationEngine` singleton

**Dependencies:**
- `event-bus.js` - Emit time-based events
- `state-manager.js` - Access global state

---

#### `state-manager.js`
**Responsibility:** Central state repository and coordination

**Key Functions:**
- `getState()` - Get complete simulation state
- `setState(state)` - Replace entire state (for loading)
- `getFirm(id)` - Get firm by ID
- `getMarket()` - Get market state
- `getRealEstate()` - Get real estate state
- `getUserFirm()` - Get user's firm
- `getAIFirms()` - Get all AI firms

**State Structure:**
```javascript
{
  meta: { saveTimestamp, simulationDate, version },
  market: { prices, supplyDemand, transactions },
  firms: [ { id, name, type, ... }, ... ],
  realEstate: { properties: [...], ownership: {...} },
  accounting: { /* per-firm ledgers */ }
}
```

**Exports:** `StateManager` singleton

**Dependencies:** None (leaf module)

---

#### `event-bus.js`
**Responsibility:** Decoupled communication between modules

**Key Events:**
- `time:tick` - Fired each simulation tick
- `time:dayEnd` - Fired at end of day
- `time:monthEnd` - Fired at end of month
- `firm:created` - New firm created
- `transaction:created` - New accounting transaction
- `market:priceChange` - Market price updated
- `property:traded` - Real estate bought/sold

**Key Functions:**
- `on(event, handler)` - Subscribe to event
- `off(event, handler)` - Unsubscribe
- `emit(event, data)` - Fire event

**Exports:** `EventBus` singleton

**Dependencies:** None (leaf module)

---

### 3.2 Accounting Layer

#### `chart-of-accounts.js`
**Responsibility:** Define the account structure for double-entry bookkeeping

**Account Categories:**
```javascript
{
  assets: [
    'Cash',
    'Accounts Receivable',
    'Inventory - Raw Materials',
    'Inventory - Finished Goods',
    'Real Estate',
    'Equipment',
    'Prepaid Expenses'
  ],
  liabilities: [
    'Accounts Payable',
    'Notes Payable',
    'Accrued Expenses'
  ],
  equity: [
    'Owner\'s Capital',
    'Retained Earnings',
    'Current Year Earnings'
  ],
  revenue: [
    'Sales Revenue',
    'Interest Income',
    'Other Revenue'
  ],
  expenses: [
    'Cost of Goods Sold',
    'Wages Expense',
    'Rent Expense',
    'Utilities Expense',
    'Depreciation Expense',
    'Interest Expense'
  ]
}
```

**Exports:** `CHART_OF_ACCOUNTS` constant

---

#### `transaction-manager.js`
**Responsibility:** Create and validate accounting transactions

**Key Functions:**
- `createTransaction(firmId, entries, description, date)` - Create a new transaction
- `validateTransaction(transaction)` - Ensure debits = credits
- `recordTransaction(transaction)` - Commit to ledger and journal
- `getTransactionHistory(firmId, filters)` - Query past transactions

**Transaction Structure:**
```javascript
{
  id: 'tx_123',
  firmId: 'firm_user',
  date: { year, month, day },
  timestamp: 1234567890,
  description: 'Purchase raw materials',
  entries: [
    { account: 'Inventory - Raw Materials', debit: 1000, credit: 0 },
    { account: 'Cash', debit: 0, credit: 1000 }
  ],
  metadata: { relatedEntity: 'market', type: 'purchase' }
}
```

**Validation Rules:**
- Sum of debits must equal sum of credits
- All accounts must exist in chart of accounts
- Amounts must be positive numbers
- Date must be valid simulation date

**Exports:** `TransactionManager` class

**Dependencies:**
- `ledger.js` - Post transactions to ledger
- `journal.js` - Record in journal
- `chart-of-accounts.js` - Validate accounts
- `event-bus.js` - Emit transaction events

---

#### `ledger.js`
**Responsibility:** Maintain account balances and transaction history

**Key Functions:**
- `initializeLedger(firmId)` - Create ledger for new firm
- `postTransaction(firmId, transaction)` - Update account balances
- `getAccountBalance(firmId, account, date?)` - Get balance at point in time
- `getAccountHistory(firmId, account, startDate, endDate)` - Get transaction history
- `getLedger(firmId)` - Get complete ledger for firm

**Ledger Structure (per firm):**
```javascript
{
  firmId: 'firm_user',
  accounts: {
    'Cash': {
      balance: 5000,
      transactions: [
        { txId: 'tx_123', date: {...}, debit: 0, credit: 1000, balance: 5000 }
      ]
    },
    'Inventory - Raw Materials': { ... },
    // ... all accounts
  }
}
```

**Exports:** `Ledger` class

**Dependencies:**
- `chart-of-accounts.js` - Account definitions

---

#### `journal.js`
**Responsibility:** Complete transaction audit trail

**Key Functions:**
- `recordEntry(firmId, transaction)` - Add transaction to journal
- `getJournal(firmId, startDate?, endDate?)` - Get journal entries
- `searchJournal(firmId, query)` - Search journal by description/account

**Exports:** `Journal` class

**Dependencies:** None

---

#### `financial-statements.js`
**Responsibility:** Generate financial statements from ledger data

**Key Functions:**
- `generateBalanceSheet(firmId, date)` - Generate balance sheet
- `generateIncomeStatement(firmId, startDate, endDate)` - Generate income statement
- `generateCashFlowStatement(firmId, startDate, endDate)` - Generate cash flow statement

**Balance Sheet Structure:**
```javascript
{
  date: { year, month, day },
  assets: {
    current: { 'Cash': 5000, 'Inventory': 3000, total: 8000 },
    nonCurrent: { 'Real Estate': 50000, total: 50000 },
    total: 58000
  },
  liabilities: {
    current: { 'Accounts Payable': 2000, total: 2000 },
    nonCurrent: { 'Notes Payable': 20000, total: 20000 },
    total: 22000
  },
  equity: {
    'Owner\'s Capital': 30000,
    'Retained Earnings': 6000,
    total: 36000
  },
  balances: true // assets === liabilities + equity
}
```

**Income Statement Structure:**
```javascript
{
  startDate: { year, month, day },
  endDate: { year, month, day },
  revenue: { 'Sales Revenue': 10000, total: 10000 },
  expenses: {
    'Cost of Goods Sold': 6000,
    'Wages Expense': 2000,
    'Rent Expense': 500,
    total: 8500
  },
  netIncome: 1500
}
```

**Cash Flow Statement Structure:**
```javascript
{
  startDate: { year, month, day },
  endDate: { year, month, day },
  operating: {
    netIncome: 1500,
    adjustments: { depreciation: 100, ... },
    workingCapitalChanges: { inventory: -500, ... },
    total: 1100
  },
  investing: {
    propertyPurchases: -10000,
    equipmentPurchases: 0,
    total: -10000
  },
  financing: {
    loanProceeds: 5000,
    loanPayments: -500,
    total: 4500
  },
  netCashFlow: -4400,
  beginningCash: 9400,
  endingCash: 5000
}
```

**Exports:** `FinancialStatements` class

**Dependencies:**
- `ledger.js` - Access account balances and history

---

### 3.3 Economy Layer

#### `market-system.js`
**Responsibility:** Supply/demand mechanics and price discovery

**Key Functions:**
- `initializeMarket(products)` - Set up initial market state
- `recordSupply(productId, quantity, firmId)` - Firm adds supply to market
- `recordDemand(productId, quantity, firmId)` - Firm expresses demand
- `clearMarket()` - Execute trades and adjust prices
- `getPrice(productId)` - Get current market price
- `getPriceHistory(productId)` - Get historical prices

**Market Clearing Algorithm:**
1. Collect all supply and demand orders for each product
2. Match buyers and sellers (FIFO or pro-rata allocation)
3. Execute trades at current market price
4. Adjust price based on excess supply/demand
   - Excess demand → price increases
   - Excess supply → price decreases
5. Emit trade events for accounting

**Price Discovery Formula (example - can be refined):**
```
priceChange = basePrice * (demand - supply) / (demand + supply) * elasticity
newPrice = max(minPrice, currentPrice + priceChange)
```

**Market State Structure:**
```javascript
{
  products: {
    'product_steel': {
      price: 100,
      priceHistory: [ { date: {...}, price: 100 }, ... ],
      supply: [ { firmId: 'firm_1', quantity: 500 }, ... ],
      demand: [ { firmId: 'firm_2', quantity: 300 }, ... ],
      trades: [ { buyer: 'firm_2', seller: 'firm_1', quantity: 300, price: 100 }, ... ]
    }
  }
}
```

**Exports:** `MarketSystem` class

**Dependencies:**
- `product-registry.js` - Product definitions
- `event-bus.js` - Emit trade events
- `transaction-manager.js` - Create accounting transactions for trades

---

#### `product-registry.js`
**Responsibility:** Define all products and their properties

**Product Definition:**
```javascript
{
  id: 'product_steel',
  name: 'Steel',
  category: 'raw_material',
  basePrice: 100,
  unit: 'ton',
  producible: true,
  productionTime: 2, // days
  inputs: [], // raw material, no inputs
  metadata: { description: 'Basic construction material' }
}
```

**Product Categories:**
- `raw_material` - Basic resources (no inputs required)
- `intermediate` - Processed materials (requires inputs)
- `finished_goods` - Final products for sale

**Example Products:**
```javascript
[
  { id: 'product_steel', name: 'Steel', category: 'raw_material', ... },
  { id: 'product_components', name: 'Components', category: 'intermediate',
    inputs: [{ product: 'product_steel', quantity: 2 }], ... },
  { id: 'product_machinery', name: 'Machinery', category: 'finished_goods',
    inputs: [{ product: 'product_components', quantity: 5 }], ... }
]
```

**Exports:** `PRODUCTS` constant array, `ProductRegistry` class with helper methods

---

#### `production-chains.js`
**Responsibility:** Production logic and recipe management

**Key Functions:**
- `canProduce(firmId, productId)` - Check if firm can produce product
- `startProduction(firmId, productId, quantity)` - Begin production run
- `updateProduction(firmId)` - Process ongoing production (called each tick)
- `completeProduction(firmId, productionId)` - Finish production run

**Production Process:**
1. Check firm has required inputs in inventory
2. Check firm has production facility for product type
3. Deduct inputs from inventory (accounting: debit WIP, credit inventory)
4. Start production timer
5. When complete, add finished goods to inventory (accounting: debit finished goods, credit WIP)

**Production State Structure:**
```javascript
{
  firmId: 'firm_user',
  productionRuns: [
    {
      id: 'prod_123',
      productId: 'product_machinery',
      quantity: 10,
      startDate: { year: 1, month: 1, day: 5 },
      completionDate: { year: 1, month: 1, day: 8 },
      status: 'in_progress', // 'in_progress', 'completed'
      inputsUsed: [ { product: 'product_components', quantity: 50 } ]
    }
  ]
}
```

**Exports:** `ProductionChains` class

**Dependencies:**
- `product-registry.js` - Product recipes
- `inventory.js` - Access and update inventory
- `transaction-manager.js` - Record production transactions
- `property-manager.js` - Check facility capabilities

---

### 3.4 Entities Layer

#### `firm.js`
**Responsibility:** Core firm entity and operations

**Firm Structure:**
```javascript
{
  id: 'firm_user',
  name: 'User Corp',
  type: 'user', // 'user' or 'ai'
  founded: { year: 1, month: 1, day: 1 },

  // Financial
  capital: 10000,

  // Inventory
  inventory: {
    'product_steel': 100,
    'product_components': 50
  },

  // Real Estate
  properties: ['prop_factory_1', 'prop_store_1'],

  // Production
  productionCapabilities: ['product_steel', 'product_components'],
  activeProduction: [ /* production runs */ ],

  // AI-specific (for AI firms)
  aiStrategy: {
    targetProfit: 0.05,
    productFocus: ['product_steel'],
    riskTolerance: 'low'
  }
}
```

**Key Methods:**
- `constructor(id, name, type, initialCapital)`
- `getFinancialStatement(type, startDate?, endDate?)` - Get statement
- `buyProduct(productId, quantity, price)` - Purchase from market
- `sellProduct(productId, quantity, price)` - Sell to market
- `startProduction(productId, quantity)` - Begin production
- `buyProperty(propertyId, price)` - Purchase real estate
- `sellProperty(propertyId, price)` - Sell real estate
- `getCash()` - Get current cash balance
- `getInventory()` - Get current inventory

**Exports:** `Firm` class

**Dependencies:**
- `transaction-manager.js` - Record transactions
- `inventory.js` - Manage inventory
- Most other systems for various operations

---

#### `firm-ai.js`
**Responsibility:** AI decision-making for computer-controlled firms

**Key Functions:**
- `makeDecisions(firmId)` - Called each day to make decisions
- `evaluateProduction(firm)` - Decide what to produce
- `evaluateTrading(firm)` - Decide what to buy/sell
- `evaluateRealEstate(firm)` - Decide property actions
- `calculateOptimalPrice(firm, productId)` - Pricing strategy

**AI Strategy:**
- **Goal:** Break even / small profit (not aggressive growth)
- **Production:** Produce products firm is capable of making
- **Trading:** Buy inputs at market price, sell outputs at market price
- **Real Estate:** Buy properties to expand production capacity when profitable
- **Pricing:** Follow market prices closely (not price-makers)

**Decision Logic (example):**
```javascript
function makeDecisions(firm) {
  // Check if need inputs for production
  const neededInputs = calculateInputNeeds(firm);
  for (const [productId, quantity] of Object.entries(neededInputs)) {
    if (quantity > 0) {
      firm.buyProduct(productId, quantity, market.getPrice(productId));
    }
  }

  // Decide what to produce
  const productionPlan = optimizeProduction(firm);
  for (const [productId, quantity] of Object.entries(productionPlan)) {
    firm.startProduction(productId, quantity);
  }

  // Sell finished goods
  const sellableInventory = getSellableInventory(firm);
  for (const [productId, quantity] of Object.entries(sellableInventory)) {
    firm.sellProduct(productId, quantity, market.getPrice(productId));
  }
}
```

**Exports:** `FirmAI` class

**Dependencies:**
- `firm.js` - Firm operations
- `market-system.js` - Market information
- `production-chains.js` - Production capabilities
- `state-manager.js` - Access other firms and market state

---

#### `inventory.js`
**Responsibility:** Inventory tracking and management

**Key Functions:**
- `getInventory(firmId)` - Get all inventory for firm
- `getItemQuantity(firmId, productId)` - Get quantity of specific item
- `addItem(firmId, productId, quantity)` - Add to inventory
- `removeItem(firmId, productId, quantity)` - Remove from inventory (throws if insufficient)
- `hasQuantity(firmId, productId, quantity)` - Check if sufficient quantity available
- `getInventoryValue(firmId)` - Get total value of inventory at market prices

**Inventory Structure (per firm):**
```javascript
{
  'product_steel': { quantity: 100, averageCost: 95 },
  'product_components': { quantity: 50, averageCost: 210 },
  // ...
}
```

**Inventory Accounting:**
- Track average cost for COGS calculation
- When adding: update average cost using weighted average method
- When removing: use average cost for accounting entries

**Exports:** `Inventory` class

**Dependencies:**
- `state-manager.js` - Access firm data
- `product-registry.js` - Validate products

---

### 3.5 Real Estate Layer

#### `property-types.js`
**Responsibility:** Define property types and capabilities

**Property Type Definition:**
```javascript
{
  id: 'factory_small',
  name: 'Small Factory',
  category: 'production',
  basePrice: 50000,
  maintenanceCost: 500, // per month
  capabilities: {
    production: ['product_steel', 'product_components'],
    capacity: 1000 // units per day
  },
  metadata: { description: 'Basic production facility' }
}
```

**Property Categories:**
- `production` - Manufacturing facilities
- `retail` - Stores and sales locations
- `storage` - Warehouses
- `office` - Administrative buildings

**Example Property Types:**
```javascript
[
  { id: 'factory_small', name: 'Small Factory', category: 'production', ... },
  { id: 'factory_large', name: 'Large Factory', category: 'production', ... },
  { id: 'warehouse', name: 'Warehouse', category: 'storage', ... },
  { id: 'retail_store', name: 'Retail Store', category: 'retail', ... },
  { id: 'office', name: 'Office Building', category: 'office', ... }
]
```

**Exports:** `PROPERTY_TYPES` constant array, `PropertyTypes` class with helpers

---

#### `property-manager.js`
**Responsibility:** Property ownership and transactions

**Key Functions:**
- `initializeProperties()` - Create initial property inventory
- `getProperty(propertyId)` - Get property details
- `getOwner(propertyId)` - Get current owner firm ID
- `getPropertiesByOwner(firmId)` - Get all properties owned by firm
- `getAvailableProperties()` - Get properties for sale
- `buyProperty(firmId, propertyId, price)` - Purchase property
- `sellProperty(firmId, propertyId, price)` - List property for sale
- `getPropertyValue(propertyId)` - Get current market value

**Property Instance Structure:**
```javascript
{
  id: 'prop_123',
  typeId: 'factory_small',
  ownerId: 'firm_user', // or null if available
  purchaseDate: { year: 1, month: 1, day: 10 },
  purchasePrice: 50000,
  currentValue: 48000, // can depreciate or appreciate
  condition: 1.0, // 0.0 to 1.0, affects productivity
  forSale: false,
  askingPrice: null
}
```

**Property Transaction Accounting:**
- **Purchase:** Debit Real Estate, Credit Cash
- **Sale:** Debit Cash, Credit Real Estate, record gain/loss in income
- **Maintenance:** Debit Rent/Maintenance Expense, Credit Cash

**Exports:** `PropertyManager` class

**Dependencies:**
- `property-types.js` - Property definitions
- `transaction-manager.js` - Record transactions
- `event-bus.js` - Emit property events
- `state-manager.js` - Access firm data

---

#### `facility.js`
**Responsibility:** Production facility and retail location logic

**Key Functions:**
- `getFacilitiesForFirm(firmId)` - Get all facilities owned by firm
- `canProduceProduct(firmId, productId)` - Check if firm has facility for product
- `getProductionCapacity(firmId, productId)` - Get max production capacity
- `getRetailCapacity(firmId)` - Get retail sales capacity
- `getFacilityUtilization(firmId)` - Get capacity usage percentage

**Facility Capabilities:**
- **Production facilities:** Enable production of certain products
- **Retail locations:** Increase sales capacity and market reach
- **Warehouses:** Increase inventory storage capacity
- **Offices:** Reduce administrative overhead

**Exports:** `Facility` class

**Dependencies:**
- `property-manager.js` - Property ownership
- `property-types.js` - Property capabilities

---

### 3.6 UI Layer

#### `ui-controller.js`
**Responsibility:** Main UI coordination and view routing

**Key Functions:**
- `init()` - Initialize UI system
- `showView(viewName)` - Display specific view
- `updateAllViews()` - Refresh all visible data
- `registerView(name, viewInstance)` - Register view module

**Views:**
- `dashboard` - Main overview
- `accounting` - Financial statements
- `market` - Market prices and trading
- `production` - Production management
- `real-estate` - Property management
- `firm-management` - Firm details

**Exports:** `UIController` singleton

**Dependencies:** All view modules

---

#### View Modules (`dashboard.js`, `accounting-view.js`, etc.)

Each view module follows this pattern:

```javascript
class DashboardView {
  constructor() {
    this.container = document.getElementById('dashboard-container');
  }

  render(data) {
    // Update DOM with current data
    this.container.innerHTML = this.generateHTML(data);
    this.attachEventListeners();
  }

  generateHTML(data) {
    // Return HTML string
  }

  attachEventListeners() {
    // Attach click handlers, etc.
  }

  update() {
    // Refresh view with latest data
    const data = this.getData();
    this.render(data);
  }

  getData() {
    // Fetch data from state manager
  }
}
```

**Common UI Patterns:**
- Use template literals for HTML generation
- Event delegation for dynamic elements
- Debounce rapid updates
- Clear separation between data fetching and rendering

---

### 3.7 Session Layer

#### `serializer.js`
**Responsibility:** State serialization and deserialization

**Key Functions:**
- `serialize(state)` - Convert state to JSON string
- `deserialize(jsonString)` - Parse JSON to state object
- `compress(jsonString)` - Optional: compress for shorter save codes
- `decompress(compressedString)` - Decompress save codes
- `generateSaveKey(state)` - Create save key with timestamp

**Save Key Format:**
```javascript
{
  version: '1.0.0',
  saveTimestamp: 1234567890, // real-world timestamp
  simulationDate: { year: 1, month: 3, day: 15 },
  state: { /* complete simulation state */ }
}
```

**Serialization Strategy:**
- Use JSON.stringify for simplicity
- Optional: Use LZString or similar for compression
- Include version number for migration support
- Validate on deserialize

**Exports:** `Serializer` class

**Dependencies:**
- `state-manager.js` - Access complete state

---

#### `save-manager.js`
**Responsibility:** Save/load UI and coordination

**Key Functions:**
- `generateSaveKey()` - Create save key from current state
- `loadFromSaveKey(saveKey)` - Load state from save key
- `copySaveKeyToClipboard()` - Copy save key to clipboard
- `showSaveDialog()` - Display save UI
- `showLoadDialog()` - Display load UI

**UI Elements:**
- Save button → generates key → displays in textarea → copy button
- Load button → shows input → paste key → validates → loads

**Exports:** `SaveManager` class

**Dependencies:**
- `serializer.js` - Serialization
- `state-manager.js` - Load state
- `time-reconciliation.js` - Fast-forward on load

---

#### `time-reconciliation.js`
**Responsibility:** Fast-forward simulation when loading save

**Key Functions:**
- `reconcileTime(saveTimestamp, currentTimestamp, timeMultiplier)` - Calculate days to advance
- `fastForward(days)` - Execute simulation for X days without rendering

**Algorithm:**
```javascript
function reconcileTime(saveTs, currentTs, multiplier) {
  const realTimeElapsed = (currentTs - saveTs) / 1000; // seconds
  const simulatedSecondsElapsed = realTimeElapsed * multiplier;
  const simulatedDaysElapsed = Math.floor(simulatedSecondsElapsed / 86400);
  return simulatedDaysElapsed;
}

function fastForward(days) {
  // Run simulation ticks without UI updates
  for (let i = 0; i < days; i++) {
    simulationEngine.tick();
    // Skip UI updates
  }
}
```

**Exports:** `TimeReconciliation` class

**Dependencies:**
- `simulation-engine.js` - Execute ticks

---

### 3.8 Utils Layer

#### `date-utils.js`
**Responsibility:** Calendar and date manipulation

**Key Functions:**
- `createDate(year, month, day)` - Create date object
- `addDays(date, days)` - Add days to date
- `daysBetween(date1, date2)` - Calculate difference
- `formatDate(date)` - Format for display
- `isEndOfMonth(date)` - Check if last day of month
- `isEndOfYear(date)` - Check if last day of year

**Date Structure:**
```javascript
{ year: 1, month: 1, day: 1 }
```

**Calendar Rules:**
- 12 months per year
- 28 days per month (simplified)
- Year starts at 1, Month starts at 1, Day starts at 1

**Exports:** Utility functions

**Dependencies:** None

---

#### `math-utils.js`
**Responsibility:** Economic calculations and rounding

**Key Functions:**
- `round(number, decimals)` - Round to decimal places
- `clamp(value, min, max)` - Constrain value
- `interpolate(value, min, max, newMin, newMax)` - Linear interpolation
- `calculatePercentageChange(oldValue, newValue)` - Percent change

**Exports:** Utility functions

**Dependencies:** None

---

#### `validation.js`
**Responsibility:** Input validation and data integrity

**Key Functions:**
- `validateFirm(firm)` - Validate firm structure
- `validateTransaction(transaction)` - Validate transaction
- `validateProduct(product)` - Validate product definition
- `validateProperty(property)` - Validate property
- `validateNumber(value, min, max)` - Validate numeric input
- `validateDate(date)` - Validate date structure

**Exports:** Validation functions

**Dependencies:** None

---

## 4. Core Data Models

### 4.1 Simulation Date
```javascript
{
  year: 1,      // Integer, starts at 1
  month: 1,     // Integer, 1-12
  day: 1        // Integer, 1-28
}
```

### 4.2 Firm
```javascript
{
  id: 'firm_user',
  name: 'User Corporation',
  type: 'user', // 'user' | 'ai'
  founded: { year: 1, month: 1, day: 1 },

  // Inventory
  inventory: {
    'product_steel': { quantity: 100, averageCost: 95 },
    'product_components': { quantity: 50, averageCost: 210 }
  },

  // Real Estate
  properties: ['prop_factory_1', 'prop_store_1'],

  // Production
  activeProduction: [
    {
      id: 'prod_123',
      productId: 'product_machinery',
      quantity: 10,
      startDate: { year: 1, month: 1, day: 5 },
      completionDate: { year: 1, month: 1, day: 8 },
      status: 'in_progress'
    }
  ],

  // AI-specific
  aiStrategy: {
    targetProfit: 0.05,
    productFocus: ['product_steel'],
    riskTolerance: 'low'
  }
}
```

### 4.3 Accounting Transaction
```javascript
{
  id: 'tx_123',
  firmId: 'firm_user',
  date: { year: 1, month: 1, day: 5 },
  timestamp: 1234567890,
  description: 'Purchase raw materials from market',
  entries: [
    {
      account: 'Inventory - Raw Materials',
      debit: 1000,
      credit: 0
    },
    {
      account: 'Cash',
      debit: 0,
      credit: 1000
    }
  ],
  metadata: {
    type: 'purchase',
    relatedEntity: 'market',
    productId: 'product_steel',
    quantity: 10
  }
}
```

### 4.4 Product Definition
```javascript
{
  id: 'product_machinery',
  name: 'Machinery',
  category: 'finished_goods', // 'raw_material' | 'intermediate' | 'finished_goods'
  basePrice: 1000,
  unit: 'unit',
  producible: true,
  productionTime: 3, // days
  inputs: [
    { productId: 'product_components', quantity: 5 },
    { productId: 'product_steel', quantity: 10 }
  ],
  metadata: {
    description: 'Heavy industrial machinery',
    marketSize: 'large'
  }
}
```

### 4.5 Market State
```javascript
{
  'product_steel': {
    price: 100,
    priceHistory: [
      { date: { year: 1, month: 1, day: 1 }, price: 100 }
    ],
    supply: [
      { firmId: 'firm_ai_1', quantity: 500, priceLimit: 95 }
    ],
    demand: [
      { firmId: 'firm_ai_2', quantity: 300, priceLimit: 105 }
    ],
    trades: [
      {
        buyer: 'firm_ai_2',
        seller: 'firm_ai_1',
        quantity: 300,
        price: 100,
        date: { year: 1, month: 1, day: 1 }
      }
    ]
  }
}
```

### 4.6 Property
```javascript
{
  id: 'prop_123',
  typeId: 'factory_small',
  ownerId: 'firm_user',
  purchaseDate: { year: 1, month: 1, day: 10 },
  purchasePrice: 50000,
  currentValue: 48000,
  condition: 1.0, // 0.0 to 1.0
  forSale: false,
  askingPrice: null,
  metadata: {
    location: 'Industrial District',
    size: 'small'
  }
}
```

### 4.7 Property Type
```javascript
{
  id: 'factory_small',
  name: 'Small Factory',
  category: 'production',
  basePrice: 50000,
  maintenanceCost: 500,
  capabilities: {
    production: ['product_steel', 'product_components'],
    capacity: 1000
  },
  metadata: {
    description: 'Basic production facility for raw and intermediate goods'
  }
}
```

### 4.8 Ledger Account
```javascript
{
  account: 'Cash',
  type: 'asset',
  balance: 5000,
  transactions: [
    {
      txId: 'tx_123',
      date: { year: 1, month: 1, day: 5 },
      debit: 0,
      credit: 1000,
      balance: 5000,
      description: 'Purchase raw materials'
    }
  ]
}
```

### 4.9 Complete State Structure
```javascript
{
  // Metadata
  meta: {
    version: '1.0.0',
    saveTimestamp: 1234567890,
    simulationDate: { year: 1, month: 3, day: 15 },
    timeMultiplier: 100
  },

  // Market
  market: {
    products: { /* market state for each product */ },
    tradeHistory: [ /* all trades */ ]
  },

  // Firms
  firms: [
    { /* user firm */ },
    { /* AI firm 1 */ },
    { /* AI firm 2 */ }
  ],

  // Real Estate
  realEstate: {
    properties: [ /* all property instances */ ],
    forSale: [ /* property IDs for sale */ ]
  },

  // Accounting (per firm)
  accounting: {
    'firm_user': {
      ledger: { /* all accounts */ },
      journal: [ /* all transactions */ ]
    },
    'firm_ai_1': { /* ... */ }
  }
}
```

---

## 5. System Interactions

### 5.1 Simulation Loop Flow

```
SimulationEngine.tick()
├─> EventBus.emit('time:tick')
│   ├─> MarketSystem.clearMarket()
│   │   ├─> Execute trades
│   │   ├─> TransactionManager.createTransaction() for each trade
│   │   │   ├─> Ledger.postTransaction()
│   │   │   └─> Journal.recordEntry()
│   │   └─> Adjust prices based on supply/demand
│   │
│   ├─> ProductionChains.updateProduction() for each firm
│   │   ├─> Complete finished production
│   │   └─> TransactionManager.createTransaction() for completed goods
│   │
│   └─> FirmAI.makeDecisions() for each AI firm
│       ├─> Evaluate market conditions
│       ├─> Decide purchases/sales
│       └─> Start new production runs
│
├─> Advance simulation date
│
├─> If end of day: EventBus.emit('time:dayEnd')
│   └─> PropertyManager.applyMaintenance() for all properties
│
├─> If end of month: EventBus.emit('time:monthEnd')
│   └─> FinancialStatements.generateMonthlyReports()
│
└─> UIController.updateAllViews()
```

### 5.2 User Action Flow: Buy Product

```
User clicks "Buy Steel"
├─> UI captures input (quantity)
├─> MarketView calls MarketSystem.recordDemand(userFirmId, 'product_steel', quantity)
├─> MarketSystem adds demand order to queue
├─> Next market clearing:
│   ├─> Match demand with supply
│   ├─> Execute trade
│   └─> TransactionManager.createTransaction()
│       ├─> Entries: [Debit Inventory, Credit Cash]
│       ├─> Ledger.postTransaction()
│       │   ├─> Update Cash balance
│       │   └─> Update Inventory balance
│       ├─> Journal.recordEntry()
│       └─> Inventory.addItem()
│           └─> Update firm's inventory with average cost
├─> EventBus.emit('transaction:created')
└─> UIController.updateAllViews()
    ├─> AccountingView.update() - show new balance
    ├─> DashboardView.update() - show new inventory
    └─> MarketView.update() - show new prices
```

### 5.3 User Action Flow: Start Production

```
User clicks "Produce Components"
├─> UI captures input (quantity)
├─> ProductionView calls ProductionChains.startProduction()
├─> ProductionChains.canProduce() checks:
│   ├─> Facility.canProduceProduct() - has factory?
│   ├─> Inventory.hasQuantity() - has inputs?
│   └─> If valid, proceed
├─> TransactionManager.createTransaction()
│   ├─> Entries: [Debit Work-in-Progress, Credit Inventory - Raw Materials]
│   ├─> Ledger.postTransaction()
│   └─> Journal.recordEntry()
├─> Inventory.removeItem() for each input
├─> Create production run with completion date
├─> Store in firm.activeProduction[]
└─> UIController.updateAllViews()

... time passes ...

When production completes:
├─> ProductionChains.completeProduction()
├─> TransactionManager.createTransaction()
│   ├─> Entries: [Debit Inventory - Finished Goods, Credit Work-in-Progress]
│   ├─> Ledger.postTransaction()
│   └─> Journal.recordEntry()
├─> Inventory.addItem() for finished product
└─> UIController.updateAllViews()
```

### 5.4 User Action Flow: Buy Property

```
User clicks "Buy Small Factory"
├─> UI confirms purchase (property details, price)
├─> RealEstateView calls PropertyManager.buyProperty()
├─> PropertyManager checks:
│   ├─> Property available?
│   ├─> Firm has enough cash?
│   └─> If valid, proceed
├─> TransactionManager.createTransaction()
│   ├─> Entries: [Debit Real Estate, Credit Cash]
│   ├─> Ledger.postTransaction()
│   └─> Journal.recordEntry()
├─> Update property.ownerId
├─> Add property to firm.properties[]
├─> EventBus.emit('property:traded')
└─> UIController.updateAllViews()
    ├─> RealEstateView.update() - show owned properties
    ├─> AccountingView.update() - show new balance sheet
    └─> ProductionView.update() - show new capabilities
```

### 5.5 AI Firm Decision Flow (Each Day)

```
EventBus.emit('time:dayEnd')
├─> For each AI firm:
    └─> FirmAI.makeDecisions()
        ├─> Evaluate financial position
        │   └─> FinancialStatements.generateIncomeStatement()
        │
        ├─> Decide production
        │   ├─> Check market prices for sellable products
        │   ├─> Check inventory for inputs
        │   ├─> Calculate profitability
        │   └─> ProductionChains.startProduction() if profitable
        │
        ├─> Decide purchases
        │   ├─> Check production needs
        │   ├─> MarketSystem.getPrice() for inputs
        │   └─> MarketSystem.recordDemand() for needed inputs
        │
        ├─> Decide sales
        │   ├─> Check finished goods inventory
        │   ├─> MarketSystem.getPrice() for outputs
        │   └─> MarketSystem.recordSupply() for sellable goods
        │
        └─> Decide real estate (occasionally)
            ├─> If profitable and need capacity
            └─> PropertyManager.buyProperty()
```

### 5.6 Save/Load Flow

**Save:**
```
User clicks "Save Game"
├─> SaveManager.generateSaveKey()
├─> StateManager.getState() - get complete state
├─> Add current timestamp
├─> Serializer.serialize() - convert to JSON
├─> Optional: Serializer.compress()
├─> Display save key in UI
└─> User copies to clipboard
```

**Load:**
```
User clicks "Load Game", pastes save key
├─> SaveManager.loadFromSaveKey(saveKey)
├─> Serializer.deserialize() - parse JSON
├─> Validate structure
├─> TimeReconciliation.reconcileTime()
│   ├─> Calculate days elapsed
│   └─> FastForward simulation (without UI updates)
│       └─> For each day: SimulationEngine.tick()
├─> StateManager.setState() - replace current state
├─> EventBus.emit('state:loaded')
└─> UIController.updateAllViews()
```

### 5.7 Module Dependency Graph

```
Layer 1 (No dependencies):
├─ event-bus.js
├─ chart-of-accounts.js
├─ product-registry.js
├─ property-types.js
├─ date-utils.js
├─ math-utils.js
└─ validation.js

Layer 2 (Depends on Layer 1):
├─ state-manager.js
├─ journal.js
├─ ledger.js
└─ inventory.js

Layer 3 (Depends on Layer 1-2):
├─ transaction-manager.js
├─ financial-statements.js
├─ property-manager.js
└─ production-chains.js

Layer 4 (Depends on Layer 1-3):
├─ market-system.js
├─ firm.js
├─ facility.js
└─ serializer.js

Layer 5 (Depends on Layer 1-4):
├─ firm-ai.js
├─ time-reconciliation.js
└─ save-manager.js

Layer 6 (Depends on Layer 1-5):
├─ simulation-engine.js
└─ UI modules (dashboard.js, accounting-view.js, etc.)

Layer 7 (Top level):
└─ ui-controller.js
```

---

## 6. Critical Architectural Decisions

### Decision 1: Module System
**Options:**
1. ES6 modules with `import/export`
2. IIFE with global namespace
3. CommonJS-style (not browser-native)

**Recommendation:** ES6 modules
- **Pros:** Native browser support, explicit dependencies, better tooling
- **Cons:** Requires `type="module"` in HTML
- **Chosen:** ES6 modules for clean, modern code

### Decision 2: State Management
**Options:**
1. Centralized state in `StateManager`
2. Distributed state across modules
3. Immutable state with reducers (Redux-style)

**Recommendation:** Centralized state with direct mutation
- **Pros:** Simplicity, easy serialization, straightforward debugging
- **Cons:** No built-in undo/redo, harder to track changes
- **Chosen:** Centralized mutable state for simplicity

### Decision 3: Event Communication
**Options:**
1. Event bus (pub/sub)
2. Direct function calls
3. Callbacks passed as dependencies

**Recommendation:** Event bus for decoupling
- **Pros:** Loose coupling, easy to add listeners, clear event flow
- **Cons:** Harder to trace, potential for event spam
- **Chosen:** Event bus for time events, direct calls for user actions

### Decision 4: Market Clearing
**Options:**
1. Continuous (every tick)
2. Periodic (once per day/hour)
3. On-demand (when orders placed)

**Recommendation:** Daily market clearing
- **Pros:** Predictable, allows batching, realistic
- **Cons:** Delays transactions slightly
- **Chosen:** Clear market once per day at end-of-day event

### Decision 5: Price Discovery Algorithm
**Options:**
1. Supply/demand ratio adjustment
2. Order book with bid/ask spread
3. Walrasian auction (equilibrium price)

**Recommendation:** Supply/demand ratio with elasticity
- **Pros:** Simple, predictable, computationally cheap
- **Cons:** Less realistic than order books
- **Chosen:** Ratio-based for initial version (can upgrade later)

**Formula:**
```javascript
excessDemand = (demand - supply) / (demand + supply);
priceChange = basePrice * excessDemand * elasticity;
newPrice = Math.max(minPrice, currentPrice + priceChange);
```

### Decision 6: AI Firm Strategy
**Options:**
1. Profit-maximizing (aggressive)
2. Break-even targeting (conservative)
3. Random/simple rules

**Recommendation:** Break-even targeting
- **Pros:** Creates stable market, not overly competitive, realistic for established firms
- **Cons:** Less dynamic, predictable
- **Chosen:** AI firms target small profit margin (~5%) for stability

### Decision 7: Time Advancement
**Options:**
1. Fixed time step (1 tick = 1 day)
2. Variable time step (user controlled)
3. Real-time with multiplier

**Recommendation:** Fixed time step with configurable multiplier
- **Pros:** Predictable simulation, easy to reason about, configurable speed
- **Cons:** Can't pause mid-day
- **Chosen:** 1 tick = 1 day, multiplier controls ticks per second

### Decision 8: Session Save Format
**Options:**
1. Plain JSON
2. Compressed JSON (LZString)
3. Binary format

**Recommendation:** Plain JSON initially, compression optional
- **Pros:** Human-readable, debuggable, easy to implement
- **Cons:** Large save strings
- **Chosen:** JSON with optional compression for long games

### Decision 9: UI Framework
**Options:**
1. Vanilla JS with manual DOM updates
2. Lightweight virtual DOM (preact, etc.)
3. Template library (lit-html, etc.)

**Recommendation:** Vanilla JS with template literals
- **Pros:** No dependencies, full control, meets requirements
- **Cons:** More verbose, no reactivity
- **Chosen:** Vanilla for requirement compliance

### Decision 10: Accounting Transaction Validation
**Options:**
1. Validate on creation
2. Validate on commit
3. No validation (trust callers)

**Recommendation:** Validate on creation
- **Pros:** Fail fast, catch errors early, maintain integrity
- **Cons:** Performance overhead (negligible)
- **Chosen:** Strict validation on every transaction

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Core Infrastructure)
**Goal:** Set up project structure and core systems

**Tasks:**
1. Create file structure with all module files (empty stubs)
2. Implement `event-bus.js` - event system
3. Implement `state-manager.js` - central state
4. Implement `date-utils.js` - calendar functions
5. Implement `math-utils.js` - calculations
6. Implement `validation.js` - validators
7. Create `index.html` with module imports
8. Create `style.css` with base styles
9. Test: Module imports work, event bus functional

**Deliverable:** Project skeleton with core utilities

---

### Phase 2: Accounting System
**Goal:** Implement complete double-entry bookkeeping

**Tasks:**
1. Implement `chart-of-accounts.js` - account definitions
2. Implement `journal.js` - transaction journal
3. Implement `ledger.js` - account balances
4. Implement `transaction-manager.js` - transaction creation/validation
5. Implement `financial-statements.js` - statement generation
6. Create test transactions and verify balance
7. Test: Create transactions, verify debits = credits, generate statements

**Deliverable:** Working accounting system with financial statements

---

### Phase 3: Economy Foundation
**Goal:** Products, inventory, and basic market

**Tasks:**
1. Implement `product-registry.js` - define initial products
   - Steel (raw material)
   - Components (intermediate)
   - Machinery (finished goods)
2. Implement `inventory.js` - inventory tracking
3. Implement `market-system.js` - supply/demand/pricing
4. Integrate market with accounting (trades create transactions)
5. Test: Products exist, market prices adjust, trades work

**Deliverable:** Functional market with price discovery

---

### Phase 4: Firms and Production
**Goal:** Firm entities and production chains

**Tasks:**
1. Implement `firm.js` - firm class and operations
2. Implement `production-chains.js` - production logic
3. Create initial AI firms with starting capital
4. Implement `firm-ai.js` - basic AI decision-making
5. Integrate production with accounting
6. Test: Firms can produce, AI firms operate autonomously

**Deliverable:** Working production system with AI firms

---

### Phase 5: Real Estate System
**Goal:** Property ownership and facilities

**Tasks:**
1. Implement `property-types.js` - define property types
2. Implement `property-manager.js` - ownership and transactions
3. Implement `facility.js` - production capabilities
4. Create initial property inventory
5. Integrate properties with production (capacity constraints)
6. Integrate properties with accounting (purchase transactions)
7. Test: Can buy/sell properties, properties enable production

**Deliverable:** Working real estate system

---

### Phase 6: Simulation Engine
**Goal:** Time system and main loop

**Tasks:**
1. Implement `simulation-engine.js` - time and loop
2. Wire up simulation events:
   - `time:tick` - each day
   - `time:dayEnd` - end of day
   - `time:monthEnd` - end of month
3. Implement daily routines:
   - Market clearing
   - Production updates
   - AI decisions
4. Test: Simulation runs, time advances, AI firms operate

**Deliverable:** Complete simulation loop

---

### Phase 7: User Interface (Part 1 - Core Views)
**Goal:** Basic UI for viewing and interacting

**Tasks:**
1. Implement `ui-controller.js` - view management
2. Implement `dashboard.js` - main overview
   - Firm summary
   - Cash and inventory
   - Current date and speed controls
3. Implement `accounting-view.js` - financial statements
   - Balance sheet
   - Income statement
   - Cash flow statement
4. Basic styling and layout
5. Test: Can view firm state and financials

**Deliverable:** Basic viewable UI

---

### Phase 8: User Interface (Part 2 - Interaction Views)
**Goal:** UI for user actions

**Tasks:**
1. Implement `market-view.js` - trading interface
   - View prices
   - Buy/sell products
   - View trade history
2. Implement `production-view.js` - production management
   - View production capabilities
   - Start production runs
   - View active production
3. Implement `real-estate-view.js` - property management
   - View owned properties
   - Buy/sell properties
   - View property capabilities
4. Implement `firm-management-view.js` - firm overview
5. Test: Can perform all user actions through UI

**Deliverable:** Complete interactive UI

---

### Phase 9: Session Management
**Goal:** Save/load functionality

**Tasks:**
1. Implement `serializer.js` - state serialization
2. Implement `save-manager.js` - save/load UI
3. Implement `time-reconciliation.js` - fast-forward on load
4. Add save/load buttons to UI
5. Test: Can save, reload page, load save, simulation continues

**Deliverable:** Working session save/load

---

### Phase 10: Polish and Testing
**Goal:** Refinements and bug fixes

**Tasks:**
1. Balance initial market state (AI firms at break-even)
2. Tune price discovery algorithm
3. Improve AI decision-making
4. Add user onboarding/tutorial messages
5. Comprehensive testing:
   - Accounting always balances
   - Market reaches equilibrium
   - AI firms remain solvent
   - Production chains work correctly
   - Save/load preserves state
6. Performance optimization
7. Mobile responsive styling
8. Accessibility improvements

**Deliverable:** Polished, bug-free application

---

### Phase 11: Advanced Features (Optional/Future)
**Goal:** Enhancements beyond MVP

**Potential additions:**
1. More products and production chains
2. Technology upgrades (improve production efficiency)
3. Marketing campaigns (increase demand)
4. Labor management (hire workers, wage effects)
5. Loans and interest (borrow capital)
6. Multi-property firms (chain stores)
7. Competitor analysis (view AI firm financials)
8. Charts and graphs (price history, financials over time)
9. Achievements and milestones
10. Multiple save slots

---

## Implementation Notes

### Development Order Rationale
- **Bottom-up approach:** Build foundation first (utils, accounting) before higher-level systems
- **Independent modules first:** Implement modules with no dependencies early
- **Test as you go:** Each phase should have working, testable functionality
- **UI last:** Business logic stable before UI to avoid UI rewrites

### Testing Strategy
- Manual testing after each phase
- Create test scenarios for each system:
  - Accounting: Verify transactions balance, statements accurate
  - Market: Verify prices respond to supply/demand
  - Production: Verify inputs consumed, outputs created
  - AI: Verify firms make reasonable decisions
  - Save/Load: Verify state preserved accurately

### Code Quality Guidelines
- Clear function and variable names
- Comments for complex logic
- Consistent formatting
- Keep functions small and focused
- Avoid premature optimization
- Prioritize readability over cleverness

### Future Extensibility Considerations
- Product definitions in data (easy to add more)
- Property types in data (easy to add more)
- Chart of accounts can be extended
- AI strategies can be swapped
- Market clearing algorithm can be replaced
- UI views can be added without touching business logic

---

## Conclusion

This architecture provides:
1. **Clear separation of concerns** - Each module has a single responsibility
2. **Minimal coupling** - Modules interact through well-defined interfaces
3. **Easy navigation** - File structure matches conceptual model
4. **Testability** - Systems can be tested independently
5. **Extensibility** - New features can be added without major refactoring
6. **Maintainability** - Changes localized to relevant modules

The roadmap progresses logically from foundation to complete application, with each phase delivering working functionality.

**Estimated Complexity:**
- **Total Code:** ~3,000-5,000 lines of JavaScript
- **Files:** ~28 modules + HTML/CSS
- **Development Time:** Substantial project requiring careful implementation

This design balances simplicity with completeness, providing a solid foundation for a sophisticated market economy simulator while remaining manageable to implement and maintain.

---

**Document Status:** Architecture design complete, ready for implementation
**Next Steps:** Begin Phase 1 (Foundation) implementation
