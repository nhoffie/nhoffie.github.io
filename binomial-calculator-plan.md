# Binomial Distribution Calculator - Implementation Plan

## Overview
Create a high-precision binomial distribution calculator applet that can handle very large numbers of trials (n > 1,000,000) and calculate exact probabilities using vanilla HTML/CSS/JavaScript.

## Key Requirements
1. **Exact calculations** - No approximations (e.g., normal approximation)
2. **Large n support** - Handle n > 1,000,000
3. **Progress monitoring** - Real-time display of calculation progress
4. **Vanilla JS** - No external libraries or frameworks
5. **Responsive design** - Mobile-friendly interface

## Technical Challenges & Solutions

### Challenge 1: Large Number Arithmetic
**Problem**: Standard JavaScript numbers overflow when calculating factorials or large powers.

**Solution**: Use logarithmic calculations to avoid overflow/underflow:
- For P(X = k) = C(n,k) × p^k × (1-p)^(n-k)
- Calculate log(P(X = k)) = log(C(n,k)) + k×log(p) + (n-k)×log(1-p)
- Then convert back: P(X = k) = e^(log(P(X = k)))

**Logarithmic binomial coefficient**:
```
log(C(n,k)) = log(n!) - log(k!) - log((n-k)!)
            = Σ(i=1 to n)[log(i)] - Σ(i=1 to k)[log(i)] - Σ(i=1 to n-k)[log(i)]
```

### Challenge 2: Factorial Calculations for Large Numbers
**Problem**: Computing log(n!) for large n is slow if done naively.

**Solutions**:
1. **Stirling's Approximation** for very large values:
   - log(n!) ≈ n×log(n) - n + 0.5×log(2πn)
   - Accurate for large n, faster than summing

2. **Cached factorial table** for smaller values:
   - Pre-compute log factorials up to some threshold (e.g., 1000)
   - Use lookup for small values, Stirling for large values

3. **Incremental calculation**:
   - When calculating multiple probabilities, reuse intermediate results
   - log(C(n,k)) shares terms with log(C(n,k+1))

### Challenge 3: Cumulative Probability Calculations
**Problem**: P(X ≤ k) requires summing k+1 individual probabilities, which can be slow for large k.

**Solutions**:
1. **Progressive calculation**:
   - Calculate P(X = 0), P(X = 1), ..., P(X = k) iteratively
   - Use recurrence relation: P(X = k+1) = P(X = k) × [(n-k)/(k+1)] × [p/(1-p)]

2. **Smart range selection**:
   - For P(X ≥ k) where k is large, calculate 1 - P(X < k)
   - Choose the approach that requires fewer calculations

3. **Progress updates**:
   - Update progress bar after every N calculations (e.g., every 1000 iterations)
   - Use requestAnimationFrame or setTimeout to keep UI responsive

### Challenge 4: Numerical Stability
**Problem**: Very small probabilities can underflow to zero; summing many small numbers loses precision.

**Solutions**:
1. **Log-sum-exp trick** for cumulative probabilities:
   - Instead of summing probabilities directly
   - Sum in log space then convert: log(a + b) = log(a) + log(1 + e^(log(b) - log(a)))

2. **Maintain high precision**:
   - Use all available JavaScript Number precision (64-bit floating point)
   - Be careful with operations that lose precision

3. **Special case handling**:
   - If p = 0 or p = 1, shortcut calculations
   - If k > n, probability is 0
   - If k < 0, probability is 0

## Architecture

### File Structure
```
applets/binomial-calculator/
├── index.html          # Main HTML structure
├── style.css           # Styling
├── script.js           # Main application logic
├── calculator.js       # Core calculation engine
└── README.md           # Documentation
```

### Module Breakdown

#### 1. calculator.js - Calculation Engine
**Purpose**: Pure calculation functions, no UI

**Key Functions**:
- `logFactorial(n)`: Calculate log(n!) using cache + Stirling
- `logBinomialCoefficient(n, k)`: Calculate log(C(n,k))
- `logBinomialProbability(n, k, p)`: Calculate log(P(X = k))
- `binomialProbability(n, k, p)`: Calculate exact P(X = k)
- `cumulativeProbability(n, k, p, type, progressCallback)`: Calculate cumulative P
  - type: 'less_equal', 'greater_equal', 'less', 'greater', 'equal'
  - progressCallback: function called with progress updates

**Optimization strategies**:
- Cache log factorial values (up to 10,000 or so)
- Use recurrence relations when calculating multiple consecutive probabilities
- Implement early termination for probabilities < threshold (e.g., 1e-15)

#### 2. script.js - UI Logic
**Purpose**: Handle user input, display results, manage progress

**Key Functions**:
- `initializeApp()`: Set up event listeners, initialize calculator
- `validateInputs()`: Ensure n, k, p are valid
- `performCalculation()`: Orchestrate calculation with progress updates
- `displayResults()`: Format and show results
- `updateProgress(current, total)`: Update progress bar
- `formatNumber(num)`: Display very small/large numbers in scientific notation

**Features**:
- Input validation (n > 0, 0 ≤ k ≤ n, 0 ≤ p ≤ 1)
- Calculation type selection (exact, less than or equal, greater than or equal, etc.)
- Progress bar with percentage and estimated time remaining
- Cancel calculation button
- Export results (CSV, JSON)

#### 3. index.html - Structure
**Sections**:
1. **Header**: Title, navigation back to home
2. **Input Panel**:
   - Number of trials (n)
   - Number of successes (k) or range
   - Probability of success (p)
   - Calculation type selector
   - Calculate button
3. **Progress Panel** (shown during calculation):
   - Progress bar
   - Status message (e.g., "Calculating P(X ≤ 5000)...")
   - Current step / total steps
   - Cancel button
4. **Results Panel**:
   - Calculated probability (scientific notation if needed)
   - Additional statistics (mean = np, variance = np(1-p), std dev)
   - Calculation time
   - Export buttons
5. **Info Panel**:
   - Brief explanation of binomial distribution
   - Formula display
   - Examples

#### 4. style.css - Visual Design
**Design approach**:
- Match existing applet styling (see index.html color scheme)
- Clean, professional interface
- Clear visual hierarchy
- Responsive grid layout for inputs
- Prominent progress indicator during calculation
- Results displayed in card format

**Key elements**:
- Input fields with clear labels
- Large, accessible Calculate button
- Animated progress bar
- Results displayed with proper number formatting
- Color coding for different probability ranges (if applicable)

## Calculation Flow

### For Exact Probability P(X = k):
1. Validate inputs (n, k, p)
2. Handle edge cases (p=0, p=1, k>n, k<0)
3. Calculate log(P(X = k)) using log binomial formula
4. Convert to actual probability: P = e^(logP)
5. Display result

**Time complexity**: O(1) with Stirling's approximation
**No progress needed**: Nearly instantaneous

### For Cumulative Probability P(X ≤ k):
1. Validate inputs
2. Determine if we should calculate P(X ≤ k) or 1 - P(X ≥ k+1) based on which is faster
3. Initialize sum = 0, progress = 0
4. For i from 0 to k (or appropriate range):
   a. Calculate P(X = i) using recurrence relation from P(X = i-1)
   b. Add to sum
   c. Update progress every N iterations (e.g., N=1000)
   d. Check for cancellation
   e. Use requestAnimationFrame or setTimeout to keep UI responsive
5. Display final cumulative probability

**Time complexity**: O(k) or O(n-k) depending on optimization
**Progress updates**: Every 0.1% or every 1000 iterations, whichever is less frequent

### For Range Probability P(k1 ≤ X ≤ k2):
1. Calculate P(X ≤ k2) - P(X < k1)
2. Use cumulative probability logic with progress updates

## Progress Monitoring Strategy

### Progress Calculation:
```javascript
function updateProgress(current, total) {
  const percentage = (current / total) * 100;
  const elapsed = Date.now() - startTime;
  const estimated = (elapsed / current) * total;
  const remaining = estimated - elapsed;

  // Update progress bar
  progressBar.style.width = percentage + '%';
  progressText.textContent = `${percentage.toFixed(1)}% (${current}/${total})`;

  // Update time estimate
  if (current > 10) { // Only show estimate after some iterations
    timeRemaining.textContent = formatTime(remaining);
  }
}
```

### Non-blocking Calculation:
Use chunked calculation with setTimeout to avoid freezing UI:

```javascript
function calculateCumulativeChunked(n, k, p, type) {
  const CHUNK_SIZE = 1000; // Process 1000 iterations per chunk
  let current = 0;
  let sum = 0;
  let logPrevious = null;

  function processChunk() {
    const end = Math.min(current + CHUNK_SIZE, k + 1);

    for (let i = current; i < end; i++) {
      // Calculate P(X = i)
      const prob = calculateSingleProbability(n, i, p, logPrevious);
      sum += prob.value;
      logPrevious = prob.log;
      current++;
    }

    updateProgress(current, k + 1);

    if (current <= k) {
      setTimeout(processChunk, 0); // Schedule next chunk
    } else {
      displayResults(sum); // Done
    }
  }

  processChunk();
}
```

## User Interface Design

### Input Section Layout:
```
┌─────────────────────────────────────────┐
│  Number of Trials (n):    [________]    │
│  Number of Successes (k): [________]    │
│  Success Probability (p): [________]    │
│                                          │
│  Calculation Type:                       │
│  ( ) Exact: P(X = k)                    │
│  ( ) Cumulative: P(X ≤ k)               │
│  ( ) Cumulative: P(X ≥ k)               │
│  ( ) Range: P(k1 ≤ X ≤ k2)              │
│                                          │
│         [ Calculate Probability ]        │
└─────────────────────────────────────────┘
```

### Progress Display (during calculation):
```
┌─────────────────────────────────────────┐
│  Calculating P(X ≤ 500,000)...          │
│                                          │
│  ████████████████░░░░░░░░░░░░░░  52.3%  │
│  (523,000 / 1,000,000)                  │
│                                          │
│  Estimated time remaining: 12.5s         │
│                                          │
│           [ Cancel Calculation ]         │
└─────────────────────────────────────────┘
```

### Results Display:
```
┌─────────────────────────────────────────┐
│  Results                                 │
│  ────────────────────────────────────    │
│  Probability: 5.234567e-12              │
│                                          │
│  Distribution Statistics:                │
│  • Mean (μ): 500,000                    │
│  • Variance (σ²): 250,000               │
│  • Std Deviation (σ): 500               │
│                                          │
│  Calculation time: 24.3 seconds          │
│                                          │
│  [ Export Results ] [ New Calculation ]  │
└─────────────────────────────────────────┘
```

## Input Validation

### Rules:
- **n** (trials): Positive integer, n ≥ 1, n ≤ 10,000,000 (practical limit)
- **k** (successes): Non-negative integer, 0 ≤ k ≤ n
- **p** (probability): 0 ≤ p ≤ 1, decimal allowed

### Validation Messages:
- "Number of trials must be at least 1"
- "Number of trials exceeds maximum (10,000,000)"
- "Number of successes cannot be negative"
- "Number of successes cannot exceed number of trials"
- "Probability must be between 0 and 1"

### Edge Case Handling:
- If p = 0: P(X = 0) = 1, P(X = k) = 0 for k > 0
- If p = 1: P(X = n) = 1, P(X = k) = 0 for k < n
- If k > n: P(X = k) = 0
- If k < 0: P(X = k) = 0
- Very large n with p close to 0 or 1: May result in underflow, handle gracefully

## Performance Considerations

### Optimization Strategies:

1. **Logarithmic calculations**:
   - All intermediate calculations in log space
   - Convert to actual probability only at the end
   - Prevents overflow and underflow

2. **Factorial caching**:
   - Pre-calculate and cache log(n!) for n up to 10,000
   - Saves repeated calculations
   - ~80KB memory for 10,000 values

3. **Recurrence relations**:
   - P(X = k+1) = P(X = k) × [(n-k)/(k+1)] × [p/(1-p)]
   - Avoids recalculating binomial coefficients
   - Much faster for cumulative calculations

4. **Smart summation**:
   - For P(X ≤ k) where k > n/2, calculate 1 - P(X > k)
   - Reduces number of iterations

5. **Early termination**:
   - If P(X = k) < 1e-15, subsequent terms likely negligible
   - Can stop accumulation early for extreme tails
   - Display warning if terminated early

6. **Chunked processing**:
   - Process calculations in chunks (1000 iterations)
   - Use setTimeout between chunks to keep UI responsive
   - Prevents "script unresponsive" warnings

### Expected Performance:
- **Exact P(X = k)**: < 1ms for any n
- **Cumulative P(X ≤ k)** where k = 1,000: ~10ms
- **Cumulative P(X ≤ k)** where k = 100,000: ~1 second
- **Cumulative P(X ≤ k)** where k = 1,000,000: ~10 seconds

(Times are approximate and depend on hardware)

## Testing Strategy

### Test Cases:

1. **Small values** (verify exact results):
   - n=10, k=5, p=0.5 → Should match known value ~0.246
   - n=20, k=10, p=0.5 → Should match known value ~0.176

2. **Edge cases**:
   - p=0, any k>0 → Should return 0
   - p=1, k=n → Should return 1
   - k > n → Should return 0
   - k < 0 → Should return 0 or show error

3. **Large n, moderate k**:
   - n=1,000,000, k=500,000, p=0.5 → Should be very small but computable
   - Verify calculation completes without overflow

4. **Cumulative calculations**:
   - Verify P(X ≤ k) + P(X > k) = 1
   - Test progress updates appear correctly

5. **Extreme probabilities**:
   - n=1,000,000, p=0.000001, k=0 → Very close to 1
   - n=1,000,000, p=0.000001, k=2 → Should be small but exact

6. **Performance tests**:
   - n=1,000,000, calculate P(X ≤ 500,000)
   - Verify completes in reasonable time with progress updates

### Manual Testing:
- Test on different browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices
- Test with very large inputs
- Test cancellation during long calculations
- Verify all buttons and inputs work correctly

## Additional Features (Nice-to-Have)

1. **Visualization**:
   - Optional: Display probability mass function as bar chart
   - Would require canvas or SVG rendering
   - May be complex for very large n

2. **Comparison tool**:
   - Compare exact vs. normal approximation
   - Show when normal approximation is accurate

3. **Batch calculations**:
   - Input multiple (n, k, p) combinations
   - Calculate all and export results

4. **Probability table**:
   - Generate table of P(X = k) for k = 0 to n
   - Export to CSV

5. **Mean/median/mode calculations**:
   - Mean: n×p (easy)
   - Mode: floor((n+1)×p)
   - Median: approximate or calculate exactly

## Accessibility Considerations

- Semantic HTML (labels, fieldsets, etc.)
- ARIA labels for progress bar and status messages
- Keyboard navigation support
- Focus indicators on interactive elements
- Sufficient color contrast
- Screen reader announcements for calculation status
- Error messages clearly associated with inputs

## Mobile Responsiveness

- Stack input fields vertically on small screens
- Make buttons touch-friendly (min 44px height)
- Ensure progress bar is visible and clear
- Optimize for portrait and landscape orientations
- Test on various screen sizes (320px to 1920px)

## Implementation Steps

### Phase 1: Core Calculator (Priority: Critical)
1. Create `calculator.js` with log factorial and binomial probability functions
2. Implement exact probability calculation P(X = k)
3. Test with various inputs to verify accuracy
4. Optimize with caching and Stirling's approximation

### Phase 2: UI Foundation (Priority: Critical)
1. Create `index.html` with input form and results display
2. Create `style.css` matching existing applet design
3. Implement basic `script.js` with event handlers
4. Validate inputs and display error messages

### Phase 3: Cumulative Probabilities (Priority: Critical)
1. Implement cumulative probability calculations
2. Add recurrence relation optimization
3. Implement chunked processing for large calculations
4. Test with large values of k

### Phase 4: Progress Monitoring (Priority: Critical)
1. Add progress bar UI component
2. Implement progress callback in calculator
3. Add time estimation logic
4. Add cancel calculation functionality
5. Test with very large calculations

### Phase 5: Results Display (Priority: High)
1. Format probability results (scientific notation)
2. Calculate and display distribution statistics
3. Display calculation time
4. Add export functionality (CSV, JSON)

### Phase 6: Polish & Documentation (Priority: Medium)
1. Create README.md with usage instructions
2. Add information panel with formulas and examples
3. Refine styling for consistency
4. Add loading states and transitions
5. Cross-browser testing

### Phase 7: Advanced Features (Priority: Low)
1. Range probability P(k1 ≤ X ≤ k2)
2. Batch calculation mode
3. Probability table generation
4. Optional visualization

### Phase 8: Integration (Priority: High)
1. Update main index.html with link to binomial calculator
2. Test deployment on GitHub Pages
3. Verify all links work correctly

## Potential Issues & Mitigations

### Issue 1: Calculation too slow for very large k
**Mitigation**:
- Implement early termination for negligible probabilities
- Add warning to user about expected calculation time
- Provide option to use normal approximation for preview

### Issue 2: Numerical precision limits
**Mitigation**:
- Use log-space calculations throughout
- Implement log-sum-exp for cumulative probabilities
- Display warning when probability is below machine epsilon

### Issue 3: Browser freezing during calculation
**Mitigation**:
- Use chunked processing with setTimeout
- Limit chunk size to prevent long-running scripts
- Provide cancel button to abort calculation

### Issue 4: Mobile performance
**Mitigation**:
- Use larger chunk sizes on mobile to reduce overhead
- Warn users about performance on large calculations
- Optimize loop implementations

## Success Criteria

The implementation will be considered successful when:

1. ✅ Calculator correctly computes exact probabilities for n up to 10,000,000
2. ✅ All calculations use exact methods (no approximations)
3. ✅ Progress bar updates smoothly during long calculations
4. ✅ UI remains responsive (no freezing) during calculations
5. ✅ Results are numerically accurate (tested against known values)
6. ✅ Mobile-friendly and responsive design
7. ✅ Matches visual style of other applets
8. ✅ All inputs validated with clear error messages
9. ✅ Calculation can be cancelled mid-process
10. ✅ Handles edge cases gracefully (p=0, p=1, k>n, etc.)

## Timeline Estimate

- **Phase 1**: ~4 hours (core calculator engine)
- **Phase 2**: ~3 hours (UI foundation)
- **Phase 3**: ~4 hours (cumulative probabilities)
- **Phase 4**: ~3 hours (progress monitoring)
- **Phase 5**: ~2 hours (results display)
- **Phase 6**: ~2 hours (polish & docs)
- **Phase 7**: ~2 hours (advanced features)
- **Phase 8**: ~1 hour (integration)

**Total**: ~21 hours

Note: This is a development estimate, not a user-facing timeline.

## Resources & References

- Binomial distribution: https://en.wikipedia.org/wiki/Binomial_distribution
- Stirling's approximation: https://en.wikipedia.org/wiki/Stirling%27s_approximation
- Log-sum-exp trick: https://en.wikipedia.org/wiki/LogSumExp
- JavaScript Number precision: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
- Numerical stability: https://en.wikipedia.org/wiki/Numerical_stability

---

**Plan Version**: 1.0
**Created**: 2025-12-23
**Status**: Ready for review
