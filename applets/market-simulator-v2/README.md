# Market Economy Simulator V2

A comprehensive business and market economy simulator where you operate a new firm in an established market economy.

## Overview

Market Economy Simulator V2 is a single-page business simulation game built with vanilla HTML, CSS, and JavaScript. You start as a new firm in a functioning market economy with existing AI competitors, managing production, sales, finances, and real estate while adhering to real-world accounting principles.

## Key Features

### Economic Simulation
- **Closed Economy**: Self-contained market with no external resources
- **Dynamic Pricing**: Market prices adjust based on supply and demand
- **Production Chains**: Products can be manufactured using other products as inputs
- **AI Competitors**: Computer-controlled firms operate alongside you, trying to break even

### Business Management
- **Production Management**: Manufacture products using raw materials and intermediate goods
- **Market Trading**: Buy inputs and sell finished goods on the open market
- **Real Estate**: Purchase properties to expand production capacity and market presence
- **Inventory Management**: Track and manage your stock of materials and finished goods

### Accounting System
- **Double-Entry Bookkeeping**: All transactions follow strict accounting principles
- **Real-Time Financial Statements**:
  - Balance Sheet: Assets, liabilities, and equity
  - Income Statement: Revenue, expenses, and net income
  - Cash Flow Statement: Operating, investing, and financing activities
- **Complete Audit Trail**: Every transaction logged with full details
- **GAAP-Compliant**: Follows Generally Accepted Accounting Principles

### Time System
- **Simulated Calendar**: Year 1, Month 1, Day 1 at start (12 months/year, 28 days/month)
- **Accelerated Time**: Simulation runs faster than real-time
- **Time Advancement**: When loading a saved game, simulation automatically advances based on real-world time elapsed

### Session Management
- **Save System**: Generate a save key containing your complete game state and timestamp
- **Load System**: Restore your game from a save key
- **No Automatic Persistence**: Game state is not automatically saved - you control when to save
- **Time-Based Restoration**: Loading an old save automatically fast-forwards the simulation

## How to Play

### Starting Out
1. You begin with a new firm and limited starting capital
2. The market already has established AI firms operating at break-even
3. You must raise capital through smart business decisions before expanding
4. Your goal is to build a profitable, sustainable business

### Basic Workflow
1. **Analyze the Market**: Check current prices for products
2. **Plan Production**: Decide what to produce based on profit margins
3. **Purchase Inputs**: Buy raw materials or intermediate goods
4. **Produce Goods**: Use your facilities to manufacture products
5. **Sell Output**: Sell finished goods on the market
6. **Monitor Finances**: Track your income statement and balance sheet
7. **Expand**: Purchase real estate to increase production capacity
8. **Repeat**: Continuously optimize your operations

### Tips for Success
- Start small and focus on one product type
- Watch your cash flow carefully
- AI firms set market prices - adapt to the market, don't fight it
- Production chains can be profitable if managed well
- Real estate is a significant investment - plan carefully
- Review your financial statements regularly
- Save your game periodically (especially before major decisions)

## Game Concepts

### Products
Products are categorized into three types:
- **Raw Materials**: Basic resources (no inputs required)
- **Intermediate Goods**: Processed materials (require raw materials as inputs)
- **Finished Goods**: Final products (require intermediate goods as inputs)

### Production
To produce a product, you need:
1. A production facility (property) capable of making that product
2. Required input materials in your inventory
3. Time for the production process to complete

### Market System
- Firms can place supply orders (selling) and demand orders (buying)
- The market clears daily, matching buyers with sellers
- Prices adjust based on excess supply or demand
- All trades are executed at the current market price

### Real Estate
Properties provide:
- **Production Capacity**: Enable manufacturing of certain products
- **Retail Presence**: Increase sales capacity
- **Storage**: Warehouse space for inventory
- **Administrative Space**: Office buildings reduce overhead

### AI Firms
Computer-controlled firms:
- Operate established businesses already at break-even
- Make daily decisions about production, trading, and expansion
- Follow conservative strategies (not aggressively competitive)
- Respond to market conditions just like you do

## Financial Statements Explained

### Balance Sheet
Shows your financial position at a point in time:
- **Assets**: What you own (cash, inventory, real estate)
- **Liabilities**: What you owe (loans, payables)
- **Equity**: Your net worth (assets - liabilities)

### Income Statement
Shows profitability over a period:
- **Revenue**: Income from sales
- **Expenses**: Costs of operations (COGS, wages, rent, etc.)
- **Net Income**: Profit or loss (revenue - expenses)

### Cash Flow Statement
Shows cash movement over a period:
- **Operating Activities**: Cash from business operations
- **Investing Activities**: Cash from buying/selling assets
- **Financing Activities**: Cash from loans and capital

## Saving and Loading

### To Save Your Game:
1. Click the "Save Game" button
2. A save key will be generated (JSON string with timestamp)
3. Copy the save key to your clipboard
4. Store it safely (paste into a text file, note-taking app, etc.)

### To Load Your Game:
1. Click the "Load Game" button
2. Paste your save key
3. Click "Restore"
4. The simulation will automatically fast-forward based on real-world time elapsed since the save
5. Your game continues from where you left off

**Important**: Reloading the page without saving will lose all progress!

## Technical Details

- **Technology**: Pure vanilla HTML, CSS, and JavaScript
- **Dependencies**: None - works completely offline
- **Browser Requirements**: Modern browser with ES6 module support
- **Persistence**: Manual save/load via session keys
- **Data Format**: JSON (optionally compressed for long games)

## Development Status

This applet is currently in **architecture/planning phase**. The complete technical architecture has been designed and documented. Implementation will proceed in phases:

1. ✅ Foundation (core utilities and infrastructure)
2. ⏳ Accounting system (double-entry bookkeeping)
3. ⏳ Economy foundation (products, inventory, market)
4. ⏳ Firms and production (entities and production chains)
5. ⏳ Real estate system (properties and facilities)
6. ⏳ Simulation engine (time and main loop)
7. ⏳ User interface (views and interactions)
8. ⏳ Session management (save/load)
9. ⏳ Polish and testing
10. ⏳ Advanced features (future enhancements)

For detailed technical documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Credits

- **Concept**: Business economy simulator with GAAP-compliant accounting
- **Architecture**: Modular vanilla JavaScript design
- **Target Audience**: Business simulation enthusiasts, economics students, accounting learners

## License

Part of [nhoffie.github.io](../../index.html) - personal portfolio of interactive web applets.

---

**Status**: Architecture complete, implementation in progress
**Last Updated**: 2025-12-18
