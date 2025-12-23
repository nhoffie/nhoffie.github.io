/**
 * Main UI Controller for Educational Cryptocurrency Applet
 * Manages all user interactions and state
 */

import { Blockchain, BlockchainConfig } from './blockchain.js';
import { Wallet } from './wallet.js';
import { Miner } from './miner.js';
import { generateAddress } from './crypto-utils.js';
import { updateAllCharts } from './visualizations.js';

/**
 * Application state
 */
class App {
  constructor() {
    this.blockchain = null;
    this.wallet = null;
    this.miner = null;
    this.hasGenesis = false;
    this.updateInterval = null;

    this.init();
  }

  /**
   * Initialize application
   */
  init() {
    this.setupEventListeners();
    this.loadPresets();
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Configuration form
    document.getElementById('config-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.createGenesisBlock();
    });

    // Preset buttons
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.applyPreset(btn.dataset.preset);
      });
    });

    // Mining controls
    document.getElementById('start-mining-btn').addEventListener('click', () => {
      this.startMining();
    });

    document.getElementById('stop-mining-btn').addEventListener('click', () => {
      this.stopMining();
    });

    document.getElementById('mining-throttle').addEventListener('input', (e) => {
      this.updateThrottle(e.target.value);
    });

    // Wallet controls
    document.getElementById('new-address-btn').addEventListener('click', () => {
      this.createNewAddress();
    });

    document.getElementById('send-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.sendTransaction();
    });

    document.getElementById('send-from').addEventListener('change', (e) => {
      this.updateAvailableBalance(e.target.value);
    });

    // Export/Import
    document.getElementById('export-json-btn').addEventListener('click', () => {
      this.exportBlockchain();
    });

    document.getElementById('copy-json-btn').addEventListener('click', () => {
      this.copyBlockchainToClipboard();
    });

    document.getElementById('import-btn').addEventListener('click', () => {
      document.getElementById('import-file').click();
    });

    document.getElementById('import-file').addEventListener('change', (e) => {
      this.importBlockchain(e.target.files[0]);
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
      this.resetBlockchain();
    });
  }

  /**
   * Load preset configurations
   */
  loadPresets() {
    this.presets = {
      bitcoin: {
        blockTimeTarget: 600,
        initialDifficulty: 4,
        blockReward: 50,
        maxSupply: 21000000,
        rewardHalvingInterval: 210000,
        difficultyAdjustmentInterval: 2016,
        genesisMessage: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks'
      },
      fast: {
        blockTimeTarget: 10,
        initialDifficulty: 3,
        blockReward: 10,
        maxSupply: 1000000,
        rewardHalvingInterval: 1000,
        difficultyAdjustmentInterval: 10,
        genesisMessage: 'Fast learning blockchain for education'
      },
      inflationary: {
        blockTimeTarget: 30,
        initialDifficulty: 4,
        blockReward: 100,
        maxSupply: 0,
        rewardHalvingInterval: 0,
        difficultyAdjustmentInterval: 20,
        genesisMessage: 'Inflationary cryptocurrency with no supply cap'
      }
    };
  }

  /**
   * Apply a preset configuration
   */
  applyPreset(presetName) {
    const preset = this.presets[presetName];
    if (!preset) return;

    document.getElementById('block-time-target').value = preset.blockTimeTarget;
    document.getElementById('initial-difficulty').value = preset.initialDifficulty;
    document.getElementById('block-reward').value = preset.blockReward;
    document.getElementById('max-supply').value = preset.maxSupply;
    document.getElementById('halving-interval').value = preset.rewardHalvingInterval;
    document.getElementById('difficulty-interval').value = preset.difficultyAdjustmentInterval;
    document.getElementById('genesis-message').value = preset.genesisMessage;

    this.showToast(`Loaded ${presetName} preset`, 'info');
  }

  /**
   * Create genesis block
   */
  createGenesisBlock() {
    const config = new BlockchainConfig({
      blockTimeTarget: parseInt(document.getElementById('block-time-target').value) * 1000,
      initialDifficulty: parseInt(document.getElementById('initial-difficulty').value),
      blockReward: parseFloat(document.getElementById('block-reward').value),
      maxSupply: parseFloat(document.getElementById('max-supply').value),
      rewardHalvingInterval: parseInt(document.getElementById('halving-interval').value),
      difficultyAdjustmentInterval: parseInt(document.getElementById('difficulty-interval').value),
      genesisMessage: document.getElementById('genesis-message').value
    });

    this.blockchain = new Blockchain(config);
    this.blockchain.createGenesisBlock();

    this.wallet = new Wallet(this.blockchain);
    this.miner = new Miner(this.blockchain);

    // Create first address
    this.wallet.createAddress('Primary Address');

    this.hasGenesis = true;

    // Show main interface
    document.getElementById('config-panel').classList.add('hidden');
    document.getElementById('main-interface').classList.remove('hidden');

    // Update UI
    this.updateAllUI();

    // Start update interval
    this.updateInterval = setInterval(() => this.updateStats(), 1000);

    this.showToast('Genesis block created!', 'success');
  }

  /**
   * Start mining
   */
  async startMining() {
    if (!this.hasGenesis) return;

    const addresses = this.wallet.getAddresses();
    if (addresses.length === 0) {
      this.showToast('Please create an address first', 'error');
      return;
    }

    const minerAddress = addresses[0].address;

    document.getElementById('start-mining-btn').classList.add('hidden');
    document.getElementById('stop-mining-btn').classList.remove('hidden');
    document.getElementById('mining-status').textContent = 'Mining...';
    document.getElementById('mining-progress').classList.remove('hidden');

    try {
      await this.miner.startMining(
        minerAddress,
        (progress) => this.onMiningProgress(progress),
        (result) => this.onMiningComplete(result),
        (error) => this.onMiningError(error)
      );
    } catch (error) {
      this.showToast(`Mining error: ${error.message}`, 'error');
      this.resetMiningUI();
    }
  }

  /**
   * Stop mining
   */
  stopMining() {
    this.miner.stopMining();
    this.resetMiningUI();
    this.showToast('Mining stopped', 'info');
  }

  /**
   * Mining progress callback
   */
  onMiningProgress(progress) {
    document.getElementById('mining-block-num').textContent = progress.blockIndex;
    document.getElementById('hash-rate').textContent = `${progress.hashRate.toLocaleString()} H/s`;
    document.getElementById('mining-attempts').textContent = `${progress.attempts.toLocaleString()} attempts`;
    document.getElementById('mining-time').textContent = `${(progress.elapsed / 1000).toFixed(1)}s`;
  }

  /**
   * Mining complete callback
   */
  onMiningComplete(result) {
    this.showToast(
      `Block #${result.block.index} mined! Reward: ${this.blockchain.config.getBlockReward(result.block.index)} coins`,
      'success'
    );

    this.resetMiningUI();
    this.updateAllUI();

    // Auto-start next block if mining was in progress
    if (this.miner.isMining()) {
      setTimeout(() => this.startMining(), 500);
    }
  }

  /**
   * Mining error callback
   */
  onMiningError(error) {
    this.showToast(`Mining error: ${error.message}`, 'error');
    this.resetMiningUI();
  }

  /**
   * Reset mining UI
   */
  resetMiningUI() {
    document.getElementById('start-mining-btn').classList.remove('hidden');
    document.getElementById('stop-mining-btn').classList.add('hidden');
    document.getElementById('mining-status').textContent = 'Idle';
    document.getElementById('mining-progress').classList.add('hidden');
    document.getElementById('hash-rate').textContent = '0 H/s';
  }

  /**
   * Update mining throttle
   */
  updateThrottle(value) {
    const throttle = parseInt(value);
    const speed = 100 - throttle;
    document.getElementById('throttle-value').textContent = `${speed}%`;

    if (this.miner) {
      this.miner.setThrottle(throttle);
    }
  }

  /**
   * Create new address
   */
  createNewAddress() {
    if (!this.hasGenesis) return;

    const label = `Address ${this.wallet.getAddresses().length + 1}`;
    this.wallet.createAddress(label);

    this.updateWalletUI();
    this.showToast('New address created', 'success');
  }

  /**
   * Send transaction
   */
  sendTransaction() {
    if (!this.hasGenesis) return;

    const fromAddress = document.getElementById('send-from').value;
    const toAddress = document.getElementById('send-to').value;
    const amount = parseFloat(document.getElementById('send-amount').value);

    if (!fromAddress || !toAddress || !amount) {
      this.showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      const txId = this.wallet.send(fromAddress, toAddress, amount);
      this.showToast('Transaction added to mempool', 'success');

      // Reset form
      document.getElementById('send-to').value = '';
      document.getElementById('send-amount').value = '';

      this.updateMempoolUI();
      this.updateWalletUI();
    } catch (error) {
      this.showToast(`Transaction failed: ${error.message}`, 'error');
    }
  }

  /**
   * Update available balance display
   */
  updateAvailableBalance(address) {
    if (!address) {
      document.getElementById('available-balance').textContent = '0.00000000';
      return;
    }

    const balance = this.wallet.getAddressBalance(address);
    document.getElementById('available-balance').textContent = balance.toFixed(8);
  }

  /**
   * Export blockchain as JSON
   */
  exportBlockchain() {
    if (!this.hasGenesis) return;

    const data = {
      ...this.blockchain.toJSON(),
      wallet: this.wallet.toJSON()
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `blockchain_${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);

    this.showToast('Blockchain exported', 'success');
  }

  /**
   * Copy blockchain JSON to clipboard
   */
  async copyBlockchainToClipboard() {
    if (!this.hasGenesis) return;

    const data = {
      ...this.blockchain.toJSON(),
      wallet: this.wallet.toJSON()
    };

    const json = JSON.stringify(data, null, 2);

    try {
      await navigator.clipboard.writeText(json);
      this.showToast('Copied to clipboard', 'success');
    } catch (error) {
      this.showToast('Failed to copy to clipboard', 'error');
    }
  }

  /**
   * Import blockchain from file
   */
  async importBlockchain(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      this.blockchain = Blockchain.fromJSON(data);
      this.wallet = Wallet.fromJSON(data.wallet, this.blockchain);
      this.miner = new Miner(this.blockchain);

      this.hasGenesis = true;

      document.getElementById('config-panel').classList.add('hidden');
      document.getElementById('main-interface').classList.remove('hidden');

      this.updateAllUI();

      this.showToast('Blockchain imported successfully', 'success');
    } catch (error) {
      this.showToast(`Import failed: ${error.message}`, 'error');
    }
  }

  /**
   * Reset blockchain
   */
  resetBlockchain() {
    if (!confirm('Are you sure you want to reset? All data will be lost.')) {
      return;
    }

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    if (this.miner && this.miner.isMining()) {
      this.miner.stopMining();
    }

    this.blockchain = null;
    this.wallet = null;
    this.miner = null;
    this.hasGenesis = false;

    document.getElementById('main-interface').classList.add('hidden');
    document.getElementById('config-panel').classList.remove('hidden');

    this.showToast('Blockchain reset', 'info');
  }

  /**
   * Update all UI elements
   */
  updateAllUI() {
    this.updateStats();
    this.updateWalletUI();
    this.updateExplorerUI();
    this.updateMempoolUI();
    updateAllCharts(this.blockchain);
  }

  /**
   * Update statistics
   */
  updateStats() {
    if (!this.hasGenesis) return;

    document.getElementById('total-blocks').textContent = this.blockchain.chain.length;
    document.getElementById('total-supply').textContent = this.blockchain.getTotalSupply().toFixed(2);
    document.getElementById('current-difficulty').textContent = this.blockchain.difficulty;

    const avgTime = this.blockchain.getAverageBlockTime(10);
    document.getElementById('avg-block-time').textContent = avgTime > 0 ? `${(avgTime / 1000).toFixed(1)}s` : 'N/A';

    const validity = this.blockchain.isChainValid();
    document.getElementById('chain-validity').textContent = validity.valid ? '✓' : '✗';
    document.getElementById('chain-validity').style.color = validity.valid ? 'var(--success-color)' : 'var(--danger-color)';
  }

  /**
   * Update wallet UI
   */
  updateWalletUI() {
    if (!this.hasGenesis) return;

    const totalBalance = this.wallet.getTotalBalance();
    document.getElementById('total-balance').textContent = totalBalance.toFixed(8);

    // Update address list
    const addressList = document.getElementById('address-list');
    const addresses = this.wallet.getAddresses();

    addressList.innerHTML = '';

    addresses.forEach(addr => {
      const balance = this.wallet.getAddressBalance(addr.address);

      const div = document.createElement('div');
      div.className = 'address-item';
      div.innerHTML = `
        <div class="address-header">
          <span class="address-label">${addr.label}</span>
          <span class="address-balance">${balance.toFixed(8)} coins</span>
        </div>
        <div class="address-string">${addr.address}</div>
      `;

      addressList.appendChild(div);
    });

    // Update send form dropdown
    const sendFrom = document.getElementById('send-from');
    const currentValue = sendFrom.value;

    sendFrom.innerHTML = '<option value="">Select address...</option>';

    addresses.forEach(addr => {
      const balance = this.wallet.getAddressBalance(addr.address);
      const option = document.createElement('option');
      option.value = addr.address;
      option.textContent = `${addr.label} (${balance.toFixed(8)} coins)`;
      sendFrom.appendChild(option);
    });

    if (currentValue) {
      sendFrom.value = currentValue;
    }
  }

  /**
   * Update blockchain explorer UI
   */
  updateExplorerUI() {
    if (!this.hasGenesis) return;

    const blockList = document.getElementById('block-list');
    blockList.innerHTML = '';

    // Show blocks in reverse order (newest first)
    const blocks = [...this.blockchain.chain].reverse();

    blocks.forEach(block => {
      const div = document.createElement('div');
      div.className = 'block-item';
      div.dataset.index = block.index;

      const isValid = block.isValid().valid;
      if (!isValid) {
        div.classList.add('invalid');
      }

      const date = new Date(block.timestamp).toLocaleString();
      const txCount = block.transactions.length;

      div.innerHTML = `
        <div class="block-header">
          <span class="block-index">Block #${block.index}</span>
          <span class="block-timestamp">${date}</span>
        </div>
        <div class="block-info">
          <span>Transactions: ${txCount}</span>
          <span>Difficulty: ${block.difficulty}</span>
          <span>Nonce: ${block.nonce}</span>
        </div>
        <div class="block-hash">Hash: ${block.hash}</div>
        <div class="block-details">
          <h4>Transactions:</h4>
          ${this.renderTransactions(block.transactions)}
        </div>
      `;

      div.addEventListener('click', () => {
        div.classList.toggle('expanded');
      });

      blockList.appendChild(div);
    });

    document.getElementById('export-size').textContent = this.blockchain.chain.length;
  }

  /**
   * Render transactions HTML
   */
  renderTransactions(transactions) {
    return transactions.map(tx => {
      const type = tx.isCoinbase ? 'Coinbase' : 'Transaction';
      const outputs = tx.outputs.map(out =>
        `${out.address}: ${out.amount.toFixed(8)} coins`
      ).join('<br>');

      return `
        <div class="transaction-item">
          <strong>${type}</strong><br>
          ${outputs}
        </div>
      `;
    }).join('');
  }

  /**
   * Update mempool UI
   */
  updateMempoolUI() {
    if (!this.hasGenesis) return;

    const mempoolList = document.getElementById('mempool-list');

    if (this.blockchain.mempool.length === 0) {
      mempoolList.innerHTML = '<p class="empty-state">No pending transactions</p>';
      return;
    }

    mempoolList.innerHTML = '';

    this.blockchain.mempool.forEach(tx => {
      const div = document.createElement('div');
      div.className = 'transaction-item';

      const outputs = tx.outputs.map(out =>
        `${out.address}: ${out.amount.toFixed(8)} coins`
      ).join('<br>');

      div.innerHTML = `
        <div class="transaction-id">ID: ${tx.id}</div>
        <div>${outputs}</div>
      `;

      mempoolList.appendChild(div);
    });
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
