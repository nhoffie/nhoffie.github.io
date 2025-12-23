/**
 * Visualization and charting utilities
 * Using HTML5 Canvas for lightweight charts
 */

/**
 * Draw difficulty chart
 */
export function drawDifficultyChart(blockchain, canvas) {
  if (!canvas || blockchain.chain.length < 2) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Extract difficulty data
  const data = blockchain.chain.map((block, index) => ({
    x: index,
    y: block.difficulty
  }));

  drawLineChart(ctx, data, width, height, {
    title: 'Difficulty Over Time',
    xLabel: 'Block Height',
    yLabel: 'Difficulty',
    color: '#f7931a'
  });
}

/**
 * Draw block time chart
 */
export function drawBlockTimeChart(blockchain, canvas) {
  if (!canvas || blockchain.chain.length < 2) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Calculate block times
  const data = [];
  for (let i = 1; i < blockchain.chain.length; i++) {
    const timeDiff = (blockchain.chain[i].timestamp - blockchain.chain[i - 1].timestamp) / 1000;
    data.push({
      x: i,
      y: timeDiff
    });
  }

  // Add target line
  const target = blockchain.config.blockTimeTarget / 1000;

  drawLineChart(ctx, data, width, height, {
    title: 'Block Time',
    xLabel: 'Block Height',
    yLabel: 'Time (seconds)',
    color: '#4a90e2',
    targetLine: target,
    targetColor: '#27ae60'
  });
}

/**
 * Draw supply chart
 */
export function drawSupplyChart(blockchain, canvas) {
  if (!canvas || blockchain.chain.length < 1) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Calculate cumulative supply
  const data = [];
  let totalSupply = 0;

  for (let i = 0; i < blockchain.chain.length; i++) {
    const block = blockchain.chain[i];
    const reward = blockchain.config.getBlockReward(i);
    totalSupply += reward;

    data.push({
      x: i,
      y: totalSupply
    });
  }

  drawLineChart(ctx, data, width, height, {
    title: 'Total Supply Growth',
    xLabel: 'Block Height',
    yLabel: 'Total Coins',
    color: '#f39c12',
    fill: true
  });
}

/**
 * Generic line chart renderer
 */
function drawLineChart(ctx, data, width, height, options = {}) {
  const {
    title = '',
    xLabel = '',
    yLabel = '',
    color = '#333',
    targetLine = null,
    targetColor = '#999',
    fill = false
  } = options;

  if (data.length === 0) return;

  // Padding
  const padding = { top: 40, right: 40, bottom: 60, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min/max values
  const xValues = data.map(d => d.x);
  const yValues = data.map(d => d.y);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues, targetLine || Infinity);
  const yMax = Math.max(...yValues, targetLine || -Infinity);

  // Add 10% padding to y-axis
  const yRange = yMax - yMin;
  const yPadding = yRange * 0.1;
  const yMinPadded = Math.max(0, yMin - yPadding);
  const yMaxPadded = yMax + yPadding;

  // Scale functions
  const scaleX = (x) => padding.left + ((x - xMin) / (xMax - xMin)) * chartWidth;
  const scaleY = (y) => padding.top + chartHeight - ((y - yMinPadded) / (yMaxPadded - yMinPadded)) * chartHeight;

  // Background
  ctx.fillStyle = '#f9f9f9';
  ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);

  // Grid lines
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;

  // Horizontal grid lines
  const ySteps = 5;
  for (let i = 0; i <= ySteps; i++) {
    const y = yMinPadded + (i / ySteps) * (yMaxPadded - yMinPadded);
    const yPos = scaleY(y);

    ctx.beginPath();
    ctx.moveTo(padding.left, yPos);
    ctx.lineTo(padding.left + chartWidth, yPos);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(y.toFixed(2), padding.left - 10, yPos + 4);
  }

  // Vertical grid lines
  const xSteps = Math.min(10, data.length - 1);
  for (let i = 0; i <= xSteps; i++) {
    const x = xMin + (i / xSteps) * (xMax - xMin);
    const xPos = scaleX(x);

    ctx.beginPath();
    ctx.moveTo(xPos, padding.top);
    ctx.lineTo(xPos, padding.top + chartHeight);
    ctx.stroke();

    // X-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(x).toString(), xPos, padding.top + chartHeight + 20);
  }

  // Draw target line if provided
  if (targetLine !== null) {
    ctx.strokeStyle = targetColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    const targetY = scaleY(targetLine);
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(padding.left + chartWidth, targetY);
    ctx.stroke();

    ctx.setLineDash([]);

    // Target label
    ctx.fillStyle = targetColor;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Target: ${targetLine}`, padding.left + 10, targetY - 5);
  }

  // Draw line
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.forEach((point, index) => {
    const x = scaleX(point.x);
    const y = scaleY(point.y);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Fill area under line if requested
  if (fill) {
    ctx.lineTo(scaleX(data[data.length - 1].x), padding.top + chartHeight);
    ctx.lineTo(scaleX(data[0].x), padding.top + chartHeight);
    ctx.closePath();

    ctx.fillStyle = color + '33'; // Add transparency
    ctx.fill();
  }

  // Draw points
  ctx.fillStyle = color;
  data.forEach(point => {
    const x = scaleX(point.x);
    const y = scaleY(point.y);

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw axes
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;

  // Y-axis
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + chartHeight);
  ctx.stroke();

  // X-axis
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top + chartHeight);
  ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
  ctx.stroke();

  // Labels
  ctx.fillStyle = '#333';
  ctx.font = 'bold 14px sans-serif';

  // X-axis label
  ctx.textAlign = 'center';
  ctx.fillText(xLabel, padding.left + chartWidth / 2, height - 20);

  // Y-axis label (rotated)
  ctx.save();
  ctx.translate(15, padding.top + chartHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();

  // Title
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, 25);
}

/**
 * Update all charts
 */
export function updateAllCharts(blockchain) {
  const difficultyCanvas = document.getElementById('difficulty-chart');
  const blocktimeCanvas = document.getElementById('blocktime-chart');
  const supplyCanvas = document.getElementById('supply-chart');

  if (difficultyCanvas) drawDifficultyChart(blockchain, difficultyCanvas);
  if (blocktimeCanvas) drawBlockTimeChart(blockchain, blocktimeCanvas);
  if (supplyCanvas) drawSupplyChart(blockchain, supplyCanvas);
}
