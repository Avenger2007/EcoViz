import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './MapVisualizations.css';

const HeatMap = ({ data, variable, region, colorScheme = 'temperature' }) => {
  const mapRef = useRef(null);
  
  useEffect(() => {
    if (!mapRef.current || !data) return;
    
    // Clear previous content
    d3.select(mapRef.current).selectAll('*').remove();
    
    // Set up dimensions
    const width = mapRef.current.clientWidth;
    const height = 400;
    
    // Create SVG
    const svg = d3.select(mapRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');
    
    // In a real implementation, we would create a grid of cells representing the heatmap
    // For this example, we'll create a placeholder with a message
    
    // Add a background rectangle
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#e0f2f1');
    
    // Add text
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#00796b')
      .style('font-size', '16px')
      .text(`Heat Map showing ${variable} data for ${region}`);
    
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#757575')
      .style('font-size', '14px')
      .style('font-style', 'italic')
      .text('In a complete implementation, this would be an interactive heat map using D3.js.');
    
    // Create a sample heatmap grid
    const gridSize = 20;
    const rows = Math.floor(height / gridSize) - 5;
    const cols = Math.floor(width / gridSize) - 2;
    const startX = (width - (cols * gridSize)) / 2;
    const startY = height - (rows * gridSize) - 40;
    
    const colorScale = getColorScale(colorScheme);
    
    // Generate sample data
    const sampleData = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Create a pattern that looks like a heatmap
        const distance = Math.sqrt(Math.pow((row - rows/2), 2) + Math.pow((col - cols/2), 2));
        const maxDistance = Math.sqrt(Math.pow(rows/2, 2) + Math.pow(cols/2, 2));
        const normalizedDistance = 1 - (distance / maxDistance);
        
        // Add some randomness
        const value = normalizedDistance * 100 + (Math.random() * 20 - 10);
        
        sampleData.push({
          row,
          col,
          value: Math.max(0, Math.min(100, value))
        });
      }
    }
    
    // Draw the heatmap cells
    svg.selectAll('.heatmap-cell')
      .data(sampleData)
      .enter()
      .append('rect')
      .attr('class', 'heatmap-cell')
      .attr('x', d => startX + d.col * gridSize)
      .attr('y', d => startY + d.row * gridSize)
      .attr('width', gridSize - 1)
      .attr('height', gridSize - 1)
      .attr('fill', d => colorScale(d.value));
    
    // Add color legend
    const legendWidth = 200;
    const legendHeight = 20;
    const legendX = width - legendWidth - 20;
    const legendY = height - 30;
    
    const legend = svg.append('g')
      .attr('transform', `translate(${legendX}, ${legendY})`);
    
    // Create gradient for legend
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'heatmap-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    
    // Add color stops
    const colorRange = colorScale.range();
    const n = colorRange.length;
    colorRange.forEach((color, i) => {
      gradient.append('stop')
        .attr('offset', `${i * 100 / (n - 1)}%`)
        .attr('stop-color', color);
    });
    
    // Draw legend rectangle
    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#heatmap-gradient)');
    
    // Add legend title
    legend.append('text')
      .attr('x', 0)
      .attr('y', -5)
      .style('font-size', '12px')
      .text(getVariableName(variable));
    
    // Add min and max labels
    legend.append('text')
      .attr('x', 0)
      .attr('y', legendHeight + 15)
      .style('font-size', '10px')
      .text('Low');
    
    legend.append('text')
      .attr('x', legendWidth)
      .attr('y', legendHeight + 15)
      .style('font-size', '10px')
      .attr('text-anchor', 'end')
      .text('High');
    
  }, [data, variable, region, colorScheme]);
  
  // Helper function to get color scale based on scheme
  const getColorScale = (scheme) => {
    switch (scheme.toLowerCase()) {
      case 'blues':
        return d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);
      case 'reds':
        return d3.scaleSequential(d3.interpolateReds).domain([0, 100]);
      case 'greens':
        return d3.scaleSequential(d3.interpolateGreens).domain([0, 100]);
      case 'temperature':
        return d3.scaleSequential(d3.interpolateRdBu).domain([100, 0]);
      default:
        return d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);
    }
  };
  
  // Helper function to get readable variable name
  const getVariableName = (variableId) => {
    const variableMap = {
      'temperature': 'Temperature (°C)',
      'co2': 'CO₂ Levels (ppm)',
      'sea-level': 'Sea Level Rise (mm)',
      'ice-sheets': 'Ice Sheet Mass (Gt)',
      'precipitation': 'Precipitation (mm)'
    };
    return variableMap[variableId] || variableId;
  };
  
  return (
    <div className="map-visualization heat-map">
      <div className="map-container" ref={mapRef}></div>
    </div>
  );
};

export default HeatMap;
