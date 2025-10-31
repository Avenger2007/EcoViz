// Data Export Utilities

export const exportAsCSV = (data, filename = 'climate-data.csv') => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  let csvContent = headers.join(',') + '\n';
  data.forEach(row => {
    csvContent += headers.map(h => row[h]).join(',') + '\n';
  });
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const exportAsJSON = (data, filename = 'climate-data.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const generateSummaryReport = (data, variable, region) => {
  if (!data || data.length === 0) return 'No data available';
  const values = data.map(d => d.value).filter(v => typeof v === 'number');
  return {
    variable,
    region,
    min: Math.min(...values),
    max: Math.max(...values),
    avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
    count: values.length
  };
};
