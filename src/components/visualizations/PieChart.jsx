import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ChartVisualizations.css';

const PieChart = ({ data, variable, region, year, colorScheme = 'category10' }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (!chartRef.current || !data) return;
    
    // Clear previous content
    d3.select(chartRef.current).selectAll('*').remove();
    
    // For a pie chart, we need categorical data
    // For this example, we'll create mock data based on the provided data
    
    // Find data for the selected year
    const yearData = data.find(item => item.year === year);
    
    if (!yearData) {
      const noDataMessage = document.createElement('p');
      noDataMessage.className = 'no-data-message';
      noDataMessage.textContent = `No data available for the year ${year}.`;
      chartRef.current.appendChild(noDataMessage);
      return;
    }
    
    // Create mock categorical data
    // In a real application, this would come from the API
    const pieData = [
      { category: 'Category A', value: yearData.value * 0.4 },
      { category: 'Category B', value: yearData.value * 0.3 },
      { category: 'Category C', value: yearData.value * 0.2 },
      { category: 'Category D', value: yearData.value * 0.1 }
    ];
    
    // Set up dimensions
    const width = chartRef.current.clientWidth;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');
    
    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(`${getVariableName(variable)} Distribution (${year})`);
    
    // Add subtitle
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 50)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(`Region: ${getRegionName(region)}`);
    
    // Create group for pie chart
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    // Get color scale
    const color = getColorScale(colorScheme);
    
    // Create pie layout
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);
    
    // Create arc generator
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);
    
    // Create outer arc for labels
    const outerArc = d3.arc()
      .innerRadius(radius * 1.1)
      .outerRadius(radius * 1.1);
    
    // Add pie slices
    const slices = g.selectAll('.arc')
      .data(pie(pieData))
      .enter()
      .append('g')
      .attr('class', 'arc');
    
    slices.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius + 10)
          );
        
        // Add tooltip
        const tooltip = g.append('g')
          .attr('class', 'tooltip');
        
        tooltip.append('rect')
          .attr('x', -80)
          .attr('y', -60)
          .attr('width', 160)
          .attr('height', 40)
          .attr('fill', 'white')
          .attr('stroke', '#ccc')
          .attr('rx', 4);
        
        tooltip.append('text')
          .attr('x', 0)
          .attr('y', -40)
          .attr('text-anchor', 'middle')
          .style('font-size', '14px')
          .text(`${d.data.category}: ${d.data.value.toFixed(2)} ${yearData.unit}`);
        
        tooltip.append('text')
          .attr('x', 0)
          .attr('y', -25)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(`${((d.data.value / d3.sum(pieData, d => d.value)) * 100).toFixed(1)}%`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc);
        g.select('.tooltip').remove();
      });
    
    // Add labels
    const labels = g.selectAll('.label')
      .data(pie(pieData))
      .enter()
      .append('g')
      .attr('class', 'label');
    
    // Add lines connecting slices to labels
    labels.append('polyline')
      .attr('points', function(d) {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      })
      .attr('fill', 'none')
      .attr('stroke', '#666')
      .attr('stroke-width', 1);
    
    // Add label text
    labels.append('text')
      .attr('transform', function(d) {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 1.05 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr('text-anchor', function(d) {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? 'start' : 'end';
      })
      .style('font-size', '12px')
      .text(d => d.data.category);
    
    // Add percentage values
    labels.append('text')
      .attr('transform', function(d) {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 1.05 * (midAngle < Math.PI ? 1 : -1);
        pos[1] += 15;
        return `translate(${pos})`;
      })
      .attr('text-anchor', function(d) {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? 'start' : 'end';
      })
      .style('font-size', '10px')
      .text(d => `${((d.data.value / d3.sum(pieData, d => d.value)) * 100).toFixed(1)}%`);
    
    // Add note about mock data
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-style', 'italic')
      .style('fill', '#757575')
      .text('Note: This is sample categorical data for demonstration purposes.');
    
  }, [data, variable, region, year, colorScheme]);
  
  // Helper function to get color scale based on scheme
  const getColorScale = (scheme) => {
    switch (scheme.toLowerCase()) {
      case 'category10':
        return d3.scaleOrdinal(d3.schemeCategory10);
      case 'accent':
        return d3.scaleOrdinal(d3.schemeAccent);
      case 'paired':
        return d3.scaleOrdinal(d3.schemePaired);
      case 'set1':
        return d3.scaleOrdinal(d3.schemeSet1);
      case 'set2':
        return d3.scaleOrdinal(d3.schemeSet2);
      case 'set3':
        return d3.scaleOrdinal(d3.schemeSet3);
      case 'pastel1':
        return d3.scaleOrdinal(d3.schemePastel1);
      case 'pastel2':
        return d3.scaleOrdinal(d3.schemePastel2);
      default:
        return d3.scaleOrdinal(d3.schemeCategory10);
    }
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
    <div className="chart-visualization pie-chart">
      <div className="chart-container" ref={chartRef}></div>
    </div>
  );
};

export default PieChart;
