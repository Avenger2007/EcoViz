import { useEffect, useRef } from 'react';
import './WorldMap.css';

const WorldMap = ({ data, variable, region }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // In a real application, you would use a mapping library like Leaflet or Mapbox
    // For this example, we'll just display a placeholder
    const mapContainer = mapRef.current;
    
    if (mapContainer) {
      // Clear previous content
      mapContainer.innerHTML = '';
      
      // Create a simple placeholder
      const mapPlaceholder = document.createElement('div');
      mapPlaceholder.className = 'map-placeholder';
      
      // Add some text to indicate what would be shown
      const mapText = document.createElement('p');
      mapText.textContent = `Interactive map showing ${getVariableName(variable)} data for ${getRegionName(region)}`;
      mapPlaceholder.appendChild(mapText);
      
      // Add a note about implementation
      const mapNote = document.createElement('p');
      mapNote.className = 'map-note';
      mapNote.textContent = 'In a complete implementation, this would be an interactive map using Leaflet or Mapbox.';
      mapPlaceholder.appendChild(mapNote);
      
      mapContainer.appendChild(mapPlaceholder);
    }
  }, [data, variable, region]);

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
    <div className="world-map">
      <div className="map-container" ref={mapRef}></div>
    </div>
  );
};

export default WorldMap;
