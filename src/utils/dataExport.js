/**
 * Data Export Utilities
 * Provides functions to export climate data in various formats
 */

/**
 * Export data as CSV
 * @param {Array} data - Array of data objects
 * @param {string} filename - Output filename
 */
export const exportAsCSV = (data, filename = 'climate-data.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvContent += values.join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data as JSON
 * @param {Object|Array} data - Data to export
 * @param {string} filename - Output filename
 */
export const exportAsJSON = (data, filename = 'climate-data.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export chart as image (PNG)
 * @param {HTMLCanvasElement} canvasElement - Canvas element to export
 * @param {string} filename - Output filename
 */
export const exportChartAsImage = (canvasElement, filename = 'climate-chart.png') => {
  if (!canvasElement) {
    console.warn('Canvas element not found');
    return;
  }

  const link = document.createElement('a');
  link.href = canvasElement.toDataURL('image/png');
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate summary report for climate data
 * @param {Array} data - Array of climate data
 * @param {string} variable - Climate variable name
 * @param {string} region - Region name
 * @returns {string} HTML summary report
 */
export const generateSummaryReport = (data, variable, region) => {
  if (!data || data.length === 0) return 'No data available';

  const values = data.map(d => d.value).filter(v => typeof v === 'number');
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const trend = values[values.length - 1] - values[0];

  return `
    <div class="summary-report">
      <h3>${variable} - ${region}</h3>
      <ul>
        <li><strong>Minimum:</strong> ${min.toFixed(2)}</li>
        <li><strong>Maximum:</strong> ${max.toFixed(2)}</li>
        <li><strong>Average:</strong> ${avg.toFixed(2)}</li>
        <li><strong>Trend:</strong> ${trend > 0 ? '+' : ''}${trend.toFixed(2)}</li>
        <li><strong>Data Points:</strong> ${values.length}</li>
      </ul>
    </div>
  `;
};
