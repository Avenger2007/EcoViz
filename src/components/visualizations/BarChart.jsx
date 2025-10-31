import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ChartVisualizations.css';

const BarChart = ({ data, variable, region, timeframe, startYear, endYear, colorScheme = 'blue' }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;
    
    // Clear previous content
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Filter data based on year range
    const filteredData = data.filter(item => 
      item.year >= startYear && item.year <= endYear
    );
    
    if (filteredData.length === 0) {
      const noDataMessage = document.createElement('p');
      noDataMessage.className = 'no-data-message';
      noDataMessage.textContent = 'No data available for the selected time period.';
      chartRef.current.appendChild(noDataMessage);
      return;
    }
    
    // Set up dimensions
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
      .attr('style', 'max-width: 100%; height: auto;')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Determine if we need to sample data (if too many bars)
    let dataToUse = filteredData;
    if (filteredData.length > 30) {
      // Sample data to avoid too many bars
      const sampleInterval = Math.ceil(filteredData.length / 30);
      dataToUse = filteredData.filter((_, i) => i % sampleInterval === 0);
    }
    
    // Set up scales
    const x = d3.scaleBand()
      .domain(dataToUse.map(d => d.year))
      .range([0, width])
      .padding(0.2);
    
    const values = dataToUse.map(d => d.value);
    const minValue = Math.min(0, d3.min(values)); // Start from 0 or lower if negative values
    const maxValue = d3.max(values);
    const padding = (maxValue - minValue) * 0.1;
    
    const y = d3.scaleLinear()
      .domain([minValue, maxValue + padding])
      .range([height, 0]);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => i % Math.ceil(dataToUse.length / 10) === 0)))
      .selectAll('text')
      .style('text-anchor', 'middle');
    
    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .text('Year');
    
    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('text-anchor', 'end');
    
    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .style('text-anchor', 'middle')
      .text(getVariableWithUnit(variable, dataToUse[0].unit));
    
    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(`${getVariableName(variable)} Trends (${startYear}-${endYear})`);
    
    // Add subtitle
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2 + 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(`Region: ${getRegionName(region)}`);
    
    // Add bars
    svg.selectAll('.bar')
      .data(dataToUse)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.year))
      .attr('width', x.bandwidth())
      .attr('y', d => y(Math.max(0, d.value)))
      .attr('height', d => Math.abs(y(d.value) - y(0)))
      .attr('fill', getColorForVariable(variable, colorScheme))
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', d3.color(getColorForVariable(variable, colorScheme)).brighter(0.5));
        
        // Add tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${x(d.year) + x.bandwidth()/2},${y(Math.max(0, d.value)) - 10})`);
        
        tooltip.append('rect')
          .attr('x', -50)
          .attr('y', -25)
          .attr('width', 100)
          .attr('height', 25)
          .attr('fill', 'white')
          .attr('stroke', '#ccc')
          .attr('rx', 4);
        
        tooltip.append('text')
          .attr('x', 0)
          .attr('y', -8)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(`${d.year}: ${d.value} ${d.unit}`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('fill', getColorForVariable(variable, colorScheme));
        svg.select('.tooltip').remove();
      });
    
    // Add average line
    const average = d3.mean(dataToUse, d => d.value);
    
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(average))
      .attr('y2', y(average))
      .attr('stroke', '#ff9800')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');
    
    // Add average label
    svg.append('text')
      .attr('x', width - 10)
      .attr('y', y(average) - 10)
      .attr('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', '#ff9800')
      .text(`Average: ${average.toFixed(2)} ${dataToUse[0].unit}`);
    
  }, [data, variable, region, timeframe, startYear, endYear, colorScheme]);
  
  // Helper function to get color based on variable and scheme
  const getColorForVariable = (variable, scheme) => {
    if (scheme !== 'auto') {
      const colorMap = {
        'blue': '#1e88e5',
        'red': '#e53935',
        'green': '#43a047',
        'purple': '#8e24aa',
        'orange': '#fb8c00',
        'teal': '#00897b'
      };
      return colorMap[scheme.toLowerCase()] || colorMap.blue;
    }
    
    // Auto color based on variable
    const variableColorMap = {
      'temperature': '#e53935', // red for temperature
      'co2': '#8e24aa',         // purple for CO2
      'sea-level': '#1e88e5',   // blue for sea level
      'ice-sheets': '#00897b',  // teal for ice sheets
      'precipitation': '#43a047' // green for precipitation
    };
    return variableColorMap[variable] || '#1e88e5';
  };
  
  // Helper function to get readable variable name
  const getVariableName = (variableId) => {
    const variableMap = {
      'temperature': 'Temperature',
      'co2': 'CO₂ Levels',
      'sea-level': 'Sea Level Rise',
      'ice-sheets': 'Ice Sheet Mass',
      'precipitation': 'Precipitation'
    };
    return variableMap[variableId] || variableId;
  };
  
  // Helper function to get variable name with unit
  const getVariableWithUnit = (variableId, unit) => {
    const variableName = getVariableName(variableId);
    return unit ? `${variableName} (${unit})` : variableName;
  };
  
  // Helper function to get region name
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
    <div className="chart-visualization bar-chart">
      <div className="chart-container" ref={chartRef}></div>
    </div>
  );
};

export default BarChart;
