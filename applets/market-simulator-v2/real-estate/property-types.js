/**
 * Property Types
 * Property definitions and capabilities
 * Defines all property types available in the real estate market
 */

/**
 * Property categories
 */
export const PROPERTY_CATEGORIES = {
  PRODUCTION: 'production',
  RETAIL: 'retail',
  STORAGE: 'storage',
  OFFICE: 'office'
};

/**
 * Property type definitions
 * Each property type has:
 * - id: Unique identifier
 * - name: Display name
 * - category: Property category (production, retail, storage, office)
 * - basePrice: Base purchase price
 * - maintenanceCost: Monthly maintenance cost
 * - capabilities: What this property enables
 * - description: Property description
 */
export const PROPERTY_TYPES = [
  // Production Facilities
  {
    id: 'smelting_facility',
    name: 'Smelting Facility',
    category: PROPERTY_CATEGORIES.PRODUCTION,
    basePrice: 85000,
    maintenanceCost: 1200,
    capabilities: {
      production: ['steel_ingots'], // Can produce steel from iron ore
      capacity: 100, // units per day
      storage: 500 // units of inventory
    },
    description: 'Facility for smelting iron ore into steel ingots'
  },
  {
    id: 'refinery',
    name: 'Refinery',
    category: PROPERTY_CATEGORIES.PRODUCTION,
    basePrice: 120000,
    maintenanceCost: 1800,
    capabilities: {
      production: ['plastic_pellets'], // Can produce plastic from crude oil
      capacity: 150,
      storage: 600
    },
    description: 'Petroleum refinery for producing plastic pellets'
  },
  {
    id: 'electronics_factory',
    name: 'Electronics Factory',
    category: PROPERTY_CATEGORIES.PRODUCTION,
    basePrice: 200000,
    maintenanceCost: 2500,
    capabilities: {
      production: ['circuit_boards', 'consumer_electronics'], // Can produce electronics
      capacity: 50,
      storage: 400
    },
    description: 'Factory for manufacturing electronic components and devices'
  },
  {
    id: 'textile_mill',
    name: 'Textile Mill',
    category: PROPERTY_CATEGORIES.PRODUCTION,
    basePrice: 75000,
    maintenanceCost: 1000,
    capabilities: {
      production: ['fabric'], // Can produce fabric from cotton
      capacity: 200,
      storage: 800
    },
    description: 'Mill for processing cotton into fabric'
  },
  {
    id: 'metal_works',
    name: 'Metal Works',
    category: PROPERTY_CATEGORIES.PRODUCTION,
    basePrice: 95000,
    maintenanceCost: 1400,
    capabilities: {
      production: ['metal_sheets'], // Can produce metal sheets from steel
      capacity: 120,
      storage: 600
    },
    description: 'Workshop for fabricating metal sheets and components'
  },
  {
    id: 'assembly_plant_small',
    name: 'Small Assembly Plant',
    category: PROPERTY_CATEGORIES.PRODUCTION,
    basePrice: 180000,
    maintenanceCost: 2200,
    capabilities: {
      production: ['furniture', 'appliances'], // Can assemble finished goods
      capacity: 30,
      storage: 300
    },
    description: 'Small-scale assembly facility for furniture and appliances'
  },
  {
    id: 'assembly_plant_large',
    name: 'Large Assembly Plant',
    category: PROPERTY_CATEGORIES.PRODUCTION,
    basePrice: 450000,
    maintenanceCost: 5000,
    capabilities: {
      production: ['industrial_machinery', 'automobiles'], // Can assemble complex machinery
      capacity: 15,
      storage: 200
    },
    description: 'Large-scale assembly facility for heavy machinery and vehicles'
  },

  // Retail Locations
  {
    id: 'retail_store_small',
    name: 'Small Retail Store',
    category: PROPERTY_CATEGORIES.RETAIL,
    basePrice: 60000,
    maintenanceCost: 800,
    capabilities: {
      retail: true,
      salesCapacity: 100, // units per day
      storage: 300
    },
    description: 'Small storefront for retail sales'
  },
  {
    id: 'retail_store_large',
    name: 'Large Retail Store',
    category: PROPERTY_CATEGORIES.RETAIL,
    basePrice: 140000,
    maintenanceCost: 1600,
    capabilities: {
      retail: true,
      salesCapacity: 250,
      storage: 800
    },
    description: 'Large retail location with showroom'
  },
  {
    id: 'showroom',
    name: 'Showroom',
    category: PROPERTY_CATEGORIES.RETAIL,
    basePrice: 110000,
    maintenanceCost: 1300,
    capabilities: {
      retail: true,
      salesCapacity: 50, // Lower volume but high-value items
      storage: 100,
      prestige: true // Increases brand value
    },
    description: 'Premium showroom for high-end products'
  },

  // Storage Facilities
  {
    id: 'warehouse_small',
    name: 'Small Warehouse',
    category: PROPERTY_CATEGORIES.STORAGE,
    basePrice: 50000,
    maintenanceCost: 500,
    capabilities: {
      storage: 2000 // Large storage capacity
    },
    description: 'Small warehouse for inventory storage'
  },
  {
    id: 'warehouse_large',
    name: 'Large Warehouse',
    category: PROPERTY_CATEGORIES.STORAGE,
    basePrice: 120000,
    maintenanceCost: 1000,
    capabilities: {
      storage: 5000
    },
    description: 'Large warehouse with extensive storage capacity'
  },
  {
    id: 'distribution_center',
    name: 'Distribution Center',
    category: PROPERTY_CATEGORIES.STORAGE,
    basePrice: 200000,
    maintenanceCost: 1800,
    capabilities: {
      storage: 8000,
      logistics: true // Reduces shipping costs
    },
    description: 'Distribution center with advanced logistics capabilities'
  },

  // Office Buildings
  {
    id: 'office_small',
    name: 'Small Office',
    category: PROPERTY_CATEGORIES.OFFICE,
    basePrice: 40000,
    maintenanceCost: 400,
    capabilities: {
      administration: true,
      overheadReduction: 0.05 // 5% reduction in overhead costs
    },
    description: 'Small office space for administrative functions'
  },
  {
    id: 'office_large',
    name: 'Large Office',
    category: PROPERTY_CATEGORIES.OFFICE,
    basePrice: 100000,
    maintenanceCost: 900,
    capabilities: {
      administration: true,
      overheadReduction: 0.12 // 12% reduction in overhead costs
    },
    description: 'Large office building with multiple departments'
  },
  {
    id: 'headquarters',
    name: 'Corporate Headquarters',
    category: PROPERTY_CATEGORIES.OFFICE,
    basePrice: 250000,
    maintenanceCost: 2000,
    capabilities: {
      administration: true,
      overheadReduction: 0.20, // 20% reduction in overhead costs
      prestige: true // Increases brand value
    },
    description: 'Premium headquarters building with executive offices'
  }
];

/**
 * Property Types Class
 * Manages property type definitions and provides lookup functions
 */
export class PropertyTypes {
  constructor() {
    this.propertyTypes = new Map();
    this._initializePropertyTypes();
  }

  /**
   * Initialize property types registry
   * @private
   */
  _initializePropertyTypes() {
    for (const propertyType of PROPERTY_TYPES) {
      this.propertyTypes.set(propertyType.id, { ...propertyType });
    }
  }

  /**
   * Get property type by ID
   * @param {string} typeId - Property type ID
   * @returns {Object|undefined} Property type definition or undefined
   */
  getPropertyType(typeId) {
    return this.propertyTypes.get(typeId);
  }

  /**
   * Get all property types
   * @returns {Array} Array of all property type definitions
   */
  getAllPropertyTypes() {
    return Array.from(this.propertyTypes.values());
  }

  /**
   * Get property types by category
   * @param {string} category - Property category
   * @returns {Array} Array of property types matching the category
   */
  getPropertyTypesByCategory(category) {
    return this.getAllPropertyTypes().filter(p => p.category === category);
  }

  /**
   * Get production facilities
   * @returns {Array} Array of production property types
   */
  getProductionFacilities() {
    return this.getPropertyTypesByCategory(PROPERTY_CATEGORIES.PRODUCTION);
  }

  /**
   * Get retail locations
   * @returns {Array} Array of retail property types
   */
  getRetailLocations() {
    return this.getPropertyTypesByCategory(PROPERTY_CATEGORIES.RETAIL);
  }

  /**
   * Get storage facilities
   * @returns {Array} Array of storage property types
   */
  getStorageFacilities() {
    return this.getPropertyTypesByCategory(PROPERTY_CATEGORIES.STORAGE);
  }

  /**
   * Get office buildings
   * @returns {Array} Array of office property types
   */
  getOfficeBuildings() {
    return this.getPropertyTypesByCategory(PROPERTY_CATEGORIES.OFFICE);
  }

  /**
   * Check if property type exists
   * @param {string} typeId - Property type ID
   * @returns {boolean} True if property type exists
   */
  hasPropertyType(typeId) {
    return this.propertyTypes.has(typeId);
  }

  /**
   * Get property type name
   * @param {string} typeId - Property type ID
   * @returns {string|undefined} Property type name or undefined
   */
  getPropertyTypeName(typeId) {
    const propertyType = this.getPropertyType(typeId);
    return propertyType ? propertyType.name : undefined;
  }

  /**
   * Get property type base price
   * @param {string} typeId - Property type ID
   * @returns {number|undefined} Base price or undefined
   */
  getPropertyTypeBasePrice(typeId) {
    const propertyType = this.getPropertyType(typeId);
    return propertyType ? propertyType.basePrice : undefined;
  }

  /**
   * Get property type maintenance cost
   * @param {string} typeId - Property type ID
   * @returns {number|undefined} Maintenance cost or undefined
   */
  getPropertyTypeMaintenanceCost(typeId) {
    const propertyType = this.getPropertyType(typeId);
    return propertyType ? propertyType.maintenanceCost : undefined;
  }

  /**
   * Get property type capabilities
   * @param {string} typeId - Property type ID
   * @returns {Object|undefined} Capabilities object or undefined
   */
  getPropertyTypeCapabilities(typeId) {
    const propertyType = this.getPropertyType(typeId);
    return propertyType ? propertyType.capabilities : undefined;
  }

  /**
   * Check if property type can produce a product
   * @param {string} typeId - Property type ID
   * @param {string} productId - Product ID
   * @returns {boolean} True if property type can produce the product
   */
  canProduceProduct(typeId, productId) {
    const capabilities = this.getPropertyTypeCapabilities(typeId);
    if (!capabilities || !capabilities.production) {
      return false;
    }
    return capabilities.production.includes(productId);
  }

  /**
   * Get property types that can produce a specific product
   * @param {string} productId - Product ID
   * @returns {Array} Array of property type IDs that can produce the product
   */
  getPropertyTypesForProduct(productId) {
    return this.getAllPropertyTypes()
      .filter(pt => pt.capabilities.production && pt.capabilities.production.includes(productId))
      .map(pt => pt.id);
  }

  /**
   * Get count of property types by category
   * @returns {Object} Counts by category
   */
  getPropertyTypeCounts() {
    return {
      production: this.getProductionFacilities().length,
      retail: this.getRetailLocations().length,
      storage: this.getStorageFacilities().length,
      office: this.getOfficeBuildings().length,
      total: this.propertyTypes.size
    };
  }
}

/**
 * Create and initialize property types registry singleton
 * @returns {PropertyTypes} Property types instance
 */
export function createPropertyTypes() {
  return new PropertyTypes();
}

// Export singleton instance
export const propertyTypes = createPropertyTypes();
