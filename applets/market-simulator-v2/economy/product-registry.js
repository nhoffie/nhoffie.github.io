/**
 * Product Registry
 * Product definitions and metadata
 * Defines all products available in the market economy
 */

/**
 * Product types for categorization
 */
export const PRODUCT_TYPES = {
  RAW_MATERIAL: 'raw_material',
  INTERMEDIATE: 'intermediate',
  FINISHED_GOODS: 'finished_goods'
};

/**
 * Product definitions
 * Each product has:
 * - id: Unique identifier
 * - name: Display name
 * - type: Product type (raw, intermediate, finished)
 * - basePrice: Starting/reference price
 * - unit: Unit of measurement
 * - description: Product description
 */
export const PRODUCTS = [
  // Raw Materials
  {
    id: 'iron_ore',
    name: 'Iron Ore',
    type: PRODUCT_TYPES.RAW_MATERIAL,
    basePrice: 45,
    unit: 'ton',
    description: 'Unrefined iron ore extracted from mines'
  },
  {
    id: 'timber',
    name: 'Timber',
    type: PRODUCT_TYPES.RAW_MATERIAL,
    basePrice: 35,
    unit: 'board-ft',
    description: 'Raw timber logs for processing'
  },
  {
    id: 'crude_oil',
    name: 'Crude Oil',
    type: PRODUCT_TYPES.RAW_MATERIAL,
    basePrice: 65,
    unit: 'barrel',
    description: 'Unrefined petroleum for chemical processing'
  },
  {
    id: 'silicon',
    name: 'Silicon Wafers',
    type: PRODUCT_TYPES.RAW_MATERIAL,
    basePrice: 120,
    unit: 'kg',
    description: 'Purified silicon wafers for electronics'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    type: PRODUCT_TYPES.RAW_MATERIAL,
    basePrice: 55,
    unit: 'bale',
    description: 'Raw cotton for textile manufacturing'
  },

  // Intermediate Goods
  {
    id: 'steel_ingots',
    name: 'Steel Ingots',
    type: PRODUCT_TYPES.INTERMEDIATE,
    basePrice: 180,
    unit: 'ton',
    description: 'Refined steel ingots ready for fabrication'
  },
  {
    id: 'plastic_pellets',
    name: 'Plastic Pellets',
    type: PRODUCT_TYPES.INTERMEDIATE,
    basePrice: 220,
    unit: 'kg',
    description: 'Processed plastic pellets for molding'
  },
  {
    id: 'circuit_boards',
    name: 'Circuit Boards',
    type: PRODUCT_TYPES.INTERMEDIATE,
    basePrice: 450,
    unit: 'unit',
    description: 'Printed circuit boards for electronics'
  },
  {
    id: 'fabric',
    name: 'Fabric',
    type: PRODUCT_TYPES.INTERMEDIATE,
    basePrice: 25,
    unit: 'yard',
    description: 'Woven fabric for furniture and apparel'
  },
  {
    id: 'metal_sheets',
    name: 'Metal Sheets',
    type: PRODUCT_TYPES.INTERMEDIATE,
    basePrice: 95,
    unit: 'sheet',
    description: 'Rolled metal sheets for manufacturing'
  },

  // Finished Goods
  {
    id: 'industrial_machinery',
    name: 'Industrial Machinery',
    type: PRODUCT_TYPES.FINISHED_GOODS,
    basePrice: 8500,
    unit: 'unit',
    description: 'Heavy industrial manufacturing equipment'
  },
  {
    id: 'consumer_electronics',
    name: 'Consumer Electronics',
    type: PRODUCT_TYPES.FINISHED_GOODS,
    basePrice: 650,
    unit: 'unit',
    description: 'Phones, tablets, and personal devices'
  },
  {
    id: 'automobiles',
    name: 'Automobiles',
    type: PRODUCT_TYPES.FINISHED_GOODS,
    basePrice: 22000,
    unit: 'unit',
    description: 'Passenger vehicles and light trucks'
  },
  {
    id: 'furniture',
    name: 'Furniture',
    type: PRODUCT_TYPES.FINISHED_GOODS,
    basePrice: 850,
    unit: 'unit',
    description: 'Home and office furniture'
  },
  {
    id: 'appliances',
    name: 'Appliances',
    type: PRODUCT_TYPES.FINISHED_GOODS,
    basePrice: 1200,
    unit: 'unit',
    description: 'Household appliances and white goods'
  }
];

/**
 * Product Registry Class
 * Manages product definitions and provides lookup functions
 */
export class ProductRegistry {
  constructor() {
    this.products = new Map();
    this._initializeProducts();
  }

  /**
   * Initialize product registry with product definitions
   * @private
   */
  _initializeProducts() {
    for (const product of PRODUCTS) {
      this.products.set(product.id, { ...product });
    }
  }

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Object|undefined} Product definition or undefined if not found
   */
  getProduct(productId) {
    return this.products.get(productId);
  }

  /**
   * Get all products
   * @returns {Array} Array of all product definitions
   */
  getAllProducts() {
    return Array.from(this.products.values());
  }

  /**
   * Get products by type
   * @param {string} type - Product type (raw_material, intermediate, finished_goods)
   * @returns {Array} Array of products matching the type
   */
  getProductsByType(type) {
    return this.getAllProducts().filter(p => p.type === type);
  }

  /**
   * Get raw materials
   * @returns {Array} Array of raw material products
   */
  getRawMaterials() {
    return this.getProductsByType(PRODUCT_TYPES.RAW_MATERIAL);
  }

  /**
   * Get intermediate goods
   * @returns {Array} Array of intermediate products
   */
  getIntermediateGoods() {
    return this.getProductsByType(PRODUCT_TYPES.INTERMEDIATE);
  }

  /**
   * Get finished goods
   * @returns {Array} Array of finished goods products
   */
  getFinishedGoods() {
    return this.getProductsByType(PRODUCT_TYPES.FINISHED_GOODS);
  }

  /**
   * Check if product exists
   * @param {string} productId - Product ID
   * @returns {boolean} True if product exists
   */
  hasProduct(productId) {
    return this.products.has(productId);
  }

  /**
   * Get product name
   * @param {string} productId - Product ID
   * @returns {string|undefined} Product name or undefined
   */
  getProductName(productId) {
    const product = this.getProduct(productId);
    return product ? product.name : undefined;
  }

  /**
   * Get product base price
   * @param {string} productId - Product ID
   * @returns {number|undefined} Base price or undefined
   */
  getProductBasePrice(productId) {
    const product = this.getProduct(productId);
    return product ? product.basePrice : undefined;
  }

  /**
   * Get product unit
   * @param {string} productId - Product ID
   * @returns {string|undefined} Unit of measurement or undefined
   */
  getProductUnit(productId) {
    const product = this.getProduct(productId);
    return product ? product.unit : undefined;
  }

  /**
   * Get count of products by type
   * @returns {Object} Counts by type
   */
  getProductCounts() {
    return {
      rawMaterials: this.getRawMaterials().length,
      intermediateGoods: this.getIntermediateGoods().length,
      finishedGoods: this.getFinishedGoods().length,
      total: this.products.size
    };
  }
}

/**
 * Create and initialize product registry singleton
 * @returns {ProductRegistry} Product registry instance
 */
export function createProductRegistry() {
  return new ProductRegistry();
}

// Export singleton instance
export const productRegistry = createProductRegistry();
