import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './ChartVisualizations.css';

const TimeSeries = ({ 
  data, 
  variable, 
  region, 
  startYear, 
  endYear, 
  colorScheme = 'blue',
  animated = true,
  animationDuration = 5000
}) => {
  const chartRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentYear, setCurrentYear] = useState(startYear);
  const animationRef = useRef(null);
  
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
    const margin = { top: 40, right: 80, bottom: 50, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
      .attr('style', 'max-width: 100%; height: auto;');
    
    // Add a group for the chart content
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Set up scales
    const x = d3.scaleLinear()
      .domain([d3.min(filteredData, d => d.year), d3.max(filteredData, d => d.year)])
      .range([0, width]);
    
    const values = filteredData.map(d => d.value);
    const minValue = d3.min(values);
    const maxValue = d3.max(values);
    const padding = (maxValue - minValue) * 0.1;
    
    const y = d3.scaleLinear()
      .domain([minValue - padding, maxValue + padding])
      .range([height, 0]);
    
    // Add X axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d => d.toString()).ticks(5))
      .selectAll('text')
      .style('text-anchor', 'middle');
    
    // Add X axis label
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .text('Year');
    
    // Add Y axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('text-anchor', 'end');
    
    // Add Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .style('text-anchor', 'middle')
      .text(getVariableWithUnit(variable, filteredData[0].unit));
    
    // Add title
    g.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(`${getVariableName(variable)} Trends (${startYear}-${endYear})`);
    
    // Add subtitle
    g.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2 + 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(`Region: ${getRegionName(region)}`);
    
    // Create line generator
    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);
    
    // Add the line path
    const path = g.append('path')
      .datum(filteredData)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', getColorForScheme(colorScheme))
      .attr('stroke-width', 2);
    
    // If animated, set up the path with animation
    if (animated) {
      // Initially set the path with no data
      path.attr('d', line([]));
      
      // Add a current year indicator
      const yearIndicator = g.append('text')
        .attr('class', 'year-indicator')
        .attr('x', width - 20)
        .attr('y', 20)
        .attr('text-anchor', 'end')
        .style('font-size', '24px')
        .style('font-weight', 'bold')
        .style('fill', getColorForScheme(colorScheme))
        .text(startYear);
      
      // Add a current value indicator
      const valueIndicator = g.append('text')
        .attr('class', 'value-indicator')
        .attr('x', width - 20)
        .attr('y', 50)
        .attr('text-anchor', 'end')
        .style('font-size', '16px')
        .style('fill', getColorForScheme(colorScheme))
        .text(`${filteredData[0].value.toFixed(2)} ${filteredData[0].unit}`);
      
      // Add a marker for the current point
      const marker = g.append('circle')
        .attr('class', 'current-marker')
        .attr('r', 6)
        .attr('fill', getColorForScheme(colorScheme))
        .attr('cx', x(startYear))
        .attr('cy', y(filteredData[0].value))
        .style('opacity', 0);
      
      // Add play/pause button
      const playButton = svg.append('g')
        .attr('class', 'play-button')
        .attr('transform', `translate(${margin.left + 20}, ${margin.top + 20})`)
        .style('cursor', 'pointer')
        .on('click', function() {
          if (isPlaying) {
            // Pause animation
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
              animationRef.current = null;
            }
            setIsPlaying(false);
            
            // Update button appearance
            playIcon.style('opacity', 1);
            pauseIcon.style('opacity', 0);
          } else {
            // Start or resume animation
            setIsPlaying(true);
            
            // Update button appearance
            playIcon.style('opacity', 0);
            pauseIcon.style('opacity', 1);
            
            // Start animation from current year
            startAnimation(currentYear);
          }
        });
      
      // Add button background
      playButton.append('circle')
        .attr('r', 15)
        .attr('fill', 'white')
        .attr('stroke', '#ccc');
      
      // Add play icon
      const playIcon = playButton.append('path')
        .attr('d', 'M-5,-8 L-5,8 L8,0 Z')
        .attr('fill', getColorForScheme(colorScheme))
        .style('opacity', 1);
      
      // Add pause icon
      const pauseIcon = playButton.append('g')
        .style('opacity', 0);
      
      pauseIcon.append('rect')
        .attr('x', -7)
        .attr('y', -7)
        .attr('width', 5)
        .attr('height', 14)
        .attr('fill', getColorForScheme(colorScheme));
      
      pauseIcon.append('rect')
        .attr('x', 2)
        .attr('y', -7)
        .attr('width', 5)
        .attr('height', 14)
        .attr('fill', getColorForScheme(colorScheme));
      
      // Function to start the animation
      const startAnimation = (fromYear) => {
        const startTime = Date.now();
        const startIndex = filteredData.findIndex(d => d.year >= fromYear);
        const endIndex = filteredData.length - 1;
        
        // If we're at the end, start over
        if (startIndex >= endIndex) {
          setCurrentYear(startYear);
          path.attr('d', line([]));
          marker.style('opacity', 0);
          yearIndicator.text(startYear);
          valueIndicator.text(`${filteredData[0].value.toFixed(2)} ${filteredData[0].unit}`);
          startAnimation(startYear);
          return;
        }
        
        const animate = () => {
          const currentTime = Date.now();
          const elapsed = currentTime - startTime;
          const progress = Math.min(1, elapsed / animationDuration);
          
          // Calculate current index based on progress
          const currentIndex = Math.floor(startIndex + progress * (endIndex - startIndex));
          
          // Update the path with data up to the current index
          const currentData = filteredData.slice(0, currentIndex + 1);
          path.attr('d', line(currentData));
          
          // Update the year indicator
          const currentYearValue = filteredData[currentIndex].year;
          yearIndicator.text(currentYearValue);
          setCurrentYear(currentYearValue);
          
          // Update the value indicator
          valueIndicator.text(`${filteredData[currentIndex].value.toFixed(2)} ${filteredData[currentIndex].unit}`);
          
          // Update the marker
          marker
            .attr('cx', x(currentYearValue))
            .attr('cy', y(filteredData[currentIndex].value))
            .style('opacity', 1);
          
          if (progress < 1) {
            // Continue animation
            animationRef.current = requestAnimationFrame(animate);
          } else {
            // Animation complete
            if (isPlaying) {
              // Start over
              setCurrentYear(startYear);
              path.attr('d', line([]));
              marker.style('opacity', 0);
              yearIndicator.text(startYear);
              valueIndicator.text(`${filteredData[0].value.toFixed(2)} ${filteredData[0].unit}`);
              startAnimation(startYear);
            } else {
              // Stop animation
              animationRef.current = null;
              playIcon.style('opacity', 1);
              pauseIcon.style('opacity', 0);
            }
          }
        };
        
        // Start animation loop
        animationRef.current = requestAnimationFrame(animate);
      };
      
      // Add a slider for manual control
      const sliderWidth = width - 100;
      const sliderHeight = 30;
      const sliderX = 50;
      const sliderY = height + margin.bottom - 30;
      
      const sliderGroup = svg.append('g')
        .attr('class', 'slider')
        .attr('transform', `translate(${margin.left + sliderX}, ${sliderY})`);
      
      // Add slider track
      sliderGroup.append('line')
        .attr('x1', 0)
        .attr('x2', sliderWidth)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 4)
        .attr('stroke-linecap', 'round');
      
      // Add slider handle
      const handle = sliderGroup.append('circle')
        .attr('class', 'handle')
        .attr('r', 8)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill', getColorForScheme(colorScheme))
        .attr('cursor', 'pointer')
        .call(d3.drag()
          .on('start', function() {
            // Pause animation if playing
            if (isPlaying) {
              if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
              }
              setIsPlaying(false);
              playIcon.style('opacity', 1);
              pauseIcon.style('opacity', 0);
            }
          })
          .on('drag', function(event) {
            // Constrain position to slider width
            const x = Math.max(0, Math.min(sliderWidth, event.x));
            handle.attr('cx', x);
            
            // Calculate year based on position
            const yearScale = d3.scaleLinear()
              .domain([0, sliderWidth])
              .range([startYear, endYear])
              .clamp(true);
            
            const year = Math.round(yearScale(x));
            setCurrentYear(year);
            
            // Find data for this year
            const yearData = filteredData.find(d => d.year === year) || 
                            filteredData.reduce((prev, curr) => 
                              Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev
                            );
            
            // Update visualization
            const yearIndex = filteredData.indexOf(yearData);
            const currentData = filteredData.slice(0, yearIndex + 1);
            
            path.attr('d', line(currentData));
            yearIndicator.text(yearData.year);
            valueIndicator.text(`${yearData.value.toFixed(2)} ${yearData.unit}`);
            
            marker
              .attr('cx', x(yearData.year))
              .attr('cy', y(yearData.value))
              .style('opacity', 1);
          })
        );
      
      // Add year labels to slider
      sliderGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(startYear);
      
      sliderGroup.append('text')
        .attr('x', sliderWidth)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(endYear);
      
      // Update slider position when currentYear changes
      useEffect(() => {
        if (!sliderGroup.empty()) {
          const yearScale = d3.scaleLinear()
            .domain([startYear, endYear])
            .range([0, sliderWidth])
            .clamp(true);
          
          handle.attr('cx', yearScale(currentYear));
        }
      }, [currentYear]);
      
    } else {
      // If not animated, just show the full line
      path.attr('d', line(filteredData));
    }
    
    // Clean up animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
    
  }, [data, variable, region, startYear, endYear, colorScheme, animated, animationDuration]);
  
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
    <div className="chart-visualization time-series">
      <div className="chart-container" ref={chartRef}></div>
    </div>
  );
};

export default TimeSeries;
