import { useEffect, useRef } from 'react';
import './MapVisualizations.css';

const InteractiveMap = ({ data, variable, region, mapType = 'leaflet' }) => {
  const mapRef = useRef(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clear previous content
    mapRef.current.innerHTML = '';
    
    // In a real implementation, we would initialize a Leaflet or Mapbox map
    // For this example, we'll create a placeholder with a message
    
    const mapPlaceholder = document.createElement('div');
    mapPlaceholder.className = 'map-placeholder';
    
    // Add some text to indicate what would be shown
    const mapText = document.createElement('p');
    mapText.textContent = `Interactive ${mapType} Map showing ${getVariableName(variable)} data for ${getRegionName(region)}`;
    mapPlaceholder.appendChild(mapText);
    
    // Add a note about implementation
    const mapNote = document.createElement('p');
    mapNote.className = 'map-note';
    mapNote.textContent = `In a complete implementation, this would be an interactive map using ${mapType === 'leaflet' ? 'Leaflet' : 'Mapbox GL JS'}.`;
    mapPlaceholder.appendChild(mapNote);
    
    // Add a sample map image
    const mapImage = document.createElement('div');
    mapImage.className = 'map-sample-image';
    mapImage.style.backgroundImage = `url('https://via.placeholder.com/600x300?text=Interactive+${mapType}+Map')`;
    mapPlaceholder.appendChild(mapImage);
    
    // Add controls
    const mapControls = document.createElement('div');
    mapControls.className = 'map-controls';
    
    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'map-control-btn';
    zoomInBtn.textContent = '+';
    zoomInBtn.title = 'Zoom In';
    mapControls.appendChild(zoomInBtn);
    
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'map-control-btn';
    zoomOutBtn.textContent = '−';
    zoomOutBtn.title = 'Zoom Out';
    mapControls.appendChild(zoomOutBtn);
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'map-control-btn reset';
    resetBtn.textContent = '⟲';
    resetBtn.title = 'Reset View';
    mapControls.appendChild(resetBtn);
    
    mapPlaceholder.appendChild(mapControls);
    
    mapRef.current.appendChild(mapPlaceholder);
    
  }, [data, variable, region, mapType]);
  
  // Helper functions to get readable names
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
    <div className="map-visualization interactive-map">
      <div className="map-container" ref={mapRef}></div>
    </div>
  );
};

export default InteractiveMap;
