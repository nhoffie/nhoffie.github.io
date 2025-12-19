/**
 * Math Utilities
 * Common mathematical operations for the simulation
 */

/**
 * Round to N decimal places
 * @param {number} number - Number to round
 * @param {number} decimals - Number of decimal places (default 2)
 * @returns {number} Rounded number
 */
export function round(number, decimals = 2) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(number * multiplier) / multiplier;
}

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 * @param {number} value - Current value
 * @param {number} oldMin - Old range minimum
 * @param {number} oldMax - Old range maximum
 * @param {number} newMin - New range minimum
 * @param {number} newMax - New range maximum
 * @returns {number} Interpolated value
 */
export function interpolate(value, oldMin, oldMax, newMin, newMax) {
  const oldRange = oldMax - oldMin;
  const newRange = newMax - newMin;

  if (oldRange === 0) return newMin;

  const ratio = (value - oldMin) / oldRange;
  return newMin + (ratio * newRange);
}

/**
 * Calculate percentage change
 * @param {number} oldValue - Original value
 * @param {number} newValue - New value
 * @returns {number} Percentage change (e.g., 0.25 for 25% increase)
 */
export function percentageChange(oldValue, newValue) {
  if (oldValue === 0) {
    return newValue === 0 ? 0 : Infinity;
  }
  return (newValue - oldValue) / oldValue;
}

/**
 * Calculate percentage of total
 * @param {number} value - Part value
 * @param {number} total - Total value
 * @returns {number} Percentage (e.g., 0.25 for 25%)
 */
export function percentageOf(value, total) {
  if (total === 0) return 0;
  return value / total;
}

/**
 * Sum array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Sum
 */
export function sum(numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

/**
 * Average of array
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Average
 */
export function average(numbers) {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}

/**
 * Ensure value is positive (non-negative)
 * @param {number} value - Value to check
 * @returns {number} Positive value (0 if negative)
 */
export function ensurePositive(value) {
  return Math.max(0, value);
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {number} decimals - Decimal places (default 2)
 * @returns {string} Formatted currency "$1,234.56"
 */
export function formatCurrency(amount, decimals = 2) {
  const rounded = round(amount, decimals);
  const negative = rounded < 0;
  const absValue = Math.abs(rounded);

  const formatted = absValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return negative ? `-$${formatted}` : `$${formatted}`;
}

/**
 * Format number with commas
 * @param {number} number - Number to format
 * @param {number} decimals - Decimal places (default 0)
 * @returns {string} Formatted number "1,234,567"
 */
export function formatNumber(number, decimals = 0) {
  const rounded = round(number, decimals);
  return rounded.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Calculate weighted average
 * @param {Array<{value: number, weight: number}>} items - Array of {value, weight} objects
 * @returns {number} Weighted average
 */
export function weightedAverage(items) {
  if (items.length === 0) return 0;

  const totalWeight = sum(items.map(item => item.weight));
  if (totalWeight === 0) return 0;

  const weightedSum = sum(items.map(item => item.value * item.weight));
  return weightedSum / totalWeight;
}

/**
 * Calculate compound growth
 * @param {number} principal - Starting value
 * @param {number} rate - Growth rate per period (e.g., 0.05 for 5%)
 * @param {number} periods - Number of periods
 * @returns {number} Final value
 */
export function compoundGrowth(principal, rate, periods) {
  return principal * Math.pow(1 + rate, periods);
}

/**
 * Calculate simple interest
 * @param {number} principal - Principal amount
 * @param {number} rate - Interest rate (e.g., 0.05 for 5%)
 * @param {number} periods - Number of periods
 * @returns {number} Interest amount
 */
export function simpleInterest(principal, rate, periods) {
  return principal * rate * periods;
}

/**
 * Random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random float between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random float
 */
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Check if number is approximately equal (within epsilon)
 * @param {number} a - First number
 * @param {number} b - Second number
 * @param {number} epsilon - Tolerance (default 0.0001)
 * @returns {boolean} True if approximately equal
 */
export function approxEqual(a, b, epsilon = 0.0001) {
  return Math.abs(a - b) < epsilon;
}

/**
 * Safe division (returns 0 if dividing by zero)
 * @param {number} numerator - Numerator
 * @param {number} denominator - Denominator
 * @returns {number} Result or 0 if denominator is 0
 */
export function safeDivide(numerator, denominator) {
  if (denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Calculate percentage as formatted string
 * @param {number} value - Value (e.g., 0.125 for 12.5%)
 * @param {number} decimals - Decimal places (default 1)
 * @returns {string} Formatted percentage "12.5%"
 */
export function formatPercentage(value, decimals = 1) {
  const percentage = value * 100;
  return `${round(percentage, decimals)}%`;
}
