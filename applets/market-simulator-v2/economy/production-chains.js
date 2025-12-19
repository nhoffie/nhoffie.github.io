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
  // Raw Materials → Intermediate Goods
  steel_ingots: {
    id: 'steel_ingots',
    name: 'Steel Refining',
    output: {
      productId: 'steel_ingots',
      quantity: 0.8 // tons (20% loss in refining)
    },
    inputs: [
      { productId: 'iron_ore', quantity: 1 } // tons
    ],
    productionTime: 1, // days
    laborCost: 180,
    description: 'Refine iron ore into steel ingots'
  },

  plastic_pellets: {
    id: 'plastic_pellets',
    name: 'Petrochemical Processing',
    output: {
      productId: 'plastic_pellets',
      quantity: 150 // kg per barrel
    },
    inputs: [
      { productId: 'crude_oil', quantity: 1 } // barrel
    ],
    productionTime: 1,
    laborCost: 250,
    description: 'Process crude oil into plastic pellets'
  },

  circuit_boards: {
    id: 'circuit_boards',
    name: 'Electronics Manufacturing',
    output: {
      productId: 'circuit_boards',
      quantity: 10 // units
    },
    inputs: [
      { productId: 'silicon', quantity: 2 }, // kg
      { productId: 'iron_ore', quantity: 0.1 } // tons (for copper/metal traces)
    ],
    productionTime: 2,
    laborCost: 850,
    description: 'Manufacture circuit boards from silicon wafers'
  },

  fabric: {
    id: 'fabric',
    name: 'Textile Weaving',
    output: {
      productId: 'fabric',
      quantity: 500 // yards per bale
    },
    inputs: [
      { productId: 'cotton', quantity: 1 } // bale
    ],
    productionTime: 2,
    laborCost: 320,
    description: 'Weave cotton into fabric'
  },

  metal_sheets: {
    id: 'metal_sheets',
    name: 'Metal Rolling',
    output: {
      productId: 'metal_sheets',
      quantity: 25 // sheets per ton
    },
    inputs: [
      { productId: 'steel_ingots', quantity: 1 } // ton
    ],
    productionTime: 1,
    laborCost: 280,
    description: 'Roll steel ingots into metal sheets'
  },

  // Intermediate Goods → Finished Products
  industrial_machinery: {
    id: 'industrial_machinery',
    name: 'Machinery Assembly',
    output: {
      productId: 'industrial_machinery',
      quantity: 1 // unit
    },
    inputs: [
      { productId: 'steel_ingots', quantity: 2 }, // tons
      { productId: 'circuit_boards', quantity: 15 }, // units
      { productId: 'metal_sheets', quantity: 40 } // sheets
    ],
    productionTime: 7,
    laborCost: 3500,
    description: 'Assemble heavy industrial machinery'
  },

  consumer_electronics: {
    id: 'consumer_electronics',
    name: 'Device Assembly',
    output: {
      productId: 'consumer_electronics',
      quantity: 5 // units
    },
    inputs: [
      { productId: 'circuit_boards', quantity: 8 }, // units
      { productId: 'plastic_pellets', quantity: 15 } // kg
    ],
    productionTime: 3,
    laborCost: 950,
    description: 'Assemble consumer electronic devices'
  },

  automobiles: {
    id: 'automobiles',
    name: 'Vehicle Assembly',
    output: {
      productId: 'automobiles',
      quantity: 1 // unit
    },
    inputs: [
      { productId: 'steel_ingots', quantity: 1.5 }, // tons
      { productId: 'plastic_pellets', quantity: 80 }, // kg
      { productId: 'circuit_boards', quantity: 12 }, // units
      { productId: 'metal_sheets', quantity: 30 } // sheets
    ],
    productionTime: 5,
    laborCost: 5200,
    description: 'Assemble automobiles from components'
  },

  furniture: {
    id: 'furniture',
    name: 'Furniture Manufacturing',
    output: {
      productId: 'furniture',
      quantity: 3 // units
    },
    inputs: [
      { productId: 'timber', quantity: 150 }, // board-ft
      { productId: 'fabric', quantity: 25 } // yards
    ],
    productionTime: 3,
    laborCost: 680,
    description: 'Manufacture furniture from timber and fabric'
  },

  appliances: {
    id: 'appliances',
    name: 'Appliance Assembly',
    output: {
      productId: 'appliances',
      quantity: 2 // units
    },
    inputs: [
      { productId: 'metal_sheets', quantity: 18 }, // sheets
      { productId: 'circuit_boards', quantity: 6 }, // units
      { productId: 'plastic_pellets', quantity: 12 } // kg
    ],
    productionTime: 4,
    laborCost: 1400,
    description: 'Assemble household appliances'
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
