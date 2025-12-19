/**
 * Production Chains
 * Production recipes and requirements
 * Defines how products are manufactured from inputs
 */

import { productRegistry } from './product-registry.js';

/**
 * Production recipes
 * Defines inputs and outputs for manufacturing
 */
export const PRODUCTION_RECIPES = {
  // Intermediate Goods - made from raw materials
  components: {
    id: 'components',
    name: 'Components',
    output: {
      productId: 'components',
      quantity: 10
    },
    inputs: [
      { productId: 'steel', quantity: 5 },
      { productId: 'plastic_resin', quantity: 3 }
    ],
    productionTime: 2, // days
    laborCost: 500,
    description: 'Manufacture components from steel and plastic'
  },

  metal_parts: {
    id: 'metal_parts',
    name: 'Metal Parts',
    output: {
      productId: 'metal_parts',
      quantity: 15
    },
    inputs: [
      { productId: 'steel', quantity: 8 },
      { productId: 'lumber', quantity: 2 }
    ],
    productionTime: 2,
    laborCost: 400,
    description: 'Fabricate metal parts from steel and lumber'
  },

  electronic_modules: {
    id: 'electronic_modules',
    name: 'Electronic Modules',
    output: {
      productId: 'electronic_modules',
      quantity: 5
    },
    inputs: [
      { productId: 'components', quantity: 8 },
      { productId: 'plastic_resin', quantity: 2 }
    ],
    productionTime: 3,
    laborCost: 800,
    description: 'Assemble electronic modules from components'
  },

  // Finished Goods - made from intermediate goods
  machinery: {
    id: 'machinery',
    name: 'Machinery',
    output: {
      productId: 'machinery',
      quantity: 1
    },
    inputs: [
      { productId: 'metal_parts', quantity: 20 },
      { productId: 'components', quantity: 15 },
      { productId: 'electronic_modules', quantity: 5 }
    ],
    productionTime: 5,
    laborCost: 2000,
    description: 'Build machinery from parts and components'
  },

  consumer_goods: {
    id: 'consumer_goods',
    name: 'Consumer Goods',
    output: {
      productId: 'consumer_goods',
      quantity: 20
    },
    inputs: [
      { productId: 'plastic_resin', quantity: 10 },
      { productId: 'components', quantity: 5 }
    ],
    productionTime: 2,
    laborCost: 300,
    description: 'Manufacture consumer goods from plastic and components'
  },

  electronics: {
    id: 'electronics',
    name: 'Electronics',
    output: {
      productId: 'electronics',
      quantity: 3
    },
    inputs: [
      { productId: 'electronic_modules', quantity: 8 },
      { productId: 'components', quantity: 10 },
      { productId: 'plastic_resin', quantity: 5 }
    ],
    productionTime: 4,
    laborCost: 1200,
    description: 'Produce electronics from modules and components'
  }
};

/**
 * Production Chains Class
 * Manages production recipes and validation
 */
export class ProductionChains {
  constructor() {
    this.recipes = new Map();
    this._initializeRecipes();
  }

  /**
   * Initialize production recipes
   * @private
   */
  _initializeRecipes() {
    for (const [recipeId, recipe] of Object.entries(PRODUCTION_RECIPES)) {
      this.recipes.set(recipeId, { ...recipe });
    }
  }

  /**
   * Get production recipe by ID
   * @param {string} recipeId - Recipe ID
   * @returns {Object|undefined} Recipe or undefined
   */
  getRecipe(recipeId) {
    return this.recipes.get(recipeId);
  }

  /**
   * Get all production recipes
   * @returns {Array} Array of all recipes
   */
  getAllRecipes() {
    return Array.from(this.recipes.values());
  }

  /**
   * Get recipes that produce a specific product
   * @param {string} productId - Product ID
   * @returns {Array} Recipes that produce this product
   */
  getRecipesForProduct(productId) {
    return this.getAllRecipes().filter(r => r.output.productId === productId);
  }

  /**
   * Get recipes that use a specific product as input
   * @param {string} productId - Product ID
   * @returns {Array} Recipes that use this product
   */
  getRecipesUsingProduct(productId) {
    return this.getAllRecipes().filter(r =>
      r.inputs.some(input => input.productId === productId)
    );
  }

  /**
   * Check if recipe exists
   * @param {string} recipeId - Recipe ID
   * @returns {boolean} True if recipe exists
   */
  hasRecipe(recipeId) {
    return this.recipes.has(recipeId);
  }

  /**
   * Validate if inputs are available for production
   * @param {string} recipeId - Recipe ID
   * @param {Object} inventory - Inventory instance
   * @param {number} batches - Number of batches to produce (default 1)
   * @returns {Object} Validation result {valid, missing}
   */
  validateInputs(recipeId, inventory, batches = 1) {
    const recipe = this.getRecipe(recipeId);
    if (!recipe) {
      return { valid: false, error: 'Recipe not found', missing: [] };
    }

    const missing = [];

    for (const input of recipe.inputs) {
      const required = input.quantity * batches;
      const available = inventory.getQuantity(input.productId);

      if (available < required) {
        const product = productRegistry.getProduct(input.productId);
        missing.push({
          productId: input.productId,
          productName: product ? product.name : input.productId,
          required,
          available,
          shortage: required - available
        });
      }
    }

    return {
      valid: missing.length === 0,
      missing
    };
  }

  /**
   * Calculate total cost of production
   * @param {string} recipeId - Recipe ID
   * @param {Object} prices - Map of productId to price
   * @param {number} batches - Number of batches (default 1)
   * @returns {Object} Cost breakdown
   */
  calculateProductionCost(recipeId, prices, batches = 1) {
    const recipe = this.getRecipe(recipeId);
    if (!recipe) {
      return null;
    }

    let materialCost = 0;
    const materials = [];

    for (const input of recipe.inputs) {
      const quantity = input.quantity * batches;
      const price = prices[input.productId] || 0;
      const cost = quantity * price;

      materialCost += cost;

      const product = productRegistry.getProduct(input.productId);
      materials.push({
        productId: input.productId,
        productName: product ? product.name : input.productId,
        quantity,
        unitPrice: price,
        totalCost: cost
      });
    }

    const laborCost = recipe.laborCost * batches;
    const totalCost = materialCost + laborCost;

    return {
      recipeId,
      batches,
      materials,
      materialCost,
      laborCost,
      totalCost,
      outputQuantity: recipe.output.quantity * batches,
      costPerUnit: totalCost / (recipe.output.quantity * batches)
    };
  }

  /**
   * Get production time for recipe
   * @param {string} recipeId - Recipe ID
   * @param {number} batches - Number of batches (default 1)
   * @returns {number} Production time in days
   */
  getProductionTime(recipeId, batches = 1) {
    const recipe = this.getRecipe(recipeId);
    return recipe ? recipe.productionTime * batches : 0;
  }

  /**
   * Get recipe summary for display
   * @param {string} recipeId - Recipe ID
   * @returns {Object} Recipe summary
   */
  getRecipeSummary(recipeId) {
    const recipe = this.getRecipe(recipeId);
    if (!recipe) {
      return null;
    }

    const inputProducts = recipe.inputs.map(input => {
      const product = productRegistry.getProduct(input.productId);
      return {
        ...input,
        productName: product ? product.name : input.productId,
        unit: product ? product.unit : 'unit'
      };
    });

    const outputProduct = productRegistry.getProduct(recipe.output.productId);

    return {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      inputs: inputProducts,
      output: {
        ...recipe.output,
        productName: outputProduct ? outputProduct.name : recipe.output.productId,
        unit: outputProduct ? outputProduct.unit : 'unit'
      },
      productionTime: recipe.productionTime,
      laborCost: recipe.laborCost
    };
  }

  /**
   * Get all recipe summaries
   * @returns {Array} Array of recipe summaries
   */
  getAllRecipeSummaries() {
    return this.getAllRecipes().map(r => this.getRecipeSummary(r.id));
  }

  /**
   * Calculate profit margin for recipe
   * @param {string} recipeId - Recipe ID
   * @param {Object} prices - Map of productId to price
   * @param {number} batches - Number of batches (default 1)
   * @returns {Object} Profit analysis
   */
  calculateProfitMargin(recipeId, prices, batches = 1) {
    const recipe = this.getRecipe(recipeId);
    if (!recipe) {
      return null;
    }

    const cost = this.calculateProductionCost(recipeId, prices, batches);
    const outputPrice = prices[recipe.output.productId] || 0;
    const revenue = outputPrice * cost.outputQuantity;
    const profit = revenue - cost.totalCost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      recipeId,
      batches,
      totalCost: cost.totalCost,
      revenue,
      profit,
      profitMargin: margin,
      profitPerUnit: profit / cost.outputQuantity
    };
  }
}

/**
 * Create and initialize production chains
 * @returns {ProductionChains} Production chains instance
 */
export function createProductionChains() {
  return new ProductionChains();
}

// Export singleton instance
export const productionChains = createProductionChains();
