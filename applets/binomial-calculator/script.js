/**
 * Binomial Distribution Calculator - UI Logic
 *
 * Handles user interactions, input validation, calculation orchestration,
 * progress updates, and results display.
 */

(function() {
    'use strict';

    // DOM Elements
    const form = document.getElementById('calculator-form');
    const trialsInput = document.getElementById('trials');
    const successesInput = document.getElementById('successes');
    const probabilityInput = document.getElementById('probability');
    const calcTypeRadios = document.getElementsByName('calc-type');
    const rangeInputsDiv = document.getElementById('range-inputs');
    const rangeStartInput = document.getElementById('range-start');
    const rangeEndInput = document.getElementById('range-end');
    const calculateBtn = document.getElementById('calculate-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const errorMessage = document.getElementById('error-message');

    const inputSection = document.getElementById('input-section');
    const progressSection = document.getElementById('progress-section');
    const resultsSection = document.getElementById('results-section');

    const progressStatus = document.getElementById('progress-status');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressCount = document.getElementById('progress-count');
    const timeEstimate = document.getElementById('time-estimate');

    const probabilityResult = document.getElementById('probability-result');
    const statMean = document.getElementById('stat-mean');
    const statVariance = document.getElementById('stat-variance');
    const statStdDev = document.getElementById('stat-stddev');
    const statMode = document.getElementById('stat-mode');
    const calcTime = document.getElementById('calc-time');
    const calcParams = document.getElementById('calc-params');

    const exportJsonBtn = document.getElementById('export-json');
    const exportCsvBtn = document.getElementById('export-csv');
    const newCalculationBtn = document.getElementById('new-calculation');

    // State
    let currentCalculation = null;
    let calculationCancelled = false;
    let startTime = null;
    let lastProgressUpdate = null;
    let currentResults = null;

    /**
     * Initialize the application
     */
    function init() {
        // Event listeners
        form.addEventListener('submit', handleFormSubmit);
        cancelBtn.addEventListener('click', handleCancelCalculation);
        newCalculationBtn.addEventListener('click', handleNewCalculation);
        exportJsonBtn.addEventListener('click', handleExportJson);
        exportCsvBtn.addEventListener('click', handleExportCsv);

        // Update range inputs visibility when calc type changes
        calcTypeRadios.forEach(radio => {
            radio.addEventListener('change', handleCalcTypeChange);
        });

        // Update max value for successes when trials changes
        trialsInput.addEventListener('input', () => {
            successesInput.max = trialsInput.value;
            rangeStartInput.max = trialsInput.value;
            rangeEndInput.max = trialsInput.value;
        });

        console.log('Binomial Calculator initialized');
    }

    /**
     * Handle calculation type change
     */
    function handleCalcTypeChange() {
        const selectedType = getSelectedCalcType();
        if (selectedType === 'range') {
            rangeInputsDiv.classList.remove('hidden');
        } else {
            rangeInputsDiv.classList.add('hidden');
        }
    }

    /**
     * Get selected calculation type
     */
    function getSelectedCalcType() {
        for (let radio of calcTypeRadios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return 'equal';
    }

    /**
     * Handle form submission
     */
    async function handleFormSubmit(event) {
        event.preventDefault();
        hideError();

        // Get input values
        const n = parseInt(trialsInput.value);
        const k = parseInt(successesInput.value);
        const p = parseFloat(probabilityInput.value);
        const calcType = getSelectedCalcType();

        // Validate inputs
        const validation = BinomialCalculator.validateInputs(n, k, p);
        if (!validation.valid) {
            showError(validation.error);
            return;
        }

        // Additional validation for range type
        if (calcType === 'range') {
            const k1 = parseInt(rangeStartInput.value);
            const k2 = parseInt(rangeEndInput.value);

            if (isNaN(k1) || isNaN(k2)) {
                showError('Please enter valid range values');
                return;
            }

            if (k1 > k2) {
                showError('Lower bound cannot be greater than upper bound');
                return;
            }

            if (k1 < 0 || k2 > n) {
                showError('Range values must be between 0 and n');
                return;
            }
        }

        // Start calculation
        await performCalculation(n, k, p, calcType);
    }

    /**
     * Perform the calculation
     */
    async function performCalculation(n, k, p, calcType) {
        calculationCancelled = false;
        startTime = Date.now();
        lastProgressUpdate = startTime;

        // Show progress section
        inputSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
        progressSection.classList.remove('hidden');
        calculateBtn.classList.add('hidden');
        cancelBtn.classList.remove('hidden');

        // Set progress status
        let statusText = '';
        switch (calcType) {
            case 'equal':
                statusText = `Calculating P(X = ${k})...`;
                break;
            case 'less':
                statusText = `Calculating P(X < ${k})...`;
                break;
            case 'less_equal':
                statusText = `Calculating P(X ≤ ${k})...`;
                break;
            case 'greater':
                statusText = `Calculating P(X > ${k})...`;
                break;
            case 'greater_equal':
                statusText = `Calculating P(X ≥ ${k})...`;
                break;
            case 'range':
                const k1 = parseInt(rangeStartInput.value);
                const k2 = parseInt(rangeEndInput.value);
                statusText = `Calculating P(${k1} ≤ X ≤ ${k2})...`;
                break;
        }
        progressStatus.textContent = statusText;

        // Reset progress
        updateProgress(0, 100);

        try {
            let result;

            if (calcType === 'range') {
                const k1 = parseInt(rangeStartInput.value);
                const k2 = parseInt(rangeEndInput.value);
                result = await BinomialCalculator.rangeProbability(n, k1, k2, p, progressCallback);
            } else {
                result = await BinomialCalculator.cumulativeProbability(n, k, p, calcType, progressCallback);
            }

            if (calculationCancelled) {
                handleNewCalculation();
                return;
            }

            // Calculate stats
            const stats = BinomialCalculator.distributionStats(n, p);

            // Calculate time
            const endTime = Date.now();
            const duration = endTime - startTime;

            // Store results
            currentResults = {
                n,
                k,
                p,
                calcType,
                result,
                stats,
                duration
            };

            if (calcType === 'range') {
                currentResults.k1 = parseInt(rangeStartInput.value);
                currentResults.k2 = parseInt(rangeEndInput.value);
            }

            // Display results
            displayResults(currentResults);

        } catch (error) {
            console.error('Calculation error:', error);
            showError('An error occurred during calculation: ' + error.message);
            handleNewCalculation();
        }
    }

    /**
     * Progress callback for calculations
     */
    function progressCallback(current, total) {
        if (calculationCancelled) {
            throw new Error('Calculation cancelled');
        }

        const percentage = Math.min(100, (current / total) * 100);
        updateProgress(current, total);

        // Update time estimate
        const now = Date.now();
        const elapsed = now - startTime;

        if (current > 10 && elapsed > 100) { // Only show estimate after some progress
            const rate = current / elapsed; // items per millisecond
            const remaining = total - current;
            const estimatedMs = remaining / rate;

            if (estimatedMs > 1000) { // Only show if more than 1 second remaining
                timeEstimate.textContent = `Estimated time remaining: ${formatTime(estimatedMs)}`;
            } else {
                timeEstimate.textContent = 'Almost done...';
            }
        }
    }

    /**
     * Update progress display
     */
    function updateProgress(current, total) {
        const percentage = Math.min(100, (current / total) * 100);

        progressBar.style.width = percentage + '%';
        progressPercentage.textContent = percentage.toFixed(1) + '%';

        if (total > 1) {
            progressCount.textContent = `(${current.toLocaleString()} / ${total.toLocaleString()})`;
        } else {
            progressCount.textContent = '';
        }
    }

    /**
     * Handle cancel calculation
     */
    function handleCancelCalculation() {
        calculationCancelled = true;
        cancelBtn.disabled = true;
        progressStatus.textContent = 'Cancelling...';
    }

    /**
     * Handle new calculation button
     */
    function handleNewCalculation() {
        inputSection.classList.remove('hidden');
        progressSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
        calculateBtn.classList.remove('hidden');
        cancelBtn.classList.add('hidden');
        cancelBtn.disabled = false;
        timeEstimate.textContent = '';
        currentResults = null;
    }

    /**
     * Display calculation results
     */
    function displayResults(results) {
        // Hide progress, show results
        progressSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        calculateBtn.classList.remove('hidden');
        cancelBtn.classList.add('hidden');

        // Display probability
        probabilityResult.textContent = formatNumber(results.result);

        // Display stats
        statMean.textContent = formatNumber(results.stats.mean);
        statVariance.textContent = formatNumber(results.stats.variance);
        statStdDev.textContent = formatNumber(results.stats.stdDev);
        statMode.textContent = results.stats.mode;

        // Display meta
        calcTime.textContent = formatTime(results.duration);

        let paramsText = `n=${results.n}, p=${results.p}`;
        if (results.calcType === 'range') {
            paramsText += `, k₁=${results.k1}, k₂=${results.k2}`;
        } else {
            paramsText += `, k=${results.k}`;
        }
        calcParams.textContent = paramsText;
    }

    /**
     * Format a number for display
     */
    function formatNumber(num) {
        if (num === 0) return '0';
        if (num === 1) return '1';

        // Use scientific notation for very small or very large numbers
        if (Math.abs(num) < 0.0001 || Math.abs(num) > 1000000) {
            return num.toExponential(10);
        }

        // Otherwise use fixed decimal places
        return num.toFixed(10).replace(/\.?0+$/, '');
    }

    /**
     * Format time duration
     */
    function formatTime(ms) {
        if (ms < 1000) {
            return `${ms.toFixed(0)}ms`;
        } else if (ms < 60000) {
            return `${(ms / 1000).toFixed(1)}s`;
        } else {
            const minutes = Math.floor(ms / 60000);
            const seconds = ((ms % 60000) / 1000).toFixed(0);
            return `${minutes}m ${seconds}s`;
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    /**
     * Hide error message
     */
    function hideError() {
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';
    }

    /**
     * Handle export to JSON
     */
    function handleExportJson() {
        if (!currentResults) return;

        const exportData = {
            parameters: {
                n: currentResults.n,
                k: currentResults.calcType === 'range' ? undefined : currentResults.k,
                k1: currentResults.k1,
                k2: currentResults.k2,
                p: currentResults.p,
                calculationType: currentResults.calcType
            },
            result: {
                probability: currentResults.result
            },
            statistics: currentResults.stats,
            metadata: {
                calculationTime: currentResults.duration,
                timestamp: new Date().toISOString()
            }
        };

        const json = JSON.stringify(exportData, null, 2);
        downloadFile(json, 'binomial-calculation.json', 'application/json');
    }

    /**
     * Handle export to CSV
     */
    function handleExportCsv() {
        if (!currentResults) return;

        const rows = [
            ['Parameter', 'Value'],
            ['Number of Trials (n)', currentResults.n],
            ['Success Probability (p)', currentResults.p],
            ['Calculation Type', currentResults.calcType]
        ];

        if (currentResults.calcType === 'range') {
            rows.push(['Lower Bound (k₁)', currentResults.k1]);
            rows.push(['Upper Bound (k₂)', currentResults.k2]);
        } else {
            rows.push(['Number of Successes (k)', currentResults.k]);
        }

        rows.push(['']);
        rows.push(['Result', '']);
        rows.push(['Probability', currentResults.result]);
        rows.push(['']);
        rows.push(['Statistics', '']);
        rows.push(['Mean', currentResults.stats.mean]);
        rows.push(['Variance', currentResults.stats.variance]);
        rows.push(['Standard Deviation', currentResults.stats.stdDev]);
        rows.push(['Mode', currentResults.stats.mode]);
        rows.push(['']);
        rows.push(['Calculation Time (ms)', currentResults.duration]);
        rows.push(['Timestamp', new Date().toISOString()]);

        const csv = rows.map(row => row.join(',')).join('\n');
        downloadFile(csv, 'binomial-calculation.csv', 'text/csv');
    }

    /**
     * Download a file
     */
    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
