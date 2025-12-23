# Binomial Distribution Calculator

A high-precision binomial distribution probability calculator that handles very large numbers of trials (n > 1,000,000) using exact logarithmic calculations.

## Features

- **Exact Calculations**: No approximations - all probabilities are calculated exactly
- **Large Number Support**: Handles n up to 10,000,000 without overflow
- **Multiple Calculation Types**:
  - Exact probability: P(X = k)
  - Cumulative probabilities: P(X ≤ k), P(X ≥ k), P(X < k), P(X > k)
  - Range probabilities: P(k₁ ≤ X ≤ k₂)
- **Progress Monitoring**: Real-time progress updates with time estimates for long calculations
- **Distribution Statistics**: Automatically calculates mean, variance, standard deviation, and mode
- **Export Functionality**: Export results to JSON or CSV format
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## How to Use

### Basic Usage

1. **Enter Parameters**:
   - **Number of Trials (n)**: Positive integer from 1 to 10,000,000
   - **Number of Successes (k)**: Non-negative integer from 0 to n
   - **Success Probability (p)**: Decimal between 0 and 1

2. **Select Calculation Type**:
   - **Exact**: Calculate P(X = k)
   - **Cumulative**: Calculate P(X ≤ k), P(X ≥ k), P(X < k), or P(X > k)
   - **Range**: Calculate P(k₁ ≤ X ≤ k₂)

3. **Click "Calculate Probability"**

4. **View Results**:
   - Probability value (with scientific notation for very small values)
   - Distribution statistics
   - Calculation time
   - Export options

### Example Calculations

#### Example 1: Coin Flips
**Question**: What's the probability of getting exactly 50 heads in 100 coin flips?

**Parameters**:
- n = 100
- k = 50
- p = 0.5
- Type = Exact (P(X = k))

**Result**: ~0.0796 or about 7.96%

#### Example 2: Quality Control
**Question**: In a batch of 1,000 items with a 2% defect rate, what's the probability of finding 30 or fewer defects?

**Parameters**:
- n = 1000
- k = 30
- p = 0.02
- Type = Cumulative (P(X ≤ k))

#### Example 3: Large Dataset
**Question**: With 1,000,000 trials and p = 0.5, what's the probability of getting between 499,000 and 501,000 successes?

**Parameters**:
- n = 1,000,000
- p = 0.5
- Type = Range
- k₁ = 499,000
- k₂ = 501,000

## Technical Details

### Calculation Method

The calculator uses logarithmic arithmetic to avoid overflow and underflow issues when dealing with very large numbers:

1. **Log Factorials**: Calculated using Stirling's approximation for large values:
   ```
   log(n!) ≈ n×log(n) - n + 0.5×log(2πn)
   ```

2. **Binomial Coefficient**: Calculated in log space:
   ```
   log(C(n,k)) = log(n!) - log(k!) - log((n-k)!)
   ```

3. **Probability Calculation**:
   ```
   log(P(X = k)) = log(C(n,k)) + k×log(p) + (n-k)×log(1-p)
   P(X = k) = e^(log(P(X = k)))
   ```

4. **Cumulative Probabilities**: Uses recurrence relations for efficiency:
   ```
   P(X = k+1) = P(X = k) × [(n-k)/(k+1)] × [p/(1-p)]
   ```

### Performance

- **Exact calculations** (P(X = k)): < 1ms for any n
- **Cumulative with k = 100,000**: ~1 second
- **Cumulative with k = 1,000,000**: ~10 seconds

The calculator automatically uses the most efficient approach for each calculation type and provides real-time progress updates for longer calculations.

### Optimizations

1. **Factorial Caching**: Pre-calculates and caches log factorials for n ≤ 10,000
2. **Stirling's Approximation**: Used for large factorials to improve performance
3. **Smart Range Selection**: For cumulative probabilities, calculates from the smaller end
4. **Recurrence Relations**: Reuses previous calculations when computing multiple probabilities
5. **Chunked Processing**: Breaks long calculations into chunks to keep UI responsive

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

Requires JavaScript enabled.

## File Structure

```
binomial-calculator/
├── index.html       # Main HTML structure
├── style.css        # Styling
├── script.js        # UI logic and event handling
├── calculator.js    # Core calculation engine
└── README.md        # This file
```

## Mathematical Background

The binomial distribution models the number of successes in a fixed number of independent trials, each with the same probability of success.

**Formula**:
```
P(X = k) = C(n,k) × p^k × (1-p)^(n-k)
```

Where:
- C(n,k) = n! / (k! × (n-k)!) is the binomial coefficient
- n = number of trials
- k = number of successes
- p = probability of success on each trial

**Properties**:
- Mean: μ = n × p
- Variance: σ² = n × p × (1-p)
- Standard Deviation: σ = √(n × p × (1-p))
- Mode: ⌊(n+1) × p⌋

## Limitations

- Maximum n: 10,000,000 (practical limit for browser-based calculations)
- Very small probabilities (< 1e-308) may underflow to zero
- Calculations with large k values may take several seconds
- Browser must support ES6+ JavaScript features

## Validation

Input validation ensures:
- n is a positive integer (1 ≤ n ≤ 10,000,000)
- k is a non-negative integer (0 ≤ k ≤ n)
- p is a decimal (0 ≤ p ≤ 1)
- For range calculations: k₁ ≤ k₂

## Known Issues

- None currently

## Future Enhancements

Potential features for future versions:
- Batch calculation mode for multiple parameter sets
- Probability mass function visualization
- Comparison with normal approximation
- Probability table generation
- Additional export formats (Excel, PDF)

## License

Part of nhoffie.github.io personal website project.

## Support

For issues or questions, please visit the [GitHub repository](https://github.com/nhoffie/nhoffie.github.io).

---

**Last Updated**: 2025-12-23
**Version**: 1.0
