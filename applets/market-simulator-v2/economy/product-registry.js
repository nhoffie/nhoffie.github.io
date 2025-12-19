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
    id: 'steel',
    name: 'Steel',
    type: PRODUCT_TYPES.RAW_MATERIAL,
    basePrice: 100,
    unit: 'ton',
    description: 'Raw steel material used in manufacturing'
  },
  {
    id: 'lumber',
    name: 'Lumber',
    type: PRODUCT_TYPES.RAW_MATERIAL,
    basePrice: 50,
    unit: 'board-ft',
    description: 'Raw lumber for construction and manufacturing'
  },
  {
    id: 'plastic_resin',
    name: 'Plastic Resin',
    type: PRODUCT_TYPES.RAW_MATERIAL,
    basePrice: 75,
    unit: 'kg',
    description: 'Plastic resin pellets for molding and manufacturing'
  },

  // Intermediate Goods
  {
    id: 'components',
    name: 'Components',
    type: PRODUCT_TYPES.INTERMEDIATE,
    basePrice: 250,
    unit: 'unit',
    description: 'Manufactured components used in finished products'
  },
  {
    id: 'metal_parts',
    name: 'Metal Parts',
    type: PRODUCT_TYPES.INTERMEDIATE,
    basePrice: 200,
    unit: 'unit',
    description: 'Fabricated metal parts and assemblies'
  },
  {
    id: 'electronic_modules',
    name: 'Electronic Modules',
    type: PRODUCT_TYPES.INTERMEDIATE,
    basePrice: 400,
    unit: 'unit',
    description: 'Electronic circuit boards and modules'
  },

  // Finished Goods
  {
    id: 'machinery',
    name: 'Machinery',
    type: PRODUCT_TYPES.FINISHED_GOODS,
    basePrice: 5000,
    unit: 'unit',
    description: 'Industrial machinery and equipment'
  },
  {
    id: 'consumer_goods',
    name: 'Consumer Goods',
    type: PRODUCT_TYPES.FINISHED_GOODS,
    basePrice: 150,
    unit: 'unit',
    description: 'Consumer products and household items'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    type: PRODUCT_TYPES.FINISHED_GOODS,
    basePrice: 800,
    unit: 'unit',
    description: 'Consumer and industrial electronic devices'
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
