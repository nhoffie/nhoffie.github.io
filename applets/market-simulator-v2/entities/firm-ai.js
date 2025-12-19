/**
 * Firm AI
 * Artificial intelligence for computer-controlled firms
 * Makes autonomous decisions about production, trading, and inventory
 */

import { productionChains } from '../economy/production-chains.js';
import { productRegistry } from '../economy/product-registry.js';
import { round } from '../utils/math-utils.js';

/**
 * AI Decision Maker for Firms
 * Analyzes market conditions and makes strategic decisions
 */
export class FirmAI {
  constructor(firmId, strategy = 'balanced') {
    this.firmId = firmId;
    this.strategy = strategy; // 'aggressive', 'balanced', 'conservative'
    this.lastDecisionTime = null;
    this.decisionInterval = 1; // Days between decisions

    // Strategy parameters
    this.strategyParams = this._getStrategyParams(strategy);
  }

  /**
   * Get strategy parameters based on strategy type
   * @private
   */
  _getStrategyParams(strategy) {
    const params = {
      aggressive: {
        minCashReserve: 5000,      // Lower cash reserve
        targetProfitMargin: 0.15,   // 15% profit margin
        inventoryTurnover: 3,       // Sell inventory quickly
        productionRisk: 0.8,        // Willing to take risks
        maxDebtRatio: 0.6           // 60% debt-to-assets
      },
      balanced: {
        minCashReserve: 15000,      // Moderate cash reserve
        targetProfitMargin: 0.25,   // 25% profit margin
        inventoryTurnover: 2,       // Moderate inventory turnover
        productionRisk: 0.5,        // Balanced risk
        maxDebtRatio: 0.4           // 40% debt-to-assets
      },
      conservative: {
        minCashReserve: 30000,      // High cash reserve
        targetProfitMargin: 0.35,   // 35% profit margin
        inventoryTurnover: 1.5,     // Slow, steady sales
        productionRisk: 0.3,        // Low risk
        maxDebtRatio: 0.2           // 20% debt-to-assets
      }
    };

    return params[strategy] || params.balanced;
  }

  /**
   * Make AI decisions for the firm
   * @param {Object} firm - Firm instance
   * @param {Object} inventory - Inventory instance
   * @param {Object} market - Market system instance
   * @param {Object} txManager - Transaction manager instance
   * @param {Object} currentDate - Current simulation date
   * @returns {Object} Decisions made
   */
  makeDecisions(firm, inventory, market, txManager, currentDate) {
    const decisions = {
      production: [],
      purchases: [],
      sales: [],
      timestamp: Date.now()
    };

    // Get current financial state
    const cash = txManager.ledger.getAccountBalance('Cash');
    const prices = market.getAllPrices();

    // 1. Decide on sales (sell finished goods)
    const salesDecisions = this._decideSales(inventory, market, prices);
    decisions.sales = salesDecisions;

    // Execute sales
    for (const sale of salesDecisions) {
      const result = firm.sellProduct(
        sale.productId,
        sale.quantity,
        market,
        inventory,
        txManager,
        currentDate
      );
      sale.executed = result.success;
    }

    // 2. Decide on production (what to manufacture)
    const productionDecisions = this._decideProduction(
      inventory,
      market,
      cash,
      prices
    );
    decisions.production = productionDecisions;

    // Execute production
    for (const production of productionDecisions) {
      const result = firm.startProduction(
        production.recipeId,
        production.batches,
        inventory,
        market,
        txManager,
        currentDate
      );
      production.executed = result.success;
    }

    // 3. Decide on purchases (buy raw materials for production)
    const purchaseDecisions = this._decidePurchases(
      inventory,
      market,
      cash,
      prices,
      productionDecisions
    );
    decisions.purchases = purchaseDecisions;

    // Execute purchases
    for (const purchase of purchaseDecisions) {
      const result = firm.buyProduct(
        purchase.productId,
        purchase.quantity,
        market,
        inventory,
        txManager,
        currentDate
      );
      purchase.executed = result.success;
    }

    this.lastDecisionTime = currentDate;
    return decisions;
  }

  /**
   * Decide what to sell
   * @private
   */
  _decideSales(inventory, market, prices) {
    const sales = [];
    const finishedGoods = productRegistry.getFinishedGoods();

    for (const product of finishedGoods) {
      const available = inventory.getQuantity(product.id);

      if (available > 0) {
        // Sell portion of inventory based on strategy
        const sellQuantity = Math.floor(
          available / this.strategyParams.inventoryTurnover
        );

        if (sellQuantity > 0) {
          sales.push({
            productId: product.id,
            quantity: sellQuantity,
            expectedRevenue: sellQuantity * prices[product.id]
          });
        }
      }
    }

    return sales;
  }

  /**
   * Decide what to produce
   * @private
   */
  _decideProduction(inventory, market, cash, prices) {
    const production = [];

    // Only produce if we have enough cash reserve
    if (cash < this.strategyParams.minCashReserve) {
      return production;
    }

    const availableCash = cash - this.strategyParams.minCashReserve;
    const recipes = productionChains.getAllRecipes();

    // Analyze profitability of each recipe
    const opportunities = [];

    for (const recipe of recipes) {
      const profitAnalysis = productionChains.calculateProfitMargin(
        recipe.id,
        prices,
        1
      );

      if (profitAnalysis && profitAnalysis.profitMargin > 0) {
        // Check if we have materials
        const validation = productionChains.validateInputs(
          recipe.id,
          inventory,
          1
        );

        opportunities.push({
          recipeId: recipe.id,
          profitMargin: profitAnalysis.profitMargin,
          profit: profitAnalysis.profit,
          cost: profitAnalysis.totalCost,
          hasMaterials: validation.valid,
          missing: validation.missing
        });
      }
    }

    // Sort by profit margin (descending)
    opportunities.sort((a, b) => b.profitMargin - a.profitMargin);

    // Select profitable recipes to produce
    let budgetRemaining = availableCash;

    for (const opp of opportunities) {
      // Only produce if profit margin meets target
      if (opp.profitMargin < this.strategyParams.targetProfitMargin * 100) {
        continue;
      }

      // Skip if we don't have materials and can't afford them
      if (!opp.hasMaterials) {
        const materialsCost = this._calculateMaterialsCost(
          opp.recipeId,
          opp.missing,
          prices
        );

        if (materialsCost > budgetRemaining) {
          continue;
        }
      }

      // Calculate how many batches we can afford
      const maxBatches = Math.floor(budgetRemaining / opp.cost);

      if (maxBatches > 0) {
        const batches = Math.max(1, Math.floor(
          maxBatches * this.strategyParams.productionRisk
        ));

        production.push({
          recipeId: opp.recipeId,
          batches,
          expectedProfit: opp.profit * batches,
          expectedCost: opp.cost * batches
        });

        budgetRemaining -= opp.cost * batches;
      }
    }

    return production;
  }

  /**
   * Decide what materials to purchase
   * @private
   */
  _decidePurchases(inventory, market, cash, prices, productionPlans) {
    const purchases = [];

    // Only purchase if we have enough cash
    if (cash < this.strategyParams.minCashReserve) {
      return purchases;
    }

    const availableCash = cash - this.strategyParams.minCashReserve;
    let budgetRemaining = availableCash;

    // Calculate materials needed for planned production
    const materialsNeeded = {};

    for (const plan of productionPlans) {
      const recipe = productionChains.getRecipe(plan.recipeId);
      if (!recipe) continue;

      for (const input of recipe.inputs) {
        const needed = input.quantity * plan.batches;
        const available = inventory.getQuantity(input.productId);
        const shortage = Math.max(0, needed - available);

        if (shortage > 0) {
          if (!materialsNeeded[input.productId]) {
            materialsNeeded[input.productId] = 0;
          }
          materialsNeeded[input.productId] += shortage;
        }
      }
    }

    // Purchase needed materials
    for (const [productId, quantity] of Object.entries(materialsNeeded)) {
      const cost = quantity * prices[productId];

      if (cost <= budgetRemaining) {
        purchases.push({
          productId,
          quantity: round(quantity, 2),
          expectedCost: cost
        });
        budgetRemaining -= cost;
      }
    }

    // Opportunistically purchase raw materials at good prices
    if (budgetRemaining > 0) {
      const rawMaterials = productRegistry.getRawMaterials();

      for (const material of rawMaterials) {
        const currentPrice = prices[material.id];
        const basePrice = material.basePrice;

        // Buy if price is below base price (good deal)
        if (currentPrice < basePrice * 0.9) {
          const quantityToBuy = Math.floor(
            (budgetRemaining * 0.2) / currentPrice
          );

          if (quantityToBuy > 0) {
            purchases.push({
              productId: material.id,
              quantity: quantityToBuy,
              expectedCost: quantityToBuy * currentPrice,
              opportunistic: true
            });
            budgetRemaining -= quantityToBuy * currentPrice;
          }
        }
      }
    }

    return purchases;
  }

  /**
   * Calculate cost of missing materials
   * @private
   */
  _calculateMaterialsCost(recipeId, missing, prices) {
    let cost = 0;

    for (const item of missing) {
      cost += item.shortage * prices[item.productId];
    }

    return cost;
  }

  /**
   * Evaluate overall firm performance
   * @param {Object} txManager - Transaction manager
   * @returns {Object} Performance metrics
   */
  evaluatePerformance(txManager) {
    const ledger = txManager.ledger;

    // Get key financial metrics
    const cash = ledger.getAccountBalance('Cash');
    const inventory = ledger.getAccountBalance('Inventory - Finished Goods') +
                     ledger.getAccountBalance('Inventory - Raw Materials') +
                     ledger.getAccountBalance('Inventory - Work in Progress');
    const equipment = ledger.getAccountBalance('Equipment');
    const totalAssets = cash + inventory + equipment;

    const revenue = ledger.getAccountBalance('Sales Revenue');
    const cogs = ledger.getAccountBalance('Cost of Goods Sold');
    const expenses = ledger.getAccountBalance('Wages Expense');

    const grossProfit = revenue - cogs;
    const netIncome = revenue - cogs - expenses;

    return {
      cash,
      inventory,
      equipment,
      totalAssets,
      revenue,
      grossProfit,
      netIncome,
      profitMargin: revenue > 0 ? (netIncome / revenue) * 100 : 0
    };
  }

  /**
   * Should make decision now?
   * @param {Object} currentDate - Current simulation date
   * @returns {boolean} True if should make decision
   */
  shouldMakeDecision(currentDate) {
    if (!this.lastDecisionTime) {
      return true;
    }

    // Simple day comparison (assumes dates are comparable)
    const lastDay = this.lastDecisionTime.year * 365 +
                   this.lastDecisionTime.month * 28 +
                   this.lastDecisionTime.day;
    const currentDay = currentDate.year * 365 +
                      currentDate.month * 28 +
                      currentDate.day;

    return (currentDay - lastDay) >= this.decisionInterval;
  }

  /**
   * Set decision interval
   * @param {number} days - Days between decisions
   */
  setDecisionInterval(days) {
    this.decisionInterval = days;
  }

  /**
   * Change AI strategy
   * @param {string} strategy - New strategy ('aggressive', 'balanced', 'conservative')
   */
  setStrategy(strategy) {
    this.strategy = strategy;
    this.strategyParams = this._getStrategyParams(strategy);
  }

  /**
   * Get current strategy
   * @returns {string} Current strategy
   */
  getStrategy() {
    return this.strategy;
  }
}

/**
 * Create AI controller for a firm
 * @param {string} firmId - Firm ID
 * @param {string} strategy - AI strategy
 * @returns {FirmAI} AI controller
 */
export function createFirmAI(firmId, strategy = 'balanced') {
  return new FirmAI(firmId, strategy);
}
