import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
// Create a mock for topojson to prevent errors when the package is missing
const topojsonMock = {
  feature: () => ({ type: 'FeatureCollection', features: [] })
};

// Dynamic import for topojson-client
let topojson = topojsonMock;

// We'll try to load the real topojson in useEffect
import './MapVisualizations.css';

const ChoroplethMap = ({ data, variable, region, colorScheme = 'blues' }) => {
  const mapRef = useRef(null);
  const [topoLoaded, setTopoLoaded] = useState(false);
  
  // Try to load topojson-client dynamically
  useEffect(() => {
    const loadTopojson = async () => {
      try {
        const module = await import('topojson-client');
        topojson = module;
        setTopoLoaded(true);
        console.log('Successfully loaded topojson-client');
      } catch (error) {
        console.warn('Could not load topojson-client:', error.message);
        // We'll continue with the mock implementation
        setTopoLoaded(true);
      }
    };
    
    loadTopojson();
  }, []);
  
  useEffect(() => {
    if (!mapRef.current || !data || !topoLoaded) return;
    
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
    
    // Create a group for the map
    const g = svg.append('g');
    
    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);
    
    // In a real implementation, we would load GeoJSON data and create the choropleth map
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
      .text(`Choropleth Map showing ${variable} data for ${region}`);
    
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#757575')
      .style('font-size', '14px')
      .style('font-style', 'italic')
      .text('In a complete implementation, this would be an interactive choropleth map using D3.js and TopoJSON.');
    
    // Add color legend
    const legendWidth = 200;
    const legendHeight = 20;
    const legendX = width - legendWidth - 20;
    const legendY = height - legendHeight - 20;
    
    const colorScale = getColorScale(colorScheme);
    
    const legend = svg.append('g')
      .attr('transform', `translate(${legendX}, ${legendY})`);
    
    // Create gradient for legend
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    
    // Add color stops
    colorScale.range().forEach((color, i) => {
      gradient.append('stop')
        .attr('offset', `${i * 100 / (colorScale.range().length - 1)}%`)
        .attr('stop-color', color);
    });
    
    // Draw legend rectangle
    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)');
    
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
    
  }, [data, variable, region, colorScheme, topoLoaded]);
  
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
    <div className="map-visualization choropleth-map">
      <div className="map-container" ref={mapRef}></div>
      {!topoLoaded && (
        <div className="loading-message">Loading map resources...</div>
      )}
    </div>
  );
};

export default ChoroplethMap;
