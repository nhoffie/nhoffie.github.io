/**
 * Event Bus
 * Pub/sub event system for decoupled communication between modules
 *
 * Supported Events:
 * - time:tick - Each simulation day
 * - time:dayEnd - End of day
 * - time:monthEnd - End of month
 * - time:yearEnd - End of year
 * - firm:created - New firm created
 * - transaction:created - New accounting transaction
 * - market:priceChange - Market price updated
 * - market:tradeExecuted - Trade completed
 * - property:traded - Property bought/sold
 * - production:started - Production begun
 * - production:completed - Production finished
 * - state:loaded - Save state loaded
 */

class EventBus {
  constructor() {
    this.listeners = {}; // { eventName: [handler1, handler2, ...] }
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
   * Subscribe to an event
   * @param {string} eventName - Event name
   * @param {Function} handler - Handler function
   */
  on(eventName, handler) {
    if (typeof handler !== 'function') {
      console.error(`EventBus.on: Handler for "${eventName}" must be a function`);
      return;
    }

    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(handler);

    if (this.debugMode) {
      console.log(`EventBus: Subscribed to "${eventName}" (${this.listeners[eventName].length} total listeners)`);
    }
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName - Event name
   * @param {Function} handler - Handler function to remove
   */
  off(eventName, handler) {
    if (!this.listeners[eventName]) {
      return;
    }

    const index = this.listeners[eventName].indexOf(handler);
    if (index !== -1) {
      this.listeners[eventName].splice(index, 1);

      if (this.debugMode) {
        console.log(`EventBus: Unsubscribed from "${eventName}" (${this.listeners[eventName].length} remaining)`);
      }
    }

    // Clean up empty listener arrays
    if (this.listeners[eventName].length === 0) {
      delete this.listeners[eventName];
    }
  }

  /**
   * Fire an event with data
   * @param {string} eventName - Event name
   * @param {*} data - Data to pass to handlers
   */
  emit(eventName, data = null) {
    if (this.debugMode) {
      console.log(`EventBus: Emitting "${eventName}"`, data);
    }

    if (!this.listeners[eventName]) {
      if (this.debugMode) {
        console.log(`EventBus: No listeners for "${eventName}"`);
      }
      return;
    }

    // Create a copy of the listeners array to avoid issues if handlers modify subscriptions
    const handlers = [...this.listeners[eventName]];

    for (const handler of handlers) {
      try {
        handler(data);
      } catch (error) {
        console.error(`EventBus: Error in handler for "${eventName}":`, error);
      }
    }
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first call)
   * @param {string} eventName - Event name
   * @param {Function} handler - Handler function
   */
  once(eventName, handler) {
    const onceWrapper = (data) => {
      handler(data);
      this.off(eventName, onceWrapper);
    };

    this.on(eventName, onceWrapper);
  }

  /**
   * Clear all listeners for an event (or all events if no name provided)
   * @param {string|null} eventName - Event name (optional)
   */
  clear(eventName = null) {
    if (eventName === null) {
      this.listeners = {};
      if (this.debugMode) {
        console.log('EventBus: Cleared all listeners');
      }
    } else {
      delete this.listeners[eventName];
      if (this.debugMode) {
        console.log(`EventBus: Cleared all listeners for "${eventName}"`);
      }
    }
  }

  /**
   * Get count of listeners for an event
   * @param {string} eventName - Event name
   * @returns {number} Number of listeners
   */
  listenerCount(eventName) {
    return this.listeners[eventName] ? this.listeners[eventName].length : 0;
  }

  /**
   * Get all event names that have listeners
   * @returns {string[]} Array of event names
   */
  getEventNames() {
    return Object.keys(this.listeners);
  }

  /**
   * Check if event has any listeners
   * @param {string} eventName - Event name
   * @returns {boolean} True if event has listeners
   */
  hasListeners(eventName) {
    return this.listenerCount(eventName) > 0;
  }
}

// Export singleton instance
export const eventBus = new EventBus();

// Export class for testing
export { EventBus };
