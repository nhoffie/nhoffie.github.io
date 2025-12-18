/**
 * Simulation Engine
 * Main simulation loop and time management
 *
 * Phase 1: Stub implementation
 * Phase 6: Full implementation with game loop
 */

import { eventBus } from './event-bus.js';
import { stateManager } from './state-manager.js';
import { nextDay } from '../utils/date-utils.js';

class SimulationEngine {
  constructor() {
    this.tickInterval = null;
    this.ticksPerSecond = 1; // Will be calculated from timeMultiplier
    this.debugMode = false;
  }

  /**
   * Enable or disable debug mode
   * @param {boolean} enabled - Enable debug logging
   */
  setDebugMode(enabled) {
    this.debugMode = enabled;
  }

  /**
   * Initialize simulation
   * Phase 1: Just set up structure
   */
  init() {
    if (this.debugMode) {
      console.log('SimulationEngine: Initialized (Phase 1 stub)');
    }

    // Subscribe to state changes
    eventBus.on('state:loaded', () => {
      if (this.debugMode) {
        console.log('SimulationEngine: State loaded');
      }
    });
  }

  /**
   * Start simulation loop
   * Phase 1: Minimal implementation
   * Phase 6: Full game loop with setInterval
   */
  start() {
    stateManager.setPaused(false);

    if (this.debugMode) {
      console.log('SimulationEngine: Started (Phase 1 stub)');
      console.log('  Full implementation in Phase 6');
    }

    // TODO Phase 6: Implement actual game loop
    // this.tickInterval = setInterval(() => this.tick(), 1000 / this.ticksPerSecond);
  }

  /**
   * Pause simulation
   * Phase 1: Minimal implementation
   */
  pause() {
    stateManager.setPaused(true);

    if (this.debugMode) {
      console.log('SimulationEngine: Paused (Phase 1 stub)');
    }

    // TODO Phase 6: Clear interval
    // if (this.tickInterval) {
    //   clearInterval(this.tickInterval);
    //   this.tickInterval = null;
    // }
  }

  /**
   * Toggle pause state
   */
  togglePause() {
    if (stateManager.isPaused()) {
      this.start();
    } else {
      this.pause();
    }
  }

  /**
   * Execute one simulation tick (one day)
   * Phase 1: Minimal implementation
   * Phase 6: Full implementation with all systems
   */
  tick() {
    if (this.debugMode) {
      console.log('SimulationEngine: Tick (Phase 1 stub)');
    }

    // Get current date
    const currentDate = stateManager.getCurrentDate();

    // Advance time by one day
    const nextDate = nextDay(currentDate);
    stateManager.setCurrentDate(nextDate);

    // Emit time events
    eventBus.emit('time:tick', { date: nextDate });

    // TODO Phase 6: Implement full tick logic:
    // 1. Market clearing
    // 2. Production updates
    // 3. AI firm decisions
    // 4. End of day events
    // 5. UI updates
  }

  /**
   * Execute multiple ticks (for fast-forward)
   * @param {number} days - Number of days to advance
   */
  fastForward(days) {
    if (this.debugMode) {
      console.log(`SimulationEngine: Fast-forwarding ${days} days (Phase 1 stub)`);
    }

    for (let i = 0; i < days; i++) {
      this.tick();
    }
  }

  /**
   * Get current simulation speed (ticks per second)
   * @returns {number} Ticks per second
   */
  getSpeed() {
    return this.ticksPerSecond;
  }

  /**
   * Set simulation speed
   * @param {number} ticksPerSecond - Ticks per second
   */
  setSpeed(ticksPerSecond) {
    this.ticksPerSecond = ticksPerSecond;

    // If running, restart with new speed
    if (!stateManager.isPaused()) {
      this.pause();
      this.start();
    }

    if (this.debugMode) {
      console.log(`SimulationEngine: Speed set to ${ticksPerSecond} ticks/second`);
    }
  }

  /**
   * Calculate ticks per second from time multiplier
   * Time multiplier determines how many simulation seconds pass per real second
   * @param {number} timeMultiplier - Time multiplier (e.g., 60 = 60x speed)
   * @returns {number} Ticks per second
   */
  calculateTicksPerSecond(timeMultiplier) {
    // Each tick = 1 day = 86400 simulation seconds
    // If timeMultiplier = 60, then 60 sim seconds pass per real second
    // Therefore: ticks/second = 60 / 86400 = 0.000694
    // For more reasonable gameplay, we might want 1 tick per real second at 60x speed
    // This is a design decision for Phase 6
    const SECONDS_PER_DAY = 86400;
    return timeMultiplier / SECONDS_PER_DAY;
  }
}

// Export singleton instance
export const simulationEngine = new SimulationEngine();

// Export class for testing
export { SimulationEngine };
