# Educational Cryptocurrency / Blockchain Applet

An interactive educational tool for learning cryptocurrency and blockchain mechanics through hands-on experimentation. This applet implements a fully functional proof-of-work blockchain that runs entirely in your browser with no external dependencies or data persistence.

## Features

### 🔧 Configurable Blockchain Parameters
- **Block Time Target**: Set desired time between blocks (1-600 seconds)
- **Initial Difficulty**: Configure proof-of-work difficulty (1-8 leading zeros)
- **Block Rewards**: Set mining rewards and optional halving schedules
- **Supply Cap**: Optional maximum supply limit
- **Difficulty Adjustment**: Automatic difficulty tuning to maintain target block time

### ⛏️ Browser-Based Mining
- **Web Worker Mining**: Non-blocking proof-of-work computation
- **Real-time Statistics**: Hash rate, attempts, elapsed time
- **Throttle Control**: Adjust mining speed for observation and learning
- **Progress Monitoring**: Watch the mining process in action

### 💰 Full Wallet System
- **Multiple Addresses**: Create and manage multiple wallet addresses
- **UTXO Tracking**: Bitcoin-style unspent transaction output model
- **Transaction Creation**: Send coins between addresses with proper fee handling
- **Balance Calculation**: Automatic balance tracking across all addresses
- **Double-spend Prevention**: Built-in transaction validation

### 🔍 Blockchain Explorer
- **Block Browser**: View all blocks with full details
- **Transaction History**: Explore all transactions in each block
- **Mempool Viewer**: See pending transactions waiting to be mined
- **Chain Validation**: Real-time blockchain integrity checking
- **Statistics Dashboard**: Total blocks, supply, average block time, and more

### 📊 Visualizations
- **Difficulty Chart**: Track difficulty adjustments over time
- **Block Time Distribution**: Compare actual vs target block times
- **Supply Curve**: Visualize total coin creation

### 💾 Export / Import
- **JSON Export**: Save entire blockchain state
- **Session Restore**: Load previously exported blockchains
- **No Data Persistence**: Fresh start on every refresh (unless imported)
- **Clipboard Support**: Quick copy/paste for sharing

### 📚 Educational Content
- Explanations of key concepts (proof-of-work, UTXO, difficulty adjustment, etc.)
- Interactive learning through experimentation
- Real blockchain mechanics without the complexity

## Presets

### Bitcoin-like
- 600 second block time (10 minutes)
- 21 million coin supply cap
- Reward halving every 210,000 blocks
- Difficulty adjustment every 2,016 blocks

### Fast Learning
- 10 second block time
- 1 million coin supply cap
- Frequent difficulty adjustments
- Quick iteration for learning

### Inflationary
- 30 second block time
- No supply cap
- Constant block rewards
- Demonstrates non-deflationary model

## How It Works

### Proof-of-Work Mining

The applet uses a custom JavaScript SHA-256 implementation to perform proof-of-work mining. Miners search for a "nonce" value that, when hashed with the block data, produces a hash with the required number of leading zeros.

```
Block Hash = SHA256(index + timestamp + transactions + previousHash + nonce)
Valid if: Hash starts with N zeros (where N = difficulty)
```

### Difficulty Adjustment

Every N blocks (configurable), the blockchain analyzes recent block times and adjusts difficulty:

- **Blocks too slow**: Decrease difficulty (easier to mine)
- **Blocks too fast**: Increase difficulty (harder to mine)
- **Target**: Maintain average block time close to configured target

### UTXO Model

Instead of account balances, the blockchain tracks Unspent Transaction Outputs (UTXOs):

1. Each transaction consumes previous outputs as inputs
2. Creates new outputs for recipients
3. Your balance = sum of all UTXOs you control
4. Prevents double-spending through UTXO validation

### Transaction Fees

Transactions include fees calculated as:

```
Fee = Sum(inputs) - Sum(outputs)
```

Miners receive fees in addition to block rewards.

## Technical Details

### Architecture
- **Pure Vanilla JavaScript**: No frameworks, no build process
- **ES6 Modules**: Clean, maintainable code structure
- **Web Workers**: Background mining keeps UI responsive
- **HTML5 Canvas**: Lightweight chart rendering

### Files
- `index.html` - Main user interface
- `style.css` - Responsive styling
- `script.js` - UI controller and application logic
- `blockchain.js` - Core blockchain implementation
- `crypto-utils.js` - SHA-256 and cryptographic utilities
- `wallet.js` - Wallet and UTXO management
- `miner.js` - Mining controller
- `mining-worker.js` - Web Worker for proof-of-work
- `visualizations.js` - Chart rendering

### Browser Compatibility
- **Chrome/Edge**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Mobile**: iOS 14+, Chrome Mobile

Requires:
- Web Workers
- ES6 modules
- HTML5 Canvas

## Usage

### Getting Started

1. **Configure Your Blockchain**
   - Choose a preset or customize parameters
   - Set block time, difficulty, rewards, and supply caps
   - Click "Create Genesis Block"

2. **Start Mining**
   - Mining creates new blocks and earns rewards
   - Adjust throttle to control mining speed
   - Watch hash rate and progress in real-time

3. **Manage Your Wallet**
   - Create new addresses as needed
   - View balances for each address
   - Send transactions between addresses

4. **Explore the Blockchain**
   - Browse all blocks and transactions
   - Verify chain integrity
   - View pending transactions in mempool

5. **Experiment and Learn**
   - Try different difficulty settings
   - Observe difficulty adjustments
   - Create transaction chains
   - Visualize blockchain growth

### Tips for Learning

- **Start with Fast Learning preset**: Quick feedback for experimentation
- **Adjust throttle to 50-100%**: Observe mining process more clearly
- **Mine several blocks**: See difficulty adjustment in action
- **Create multiple addresses**: Practice transaction creation
- **Export and compare**: Try different configurations and compare results

## Educational Goals

This applet helps you understand:

1. **Proof-of-Work**: Why mining is computationally expensive
2. **Difficulty Adjustment**: How blockchains maintain consistent block times
3. **UTXO Model**: How Bitcoin-style transaction tracking works
4. **Transaction Validation**: Preventing double-spends and invalid transactions
5. **Block Structure**: Components of a block and how they link together
6. **Merkle Trees**: Simplified transaction hashing (merkle root)
7. **Mining Economics**: Block rewards, halvings, and supply schedules
8. **Transaction Fees**: Miner incentives beyond block rewards

## Limitations

This is an educational tool with intentional simplifications:

- **No cryptographic signatures**: Simplified address validation
- **No network**: Single-node blockchain (your browser only)
- **No persistent storage**: Data lost on refresh (unless exported)
- **Simplified Merkle tree**: Hash of all transactions, not full tree
- **No mining pools**: Solo mining only
- **Basic fee market**: No priority or complex fee estimation

## Future Enhancements

Potential additions for deeper learning:

- Multiple mining algorithms (Scrypt, Ethash simulation)
- Network simulation with multiple "nodes"
- Smart contracts (simple scripting)
- More sophisticated fee markets
- Full Merkle tree implementation
- Bloom filters and SPV clients
- SegWit simulation
- Lightning network basics

## License

This educational tool is part of nhoffie.github.io and is provided as-is for learning purposes.

## Credits

Created as an educational resource to help people understand cryptocurrency mechanics through hands-on experimentation.

**Note**: This applet has no real monetary value and creates no actual cryptocurrency. All coins and transactions exist only in your browser session.

---

**Part of [nhoffie.github.io](../../index.html)**
