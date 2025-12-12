# Warehouse Equipment Operations - Implementation Plan

## Overview

This document outlines the implementation plan for adding warehouse equipment operations to the accounting simulation game. The feature allows employees to operate equipment, craft new equipment, and produce commodities within warehouses.

**Session ID**: claude/warehouse-equipment-operations-C6G2d

---

## Current Game State Analysis

### ✅ Existing Systems
- **Employees**: 10-tier skill system (Novice to Elite), wage payments, building assignments
- **Warehouses**: 4×4 interior grid structure (currently unused), 14-day construction time
- **Commodities Market**: 5 commodities (Power, Water, Lumber, Steel, Concrete)
- **Time Simulation**: 60:1 time scale (1 real second = 60 sim seconds)
- **Inventory**: FIFO costing, portfolio management
- **Accounting**: Double-entry bookkeeping with Equipment asset account (1500)

### ❌ Missing Systems
- Equipment types and definitions
- Equipment placement in warehouse grids
- Crafting/production mechanics
- Employee task assignment
- Production time calculations
- Equipment-specific materials

---

## Implementation Phases

### **Phase 1: Equipment Infrastructure & Data Model** 🏗️
**Estimated Complexity**: Medium
**Session Duration**: 30-45 minutes

#### Goals
- Define equipment type system
- Create equipment definitions with stats
- Add new commodity types for materials
- Store equipment in warehouse grid
- Basic equipment data persistence

#### Deliverables

1. **Equipment Definition System**
   ```javascript
   const EQUIPMENT_TYPES = {
       WORKBENCH: {
           id: 'workbench',
           name: 'Workbench',
           description: 'Basic crafting station for producing equipment',
           materials: { lumber: 10 },  // Craftable without equipment
           productionTime: 4 * 60 * 60 * 1000,  // 4 simulation hours
           canCraftWithoutEquipment: true,
           gridSize: 1,  // Occupies 1 grid cell
           produces: ['equipment']  // Can produce other equipment
       },
       LUMBER_MILL: {
           id: 'lumber_mill',
           name: 'Lumber Mill',
           description: 'Processes raw logs into lumber',
           materials: { lumber: 20, steel: 5 },
           productionTime: 8 * 60 * 60 * 1000,  // 8 hours
           requiresEquipment: ['workbench'],
           gridSize: 1,
           produces: ['lumber']
       },
       FOUNDRY: {
           id: 'foundry',
           name: 'Foundry',
           description: 'Smelts ore into steel',
           materials: { lumber: 15, steel: 10, concrete: 5 },
           productionTime: 12 * 60 * 60 * 1000,  // 12 hours
           requiresEquipment: ['workbench'],
           gridSize: 1,
           produces: ['steel']
       },
       // More equipment types to be added...
   };
   ```

2. **New Commodity Types**
   - **Raw Logs** (price: $8.00) - Used to produce Lumber at Lumber Mill
   - **Iron Ore** (price: $12.00) - Used to produce Steel at Foundry
   - **Sand** (price: $3.00) - Used to produce Concrete at Concrete Mixer
   - **Gravel** (price: $4.00) - Used for Concrete production
   - Consider: Coal, Oil, Natural Gas for power generation

3. **Data Structure Updates**
   ```javascript
   // Update building.interior structure
   building.interior = {
       grid: [
           [null, null, null, null],
           [null, null, null, null],
           [null, null, null, null],
           [null, null, null, null]
       ],
       equipment: [
           {
               id: uniqueId,
               type: 'workbench',
               gridX: 0,
               gridY: 0,
               installDate: 'Y1-M1-D5',
               status: 'idle', // idle, producing, broken
               currentProduction: null  // Reference to active production job
           }
       ]
   };
   ```

4. **Helper Functions**
   - `getEquipmentDefinition(equipmentType)` - Get equipment specs
   - `canPlaceEquipment(buildingId, x, y, equipmentType)` - Check grid space
   - `placeEquipment(buildingId, x, y, equipmentType)` - Install equipment in grid
   - `removeEquipment(buildingId, equipmentId)` - Uninstall equipment
   - `getWarehouseEquipment(buildingId)` - List all equipment in warehouse
   - `getAvailableEquipment(buildingId)` - Equipment not currently in use

#### Testing Checklist
- [ ] Equipment definitions load correctly
- [ ] New commodities appear in market
- [ ] Equipment can be placed in warehouse grid
- [ ] Equipment persists in session save/load
- [ ] Grid collision detection works (can't overlap equipment)

---

### **Phase 2: Workbench Crafting System** 🔨
**Estimated Complexity**: Medium
**Session Duration**: 30-45 minutes

#### Goals
- Implement manual crafting of workbench from lumber
- Create production queue system
- Calculate production time based on employees and skills
- Update accounting for material consumption

#### Deliverables

1. **Production Queue System**
   ```javascript
   appState.productionQueue = [
       {
           id: uniqueId,
           buildingId: 123,
           equipmentId: null,  // null for workbench crafting
           productType: 'equipment',
           productId: 'workbench',
           quantity: 1,
           startTime: simulationTime,
           estimatedCompletionTime: simulationTime + calculatedDuration,
           actualCompletionTime: null,
           status: 'in_progress', // in_progress, completed, cancelled
           materialsConsumed: { lumber: 10 },
           assignedEmployees: [employeeId1, employeeId2],
           transactionId: txnId
       }
   ];
   ```

2. **Production Time Calculation**
   ```javascript
   function calculateProductionTime(baseTime, employeeCount, avgSkillLevel) {
       // Base formula: time = baseTime / (employeeCount * skillMultiplier)
       // Skill multiplier: 1.0 (level 1) to 2.5 (level 10)
       const skillMultiplier = 0.7 + (avgSkillLevel * 0.18);
       const employeeMultiplier = Math.sqrt(employeeCount); // Diminishing returns
       const totalMultiplier = employeeMultiplier * skillMultiplier;

       return Math.max(baseTime / totalMultiplier, baseTime * 0.2);  // Min 20% of base time
   }
   ```

3. **Crafting Functions**
   - `startWorkbenchCraft(buildingId)` - Begin crafting workbench
     - Check lumber inventory (10 units required)
     - Check building has employees
     - Consume materials from inventory (FIFO)
     - Calculate production time
     - Add to production queue
     - Create accounting transaction (debit Equipment 1500, credit Inventory 1200)

   - `checkProductionProgress()` - Called in simulation loop (every 100ms)
     - Check if any production jobs completed
     - Move completed equipment to warehouse grid (auto-place if space available)
     - Update production status

   - `cancelProduction(productionId)` - Cancel active production
     - Refund 50% of materials
     - Remove from queue

4. **UI Components**
   - Production panel in warehouse interior view
   - "Craft Workbench" button (only shows when no equipment required)
   - Production queue display showing:
     - Item being produced
     - Progress bar (% complete based on time)
     - Estimated completion time
     - Assigned employees
     - Cancel button

5. **Accounting Integration**
   - Material consumption: Debit Equipment/Inventory, Credit Inventory
   - Use FIFO cost basis for materials
   - Record transaction when production starts

#### Testing Checklist
- [ ] Can craft workbench with 10 lumber
- [ ] Production time varies with employee count and skill
- [ ] Materials deducted from inventory with correct FIFO costing
- [ ] Production completes at correct simulation time
- [ ] Workbench appears in warehouse grid when complete
- [ ] Accounting transactions recorded correctly
- [ ] Can cancel production and receive partial refund

---

### **Phase 3: Equipment-to-Equipment Production** ⚙️
**Estimated Complexity**: High
**Session Duration**: 45-60 minutes

#### Goals
- Use workbench to produce other equipment
- Handle equipment prerequisites
- Create comprehensive equipment library
- Equipment placement UI

#### Deliverables

1. **Expanded Equipment Library**
   Add 8-10 equipment types:
   - **Lumber Mill** (requires: workbench; produces: lumber from raw logs)
   - **Foundry** (requires: workbench; produces: steel from iron ore)
   - **Concrete Mixer** (requires: workbench; produces: concrete from sand + gravel)
   - **Assembly Line** (requires: workbench; produces: complex products)
   - **Storage Rack** (requires: workbench; increases warehouse capacity)
   - **Power Generator** (requires: workbench + foundry; produces: power)
   - **Water Pump** (requires: workbench; produces: water)
   - **Forge** (requires: workbench; produces: tools and equipment)

2. **Equipment Production System**
   ```javascript
   function startEquipmentProduction(buildingId, equipmentType) {
       // 1. Validate prerequisites
       const requiredEquipment = EQUIPMENT_TYPES[equipmentType].requiresEquipment;
       if (!hasRequiredEquipment(buildingId, requiredEquipment)) {
           return { success: false, error: 'Missing required equipment' };
       }

       // 2. Check materials
       const materials = EQUIPMENT_TYPES[equipmentType].materials;
       if (!hasRequiredMaterials(materials)) {
           return { success: false, error: 'Insufficient materials' };
       }

       // 3. Find available equipment (not currently producing)
       const availableEquipment = getAvailableEquipment(buildingId, requiredEquipment[0]);
       if (!availableEquipment) {
           return { success: false, error: 'Equipment is busy' };
       }

       // 4. Calculate production time
       const employees = getEmployeesByBuilding(buildingId);
       const avgSkill = calculateAverageSkill(employees);
       const baseTime = EQUIPMENT_TYPES[equipmentType].productionTime;
       const actualTime = calculateProductionTime(baseTime, employees.length, avgSkill);

       // 5. Consume materials and start production
       consumeMaterials(materials);
       createProductionJob(buildingId, availableEquipment.id, equipmentType, actualTime);

       // 6. Mark equipment as busy
       availableEquipment.status = 'producing';

       return { success: true, productionId: newJob.id };
   }
   ```

3. **Equipment Management UI**
   - Equipment catalog browser
     - Filter by: can craft, missing requirements, all
     - Show material costs
     - Show production time estimate
     - Show prerequisites
   - Production queue viewer
     - Active productions with progress bars
     - Queue of waiting jobs
   - Warehouse grid view enhancements
     - Click to place new equipment (drag & drop optional)
     - Click equipment to see details/status
     - Highlight equipment when producing

4. **Helper Functions**
   - `hasRequiredEquipment(buildingId, requiredTypes)` - Check prerequisites
   - `getAvailableEquipmentByType(buildingId, type)` - Find idle equipment
   - `calculateAverageSkill(employees)` - Average skill level
   - `consumeMaterials(materialsDict)` - Deduct from inventory
   - `hasRequiredMaterials(materialsDict)` - Check inventory
   - `autoPlaceEquipment(buildingId, equipmentType)` - Find empty grid spot

#### Testing Checklist
- [ ] Cannot produce equipment without prerequisites
- [ ] Materials consumed when starting production
- [ ] Equipment marked as "busy" during production
- [ ] Equipment becomes "idle" when production completes
- [ ] Multiple equipment can produce simultaneously
- [ ] Cannot start production if equipment is busy
- [ ] Produced equipment appears in warehouse grid
- [ ] Equipment placement UI works correctly
- [ ] Can see all equipment details and requirements

---

### **Phase 4: Commodity Production System** 🏭
**Estimated Complexity**: High
**Session Duration**: 45-60 minutes

#### Goals
- Equipment produces commodities (lumber, steel, concrete, etc.)
- Integrate with existing commodity market
- Production recipes with multiple inputs
- Continuous production mode

#### Deliverables

1. **Production Recipes**
   ```javascript
   const PRODUCTION_RECIPES = {
       LUMBER: {
           id: 'lumber',
           name: 'Lumber Production',
           equipmentRequired: 'lumber_mill',
           inputs: { raw_logs: 2 },
           outputs: { lumber: 1 },
           baseProductionTime: 2 * 60 * 60 * 1000,  // 2 hours per batch
           batchSize: 1
       },
       STEEL: {
           id: 'steel',
           equipmentRequired: 'foundry',
           inputs: { iron_ore: 3, coal: 1 },
           outputs: { steel: 1 },
           baseProductionTime: 4 * 60 * 60 * 1000,  // 4 hours
           batchSize: 1
       },
       CONCRETE: {
           id: 'concrete',
           equipmentRequired: 'concrete_mixer',
           inputs: { sand: 2, gravel: 2, water: 1 },
           outputs: { concrete: 1 },
           baseProductionTime: 1 * 60 * 60 * 1000,  // 1 hour
           batchSize: 1
       },
       POWER: {
           id: 'power',
           equipmentRequired: 'power_generator',
           inputs: { coal: 1 },  // or oil, or natural_gas
           outputs: { power: 10 },
           baseProductionTime: 30 * 60 * 1000,  // 30 minutes
           batchSize: 1
       }
       // More recipes...
   };
   ```

2. **Commodity Production Functions**
   ```javascript
   function startCommodityProduction(buildingId, equipmentId, recipeId, continuous = false) {
       const recipe = PRODUCTION_RECIPES[recipeId];
       const equipment = getEquipmentById(buildingId, equipmentId);

       // Validate equipment type matches recipe
       if (equipment.type !== recipe.equipmentRequired) {
           return { success: false, error: 'Wrong equipment type' };
       }

       // Check input materials
       if (!hasRequiredMaterials(recipe.inputs)) {
           return { success: false, error: 'Insufficient materials' };
       }

       // Consume inputs
       consumeMaterials(recipe.inputs);

       // Calculate production time
       const employees = getEmployeesByBuilding(buildingId);
       const productionTime = calculateProductionTime(
           recipe.baseProductionTime,
           employees.length,
           calculateAverageSkill(employees)
       );

       // Create production job
       const job = {
           id: appState.nextProductionId++,
           buildingId: buildingId,
           equipmentId: equipmentId,
           productType: 'commodity',
           recipeId: recipeId,
           outputs: recipe.outputs,
           startTime: getCurrentSimulationTime(),
           estimatedCompletionTime: getCurrentSimulationTime() + productionTime,
           status: 'in_progress',
           continuous: continuous,  // Auto-restart when complete
           materialsConsumed: recipe.inputs
       };

       appState.productionQueue.push(job);
       equipment.status = 'producing';
       equipment.currentProduction = job.id;

       return { success: true, productionId: job.id };
   }

   function completeCommodityProduction(productionJob) {
       // Add outputs to inventory
       for (const [commodityName, quantity] of Object.entries(productionJob.outputs)) {
           const commodityId = getCommodityIdByName(commodityName);
           addToInventory(commodityId, quantity, 0);  // Cost basis = 0 for self-produced
       }

       // Mark equipment as idle
       const equipment = getEquipmentById(productionJob.buildingId, productionJob.equipmentId);
       equipment.status = 'idle';
       equipment.currentProduction = null;

       // If continuous mode, restart production
       if (productionJob.continuous) {
           const recipe = PRODUCTION_RECIPES[productionJob.recipeId];
           if (hasRequiredMaterials(recipe.inputs)) {
               startCommodityProduction(
                   productionJob.buildingId,
                   productionJob.equipmentId,
                   productionJob.recipeId,
                   true
               );
           } else {
               // Not enough materials, stop continuous production
               equipment.status = 'idle';
           }
       }

       productionJob.status = 'completed';
       productionJob.actualCompletionTime = getCurrentSimulationTime();
   }
   ```

3. **Production Accounting**
   - Self-produced commodities: cost basis = material costs
   - Transaction: Debit Inventory (outputs), Credit Inventory (inputs)
   - Track production costs for COGS calculation

4. **UI Enhancements**
   - Recipe browser for each equipment type
   - Production controls:
     - Start button
     - Continuous mode toggle
     - Batch quantity selector (future enhancement)
   - Production history log
   - Efficiency metrics (items produced per day, per employee)

5. **Integration with Existing Systems**
   - Self-produced commodities appear in portfolio
   - Can sell self-produced commodities on market
   - Cost basis tracking for gain/loss calculations

#### Testing Checklist
- [ ] Can produce lumber from raw logs at lumber mill
- [ ] Can produce steel from iron ore at foundry
- [ ] Can produce concrete from sand + gravel + water
- [ ] Can produce power from coal
- [ ] Input materials consumed correctly
- [ ] Output commodities added to inventory
- [ ] Continuous mode restarts production automatically
- [ ] Continuous mode stops when materials run out
- [ ] Production time scales with employees and skill
- [ ] Accounting transactions recorded correctly
- [ ] Self-produced commodities have correct cost basis

---

### **Phase 5: Employee Task Management & UI Polish** 👷
**Estimated Complexity**: High
**Session Duration**: 45-60 minutes

#### Goals
- Visual feedback for employee assignments
- Task queue management
- Production efficiency display
- Quality of life improvements

#### Deliverables

1. **Employee Assignment Visualization**
   - Show which employees are assigned to building
   - Show employee status: idle, working, on break
   - Employee efficiency indicator (based on skill level)

2. **Production Dashboard**
   - Summary view for all warehouses
   - Active productions across all buildings
   - Production capacity (idle vs. busy equipment)
   - Material requirements for upcoming productions

3. **Warehouse Management Enhancements**
   - Equipment utilization percentage
   - Production history for each warehouse
   - Recommendations for equipment to build next
   - Material stockpile warnings (low inventory alerts)

4. **Quality of Life Features**
   - Keyboard shortcuts for common actions
   - Bulk production queueing
   - Production templates/saved recipes
   - Auto-restart production when materials available
   - Notification system for completed productions

5. **Visual Indicators**
   - Animated production progress bars
   - Equipment status icons (idle, producing, broken)
   - Employee avatars/icons in warehouse view
   - Color coding for production types

6. **Tutorial/Help System**
   - Guided tour of equipment system
   - Tooltips for all UI elements
   - "Getting Started" checklist
   - Equipment tech tree visualization

#### Testing Checklist
- [ ] Can see all employees assigned to warehouse
- [ ] Production dashboard shows accurate data
- [ ] Notifications appear when production completes
- [ ] Equipment status updates in real-time
- [ ] Material warnings appear when inventory low
- [ ] Tutorial guides new players through system
- [ ] UI is responsive on mobile devices
- [ ] All tooltips display correctly
- [ ] Performance is acceptable with many productions

---

### **Phase 6: Advanced Features (Optional)** 🚀
**Estimated Complexity**: Very High
**Session Duration**: 60+ minutes

#### Potential Enhancements
- **Equipment Upgrades**: Improve speed/efficiency of existing equipment
- **Equipment Maintenance**: Equipment degrades, requires repairs
- **Quality Levels**: Produced commodities have quality ratings
- **Employee Training**: Improve skills through production work
- **Blueprints System**: Research new equipment types
- **Automation**: Auto-purchase materials, auto-sell products
- **Multi-building Production Chains**: Link warehouses together
- **Transportation**: Move materials between warehouses
- **Power/Water Requirements**: Equipment consumes utilities
- **Warehouse Expansion**: Upgrade to 5×5, 6×6 grids

---

## Data Model Summary

### New Data Structures

```javascript
// appState additions
appState.productionQueue = [];  // Active and completed production jobs
appState.nextProductionId = 1;

// building.interior enhancements
building.interior = {
    grid: [[null, null, null, null], ...],  // 4x4 grid
    equipment: [
        {
            id: number,
            type: string,  // 'workbench', 'lumber_mill', etc.
            gridX: number,
            gridY: number,
            installDate: string,
            status: string,  // 'idle', 'producing', 'broken'
            currentProduction: number | null  // productionId
        }
    ]
};

// Production job structure
{
    id: number,
    buildingId: number,
    equipmentId: number | null,  // null for workbench crafting
    productType: string,  // 'equipment' or 'commodity'
    productId: string,  // equipment type or recipe id
    recipeId: string | null,  // for commodity production
    quantity: number,
    startTime: number,  // simulation milliseconds
    estimatedCompletionTime: number,
    actualCompletionTime: number | null,
    status: string,  // 'in_progress', 'completed', 'cancelled'
    materialsConsumed: object,  // { commodityName: quantity }
    outputs: object,  // { commodityName: quantity }
    assignedEmployees: array,  // employee IDs
    continuous: boolean,  // auto-restart when complete
    transactionId: number
}
```

### New Commodities to Add

| ID | Name | Description | Price |
|----|------|-------------|-------|
| 6 | Raw Logs | Unprocessed timber | $8.00 |
| 7 | Iron Ore | Raw iron ore | $12.00 |
| 8 | Sand | Construction sand | $3.00 |
| 9 | Gravel | Construction gravel | $4.00 |
| 10 | Coal | Fuel for power generation | $7.00 |
| 11 | Oil | Petroleum fuel | $15.00 |
| 12 | Natural Gas | Clean-burning fuel | $10.00 |

---

## Implementation Strategy

### Recommended Session Order

1. ✅ **Session 1**: Phase 1 - Equipment Infrastructure (this session)
   - Equipment definitions
   - New commodities
   - Data structures
   - Basic placement

2. **Session 2**: Phase 2 - Workbench Crafting
   - Production queue
   - Time calculations
   - Basic UI

3. **Session 3**: Phase 3 - Equipment Production
   - Equipment library expansion
   - Production system
   - Advanced UI

4. **Session 4**: Phase 4 - Commodity Production
   - Production recipes
   - Continuous production
   - Integration

5. **Session 5**: Phase 5 - Employee Management & Polish
   - Visualization
   - Dashboard
   - QoL features

6. **Session 6+**: Phase 6 - Advanced Features (as needed)

### Session Handoff Protocol

At the end of each session:
1. Commit all changes with descriptive message
2. Push to branch `claude/warehouse-equipment-operations-C6G2d`
3. Update this document with completion status
4. Document any bugs or issues found
5. Note any deviations from the plan
6. Suggest next session focus

---

## Testing Strategy

### Unit Testing (Manual)
- Test each function in isolation
- Verify data structures persist correctly
- Check edge cases (no materials, no employees, etc.)

### Integration Testing
- Test production flow end-to-end
- Verify accounting transactions
- Test with multiple simultaneous productions
- Verify session save/load preserves state

### Performance Testing
- Test with 20+ buildings
- Test with 100+ employees
- Test with 50+ active productions
- Monitor simulation loop performance

### User Acceptance Testing
- Can a new player understand the system?
- Is the UI intuitive?
- Are error messages helpful?
- Is the production time reasonable?

---

## Known Constraints & Considerations

1. **4×4 Grid Limitation**: Only 16 equipment slots per warehouse
   - Consider: Allow equipment to occupy multiple cells (2×2)
   - Future: Warehouse expansion upgrades

2. **Employee Assignment**: All employees in building contribute to all productions
   - Simple model: everyone helps with everything
   - Future: Individual task assignment

3. **Simulation Performance**: Production queue checked every 100ms
   - Optimize: Only check when near completion time
   - Consider: Separate production loop from clock loop

4. **Cost Basis for Self-Produced Commodities**: Set to $0 or material cost?
   - Decision: Use material cost for accurate COGS
   - Track production costs separately from purchase costs

5. **Equipment Prerequisites**: Linear dependency (workbench → other equipment)
   - Simple tech tree: workbench is gateway to everything
   - Future: Complex tech trees with multiple paths

6. **Material Balance**: Ensure raw materials are reasonably priced
   - Raw logs ($8) should make lumber ($10) profitable
   - Iron ore ($12) → steel ($20) conversion profitable
   - Balance production times with market prices

---

## Success Criteria

### Phase 1 Complete When:
- ✅ Equipment types defined with all properties
- ✅ New commodities added to market
- ✅ Equipment can be placed in warehouse grid
- ✅ Equipment data persists in session save/load
- ✅ No breaking changes to existing features

### Phase 2 Complete When:
- ✅ Can craft workbench from 10 lumber
- ✅ Production completes after correct time period
- ✅ Workbench appears in warehouse after completion
- ✅ Accounting transactions are correct
- ✅ UI shows production progress

### Phase 3 Complete When:
- ✅ 8+ equipment types available
- ✅ Can produce equipment using workbench
- ✅ Prerequisites enforced correctly
- ✅ Multiple equipment can produce simultaneously
- ✅ UI shows all equipment clearly

### Phase 4 Complete When:
- ✅ Equipment produces commodities
- ✅ Multiple input recipes work correctly
- ✅ Continuous production mode works
- ✅ Self-produced commodities integrate with market
- ✅ Cost basis tracked accurately

### Phase 5 Complete When:
- ✅ Dashboard shows all production activity
- ✅ Visual feedback for all operations
- ✅ Material warnings system works
- ✅ Tutorial helps new players
- ✅ Performance is acceptable

---

## Contact & Questions

For questions or issues during implementation:
- Reference this plan document
- Check existing code patterns in script.js
- Follow CLAUDE.md guidelines for code style
- Keep commits atomic and well-described
- Update this document if plans change

---

**Document Version**: 1.0
**Last Updated**: 2025-12-12
**Status**: Phase 1 Ready to Implement
