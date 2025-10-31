import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ChartVisualizations.css';

const ScatterPlot = ({ 
  data, 
  xVariable, 
  yVariable, 
  region, 
  startYear, 
  endYear, 
  colorScheme = 'blue',
  showTrendline = true
}) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;
    
    // Clear previous content
    d3.select(chartRef.current).selectAll('*').remove();
    
    // For a real scatter plot, we would need data with both x and y variables
    // For this example, we'll create mock data based on the provided data
    
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
    
    // Create mock data for the second variable
    // In a real application, this would come from the API
    const scatterData = filteredData.map(item => {
      // Create a correlated but slightly different value for the second variable
      const baseValue = item.value;
      const correlation = 0.7; // 0.7 correlation between variables
      const randomFactor = Math.random() * 2 - 1; // Random value between -1 and 1
      
      // Calculate correlated value with some randomness
      const correlatedValue = baseValue * correlation + baseValue * (1 - correlation) * randomFactor;
      
      return {
        year: item.year,
        xValue: baseValue,
        yValue: correlatedValue,
        xUnit: item.unit,
        yUnit: item.unit
      };
    });
    
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
    
    // Set up scales
    const xValues = scatterData.map(d => d.xValue);
    const yValues = scatterData.map(d => d.yValue);
    
    const xMin = d3.min(xValues);
    const xMax = d3.max(xValues);
    const xPadding = (xMax - xMin) * 0.1;
    
    const yMin = d3.min(yValues);
    const yMax = d3.max(yValues);
    const yPadding = (yMax - yMin) * 0.1;
    
    const x = d3.scaleLinear()
      .domain([xMin - xPadding, xMax + xPadding])
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain([yMin - yPadding, yMax + yPadding])
      .range([height, 0]);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'middle');
    
    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .text(getVariableWithUnit(xVariable, scatterData[0].xUnit));
    
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
      .text(getVariableWithUnit(yVariable, scatterData[0].yUnit));
    
    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(`${getVariableName(xVariable)} vs ${getVariableName(yVariable)} (${startYear}-${endYear})`);
    
    // Add subtitle
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2 + 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(`Region: ${getRegionName(region)}`);
    
    // Add dots
    svg.selectAll('.dot')
      .data(scatterData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.xValue))
      .attr('cy', d => y(d.yValue))
      .attr('r', 5)
      .attr('fill', getColorForScheme(colorScheme))
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', 8)
          .attr('opacity', 1);
        
        // Add tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${x(d.xValue)},${y(d.yValue) - 15})`);
        
        tooltip.append('rect')
          .attr('x', -80)
          .attr('y', -40)
          .attr('width', 160)
          .attr('height', 40)
          .attr('fill', 'white')
          .attr('stroke', '#ccc')
          .attr('rx', 4);
        
        tooltip.append('text')
          .attr('x', 0)
          .attr('y', -25)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(`Year: ${d.year}`);
        
        tooltip.append('text')
          .attr('x', 0)
          .attr('y', -10)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(`${getVariableName(xVariable)}: ${d.xValue.toFixed(2)} ${d.xUnit}`);
        
        tooltip.append('text')
          .attr('x', 0)
          .attr('y', 5)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(`${getVariableName(yVariable)}: ${d.yValue.toFixed(2)} ${d.yUnit}`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('r', 5)
          .attr('opacity', 0.7);
        svg.select('.tooltip').remove();
      });
    
    // Add year labels to some points
    scatterData.filter((d, i) => i % Math.ceil(scatterData.length / 5) === 0)
      .forEach(d => {
        svg.append('text')
          .attr('x', x(d.xValue) + 8)
          .attr('y', y(d.yValue) - 8)
          .style('font-size', '10px')
          .text(d.year);
      });
    
    // Add trend line if requested
    if (showTrendline && scatterData.length > 2) {
      // Calculate linear regression
      const xVals = scatterData.map(d => d.xValue);
      const yVals = scatterData.map(d => d.yValue);
      
      const xMean = d3.mean(xVals);
      const yMean = d3.mean(yVals);
      
      const ssXX = d3.sum(xVals.map(x => Math.pow(x - xMean, 2)));
      const ssXY = d3.sum(xVals.map((x, i) => (x - xMean) * (yVals[i] - yMean)));
      
      const slope = ssXY / ssXX;
      const intercept = yMean - slope * xMean;
      
      // Calculate R-squared
      const yPred = xVals.map(x => intercept + slope * x);
      const ssTot = d3.sum(yVals.map(y => Math.pow(y - yMean, 2)));
      const ssRes = d3.sum(yVals.map((y, i) => Math.pow(y - yPred[i], 2)));
      const rSquared = 1 - (ssRes / ssTot);
      
      // Create trend line data
      const trendData = [
        { x: d3.min(xVals), y: intercept + slope * d3.min(xVals) },
        { x: d3.max(xVals), y: intercept + slope * d3.max(xVals) }
      ];
      
      // Add the trend line
      svg.append('line')
        .attr('x1', x(trendData[0].x))
        .attr('y1', y(trendData[0].y))
        .attr('x2', x(trendData[1].x))
        .attr('y2', y(trendData[1].y))
        .attr('stroke', '#ff9800')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');
      
      // Add R-squared value
      svg.append('text')
        .attr('x', width - 10)
        .attr('y', 20)
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .style('fill', '#ff9800')
        .text(`R² = ${rSquared.toFixed(3)}`);
    }
    
  }, [data, xVariable, yVariable, region, startYear, endYear, colorScheme, showTrendline]);
  
  // Helper function to get color based on scheme
  const getColorForScheme = (scheme) => {
    const colorMap = {
      'blue': '#1e88e5',
      'red': '#e53935',
      'green': '#43a047',
      'purple': '#8e24aa',
      'orange': '#fb8c00',
      'teal': '#00897b'
    };
    return colorMap[scheme.toLowerCase()] || colorMap.blue;
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
    <div className="chart-visualization scatter-plot">
      <div className="chart-container" ref={chartRef}></div>
    </div>
  );
};

export default ScatterPlot;
