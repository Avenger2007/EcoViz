import { useEffect, useRef } from 'react';
import './ClimateChart.css';

const ClimateChart = ({ data, variable, region, timeframe, startYear, endYear }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // In a real application, you would use a charting library like Chart.js or D3.js
    // For this example, we'll just display a placeholder with some sample data
    const chartContainer = chartRef.current;
    
    if (chartContainer && data && data.length > 0) {
      // Clear previous content
      chartContainer.innerHTML = '';
      
      // Filter data based on year range
      const filteredData = data.filter(item => 
        item.year >= startYear && item.year <= endYear
      );
      
      if (filteredData.length === 0) {
        const noDataMessage = document.createElement('p');
        noDataMessage.className = 'no-data-message';
        noDataMessage.textContent = 'No data available for the selected time period.';
        chartContainer.appendChild(noDataMessage);
        return;
      }
      
      // Create a simple chart representation
      const chartPlaceholder = document.createElement('div');
      chartPlaceholder.className = 'chart-placeholder';
      
      // Create chart header
      const chartHeader = document.createElement('div');
      chartHeader.className = 'chart-header';
      
      const chartTitle = document.createElement('h3');
      chartTitle.textContent = `${getVariableName(variable)} Trends (${startYear}-${endYear})`;
      chartHeader.appendChild(chartTitle);
      
      const chartSubtitle = document.createElement('p');
      chartSubtitle.textContent = `Region: ${getRegionName(region)}`;
      chartHeader.appendChild(chartSubtitle);
      
      chartPlaceholder.appendChild(chartHeader);
      
      // Create a simple bar chart representation
      const chartBars = document.createElement('div');
      chartBars.className = 'chart-bars';
      
      // Find min and max values for scaling
      const values = filteredData.map(item => item.value);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const range = maxValue - minValue;
      
      // Create bars for each data point
      filteredData.forEach(item => {
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        
        const barHeight = range === 0 ? 50 : ((item.value - minValue) / range) * 100;
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${Math.max(5, barHeight)}%`;
        
        // Color based on value (for temperature: blue for cold, red for hot)
        if (variable === 'temperature') {
          const hue = 240 - (barHeight * 2.4); // 240 (blue) to 0 (red)
          bar.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
        }
        
        const barLabel = document.createElement('div');
        barLabel.className = 'bar-label';
        barLabel.textContent = item.year;
        
        const barValue = document.createElement('div');
        barValue.className = 'bar-value';
        barValue.textContent = `${item.value} ${item.unit}`;
        
        barContainer.appendChild(bar);
        barContainer.appendChild(barLabel);
        barContainer.appendChild(barValue);
        
        chartBars.appendChild(barContainer);
      });
      
      chartPlaceholder.appendChild(chartBars);
      
      // Add a note about implementation
      const chartNote = document.createElement('p');
      chartNote.className = 'chart-note';
      chartNote.textContent = 'In a complete implementation, this would be an interactive chart using Chart.js or D3.js.';
      chartPlaceholder.appendChild(chartNote);
      
      chartContainer.appendChild(chartPlaceholder);
    }
  }, [data, variable, region, timeframe, startYear, endYear]);

  // Helper functions to get readable names
  const getVariableName = (variableId) => {
    const variableMap = {
      'temperature': 'Temperature',
      'co2': 'CO2 Levels',
      'sea-level': 'Sea Level Rise',
      'ice-sheets': 'Ice Sheet Mass',
      'precipitation': 'Precipitation'
    };
    return variableMap[variableId] || variableId;
  };

  const getRegionName = (regionId) => {
    const regionMap = {
      'global': 'Global',
      'north-america': 'North America',
      'europe': 'Europe',
      'asia': 'Asia',
      'africa': 'Africa',
      'south-america': 'South America',
      'oceania': 'Oceania'
    };
    return regionMap[regionId] || regionId;
  };

  return (
    <div className="climate-chart">
      <div className="chart-container" ref={chartRef}></div>
    </div>
  );
};

export default ClimateChart;
