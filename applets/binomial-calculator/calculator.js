/**
 * Binomial Distribution Calculator - Core Calculation Engine
 *
 * This module provides exact binomial probability calculations using logarithmic
 * arithmetic to handle very large numbers without overflow/underflow.
 *
 * All calculations are exact - no approximations are used for probability values.
 */

(function(global) {
    'use strict';

    // Cache for log factorial values (for n up to CACHE_SIZE)
    const CACHE_SIZE = 10000;
    const logFactorialCache = new Float64Array(CACHE_SIZE + 1);
    let cacheInitialized = false;

    /**
     * Initialize the log factorial cache
     */
    function initializeCache() {
        if (cacheInitialized) return;

        logFactorialCache[0] = 0; // log(0!) = log(1) = 0
        logFactorialCache[1] = 0; // log(1!) = log(1) = 0

        for (let i = 2; i <= CACHE_SIZE; i++) {
            logFactorialCache[i] = logFactorialCache[i - 1] + Math.log(i);
        }

        cacheInitialized = true;
    }

    /**
     * Calculate log(n!) using cache for small values and Stirling's approximation for large values
     *
     * Stirling's approximation: log(n!) ≈ n*log(n) - n + 0.5*log(2πn)
     *
     * @param {number} n - The number to calculate factorial for
     * @returns {number} - log(n!)
     */
    function logFactorial(n) {
        if (!cacheInitialized) {
            initializeCache();
        }

        if (n < 0) {
            throw new Error('Factorial undefined for negative numbers');
        }

        if (n <= CACHE_SIZE) {
            return logFactorialCache[n];
        }

        // Use Stirling's approximation for large n
        // log(n!) ≈ n*log(n) - n + 0.5*log(2πn)
        return n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n);
    }

    /**
     * Calculate log(C(n, k)) = log(n! / (k! * (n-k)!))
     *
     * @param {number} n - Total number of trials
     * @param {number} k - Number of successes
     * @returns {number} - log(C(n, k))
     */
    function logBinomialCoefficient(n, k) {
        if (k < 0 || k > n) {
            return -Infinity; // C(n, k) = 0 for k < 0 or k > n
        }

        if (k === 0 || k === n) {
            return 0; // log(1) = 0
        }

        // Use symmetry: C(n, k) = C(n, n-k)
        // Choose the smaller of k and n-k to minimize computation
        const kOptimal = Math.min(k, n - k);

        // log(C(n, k)) = log(n!) - log(k!) - log((n-k)!)
        return logFactorial(n) - logFactorial(kOptimal) - logFactorial(n - kOptimal);
    }

    /**
     * Calculate log(P(X = k)) where X ~ Binomial(n, p)
     *
     * Formula: log(P(X = k)) = log(C(n, k)) + k*log(p) + (n-k)*log(1-p)
     *
     * @param {number} n - Number of trials
     * @param {number} k - Number of successes
     * @param {number} p - Probability of success
     * @returns {number} - log(P(X = k))
     */
    function logBinomialProbability(n, k, p) {
        // Edge cases
        if (k < 0 || k > n) {
            return -Infinity; // P(X = k) = 0
        }

        if (p === 0) {
            return k === 0 ? 0 : -Infinity; // P(X = 0) = 1, P(X = k) = 0 for k > 0
        }

        if (p === 1) {
            return k === n ? 0 : -Infinity; // P(X = n) = 1, P(X = k) = 0 for k < n
        }

        // Standard calculation
        const logCoeff = logBinomialCoefficient(n, k);
        const logPTerm = k * Math.log(p);
        const logQTerm = (n - k) * Math.log(1 - p);

        return logCoeff + logPTerm + logQTerm;
    }

    /**
     * Calculate P(X = k) exactly where X ~ Binomial(n, p)
     *
     * @param {number} n - Number of trials
     * @param {number} k - Number of successes
     * @param {number} p - Probability of success
     * @returns {number} - P(X = k)
     */
    function binomialProbability(n, k, p) {
        const logProb = logBinomialProbability(n, k, p);

        if (logProb === -Infinity) {
            return 0;
        }

        return Math.exp(logProb);
    }

    /**
     * Calculate cumulative probability using recurrence relation for efficiency
     *
     * Recurrence: P(X = k+1) = P(X = k) * [(n-k)/(k+1)] * [p/(1-p)]
     *
     * @param {number} n - Number of trials
     * @param {number} startK - Starting k value
     * @param {number} endK - Ending k value (inclusive)
     * @param {number} p - Probability of success
     * @param {function} progressCallback - Optional callback(current, total)
     * @returns {Promise<number>} - Cumulative probability P(startK ≤ X ≤ endK)
     */
    async function cumulativeProbabilityRange(n, startK, endK, p, progressCallback = null) {
        // Validate inputs
        if (startK < 0) startK = 0;
        if (endK > n) endK = n;
        if (startK > endK) return 0;

        // Edge cases
        if (p === 0) {
            return startK === 0 ? 1 : 0;
        }
        if (p === 1) {
            return endK === n ? 1 : 0;
        }

        // Calculate using recurrence relation
        let sum = 0;
        let currentProb = binomialProbability(n, startK, p);
        sum += currentProb;

        const total = endK - startK + 1;
        const CHUNK_SIZE = 1000; // Process 1000 iterations per chunk
        const UPDATE_FREQUENCY = 1000; // Update progress every 1000 iterations

        for (let k = startK; k < endK; k++) {
            // Use recurrence relation: P(X = k+1) = P(X = k) * [(n-k)/(k+1)] * [p/(1-p)]
            const ratio = ((n - k) / (k + 1)) * (p / (1 - p));
            currentProb *= ratio;
            sum += currentProb;

            // Update progress
            if (progressCallback && (k - startK + 1) % UPDATE_FREQUENCY === 0) {
                progressCallback(k - startK + 1, total);

                // Yield to event loop every CHUNK_SIZE iterations
                if ((k - startK + 1) % CHUNK_SIZE === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }
        }

        // Final progress update
        if (progressCallback) {
            progressCallback(total, total);
        }

        return sum;
    }

    /**
     * Calculate cumulative probability P(X ≤ k) or P(X ≥ k)
     * Automatically chooses the most efficient approach
     *
     * @param {number} n - Number of trials
     * @param {number} k - Threshold value
     * @param {number} p - Probability of success
     * @param {string} type - 'less_equal', 'greater_equal', 'less', 'greater', or 'equal'
     * @param {function} progressCallback - Optional callback(current, total)
     * @returns {Promise<number>} - Cumulative probability
     */
    async function cumulativeProbability(n, k, p, type = 'less_equal', progressCallback = null) {
        // Validate k
        if (k < 0) k = 0;
        if (k > n) k = n;

        switch (type) {
            case 'equal':
                // P(X = k)
                if (progressCallback) {
                    progressCallback(1, 1);
                }
                return binomialProbability(n, k, p);

            case 'less':
                // P(X < k) = P(X ≤ k-1)
                if (k === 0) return 0;
                return cumulativeProbabilityRange(n, 0, k - 1, p, progressCallback);

            case 'less_equal':
                // P(X ≤ k)
                // Choose efficient direction: if k > n/2, calculate 1 - P(X > k)
                if (k > n / 2) {
                    if (k === n) return 1;
                    const complement = await cumulativeProbabilityRange(n, k + 1, n, p, progressCallback);
                    return 1 - complement;
                }
                return cumulativeProbabilityRange(n, 0, k, p, progressCallback);

            case 'greater':
                // P(X > k) = P(X ≥ k+1)
                if (k === n) return 0;
                // Choose efficient direction: if k < n/2, calculate 1 - P(X ≤ k)
                if (k < n / 2) {
                    const complement = await cumulativeProbabilityRange(n, 0, k, p, progressCallback);
                    return 1 - complement;
                }
                return cumulativeProbabilityRange(n, k + 1, n, p, progressCallback);

            case 'greater_equal':
                // P(X ≥ k)
                // Choose efficient direction: if k < n/2, calculate 1 - P(X < k)
                if (k === 0) return 1;
                if (k < n / 2) {
                    const complement = await cumulativeProbabilityRange(n, 0, k - 1, p, progressCallback);
                    return 1 - complement;
                }
                return cumulativeProbabilityRange(n, k, n, p, progressCallback);

            default:
                throw new Error(`Unknown type: ${type}`);
        }
    }

    /**
     * Calculate range probability P(k1 ≤ X ≤ k2)
     *
     * @param {number} n - Number of trials
     * @param {number} k1 - Lower bound (inclusive)
     * @param {number} k2 - Upper bound (inclusive)
     * @param {number} p - Probability of success
     * @param {function} progressCallback - Optional callback(current, total)
     * @returns {Promise<number>} - P(k1 ≤ X ≤ k2)
     */
    async function rangeProbability(n, k1, k2, p, progressCallback = null) {
        // Validate inputs
        if (k1 < 0) k1 = 0;
        if (k2 > n) k2 = n;
        if (k1 > k2) return 0;

        return cumulativeProbabilityRange(n, k1, k2, p, progressCallback);
    }

    /**
     * Calculate distribution statistics
     *
     * @param {number} n - Number of trials
     * @param {number} p - Probability of success
     * @returns {object} - {mean, variance, stdDev, mode}
     */
    function distributionStats(n, p) {
        const mean = n * p;
        const variance = n * p * (1 - p);
        const stdDev = Math.sqrt(variance);
        const mode = Math.floor((n + 1) * p);

        return {
            mean,
            variance,
            stdDev,
            mode
        };
    }

    /**
     * Validate inputs for binomial distribution
     *
     * @param {number} n - Number of trials
     * @param {number} k - Number of successes (can be null for some calculations)
     * @param {number} p - Probability of success
     * @returns {object} - {valid: boolean, error: string}
     */
    function validateInputs(n, k, p) {
        // Validate n
        if (!Number.isInteger(n) || n < 1) {
            return { valid: false, error: 'Number of trials must be a positive integer (n ≥ 1)' };
        }

        if (n > 10000000) {
            return { valid: false, error: 'Number of trials exceeds maximum (10,000,000)' };
        }

        // Validate p
        if (typeof p !== 'number' || p < 0 || p > 1) {
            return { valid: false, error: 'Probability must be between 0 and 1' };
        }

        // Validate k (if provided)
        if (k !== null && k !== undefined) {
            if (!Number.isInteger(k)) {
                return { valid: false, error: 'Number of successes must be an integer' };
            }

            if (k < 0) {
                return { valid: false, error: 'Number of successes cannot be negative' };
            }

            if (k > n) {
                return { valid: false, error: 'Number of successes cannot exceed number of trials' };
            }
        }

        return { valid: true };
    }

    // Export functions
    const BinomialCalculator = {
        logFactorial,
        logBinomialCoefficient,
        logBinomialProbability,
        binomialProbability,
        cumulativeProbability,
        rangeProbability,
        distributionStats,
        validateInputs
    };

    // Export to global scope
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = BinomialCalculator;
    } else {
        global.BinomialCalculator = BinomialCalculator;
    }

})(typeof window !== 'undefined' ? window : this);
