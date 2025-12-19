/**
 * Facility
 * Production facility and retail location logic
 * Manages facility capabilities and capacity calculations
 */

import { propertyTypes } from './property-types.js';
import { propertyManager } from './property-manager.js';
import { stateManager } from '../core/state-manager.js';

/**
 * Facility Class
 * Handles facility-based capabilities and capacity
 */
export class Facility {
  constructor() {
    // Facility manager is stateless - all data comes from properties
  }

  /**
   * Get all facilities (properties) owned by a firm
   * @param {string} firmId - Firm ID
   * @returns {Array} Array of property details
   */
  getFacilitiesForFirm(firmId) {
    const properties = propertyManager.getPropertiesByOwner(firmId);
    return properties.map(property => {
      const propertyType = propertyTypes.getPropertyType(property.typeId);
      return {
        ...property,
        type: propertyType
      };
    });
  }

  /**
   * Get production facilities owned by a firm
   * @param {string} firmId - Firm ID
   * @returns {Array} Array of production facilities
   */
  getProductionFacilities(firmId) {
    const facilities = this.getFacilitiesForFirm(firmId);
    return facilities.filter(f => f.type && f.type.category === 'production');
  }

  /**
   * Get retail locations owned by a firm
   * @param {string} firmId - Firm ID
   * @returns {Array} Array of retail facilities
   */
  getRetailLocations(firmId) {
    const facilities = this.getFacilitiesForFirm(firmId);
    return facilities.filter(f => f.type && f.type.category === 'retail');
  }

  /**
   * Get storage facilities owned by a firm
   * @param {string} firmId - Firm ID
   * @returns {Array} Array of storage facilities
   */
  getStorageFacilities(firmId) {
    const facilities = this.getFacilitiesForFirm(firmId);
    return facilities.filter(f => f.type && f.type.category === 'storage');
  }

  /**
   * Get office buildings owned by a firm
   * @param {string} firmId - Firm ID
   * @returns {Array} Array of office facilities
   */
  getOfficeBuildings(firmId) {
    const facilities = this.getFacilitiesForFirm(firmId);
    return facilities.filter(f => f.type && f.type.category === 'office');
  }

  /**
   * Check if firm can produce a specific product
   * @param {string} firmId - Firm ID
   * @param {string} productId - Product ID
   * @returns {boolean} True if firm has facility to produce product
   */
  canProduceProduct(firmId, productId) {
    const productionFacilities = this.getProductionFacilities(firmId);

    for (const facility of productionFacilities) {
      if (!facility.type || !facility.type.capabilities || !facility.type.capabilities.production) {
        continue;
      }

      if (facility.type.capabilities.production.includes(productId)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get production capacity for a specific product
   * @param {string} firmId - Firm ID
   * @param {string} productId - Product ID
   * @returns {number} Maximum daily production capacity (units/day)
   */
  getProductionCapacity(firmId, productId) {
    const productionFacilities = this.getProductionFacilities(firmId);
    let totalCapacity = 0;

    for (const facility of productionFacilities) {
      if (!facility.type || !facility.type.capabilities || !facility.type.capabilities.production) {
        continue;
      }

      if (facility.type.capabilities.production.includes(productId)) {
        const baseCapacity = facility.type.capabilities.capacity || 0;
        // Adjust capacity based on condition (0.5 to 1.0)
        const adjustedCapacity = baseCapacity * facility.condition;
        totalCapacity += adjustedCapacity;
      }
    }

    return Math.floor(totalCapacity);
  }

  /**
   * Get all products a firm can produce
   * @param {string} firmId - Firm ID
   * @returns {Array} Array of product IDs
   */
  getProducibleProducts(firmId) {
    const productionFacilities = this.getProductionFacilities(firmId);
    const producibleProducts = new Set();

    for (const facility of productionFacilities) {
      if (!facility.type || !facility.type.capabilities || !facility.type.capabilities.production) {
        continue;
      }

      for (const productId of facility.type.capabilities.production) {
        producibleProducts.add(productId);
      }
    }

    return Array.from(producibleProducts);
  }

  /**
   * Get retail sales capacity
   * @param {string} firmId - Firm ID
   * @returns {number} Maximum daily sales capacity (units/day)
   */
  getRetailCapacity(firmId) {
    const retailLocations = this.getRetailLocations(firmId);
    let totalCapacity = 0;

    for (const location of retailLocations) {
      if (!location.type || !location.type.capabilities) {
        continue;
      }

      const baseCapacity = location.type.capabilities.salesCapacity || 0;
      // Adjust capacity based on condition
      const adjustedCapacity = baseCapacity * location.condition;
      totalCapacity += adjustedCapacity;
    }

    return Math.floor(totalCapacity);
  }

  /**
   * Get total storage capacity
   * @param {string} firmId - Firm ID
   * @returns {number} Total storage capacity (units)
   */
  getStorageCapacity(firmId) {
    const facilities = this.getFacilitiesForFirm(firmId);
    let totalCapacity = 0;

    for (const facility of facilities) {
      if (!facility.type || !facility.type.capabilities) {
        continue;
      }

      const storageCapacity = facility.type.capabilities.storage || 0;
      totalCapacity += storageCapacity;
    }

    return totalCapacity;
  }

  /**
   * Get total overhead reduction from office buildings
   * @param {string} firmId - Firm ID
   * @returns {number} Overhead reduction percentage (0.0 to 1.0)
   */
  getOverheadReduction(firmId) {
    const offices = this.getOfficeBuildings(firmId);
    let totalReduction = 0;

    for (const office of offices) {
      if (!office.type || !office.type.capabilities) {
        continue;
      }

      const reduction = office.type.capabilities.overheadReduction || 0;
      totalReduction += reduction;
    }

    // Cap at 50% reduction
    return Math.min(0.5, totalReduction);
  }

  /**
   * Check if firm has prestige properties
   * @param {string} firmId - Firm ID
   * @returns {boolean} True if firm has prestige properties
   */
  hasPrestige(firmId) {
    const facilities = this.getFacilitiesForFirm(firmId);

    for (const facility of facilities) {
      if (facility.type && facility.type.capabilities && facility.type.capabilities.prestige) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if firm has logistics capabilities
   * @param {string} firmId - Firm ID
   * @returns {boolean} True if firm has logistics
   */
  hasLogistics(firmId) {
    const facilities = this.getFacilitiesForFirm(firmId);

    for (const facility of facilities) {
      if (facility.type && facility.type.capabilities && facility.type.capabilities.logistics) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get facility utilization percentage
   * @param {string} firmId - Firm ID
   * @param {string} productId - Product ID (optional)
   * @returns {number} Utilization percentage (0.0 to 1.0)
   */
  getFacilityUtilization(firmId, productId = null) {
    // This would need production system integration to track actual usage
    // For now, return 0 as placeholder
    // TODO: Implement with production system in Phase 6
    return 0;
  }

  /**
   * Get detailed facility capabilities for a firm
   * @param {string} firmId - Firm ID
   * @returns {Object} Detailed capabilities summary
   */
  getFirmCapabilities(firmId) {
    return {
      producibleProducts: this.getProducibleProducts(firmId),
      productionCapacities: this._getProductionCapacityMap(firmId),
      retailCapacity: this.getRetailCapacity(firmId),
      storageCapacity: this.getStorageCapacity(firmId),
      overheadReduction: this.getOverheadReduction(firmId),
      hasPrestige: this.hasPrestige(firmId),
      hasLogistics: this.hasLogistics(firmId),
      facilityCounts: {
        production: this.getProductionFacilities(firmId).length,
        retail: this.getRetailLocations(firmId).length,
        storage: this.getStorageFacilities(firmId).length,
        office: this.getOfficeBuildings(firmId).length,
        total: this.getFacilitiesForFirm(firmId).length
      }
    };
  }

  /**
   * Get production capacity for each product
   * @param {string} firmId - Firm ID
   * @returns {Object} Map of product ID to capacity
   * @private
   */
  _getProductionCapacityMap(firmId) {
    const producibleProducts = this.getProducibleProducts(firmId);
    const capacityMap = {};

    for (const productId of producibleProducts) {
      capacityMap[productId] = this.getProductionCapacity(firmId, productId);
    }

    return capacityMap;
  }

  /**
   * Get facilities that can produce a specific product
   * @param {string} firmId - Firm ID
   * @param {string} productId - Product ID
   * @returns {Array} Array of facilities that can produce the product
   */
  getFacilitiesForProduct(firmId, productId) {
    const productionFacilities = this.getProductionFacilities(firmId);
    const matchingFacilities = [];

    for (const facility of productionFacilities) {
      if (!facility.type || !facility.type.capabilities || !facility.type.capabilities.production) {
        continue;
      }

      if (facility.type.capabilities.production.includes(productId)) {
        matchingFacilities.push(facility);
      }
    }

    return matchingFacilities;
  }

  /**
   * Get current inventory vs storage capacity
   * @param {string} firmId - Firm ID
   * @returns {Object} Storage usage information
   */
  getStorageUsage(firmId) {
    const storageCapacity = this.getStorageCapacity(firmId);
    const inventory = stateManager.getFirmInventory(firmId);

    if (!inventory) {
      return {
        capacity: storageCapacity,
        used: 0,
        available: storageCapacity,
        utilizationPercent: 0
      };
    }

    const totalItems = inventory.getTotalQuantity();

    return {
      capacity: storageCapacity,
      used: totalItems,
      available: Math.max(0, storageCapacity - totalItems),
      utilizationPercent: storageCapacity > 0 ? totalItems / storageCapacity : 0
    };
  }

  /**
   * Check if firm has storage capacity for additional items
   * @param {string} firmId - Firm ID
   * @param {number} quantity - Quantity to add
   * @returns {boolean} True if capacity available
   */
  hasStorageCapacity(firmId, quantity) {
    const storageUsage = this.getStorageUsage(firmId);
    return storageUsage.available >= quantity;
  }

  /**
   * Get required property type for producing a product
   * @param {string} productId - Product ID
   * @returns {Array} Array of property type IDs that can produce the product
   */
  getRequiredPropertyTypesForProduct(productId) {
    return propertyTypes.getPropertyTypesForProduct(productId);
  }

  /**
   * Get recommended properties for a firm based on missing capabilities
   * @param {string} firmId - Firm ID
   * @returns {Object} Recommendations
   */
  getPropertyRecommendations(firmId) {
    const capabilities = this.getFirmCapabilities(firmId);
    const recommendations = {
      urgentNeeds: [],
      suggestions: []
    };

    // Check if needs storage
    const storageUsage = this.getStorageUsage(firmId);
    if (storageUsage.utilizationPercent > 0.8) {
      recommendations.urgentNeeds.push({
        category: 'storage',
        reason: 'Storage capacity nearly full',
        suggested: ['warehouse_small', 'warehouse_large']
      });
    }

    // Check if needs production facilities
    if (capabilities.facilityCounts.production === 0) {
      recommendations.urgentNeeds.push({
        category: 'production',
        reason: 'No production facilities',
        suggested: ['smelting_facility', 'textile_mill', 'metal_works']
      });
    }

    // Suggest retail if none
    if (capabilities.facilityCounts.retail === 0) {
      recommendations.suggestions.push({
        category: 'retail',
        reason: 'No retail presence',
        suggested: ['retail_store_small']
      });
    }

    // Suggest office for overhead reduction
    if (capabilities.overheadReduction === 0) {
      recommendations.suggestions.push({
        category: 'office',
        reason: 'No overhead reduction',
        suggested: ['office_small']
      });
    }

    return recommendations;
  }
}

/**
 * Create facility instance
 * @returns {Facility} Facility manager
 */
export function createFacility() {
  return new Facility();
}

// Export singleton instance
export const facility = createFacility();
