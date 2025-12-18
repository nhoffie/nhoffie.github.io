/**
 * State Manager
 * Central state repository and coordination
 * Single source of truth for simulation state
 */

import { createDate } from '../utils/date-utils.js';

class StateManager {
  constructor() {
    this.state = this.createInitialState();
    this.debugMode = false;
  }

  /**
   * Enable or disable debug mode
   * @param {boolean} enabled - Enable debug logging
   */
  setDebugMode(enabled) {
    this.debugMode = enabled;
  }

  /**
   * Create initial state structure with user firm
   * @returns {Object} Initial state
   */
  createInitialState() {
    const initialDate = createDate(1, 1, 1);

    // Create initial user firm
    const userFirm = {
      id: 'firm_user',
      name: 'Your Company',
      type: 'user',
      founded: { ...initialDate },
      inventory: {}, // Empty inventory at start
      properties: [], // No properties at start
      activeProduction: [] // No active production at start
    };

    return {
      meta: {
        version: '1.0.0',
        saveTimestamp: null,
        simulationDate: { ...initialDate },
        timeMultiplier: 60, // 60x real-time
        isPaused: true,
        debugMode: false
      },
      market: {
        products: {}, // Will be populated in Phase 3
        tradeHistory: []
      },
      firms: [userFirm], // Start with user firm
      realEstate: {
        properties: [], // Will be populated in Phase 5
        forSale: []
      },
      accounting: {
        'firm_user': {
          ledger: {}, // Will be initialized in Phase 2
          journal: []
        }
      }
    };
  }

  /**
   * Reset state to initial
   */
  reset() {
    this.state = this.createInitialState();
    if (this.debugMode) {
      console.log('StateManager: State reset to initial');
    }
  }

  /**
   * Get complete state
   * @returns {Object} Complete state object
   */
  getState() {
    return this.state;
  }

  /**
   * Replace entire state (for loading saves)
   * @param {Object} newState - New state object
   */
  setState(newState) {
    this.state = newState;
    if (this.debugMode) {
      console.log('StateManager: State replaced');
    }
  }

  /**
   * Get metadata
   * @returns {Object} Metadata object
   */
  getMeta() {
    return this.state.meta;
  }

  /**
   * Get current simulation date
   * @returns {Object} Current date
   */
  getCurrentDate() {
    return this.state.meta.simulationDate;
  }

  /**
   * Set current simulation date
   * @param {Object} date - New date
   */
  setCurrentDate(date) {
    this.state.meta.simulationDate = date;
  }

  /**
   * Get time multiplier
   * @returns {number} Time multiplier
   */
  getTimeMultiplier() {
    return this.state.meta.timeMultiplier;
  }

  /**
   * Set time multiplier
   * @param {number} multiplier - New multiplier value
   */
  setTimeMultiplier(multiplier) {
    this.state.meta.timeMultiplier = multiplier;
    if (this.debugMode) {
      console.log(`StateManager: Time multiplier set to ${multiplier}`);
    }
  }

  /**
   * Get paused state
   * @returns {boolean} True if paused
   */
  isPaused() {
    return this.state.meta.isPaused;
  }

  /**
   * Set paused state
   * @param {boolean} paused - Paused state
   */
  setPaused(paused) {
    this.state.meta.isPaused = paused;
    if (this.debugMode) {
      console.log(`StateManager: Simulation ${paused ? 'paused' : 'resumed'}`);
    }
  }

  /**
   * Get debug mode state
   * @returns {boolean} True if debug mode enabled
   */
  isDebugMode() {
    return this.state.meta.debugMode;
  }

  /**
   * Set debug mode state
   * @param {boolean} enabled - Debug mode enabled
   */
  setDebugModeState(enabled) {
    this.state.meta.debugMode = enabled;
    this.debugMode = enabled;
  }

  /**
   * Get all firms
   * @returns {Array} Array of firms
   */
  getFirms() {
    return this.state.firms;
  }

  /**
   * Get firm by ID
   * @param {string} firmId - Firm ID
   * @returns {Object|undefined} Firm object or undefined if not found
   */
  getFirm(firmId) {
    return this.state.firms.find(f => f.id === firmId);
  }

  /**
   * Get user firm (type === 'user')
   * @returns {Object|undefined} User firm or undefined
   */
  getUserFirm() {
    return this.state.firms.find(f => f.type === 'user');
  }

  /**
   * Get AI firms
   * @returns {Array} Array of AI firms
   */
  getAIFirms() {
    return this.state.firms.filter(f => f.type === 'ai');
  }

  /**
   * Add firm
   * @param {Object} firm - Firm object to add
   */
  addFirm(firm) {
    this.state.firms.push(firm);
    if (this.debugMode) {
      console.log(`StateManager: Firm added: ${firm.id} (${firm.name})`);
    }
  }

  /**
   * Remove firm by ID
   * @param {string} firmId - Firm ID to remove
   * @returns {boolean} True if firm was removed
   */
  removeFirm(firmId) {
    const index = this.state.firms.findIndex(f => f.id === firmId);
    if (index !== -1) {
      this.state.firms.splice(index, 1);
      if (this.debugMode) {
        console.log(`StateManager: Firm removed: ${firmId}`);
      }
      return true;
    }
    return false;
  }

  /**
   * Get market state
   * @returns {Object} Market state
   */
  getMarket() {
    return this.state.market;
  }

  /**
   * Get market data for specific product
   * @param {string} productId - Product ID
   * @returns {Object|undefined} Product market data
   */
  getProductMarket(productId) {
    return this.state.market.products[productId];
  }

  /**
   * Get real estate state
   * @returns {Object} Real estate state
   */
  getRealEstate() {
    return this.state.realEstate;
  }

  /**
   * Get property by ID
   * @param {string} propertyId - Property ID
   * @returns {Object|undefined} Property or undefined
   */
  getProperty(propertyId) {
    return this.state.realEstate.properties.find(p => p.id === propertyId);
  }

  /**
   * Get accounting data
   * @returns {Object} Complete accounting data
   */
  getAccounting() {
    return this.state.accounting;
  }

  /**
   * Get accounting for specific firm
   * @param {string} firmId - Firm ID
   * @returns {Object|undefined} Firm accounting data
   */
  getFirmAccounting(firmId) {
    return this.state.accounting[firmId];
  }

  /**
   * Initialize accounting for firm
   * @param {string} firmId - Firm ID
   */
  initializeFirmAccounting(firmId) {
    if (!this.state.accounting[firmId]) {
      this.state.accounting[firmId] = {
        ledger: {},
        journal: []
      };
      if (this.debugMode) {
        console.log(`StateManager: Accounting initialized for firm: ${firmId}`);
      }
    }
  }

  /**
   * Get firm's ledger
   * @param {string} firmId - Firm ID
   * @returns {Object|undefined} Ledger object
   */
  getFirmLedger(firmId) {
    const accounting = this.getFirmAccounting(firmId);
    return accounting ? accounting.ledger : undefined;
  }

  /**
   * Get firm's journal
   * @param {string} firmId - Firm ID
   * @returns {Array|undefined} Journal array
   */
  getFirmJournal(firmId) {
    const accounting = this.getFirmAccounting(firmId);
    return accounting ? accounting.journal : undefined;
  }

  /**
   * Get firm's inventory
   * @param {string} firmId - Firm ID
   * @returns {Object|undefined} Inventory object
   */
  getFirmInventory(firmId) {
    const firm = this.getFirm(firmId);
    return firm ? firm.inventory : undefined;
  }

  /**
   * Get firm's properties
   * @param {string} firmId - Firm ID
   * @returns {Array|undefined} Array of property IDs
   */
  getFirmProperties(firmId) {
    const firm = this.getFirm(firmId);
    return firm ? firm.properties : undefined;
  }

  /**
   * Export state as JSON string
   * @returns {string} JSON string
   */
  exportState() {
    return JSON.stringify(this.state, null, 2);
  }

  /**
   * Import state from JSON string
   * @param {string} jsonString - JSON state string
   * @returns {boolean} True if successful
   */
  importState(jsonString) {
    try {
      const newState = JSON.parse(jsonString);
      this.setState(newState);
      return true;
    } catch (error) {
      console.error('StateManager: Failed to import state:', error);
      return false;
    }
  }
}

// Export singleton instance
export const stateManager = new StateManager();

// Export class for testing
export { StateManager };
