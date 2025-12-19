/**
 * Property Manager
 * Property ownership and transactions
 * Manages property instances, ownership tracking, and real estate transactions
 */

import { propertyTypes } from './property-types.js';
import { stateManager } from '../core/state-manager.js';
import { eventBus } from '../core/event-bus.js';

/**
 * Property Manager Class
 * Handles all property-related operations
 */
export class PropertyManager {
  constructor() {
    this.propertyCounter = 0;
    this.initialized = false;
  }

  /**
   * Initialize property inventory
   * Creates initial set of properties available for purchase
   */
  initializeProperties() {
    if (this.initialized) {
      return;
    }

    const properties = [];
    const allPropertyTypes = propertyTypes.getAllPropertyTypes();

    // Create multiple instances of each property type
    for (const propertyType of allPropertyTypes) {
      // Create 3-5 instances of each property type
      const instanceCount = propertyType.category === 'production' ? 5 : 3;

      for (let i = 0; i < instanceCount; i++) {
        properties.push(this._createPropertyInstance(propertyType.id));
      }
    }

    // Store in state
    const realEstate = stateManager.getRealEstate();
    realEstate.properties = properties;
    realEstate.forSale = properties.map(p => p.id); // All initially for sale

    this.initialized = true;

    eventBus.emit('properties:initialized', {
      count: properties.length
    });
  }

  /**
   * Create a property instance
   * @param {string} typeId - Property type ID
   * @returns {Object} Property instance
   * @private
   */
  _createPropertyInstance(typeId) {
    const propertyType = propertyTypes.getPropertyType(typeId);
    if (!propertyType) {
      throw new Error(`Property type not found: ${typeId}`);
    }

    const propertyId = this._generatePropertyId();
    const currentDate = stateManager.getCurrentDate();

    return {
      id: propertyId,
      typeId: typeId,
      ownerId: null, // Not owned initially
      purchaseDate: null,
      purchasePrice: null,
      currentValue: propertyType.basePrice, // Starts at base price
      condition: 1.0, // Perfect condition (0.0 to 1.0)
      forSale: true,
      askingPrice: propertyType.basePrice,
      metadata: {
        created: { ...currentDate }
      }
    };
  }

  /**
   * Generate unique property ID
   * @returns {string} Property ID
   * @private
   */
  _generatePropertyId() {
    return `prop_${Date.now()}_${this.propertyCounter++}`;
  }

  /**
   * Get property by ID
   * @param {string} propertyId - Property ID
   * @returns {Object|undefined} Property or undefined
   */
  getProperty(propertyId) {
    return stateManager.getProperty(propertyId);
  }

  /**
   * Get all properties
   * @returns {Array} All properties
   */
  getAllProperties() {
    return stateManager.getRealEstate().properties;
  }

  /**
   * Get properties for sale
   * @returns {Array} Properties available for purchase
   */
  getAvailableProperties() {
    const realEstate = stateManager.getRealEstate();
    return realEstate.properties.filter(p =>
      realEstate.forSale.includes(p.id) && p.ownerId === null
    );
  }

  /**
   * Get properties owned by a firm
   * @param {string} firmId - Firm ID
   * @returns {Array} Properties owned by firm
   */
  getPropertiesByOwner(firmId) {
    const firm = stateManager.getFirm(firmId);
    if (!firm || !firm.properties) {
      return [];
    }

    return firm.properties.map(propId => this.getProperty(propId)).filter(p => p !== undefined);
  }

  /**
   * Get owner of a property
   * @param {string} propertyId - Property ID
   * @returns {string|null} Firm ID or null if unowned
   */
  getOwner(propertyId) {
    const property = this.getProperty(propertyId);
    return property ? property.ownerId : null;
  }

  /**
   * Buy a property
   * @param {string} firmId - Buyer firm ID
   * @param {string} propertyId - Property ID to purchase
   * @returns {boolean} True if purchase successful
   */
  buyProperty(firmId, propertyId) {
    const firm = stateManager.getFirm(firmId);
    const property = this.getProperty(propertyId);
    const realEstate = stateManager.getRealEstate();

    // Validation
    if (!firm) {
      console.error(`Firm not found: ${firmId}`);
      return false;
    }

    if (!property) {
      console.error(`Property not found: ${propertyId}`);
      return false;
    }

    if (property.ownerId !== null) {
      console.error(`Property already owned: ${propertyId}`);
      return false;
    }

    if (!realEstate.forSale.includes(propertyId)) {
      console.error(`Property not for sale: ${propertyId}`);
      return false;
    }

    const price = property.askingPrice;

    // Check if firm has enough cash
    const accounting = stateManager.getFirmAccounting(firmId);
    if (!accounting) {
      console.error(`Accounting not found for firm: ${firmId}`);
      return false;
    }

    const ledger = accounting.ledger;
    const cashBalance = ledger.getAccountBalance('Cash');

    if (cashBalance < price) {
      console.error(`Insufficient funds. Need ${price}, have ${cashBalance}`);
      return false;
    }

    // Record accounting transaction
    const transactionManager = accounting.transactionManager;
    const currentDate = stateManager.getCurrentDate();

    const propertyType = propertyTypes.getPropertyType(property.typeId);
    const description = `Purchase of ${propertyType.name} (${propertyId})`;

    const transaction = transactionManager.createSimpleTransaction(
      'Real Estate',
      'Cash',
      price,
      description,
      currentDate,
      {
        type: 'property_purchase',
        propertyId: propertyId,
        propertyType: property.typeId
      }
    );

    if (!transaction) {
      console.error('Failed to create transaction for property purchase');
      return false;
    }

    // Update property ownership
    property.ownerId = firmId;
    property.purchaseDate = { ...currentDate };
    property.purchasePrice = price;
    property.forSale = false;
    property.askingPrice = null;

    // Remove from for sale list
    const forSaleIndex = realEstate.forSale.indexOf(propertyId);
    if (forSaleIndex !== -1) {
      realEstate.forSale.splice(forSaleIndex, 1);
    }

    // Add to firm's properties
    if (!firm.properties) {
      firm.properties = [];
    }
    firm.properties.push(propertyId);

    // Emit event
    eventBus.emit('property:traded', {
      type: 'purchase',
      firmId: firmId,
      propertyId: propertyId,
      price: price
    });

    return true;
  }

  /**
   * Sell a property
   * @param {string} firmId - Seller firm ID
   * @param {string} propertyId - Property ID to sell
   * @param {string} buyerFirmId - Buyer firm ID (optional, can sell to market)
   * @returns {boolean} True if sale successful
   */
  sellProperty(firmId, propertyId, buyerFirmId = null) {
    const firm = stateManager.getFirm(firmId);
    const property = this.getProperty(propertyId);
    const realEstate = stateManager.getRealEstate();

    // Validation
    if (!firm) {
      console.error(`Firm not found: ${firmId}`);
      return false;
    }

    if (!property) {
      console.error(`Property not found: ${propertyId}`);
      return false;
    }

    if (property.ownerId !== firmId) {
      console.error(`Property not owned by firm: ${propertyId}`);
      return false;
    }

    // Calculate sale price (current market value)
    const salePrice = property.currentValue;

    // If selling to another firm, use buyProperty from buyer's perspective
    if (buyerFirmId) {
      // First, list it for sale
      property.forSale = true;
      property.askingPrice = salePrice;
      realEstate.forSale.push(propertyId);

      // Remove from current owner
      property.ownerId = null;
      const propIndex = firm.properties.indexOf(propertyId);
      if (propIndex !== -1) {
        firm.properties.splice(propIndex, 1);
      }

      // Buyer purchases
      return this.buyProperty(buyerFirmId, propertyId);
    }

    // Selling back to market
    const accounting = stateManager.getFirmAccounting(firmId);
    if (!accounting) {
      console.error(`Accounting not found for firm: ${firmId}`);
      return false;
    }

    const transactionManager = accounting.transactionManager;
    const currentDate = stateManager.getCurrentDate();

    const propertyType = propertyTypes.getPropertyType(property.typeId);
    const description = `Sale of ${propertyType.name} (${propertyId})`;

    // Calculate gain or loss
    const bookValue = property.purchasePrice || property.currentValue;
    const gainOrLoss = salePrice - bookValue;

    // Create transaction entries
    const entries = [
      { account: 'Cash', debit: salePrice, credit: 0 },
      { account: 'Real Estate', debit: 0, credit: bookValue }
    ];

    // Add gain or loss entry
    if (gainOrLoss > 0) {
      entries.push({ account: 'Gain on Sale of Assets', debit: 0, credit: gainOrLoss });
    } else if (gainOrLoss < 0) {
      entries.push({ account: 'Loss on Sale of Assets', debit: Math.abs(gainOrLoss), credit: 0 });
    }

    const transaction = transactionManager.createTransaction(
      entries,
      description,
      currentDate,
      {
        type: 'property_sale',
        propertyId: propertyId,
        propertyType: property.typeId,
        gainOrLoss: gainOrLoss
      }
    );

    if (!transaction) {
      console.error('Failed to create transaction for property sale');
      return false;
    }

    // Update property
    property.ownerId = null;
    property.forSale = true;
    property.askingPrice = salePrice;
    realEstate.forSale.push(propertyId);

    // Remove from firm's properties
    const propIndex = firm.properties.indexOf(propertyId);
    if (propIndex !== -1) {
      firm.properties.splice(propIndex, 1);
    }

    // Emit event
    eventBus.emit('property:traded', {
      type: 'sale',
      firmId: firmId,
      propertyId: propertyId,
      price: salePrice,
      gainOrLoss: gainOrLoss
    });

    return true;
  }

  /**
   * List property for sale
   * @param {string} firmId - Owner firm ID
   * @param {string} propertyId - Property ID
   * @param {number} askingPrice - Asking price
   * @returns {boolean} True if listed successfully
   */
  listPropertyForSale(firmId, propertyId, askingPrice) {
    const property = this.getProperty(propertyId);
    const realEstate = stateManager.getRealEstate();

    if (!property) {
      console.error(`Property not found: ${propertyId}`);
      return false;
    }

    if (property.ownerId !== firmId) {
      console.error(`Property not owned by firm: ${propertyId}`);
      return false;
    }

    property.forSale = true;
    property.askingPrice = askingPrice;

    if (!realEstate.forSale.includes(propertyId)) {
      realEstate.forSale.push(propertyId);
    }

    eventBus.emit('property:listed', {
      firmId: firmId,
      propertyId: propertyId,
      askingPrice: askingPrice
    });

    return true;
  }

  /**
   * Remove property from sale listing
   * @param {string} firmId - Owner firm ID
   * @param {string} propertyId - Property ID
   * @returns {boolean} True if delisted successfully
   */
  delistProperty(firmId, propertyId) {
    const property = this.getProperty(propertyId);
    const realEstate = stateManager.getRealEstate();

    if (!property) {
      console.error(`Property not found: ${propertyId}`);
      return false;
    }

    if (property.ownerId !== firmId) {
      console.error(`Property not owned by firm: ${propertyId}`);
      return false;
    }

    property.forSale = false;
    property.askingPrice = null;

    const forSaleIndex = realEstate.forSale.indexOf(propertyId);
    if (forSaleIndex !== -1) {
      realEstate.forSale.splice(forSaleIndex, 1);
    }

    eventBus.emit('property:delisted', {
      firmId: firmId,
      propertyId: propertyId
    });

    return true;
  }

  /**
   * Apply monthly maintenance to all owned properties
   * Called at end of month
   */
  applyMonthlyMaintenance() {
    const firms = stateManager.getFirms();

    for (const firm of firms) {
      if (!firm.properties || firm.properties.length === 0) {
        continue;
      }

      const accounting = stateManager.getFirmAccounting(firm.id);
      if (!accounting) {
        continue;
      }

      let totalMaintenance = 0;

      // Calculate total maintenance for all properties
      for (const propertyId of firm.properties) {
        const property = this.getProperty(propertyId);
        if (!property) continue;

        const propertyType = propertyTypes.getPropertyType(property.typeId);
        if (!propertyType) continue;

        totalMaintenance += propertyType.maintenanceCost;
      }

      // Record maintenance expense
      if (totalMaintenance > 0) {
        const transactionManager = accounting.transactionManager;
        const currentDate = stateManager.getCurrentDate();

        transactionManager.createSimpleTransaction(
          'Maintenance Expense',
          'Cash',
          totalMaintenance,
          `Monthly property maintenance for ${firm.properties.length} properties`,
          currentDate,
          {
            type: 'property_maintenance',
            propertyCount: firm.properties.length
          }
        );
      }
    }

    eventBus.emit('maintenance:applied', {
      date: stateManager.getCurrentDate()
    });
  }

  /**
   * Update property values (appreciation/depreciation)
   * Called periodically to adjust market values
   */
  updatePropertyValues() {
    const properties = this.getAllProperties();

    for (const property of properties) {
      if (!property.ownerId) continue; // Only update owned properties

      const propertyType = propertyTypes.getPropertyType(property.typeId);
      if (!propertyType) continue;

      // Simple depreciation: condition affects value
      // Properties slowly depreciate based on condition
      const depreciationFactor = 0.999; // Very slow depreciation
      property.currentValue *= depreciationFactor;
      property.condition = Math.max(0.5, property.condition * 0.9999); // Condition slowly degrades

      // Ensure value doesn't go below 50% of base price
      const minValue = propertyType.basePrice * 0.5;
      property.currentValue = Math.max(minValue, property.currentValue);
    }
  }

  /**
   * Get total property value for a firm
   * @param {string} firmId - Firm ID
   * @returns {number} Total property value
   */
  getTotalPropertyValue(firmId) {
    const properties = this.getPropertiesByOwner(firmId);
    return properties.reduce((total, property) => total + property.currentValue, 0);
  }

  /**
   * Get property details with type information
   * @param {string} propertyId - Property ID
   * @returns {Object|null} Property with type details
   */
  getPropertyDetails(propertyId) {
    const property = this.getProperty(propertyId);
    if (!property) return null;

    const propertyType = propertyTypes.getPropertyType(property.typeId);
    if (!propertyType) return null;

    return {
      ...property,
      type: propertyType
    };
  }
}

/**
 * Create property manager instance
 * @returns {PropertyManager} Property manager
 */
export function createPropertyManager() {
  return new PropertyManager();
}

// Export singleton instance
export const propertyManager = createPropertyManager();
