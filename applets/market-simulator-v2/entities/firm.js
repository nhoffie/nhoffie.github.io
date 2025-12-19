/**
 * Firm
 * Core firm entity and operations
 * Manages production, trading, and business operations
 */

import { eventBus } from '../core/event-bus.js';
import { productionChains } from '../economy/production-chains.js';
import { productRegistry } from '../economy/product-registry.js';

/**
 * Production Run
 * Represents an active production process
 */
export class ProductionRun {
  constructor(recipeId, batches, startDate, endDate, firmId) {
    this.id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.recipeId = recipeId;
    this.batches = batches;
    this.startDate = { ...startDate };
    this.endDate = { ...endDate };
    this.firmId = firmId;
    this.status = 'in_progress'; // in_progress, completed, cancelled
    this.createdAt = Date.now();
  }
}

/**
 * Firm Class
 * Represents a business entity (user or AI)
 */
export class Firm {
  constructor(id, name, type = 'ai') {
    this.id = id;
    this.name = name;
    this.type = type; // 'user' or 'ai'
    this.founded = null;
    this.activeProduction = []; // Array of ProductionRun instances
    this.properties = []; // Array of property IDs owned
  }

  /**
   * Start production run
   * @param {string} recipeId - Production recipe ID
   * @param {number} batches - Number of batches to produce
   * @param {Object} inventory - Inventory instance
   * @param {Object} market - Market system instance
   * @param {Object} txManager - Transaction manager instance
   * @param {Object} currentDate - Current simulation date
   * @returns {Object} Result {success, productionRun, error}
   */
  startProduction(recipeId, batches, inventory, market, txManager, currentDate) {
    const recipe = productionChains.getRecipe(recipeId);
    if (!recipe) {
      return { success: false, error: 'Recipe not found' };
    }

    // Validate inputs available
    const validation = productionChains.validateInputs(recipeId, inventory, batches);
    if (!validation.valid) {
      return {
        success: false,
        error: 'Insufficient materials',
        missing: validation.missing
      };
    }

    // Calculate costs
    const prices = market.getAllPrices();
    const cost = productionChains.calculateProductionCost(recipeId, prices, batches);

    // Check if firm has enough cash for labor
    const cash = txManager.ledger.getAccountBalance('Cash');
    if (cash < cost.laborCost) {
      return {
        success: false,
        error: `Insufficient cash for labor. Need ${cost.laborCost}, have ${cash}`
      };
    }

    // Remove inputs from inventory
    for (const input of recipe.inputs) {
      const quantity = input.quantity * batches;
      if (!inventory.remove(input.productId, quantity)) {
        // Rollback (should not happen due to validation)
        return { success: false, error: 'Failed to remove materials from inventory' };
      }
    }

    // Record material costs (moving from inventory to WIP)
    txManager.createTransaction(
      [
        { account: 'Inventory - Work in Progress', debit: cost.materialCost, credit: 0 },
        { account: 'Inventory - Raw Materials', debit: 0, credit: cost.materialCost }
      ],
      `Production started: ${recipe.name} (${batches} batches)`,
      currentDate,
      { type: 'production_start', recipeId, batches }
    );

    // Record labor cost
    txManager.createTransaction(
      [
        { account: 'Wages Expense', debit: cost.laborCost, credit: 0 },
        { account: 'Cash', debit: 0, credit: cost.laborCost }
      ],
      `Labor cost for ${recipe.name} production`,
      currentDate,
      { type: 'labor_cost', recipeId, batches }
    );

    // Calculate end date
    const productionDays = productionChains.getProductionTime(recipeId, batches);
    const endDate = this._addDays(currentDate, productionDays);

    // Create production run
    const productionRun = new ProductionRun(recipeId, batches, currentDate, endDate, this.id);
    this.activeProduction.push(productionRun);

    // Emit event
    eventBus.emit('production:started', {
      firmId: this.id,
      productionRun
    });

    return {
      success: true,
      productionRun,
      cost
    };
  }

  /**
   * Complete production runs that have finished
   * @param {Object} currentDate - Current simulation date
   * @param {Object} inventory - Inventory instance
   * @param {Object} txManager - Transaction manager instance
   * @returns {Array} Completed production runs
   */
  completeProduction(currentDate, inventory, txManager) {
    const completed = [];

    for (let i = this.activeProduction.length - 1; i >= 0; i--) {
      const run = this.activeProduction[i];

      if (this._isDateAfterOrEqual(currentDate, run.endDate)) {
        const recipe = productionChains.getRecipe(run.recipeId);
        if (!recipe) continue;

        // Add output to inventory
        const outputQuantity = recipe.output.quantity * run.batches;
        inventory.add(recipe.output.productId, outputQuantity);

        // Get WIP cost
        const wipBalance = txManager.ledger.getAccountBalance('Inventory - Work in Progress');

        // Move from WIP to Finished Goods
        txManager.createTransaction(
          [
            { account: 'Inventory - Finished Goods', debit: wipBalance, credit: 0 },
            { account: 'Inventory - Work in Progress', debit: 0, credit: wipBalance }
          ],
          `Production completed: ${recipe.name} (${run.batches} batches)`,
          currentDate,
          { type: 'production_complete', productionRunId: run.id, recipeId: run.recipeId }
        );

        run.status = 'completed';
        completed.push(run);

        // Remove from active production
        this.activeProduction.splice(i, 1);

        // Emit event
        eventBus.emit('production:completed', {
          firmId: this.id,
          productionRun: run,
          output: {
            productId: recipe.output.productId,
            quantity: outputQuantity
          }
        });
      }
    }

    return completed;
  }

  /**
   * Buy product from market
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to buy
   * @param {Object} market - Market system instance
   * @param {Object} inventory - Inventory instance
   * @param {Object} txManager - Transaction manager instance
   * @param {Object} currentDate - Current simulation date
   * @returns {Object} Result {success, trade, error}
   */
  buyProduct(productId, quantity, market, inventory, txManager, currentDate) {
    if (!productRegistry.hasProduct(productId)) {
      return { success: false, error: 'Product not found' };
    }

    const price = market.getPrice(productId);
    const totalCost = quantity * price;

    // Check if firm has enough cash
    const cash = txManager.ledger.getAccountBalance('Cash');
    if (cash < totalCost) {
      return {
        success: false,
        error: `Insufficient cash. Need ${totalCost}, have ${cash}`
      };
    }

    // Execute trade in market
    const tradeResult = market.executeTrade({
      productId,
      quantity,
      price,
      buyerId: this.id,
      sellerId: 'market',
      date: currentDate,
      metadata: { type: 'purchase' }
    });

    if (!tradeResult.success) {
      return tradeResult;
    }

    // Add to inventory
    inventory.add(productId, quantity);

    // Record accounting transaction
    txManager.recordCashPurchase(
      totalCost,
      'Inventory - Raw Materials',
      `Purchase ${quantity} ${productRegistry.getProductName(productId)}`,
      currentDate
    );

    // Record demand in market
    market.recordDemand(productId, quantity);

    return {
      success: true,
      trade: tradeResult.trade
    };
  }

  /**
   * Sell product to market
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to sell
   * @param {Object} market - Market system instance
   * @param {Object} inventory - Inventory instance
   * @param {Object} txManager - Transaction manager instance
   * @param {Object} currentDate - Current simulation date
   * @returns {Object} Result {success, trade, error}
   */
  sellProduct(productId, quantity, market, inventory, txManager, currentDate) {
    if (!productRegistry.hasProduct(productId)) {
      return { success: false, error: 'Product not found' };
    }

    // Check if firm has enough inventory
    if (!inventory.has(productId, quantity)) {
      return {
        success: false,
        error: `Insufficient inventory. Have ${inventory.getQuantity(productId)}, need ${quantity}`
      };
    }

    const price = market.getPrice(productId);
    const totalRevenue = quantity * price;

    // Execute trade in market
    const tradeResult = market.executeTrade({
      productId,
      quantity,
      price,
      buyerId: 'market',
      sellerId: this.id,
      date: currentDate,
      metadata: { type: 'sale' }
    });

    if (!tradeResult.success) {
      return tradeResult;
    }

    // Remove from inventory
    inventory.remove(productId, quantity);

    // Calculate COGS (using average cost from finished goods inventory)
    const finishedGoodsBalance = txManager.ledger.getAccountBalance('Inventory - Finished Goods');
    const inventoryQuantity = inventory.getTotalQuantity();
    const avgCost = inventoryQuantity > 0 ? finishedGoodsBalance / inventoryQuantity : 0;
    const cogs = avgCost * quantity;

    // Record sale
    txManager.recordCashSale(
      totalRevenue,
      cogs,
      `Sale of ${quantity} ${productRegistry.getProductName(productId)}`,
      currentDate
    );

    // Record supply in market
    market.recordSupply(productId, quantity);

    return {
      success: true,
      trade: tradeResult.trade
    };
  }

  /**
   * Get active production runs
   * @returns {Array} Active production runs
   */
  getActiveProduction() {
    return [...this.activeProduction];
  }

  /**
   * Get firm summary
   * @returns {Object} Firm summary
   */
  getSummary() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      founded: this.founded,
      activeProduction: this.activeProduction.length,
      properties: this.properties.length
    };
  }

  /**
   * Helper: Add days to date
   * @private
   */
  _addDays(date, days) {
    // Simplified date addition (assumes 28-day months)
    let { year, month, day } = date;
    day += days;

    while (day > 28) {
      day -= 28;
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }

    return { year, month, day };
  }

  /**
   * Helper: Check if date1 >= date2
   * @private
   */
  _isDateAfterOrEqual(date1, date2) {
    const d1 = date1.year * 10000 + date1.month * 100 + date1.day;
    const d2 = date2.year * 10000 + date2.month * 100 + date2.day;
    return d1 >= d2;
  }
}

/**
 * Create a new firm
 * @param {string} id - Firm ID
 * @param {string} name - Firm name
 * @param {string} type - Firm type ('user' or 'ai')
 * @param {Object} foundedDate - Date firm was founded
 * @returns {Firm} New firm instance
 */
export function createFirm(id, name, type, foundedDate) {
  const firm = new Firm(id, name, type);
  firm.founded = { ...foundedDate };
  return firm;
}
