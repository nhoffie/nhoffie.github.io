# Plan: Fix Miner and Add Manual Hash Rate Control

## Problem Analysis

### Potential Issues with Current Miner

1. **Web Worker Module Loading**
   - Web Workers can't use ES6 `import` in all browsers
   - The worker file duplicates SHA-256 code but may have context issues
   - Worker communication might be failing silently

2. **Hash Calculation in Worker**
   - The block data structure might not match between main thread and worker
   - JSON serialization of block data could be causing hash mismatches
   - The worker might not be calculating hashes correctly

3. **Throttle Implementation**
   - Current busy-wait throttle is inefficient
   - Doesn't provide predictable hash rates
   - Not educational - happens too fast to observe

## Proposed Solution: Manual Hash Rate Control

### Benefits
- **Predictable**: Set exact hashes per second (e.g., 10 H/s, 100 H/s, 1000 H/s)
- **Observable**: Slow enough to see each attempt and understand the process
- **Educational**: Users can experiment with different speeds
- **Reliable**: Main thread implementation avoids Worker complexity
- **Debuggable**: Easier to diagnose issues

### Implementation Approach

#### 1. Simplify Mining (No Web Worker)
- Remove Web Worker complexity for now
- Implement mining directly in main thread with controlled timing
- Use `setInterval` or `requestAnimationFrame` for controlled hash rate

#### 2. Hash Rate Presets
- **Very Slow**: 1-10 H/s (watch each hash attempt)
- **Slow**: 10-100 H/s (observe mining process)
- **Medium**: 100-1000 H/s (reasonable speed)
- **Fast**: 1000-10000 H/s (quick mining)
- **Unlimited**: As fast as browser allows (optional)

#### 3. UI Changes
Replace current throttle slider with:
```
Hash Rate Control:
[Preset Buttons: 1 H/s | 10 H/s | 100 H/s | 1000 H/s | Max]
Or Custom: [____] H/s

Current: X hashes/second
```

#### 4. Mining Loop Logic
```javascript
// Calculate delay between hashes for target rate
const targetHashRate = 100; // user-selected
const delayMs = 1000 / targetHashRate;

// Mine with controlled timing
const mineStep = () => {
  if (!mining) return;

  // Try one hash
  const hash = calculateBlockHash();
  attempts++;

  if (meetsRequired(hash, difficulty)) {
    // Found block!
    onComplete();
  } else {
    // Schedule next hash attempt
    setTimeout(mineStep, delayMs);
  }

  // Report progress every N attempts
  if (attempts % reportInterval === 0) {
    onProgress();
  }
};
```

## Detailed Changes

### File: `miner.js`

**Changes:**
1. Remove Web Worker code path
2. Add hash rate configuration
3. Implement controlled timing loop
4. Use actual SHA-256 from crypto-utils (import properly)
5. Simplify block hash calculation

**New Methods:**
- `setHashRate(hashesPerSecond)` - Set target hash rate
- `mineStep()` - Single hash attempt with scheduling
- Proper integration with imported SHA-256

### File: `script.js`

**UI Changes:**
1. Replace throttle slider with hash rate controls
2. Add preset buttons (1, 10, 100, 1000, Max H/s)
3. Add custom hash rate input
4. Update hash rate display to show actual vs target
5. Show "X / Y H/s" (actual / target)

**Event Handlers:**
- Hash rate preset buttons
- Custom hash rate input
- Validation (minimum 1 H/s, maximum 100000 H/s)

### File: `index.html`

**Replace:**
```html
<div class="throttle-control">
    <label for="mining-throttle">Mining Speed:</label>
    <input type="range" id="mining-throttle" min="0" max="100" value="0">
    <span id="throttle-value">100%</span>
</div>
```

**With:**
```html
<div class="hashrate-control">
    <label>Target Hash Rate:</label>
    <div class="hashrate-presets">
        <button class="btn btn-sm" data-hashrate="1">1 H/s</button>
        <button class="btn btn-sm" data-hashrate="10">10 H/s</button>
        <button class="btn btn-sm" data-hashrate="100">100 H/s</button>
        <button class="btn btn-sm" data-hashrate="1000">1000 H/s</button>
        <button class="btn btn-sm" data-hashrate="0">Max</button>
    </div>
    <div class="hashrate-custom">
        <label>Custom:</label>
        <input type="number" id="custom-hashrate" min="1" max="100000" placeholder="100">
        <span>H/s</span>
    </div>
    <div class="hashrate-display">
        Target: <span id="target-hashrate">100</span> H/s |
        Actual: <span id="actual-hashrate">0</span> H/s
    </div>
</div>
```

### File: `style.css`

**Add:**
```css
.hashrate-control {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.hashrate-presets {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.btn-sm {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
}

.hashrate-custom {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.hashrate-custom input {
    width: 100px;
}

.hashrate-display {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-family: 'Courier New', monospace;
}
```

## Debugging Current Miner

### Before Making Changes

**Test 1: Check if worker loads**
- Open browser console
- Look for any errors when mining starts
- Check if "Worker ready" message appears

**Test 2: Verify hash calculation**
- Add console.log in mining loop
- Check if hashes are being calculated
- Verify hash format (64 hex characters)

**Test 3: Check difficulty validation**
- Log the hash and difficulty
- Manually verify if hash meets requirement
- Check if leading zeros are correctly counted

**Test 4: Check block structure**
- Log block data being hashed
- Verify all fields are present and correct
- Ensure merkle root is calculated

### Diagnostic Commands

```javascript
// In browser console after loading page:

// Check if blockchain exists
app.blockchain

// Check if miner exists
app.miner

// Try to manually create a block
const block = app.blockchain.chain[0]
console.log(block)

// Try to manually calculate a hash
import('./crypto-utils.js').then(utils => {
  const hash = utils.sha256('test');
  console.log('Hash:', hash);
  console.log('Meets difficulty 4?', utils.meetsRequired(hash, 4));
});
```

## Implementation Steps

1. **Diagnose current issue** (optional, for understanding)
   - Open browser console
   - Try to start mining
   - Capture any errors
   - Report findings

2. **Implement hash rate control**
   - Update `miner.js` with new mining loop
   - Remove/comment out Web Worker code
   - Add hash rate configuration

3. **Update UI**
   - Replace throttle controls with hash rate controls
   - Add preset buttons
   - Add custom input

4. **Update CSS**
   - Style new controls
   - Ensure mobile responsiveness

5. **Test thoroughly**
   - Test each hash rate preset
   - Verify blocks are actually mined
   - Check difficulty adjustment works
   - Ensure rewards are credited

6. **Add fallback**
   - Keep Web Worker code but make it optional
   - Add setting to switch between modes
   - Document which browsers support which modes

## Expected Outcomes

### User Experience
- Click "1 H/s" → See each hash attempt clearly
- Click "100 H/s" → Reasonable mining speed for learning
- Click "1000 H/s" → Faster mining for experimentation
- Click "Max" → Mine as fast as possible

### Educational Value
- Students can observe individual hash attempts at 1-10 H/s
- Understand that lower hash = slower mining
- Experiment with difficulty vs hash rate
- See how difficulty adjustment responds to hash rate changes

### Technical Benefits
- Simpler code without Web Worker complexity
- Easier to debug and maintain
- More reliable across browsers
- Better for educational purposes

## Questions for Review

1. **Hash Rate Range**: Should we limit maximum to 10000 H/s or allow unlimited?
2. **Default Hash Rate**: What should be the default? (Suggest 100 H/s)
3. **UI Placement**: Keep in same mining controls section?
4. **Web Worker**: Keep as optional "advanced" feature or remove entirely?
5. **Batch Processing**: For high hash rates (>1000), should we batch multiple hashes per iteration?

## Alternative: Hybrid Approach

Keep Web Worker for "Max" mode but use controlled timing for specific hash rates:
- 1-1000 H/s: Main thread with controlled timing (educational)
- Max (0 H/s): Web Worker for maximum performance (optional)

This gives best of both worlds: controlled learning + fast mining option.

---

**Ready to proceed with implementation after your review and approval!**
