/**
 * Market System
 * Supply/demand mechanics and price discovery
 * Manages market prices, orders, and trade execution
 */

import { productRegistry } from './product-registry.js';
import { eventBus } from '../core/event-bus.js';
import { round } from '../utils/math-utils.js';

/**
 * Market System Class
 * Manages supply, demand, and pricing for all products
 */
export class MarketSystem {
  constructor() {
    this.prices = {}; // { productId: currentPrice }
    this.priceHistory = {}; // { productId: [{ date, price }] }
    this.supply = {}; // { productId: totalSupply }
    this.demand = {}; // { productId: totalDemand }
    this.tradeHistory = []; // Array of completed trades

    // Market parameters
    this.priceElasticity = 0.1; // How much prices change based on supply/demand
    this.minPriceMultiplier = 0.3; // Minimum price is 30% of base
    this.maxPriceMultiplier = 3.0; // Maximum price is 300% of base

    this._initializePrices();
  }

  /**
   * Initialize prices for all products at base price
   * @private
   */
  _initializePrices() {
    const products = productRegistry.getAllProducts();

    for (const product of products) {
      this.prices[product.id] = product.basePrice;
      this.priceHistory[product.id] = [];
      this.supply[product.id] = 0;
      this.demand[product.id] = 0;
    }
  }

  /**
   * Get current price for a product
   * @param {string} productId - Product ID
   * @returns {number} Current price
   */
  getPrice(productId) {
    return this.prices[productId] || productRegistry.getProductBasePrice(productId) || 0;
  }

  /**
   * Get all current prices
   * @returns {Object} Map of productId to price
   */
  getAllPrices() {
    return { ...this.prices };
  }

  /**
   * Update price based on supply and demand
   * @param {string} productId - Product ID
   */
  updatePrice(productId) {
    const product = productRegistry.getProduct(productId);
    if (!product) return;

    const currentPrice = this.getPrice(productId);
    const supply = this.supply[productId] || 0;
    const demand = this.demand[productId] || 0;

    // Calculate supply/demand ratio
    // ratio > 1 means more demand than supply (price should increase)
    // ratio < 1 means more supply than demand (price should decrease)
    let ratio = 1.0;

    if (supply > 0 && demand > 0) {
      ratio = demand / supply;
    } else if (demand > 0) {
      ratio = 2.0; // High demand, no supply -> price increase
    } else if (supply > 0) {
      ratio = 0.5; // Supply but no demand -> price decrease
    }

    // Calculate price change based on elasticity
    const priceMultiplier = 1.0 + (ratio - 1.0) * this.priceElasticity;
    let newPrice = currentPrice * priceMultiplier;

    // Enforce min/max price limits based on base price
    const basePrice = product.basePrice;
    const minPrice = basePrice * this.minPriceMultiplier;
    const maxPrice = basePrice * this.maxPriceMultiplier;

    newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));
    newPrice = round(newPrice, 2);

    // Update price if it changed significantly (more than 1 cent)
    if (Math.abs(newPrice - currentPrice) > 0.01) {
      const oldPrice = this.prices[productId];
      this.prices[productId] = newPrice;

      // Emit price change event
      eventBus.emit('market:priceChange', {
        productId,
        oldPrice,
        newPrice,
        supply,
        demand,
        ratio
      });
    }
  }

  /**
   * Record supply (available for sale)
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity supplied
   */
  recordSupply(productId, quantity) {
    if (!this.supply[productId]) {
      this.supply[productId] = 0;
    }
    this.supply[productId] += quantity;
  }

  /**
   * Record demand (wanted to buy)
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity demanded
   */
  recordDemand(productId, quantity) {
    if (!this.demand[productId]) {
      this.demand[productId] = 0;
    }
    this.demand[productId] += quantity;
  }

  /**
   * Reset supply and demand counters
   * Call this periodically (e.g., daily) to recalculate
   */
  resetSupplyDemand() {
    for (const productId of Object.keys(this.prices)) {
      this.supply[productId] = 0;
      this.demand[productId] = 0;
    }
  }

  /**
   * Execute a trade between two parties
   * @param {Object} trade - Trade details
   * @returns {Object} Trade result
   */
  executeTrade(trade) {
    const {
      productId,
      quantity,
      price,
      buyerId,
      sellerId,
      date,
      metadata = {}
    } = trade;

    // Validate trade
    if (!productRegistry.hasProduct(productId)) {
      return { success: false, error: 'Invalid product' };
    }

    if (quantity <= 0) {
      return { success: false, error: 'Invalid quantity' };
    }

    if (price <= 0) {
      return { success: false, error: 'Invalid price' };
    }

    // Calculate total cost
    const totalCost = round(quantity * price, 2);

    // Record trade
    const tradeRecord = {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId,
      quantity,
      price,
      totalCost,
      buyerId,
      sellerId,
      date: { ...date },
      timestamp: Date.now(),
      metadata
    };

    this.tradeHistory.push(tradeRecord);

    // Emit trade event
    eventBus.emit('market:trade', tradeRecord);

    return {
      success: true,
      trade: tradeRecord
    };
  }

  /**
   * Get trade history for a product
   * @param {string} productId - Product ID
   * @param {number} limit - Maximum number of trades to return
   * @returns {Array} Recent trades
   */
  getTradeHistory(productId, limit = 10) {
    let trades = this.tradeHistory;

    if (productId) {
      trades = trades.filter(t => t.productId === productId);
    }

    return trades.slice(-limit);
  }

  /**
   * Get price history for a product
   * @param {string} productId - Product ID
   * @returns {Array} Price history [{date, price}]
   */
  getPriceHistory(productId) {
    return this.priceHistory[productId] || [];
  }

  /**
   * Record current price in history
   * Call this periodically to maintain price history
   * @param {Object} date - Current simulation date
   */
  recordPriceHistory(date) {
    for (const [productId, price] of Object.entries(this.prices)) {
      if (!this.priceHistory[productId]) {
        this.priceHistory[productId] = [];
      }

      this.priceHistory[productId].push({
        date: { ...date },
        price
      });

      // Keep only last 100 price points
      if (this.priceHistory[productId].length > 100) {
        this.priceHistory[productId].shift();
      }
    }
  }

  /**
   * Get market summary for display
   * @returns {Object} Market summary
   */
  getMarketSummary() {
    const products = productRegistry.getAllProducts();
    const summary = [];

    for (const product of products) {
      const currentPrice = this.getPrice(product.id);
      const basePrice = product.basePrice;
      const priceChange = ((currentPrice - basePrice) / basePrice) * 100;

      summary.push({
        productId: product.id,
        productName: product.name,
        type: product.type,
        basePrice,
        currentPrice,
        priceChange: round(priceChange, 1),
        supply: this.supply[product.id] || 0,
        demand: this.demand[product.id] || 0
      });
    }

    return summary;
  }

  /**
   * Get supply for a product
   * @param {string} productId - Product ID
   * @returns {number} Current supply
   */
  getSupply(productId) {
    return this.supply[productId] || 0;
  }

  /**
   * Get demand for a product
   * @param {string} productId - Product ID
   * @returns {number} Current demand
   */
  getDemand(productId) {
    return this.demand[productId] || 0;
  }

  /**
   * Update all prices based on current supply/demand
   */
  updateAllPrices() {
    const products = productRegistry.getAllProducts();

    for (const product of products) {
      this.updatePrice(product.id);
    }
  }

  /**
   * Set price manually (for testing or admin purposes)
   * @param {string} productId - Product ID
   * @param {number} price - New price
   */
  setPrice(productId, price) {
    if (price <= 0) {
      console.error('MarketSystem: Price must be positive');
      return false;
    }

    const oldPrice = this.prices[productId];
    this.prices[productId] = round(price, 2);

    eventBus.emit('market:priceChange', {
      productId,
      oldPrice,
      newPrice: this.prices[productId],
      manual: true
    });

    return true;
  }

  /**
   * Get total market value of all trades
   * @returns {number} Total value of all trades
   */
  getTotalTradeValue() {
    return this.tradeHistory.reduce((sum, trade) => sum + trade.totalCost, 0);
  }

  /**
   * Get trade count
   * @returns {number} Number of completed trades
   */
  getTradeCount() {
    return this.tradeHistory.length;
  }

  /**
   * Export market state (for saving)
   * @returns {Object} Market state
   */
  export() {
    return {
      prices: { ...this.prices },
      priceHistory: this.priceHistory,
      supply: { ...this.supply },
      demand: { ...this.demand },
      tradeHistory: [...this.tradeHistory]
    };
  }

  /**
   * Import market state (for loading)
   * @param {Object} data - Market state
   */
  import(data) {
    this.prices = { ...data.prices };
    this.priceHistory = data.priceHistory || {};
    this.supply = { ...data.supply };
    this.demand = { ...data.demand };
    this.tradeHistory = [...(data.tradeHistory || [])];
  }

  /**
   * Clear all market data (use with caution!)
   */
  clear() {
    this._initializePrices();
    this.tradeHistory = [];
  }
}

/**
 * Create and initialize market system
 * @returns {MarketSystem} Market system instance
 */
export function createMarketSystem() {
  return new MarketSystem();
}

// Export singleton instance
export const marketSystem = createMarketSystem();
