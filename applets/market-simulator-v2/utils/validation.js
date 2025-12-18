/**
 * Validation Utilities
 * Data validation and integrity checking
 */

import { isValidDate } from './date-utils.js';

/**
 * Validation result structure
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string} error - Error message if invalid
 */

/**
 * Create validation result
 * @param {boolean} valid - Is valid
 * @param {string} error - Error message
 * @returns {ValidationResult}
 */
function result(valid, error = '') {
  return { valid, error };
}

/**
 * Validate number is valid and optionally within range
 * @param {*} value - Value to validate
 * @param {number|null} min - Minimum value (optional)
 * @param {number|null} max - Maximum value (optional)
 * @returns {ValidationResult}
 */
export function validateNumber(value, min = null, max = null) {
  if (typeof value !== 'number' || isNaN(value)) {
    return result(false, 'Value must be a valid number');
  }

  if (min !== null && value < min) {
    return result(false, `Value must be at least ${min}`);
  }

  if (max !== null && value > max) {
    return result(false, `Value must be at most ${max}`);
  }

  return result(true);
}

/**
 * Validate date structure
 * @param {*} date - Date to validate
 * @returns {ValidationResult}
 */
export function validateDate(date) {
  if (!isValidDate(date)) {
    return result(false, 'Invalid date structure');
  }
  return result(true);
}

/**
 * Validate string is non-empty
 * @param {*} value - Value to validate
 * @param {number} minLength - Minimum length (default 1)
 * @returns {ValidationResult}
 */
export function validateString(value, minLength = 1) {
  if (typeof value !== 'string') {
    return result(false, 'Value must be a string');
  }

  if (value.length < minLength) {
    return result(false, `String must be at least ${minLength} characters`);
  }

  return result(true);
}

/**
 * Validate array has elements
 * @param {*} array - Array to validate
 * @param {number} minLength - Minimum length (default 0)
 * @returns {ValidationResult}
 */
export function validateArray(array, minLength = 0) {
  if (!Array.isArray(array)) {
    return result(false, 'Value must be an array');
  }

  if (array.length < minLength) {
    return result(false, `Array must have at least ${minLength} elements`);
  }

  return result(true);
}

/**
 * Validate object has required properties
 * @param {*} obj - Object to validate
 * @param {string[]} requiredProps - Required property names
 * @returns {ValidationResult}
 */
export function validateObject(obj, requiredProps) {
  if (typeof obj !== 'object' || obj === null) {
    return result(false, 'Value must be an object');
  }

  for (const prop of requiredProps) {
    if (!(prop in obj)) {
      return result(false, `Missing required property: ${prop}`);
    }
  }

  return result(true);
}

/**
 * Validate account name (will check against chart of accounts in Phase 2)
 * @param {string} accountName - Account name to validate
 * @returns {ValidationResult}
 */
export function validateAccount(accountName) {
  // Phase 1: Basic string validation
  // Phase 2: Will check against CHART_OF_ACCOUNTS
  const stringCheck = validateString(accountName);
  if (!stringCheck.valid) {
    return stringCheck;
  }

  // TODO Phase 2: Verify account exists in chart of accounts
  return result(true);
}

/**
 * Validate transaction structure
 * @param {Object} transaction - Transaction to validate
 * @returns {ValidationResult}
 */
export function validateTransaction(transaction) {
  // Check required properties
  const objCheck = validateObject(transaction, [
    'id', 'firmId', 'date', 'description', 'entries'
  ]);
  if (!objCheck.valid) return objCheck;

  // Validate ID
  const idCheck = validateString(transaction.id);
  if (!idCheck.valid) return result(false, 'Transaction ID must be a non-empty string');

  // Validate firm ID
  const firmIdCheck = validateString(transaction.firmId);
  if (!firmIdCheck.valid) return result(false, 'Firm ID must be a non-empty string');

  // Validate date
  const dateCheck = validateDate(transaction.date);
  if (!dateCheck.valid) return result(false, 'Transaction date is invalid');

  // Validate description
  const descCheck = validateString(transaction.description);
  if (!descCheck.valid) return result(false, 'Transaction description must be a non-empty string');

  // Validate entries array
  const entriesCheck = validateArray(transaction.entries, 2);
  if (!entriesCheck.valid) return result(false, 'Transaction must have at least 2 entries');

  // Validate each entry
  let totalDebit = 0;
  let totalCredit = 0;

  for (const entry of transaction.entries) {
    const entryCheck = validateObject(entry, ['account', 'debit', 'credit']);
    if (!entryCheck.valid) return result(false, 'Invalid transaction entry structure');

    const accountCheck = validateAccount(entry.account);
    if (!accountCheck.valid) return result(false, `Invalid account: ${entry.account}`);

    const debitCheck = validateNumber(entry.debit, 0);
    if (!debitCheck.valid) return result(false, 'Debit must be a non-negative number');

    const creditCheck = validateNumber(entry.credit, 0);
    if (!creditCheck.valid) return result(false, 'Credit must be a non-negative number');

    // Each entry should have either debit OR credit (not both)
    if (entry.debit > 0 && entry.credit > 0) {
      return result(false, 'Entry cannot have both debit and credit');
    }

    totalDebit += entry.debit;
    totalCredit += entry.credit;
  }

  // Verify debits equal credits (with small epsilon for floating point)
  const epsilon = 0.01;
  if (Math.abs(totalDebit - totalCredit) > epsilon) {
    return result(false, `Transaction debits (${totalDebit}) must equal credits (${totalCredit})`);
  }

  return result(true);
}

/**
 * Validate firm structure
 * @param {Object} firm - Firm to validate
 * @returns {ValidationResult}
 */
export function validateFirm(firm) {
  const objCheck = validateObject(firm, [
    'id', 'name', 'type', 'founded', 'inventory', 'properties', 'activeProduction'
  ]);
  if (!objCheck.valid) return objCheck;

  const idCheck = validateString(firm.id);
  if (!idCheck.valid) return result(false, 'Firm ID must be a non-empty string');

  const nameCheck = validateString(firm.name);
  if (!nameCheck.valid) return result(false, 'Firm name must be a non-empty string');

  if (firm.type !== 'user' && firm.type !== 'ai') {
    return result(false, 'Firm type must be "user" or "ai"');
  }

  const dateCheck = validateDate(firm.founded);
  if (!dateCheck.valid) return result(false, 'Firm founded date is invalid');

  if (typeof firm.inventory !== 'object' || firm.inventory === null) {
    return result(false, 'Firm inventory must be an object');
  }

  const propsCheck = validateArray(firm.properties);
  if (!propsCheck.valid) return result(false, 'Firm properties must be an array');

  const prodCheck = validateArray(firm.activeProduction);
  if (!prodCheck.valid) return result(false, 'Firm activeProduction must be an array');

  return result(true);
}

/**
 * Validate product structure
 * @param {Object} product - Product to validate
 * @returns {ValidationResult}
 */
export function validateProduct(product) {
  const objCheck = validateObject(product, [
    'id', 'name', 'category', 'basePrice', 'unit', 'producible', 'productionTime', 'inputs'
  ]);
  if (!objCheck.valid) return objCheck;

  const idCheck = validateString(product.id);
  if (!idCheck.valid) return result(false, 'Product ID must be a non-empty string');

  const nameCheck = validateString(product.name);
  if (!nameCheck.valid) return result(false, 'Product name must be a non-empty string');

  const validCategories = ['raw_material', 'intermediate', 'finished_goods'];
  if (!validCategories.includes(product.category)) {
    return result(false, `Product category must be one of: ${validCategories.join(', ')}`);
  }

  const priceCheck = validateNumber(product.basePrice, 0);
  if (!priceCheck.valid) return result(false, 'Product basePrice must be a non-negative number');

  const unitCheck = validateString(product.unit);
  if (!unitCheck.valid) return result(false, 'Product unit must be a non-empty string');

  if (typeof product.producible !== 'boolean') {
    return result(false, 'Product producible must be a boolean');
  }

  const timeCheck = validateNumber(product.productionTime, 0);
  if (!timeCheck.valid) return result(false, 'Product productionTime must be a non-negative number');

  const inputsCheck = validateArray(product.inputs);
  if (!inputsCheck.valid) return result(false, 'Product inputs must be an array');

  return result(true);
}

/**
 * Validate property structure
 * @param {Object} property - Property to validate
 * @returns {ValidationResult}
 */
export function validateProperty(property) {
  const objCheck = validateObject(property, [
    'id', 'typeId', 'ownerId', 'purchaseDate', 'purchasePrice', 'currentValue', 'condition'
  ]);
  if (!objCheck.valid) return objCheck;

  const idCheck = validateString(property.id);
  if (!idCheck.valid) return result(false, 'Property ID must be a non-empty string');

  const typeIdCheck = validateString(property.typeId);
  if (!typeIdCheck.valid) return result(false, 'Property typeId must be a non-empty string');

  // ownerId can be null (property available for purchase)
  if (property.ownerId !== null) {
    const ownerCheck = validateString(property.ownerId);
    if (!ownerCheck.valid) return result(false, 'Property ownerId must be a string or null');
  }

  if (property.purchaseDate !== null) {
    const dateCheck = validateDate(property.purchaseDate);
    if (!dateCheck.valid) return result(false, 'Property purchaseDate is invalid');
  }

  const priceCheck = validateNumber(property.purchasePrice, 0);
  if (!priceCheck.valid) return result(false, 'Property purchasePrice must be a non-negative number');

  const valueCheck = validateNumber(property.currentValue, 0);
  if (!valueCheck.valid) return result(false, 'Property currentValue must be a non-negative number');

  const conditionCheck = validateNumber(property.condition, 0, 1);
  if (!conditionCheck.valid) return result(false, 'Property condition must be between 0 and 1');

  return result(true);
}

/**
 * Validate positive integer
 * @param {*} value - Value to validate
 * @returns {ValidationResult}
 */
export function validatePositiveInteger(value) {
  const numCheck = validateNumber(value, 1);
  if (!numCheck.valid) return numCheck;

  if (!Number.isInteger(value)) {
    return result(false, 'Value must be an integer');
  }

  return result(true);
}

/**
 * Validate percentage (0 to 1)
 * @param {*} value - Value to validate
 * @returns {ValidationResult}
 */
export function validatePercentage(value) {
  return validateNumber(value, 0, 1);
}

/**
 * Validate ID format (alphanumeric with underscores/hyphens)
 * @param {*} id - ID to validate
 * @returns {ValidationResult}
 */
export function validateId(id) {
  const stringCheck = validateString(id);
  if (!stringCheck.valid) return stringCheck;

  const idRegex = /^[a-zA-Z0-9_-]+$/;
  if (!idRegex.test(id)) {
    return result(false, 'ID must contain only letters, numbers, underscores, and hyphens');
  }

  return result(true);
}
