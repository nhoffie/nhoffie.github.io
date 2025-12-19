/**
 * Inventory
 * Inventory management system
 * Tracks product quantities for firms
 */

import { productRegistry } from '../economy/product-registry.js';

/**
 * Inventory Class
 * Manages inventory of products for a firm
 */
export class Inventory {
  constructor(firmId) {
    this.firmId = firmId;
    this.items = {}; // { productId: quantity }
  }

  /**
   * Add product to inventory
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {boolean} True if successful
   */
  add(productId, quantity) {
    if (quantity <= 0) {
      console.error(`Inventory: Cannot add non-positive quantity: ${quantity}`);
      return false;
    }

    if (!productRegistry.hasProduct(productId)) {
      console.error(`Inventory: Unknown product: ${productId}`);
      return false;
    }

    if (!this.items[productId]) {
      this.items[productId] = 0;
    }

    this.items[productId] += quantity;
    return true;
  }

  /**
   * Remove product from inventory
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to remove
   * @returns {boolean} True if successful
   */
  remove(productId, quantity) {
    if (quantity <= 0) {
      console.error(`Inventory: Cannot remove non-positive quantity: ${quantity}`);
      return false;
    }

    if (!this.has(productId, quantity)) {
      console.error(`Inventory: Insufficient ${productId}: have ${this.getQuantity(productId)}, need ${quantity}`);
      return false;
    }

    this.items[productId] -= quantity;

    // Remove item if quantity reaches zero
    if (this.items[productId] === 0) {
      delete this.items[productId];
    }

    return true;
  }

  /**
   * Check if inventory has sufficient quantity of product
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to check
   * @returns {boolean} True if sufficient quantity available
   */
  has(productId, quantity = 1) {
    const currentQuantity = this.items[productId] || 0;
    return currentQuantity >= quantity;
  }

  /**
   * Get quantity of product in inventory
   * @param {string} productId - Product ID
   * @returns {number} Quantity (0 if not in inventory)
   */
  getQuantity(productId) {
    return this.items[productId] || 0;
  }

  /**
   * Set quantity of product
   * Used for initialization or adjustments
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity
   * @returns {boolean} True if successful
   */
  setQuantity(productId, quantity) {
    if (quantity < 0) {
      console.error(`Inventory: Cannot set negative quantity: ${quantity}`);
      return false;
    }

    if (!productRegistry.hasProduct(productId)) {
      console.error(`Inventory: Unknown product: ${productId}`);
      return false;
    }

    if (quantity === 0) {
      delete this.items[productId];
    } else {
      this.items[productId] = quantity;
    }

    return true;
  }

  /**
   * Get all products in inventory
   * @returns {Array} Array of {productId, quantity} objects
   */
  getAllItems() {
    return Object.entries(this.items).map(([productId, quantity]) => ({
      productId,
      quantity,
      product: productRegistry.getProduct(productId)
    }));
  }

  /**
   * Get all product IDs in inventory
   * @returns {Array} Array of product IDs
   */
  getProductIds() {
    return Object.keys(this.items);
  }

  /**
   * Check if inventory is empty
   * @returns {boolean} True if inventory has no items
   */
  isEmpty() {
    return Object.keys(this.items).length === 0;
  }

  /**
   * Get total count of distinct products
   * @returns {number} Number of different products
   */
  getProductCount() {
    return Object.keys(this.items).length;
  }

  /**
   * Get total quantity across all products
   * @returns {number} Total quantity of all items
   */
  getTotalQuantity() {
    return Object.values(this.items).reduce((sum, qty) => sum + qty, 0);
  }

  /**
   * Transfer items to another inventory
   * @param {Inventory} targetInventory - Target inventory
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to transfer
   * @returns {boolean} True if successful
   */
  transferTo(targetInventory, productId, quantity) {
    if (!this.remove(productId, quantity)) {
      return false;
    }

    if (!targetInventory.add(productId, quantity)) {
      // Rollback: add back to source
      this.add(productId, quantity);
      return false;
    }

    return true;
  }

  /**
   * Clear all inventory
   * Use with caution!
   */
  clear() {
    this.items = {};
  }

  /**
   * Calculate total inventory value at given prices
   * @param {Object} prices - { productId: price } map
   * @returns {number} Total value
   */
  calculateValue(prices) {
    let total = 0;

    for (const [productId, quantity] of Object.entries(this.items)) {
      const price = prices[productId];
      if (price !== undefined) {
        total += quantity * price;
      }
    }

    return total;
  }

  /**
   * Get inventory summary for display
   * @returns {Object} Summary with counts and details
   */
  getSummary() {
    return {
      firmId: this.firmId,
      productCount: this.getProductCount(),
      totalQuantity: this.getTotalQuantity(),
      isEmpty: this.isEmpty(),
      items: this.getAllItems()
    };
  }

  /**
   * Export inventory state (for saving)
   * @returns {Object} Inventory data
   */
  export() {
    return {
      firmId: this.firmId,
      items: { ...this.items }
    };
  }

  /**
   * Import inventory state (for loading)
   * @param {Object} data - Inventory data
   */
  import(data) {
    this.firmId = data.firmId;
    this.items = { ...data.items };
  }

  /**
   * Clone inventory
   * @returns {Inventory} New inventory instance with same items
   */
  clone() {
    const newInventory = new Inventory(this.firmId);
    newInventory.items = { ...this.items };
    return newInventory;
  }
}

/**
 * Create and initialize inventory for a firm
 * @param {string} firmId - Firm ID
 * @returns {Inventory} New inventory instance
 */
export function createInventory(firmId) {
  return new Inventory(firmId);
}
