/**
 * Date Utilities
 * Handles simulation calendar dates and manipulations
 * Format: { year: 1, month: 1, day: 1 }
 * Calendar: 12 months/year, 28 days/month
 */

const DAYS_PER_MONTH = 28;
const MONTHS_PER_YEAR = 12;

/**
 * Create a date object
 * @param {number} year - Year (starts at 1)
 * @param {number} month - Month (1-12)
 * @param {number} day - Day (1-28)
 * @returns {Object} Date object { year, month, day }
 */
export function createDate(year, month, day) {
  return { year, month, day };
}

/**
 * Add days to a date
 * @param {Object} date - Starting date
 * @param {number} days - Number of days to add
 * @returns {Object} New date
 */
export function addDays(date, days) {
  let { year, month, day } = date;

  day += days;

  // Handle day overflow
  while (day > DAYS_PER_MONTH) {
    day -= DAYS_PER_MONTH;
    month++;

    // Handle month overflow
    if (month > MONTHS_PER_YEAR) {
      month = 1;
      year++;
    }
  }

  // Handle day underflow (negative days)
  while (day < 1) {
    month--;

    // Handle month underflow
    if (month < 1) {
      month = MONTHS_PER_YEAR;
      year--;
    }

    day += DAYS_PER_MONTH;
  }

  return createDate(year, month, day);
}

/**
 * Calculate days between two dates
 * @param {Object} date1 - First date
 * @param {Object} date2 - Second date
 * @returns {number} Number of days between dates (positive if date2 > date1)
 */
export function daysBetween(date1, date2) {
  const days1 = dateToTotalDays(date1);
  const days2 = dateToTotalDays(date2);
  return days2 - days1;
}

/**
 * Convert date to total days since year 1, month 1, day 1
 * @param {Object} date - Date to convert
 * @returns {number} Total days
 */
function dateToTotalDays(date) {
  const { year, month, day } = date;
  const yearDays = (year - 1) * MONTHS_PER_YEAR * DAYS_PER_MONTH;
  const monthDays = (month - 1) * DAYS_PER_MONTH;
  return yearDays + monthDays + day;
}

/**
 * Format date for display
 * @param {Object} date - Date to format
 * @returns {string} Formatted date "1.13.15"
 */
export function formatDate(date) {
  return `${date.year}.${date.month}.${date.day}`;
}

/**
 * Format date for long display
 * @param {Object} date - Date to format
 * @returns {string} Formatted date "Year 1, Month 13, Day 15"
 */
export function formatDateLong(date) {
  return `Year ${date.year}, Month ${date.month}, Day ${date.day}`;
}

/**
 * Check if date is end of month
 * @param {Object} date - Date to check
 * @returns {boolean} True if last day of month
 */
export function isEndOfMonth(date) {
  return date.day === DAYS_PER_MONTH;
}

/**
 * Check if date is end of year
 * @param {Object} date - Date to check
 * @returns {boolean} True if last day of year
 */
export function isEndOfYear(date) {
  return date.month === MONTHS_PER_YEAR && date.day === DAYS_PER_MONTH;
}

/**
 * Advance date by one day
 * @param {Object} date - Starting date
 * @returns {Object} Next day
 */
export function nextDay(date) {
  return addDays(date, 1);
}

/**
 * Go back one day
 * @param {Object} date - Starting date
 * @returns {Object} Previous day
 */
export function previousDay(date) {
  return addDays(date, -1);
}

/**
 * Compare two dates
 * @param {Object} date1 - First date
 * @param {Object} date2 - Second date
 * @returns {number} -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export function compareDates(date1, date2) {
  const days1 = dateToTotalDays(date1);
  const days2 = dateToTotalDays(date2);

  if (days1 < days2) return -1;
  if (days1 > days2) return 1;
  return 0;
}

/**
 * Check if two dates are equal
 * @param {Object} date1 - First date
 * @param {Object} date2 - Second date
 * @returns {boolean} True if dates are equal
 */
export function datesEqual(date1, date2) {
  return date1.year === date2.year &&
         date1.month === date2.month &&
         date1.day === date2.day;
}

/**
 * Validate date structure
 * @param {Object} date - Date to validate
 * @returns {boolean} True if valid date
 */
export function isValidDate(date) {
  if (!date || typeof date !== 'object') return false;

  const { year, month, day } = date;

  if (typeof year !== 'number' || year < 1) return false;
  if (typeof month !== 'number' || month < 1 || month > MONTHS_PER_YEAR) return false;
  if (typeof day !== 'number' || day < 1 || day > DAYS_PER_MONTH) return false;

  return true;
}

/**
 * Clone a date
 * @param {Object} date - Date to clone
 * @returns {Object} New date object with same values
 */
export function cloneDate(date) {
  return createDate(date.year, date.month, date.day);
}

/**
 * Get the first day of a month
 * @param {number} year - Year
 * @param {number} month - Month
 * @returns {Object} First day of the month
 */
export function firstDayOfMonth(year, month) {
  return createDate(year, month, 1);
}

/**
 * Get the last day of a month
 * @param {number} year - Year
 * @param {number} month - Month
 * @returns {Object} Last day of the month
 */
export function lastDayOfMonth(year, month) {
  return createDate(year, month, DAYS_PER_MONTH);
}

/**
 * Get the first day of a year
 * @param {number} year - Year
 * @returns {Object} First day of the year
 */
export function firstDayOfYear(year) {
  return createDate(year, 1, 1);
}

/**
 * Get the last day of a year
 * @param {number} year - Year
 * @returns {Object} Last day of the year
 */
export function lastDayOfYear(year) {
  return createDate(year, MONTHS_PER_YEAR, DAYS_PER_MONTH);
}

// Export constants
export { DAYS_PER_MONTH, MONTHS_PER_YEAR };
