import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './WorldMap.css';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const WorldMap = ({ data, mapType = 'temperature' }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20, 0], 2);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing layers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.GeoJSON) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add data to map if available
    if (data && data.features) {
      const geoJsonLayer = L.geoJSON(data, {
        style: (feature) => {
          // Style based on map type and feature properties
          return getFeatureStyle(feature, mapType);
        },
        onEachFeature: (feature, layer) => {
          // Add popups with information
          if (feature.properties) {
            layer.bindPopup(createPopupContent(feature, mapType));
          }
        }
      }).addTo(mapInstanceRef.current);

      // Add legend
      addLegend(mapInstanceRef.current, mapType);
    }

    return () => {
      // Cleanup on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data, mapType]);

  // Helper function to style features based on data
  const getFeatureStyle = (feature, mapType) => {
    const value = feature.properties[mapType] || 0;
    
    // Different color scales for different map types
    let color = '#FFFFFF';
    
    if (mapType === 'temperature') {
      // Temperature color scale (blue to red)
      if (value < -2) color = '#0000FF';
      else if (value < -1) color = '#0066FF';
      else if (value < 0) color = '#00CCFF';
      else if (value < 1) color = '#FFFF00';
      else if (value < 2) color = '#FF9900';
      else color = '#FF0000';
    } else if (mapType === 'precipitation') {
      // Precipitation color scale (light to dark blue)
      if (value < 20) color = '#E6F0FF';
      else if (value < 40) color = '#CCE0FF';
      else if (value < 60) color = '#99C2FF';
      else if (value < 80) color = '#66A3FF';
      else if (value < 100) color = '#3385FF';
      else color = '#0066FF';
    } else if (mapType === 'co2') {
      // CO2 color scale (green to purple)
      if (value < 300) color = '#00FF00';
      else if (value < 350) color = '#ADFF2F';
      else if (value < 400) color = '#FFFF00';
      else if (value < 450) color = '#FFA500';
      else if (value < 500) color = '#FF0000';
      else color = '#800080';
    }
    
    return {
      fillColor: color,
      weight: 1,
      opacity: 1,
      color: '#666',
      fillOpacity: 0.7
    };
  };

  // Helper function to create popup content
  const createPopupContent = (feature, mapType) => {
    const { name, country, region } = feature.properties;
    const value = feature.properties[mapType] || 'No data';
    
    let unit = '';
    let title = '';
    
    if (mapType === 'temperature') {
      unit = '°C';
      title = 'Temperature Anomaly';
    } else if (mapType === 'precipitation') {
      unit = 'mm';
      title = 'Precipitation';
    } else if (mapType === 'co2') {
      unit = 'ppm';
      title = 'CO₂ Concentration';
    }
    
    return `
      <div class="map-popup">
        <h3>${name || country || region || 'Unknown'}</h3>
        <p><strong>${title}:</strong> ${value}${unit}</p>
      </div>
    `;
  };

  // Helper function to add legend
  const addLegend = (map, mapType) => {
    // Remove existing legend if any
    const existingLegend = document.querySelector('.map-legend');
    if (existingLegend) {
      existingLegend.remove();
    }
    
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = function() {
      const div = L.DomUtil.create('div', 'map-legend');
      let labels = [];
      let title = '';
      let unit = '';
      
      if (mapType === 'temperature') {
        title = 'Temperature Anomaly';
        unit = '°C';
        labels = [
          { color: '#0000FF', text: '< -2' },
          { color: '#0066FF', text: '-2 to -1' },
          { color: '#00CCFF', text: '-1 to 0' },
          { color: '#FFFF00', text: '0 to 1' },
          { color: '#FF9900', text: '1 to 2' },
          { color: '#FF0000', text: '> 2' }
        ];
      } else if (mapType === 'precipitation') {
        title = 'Precipitation';
        unit = 'mm';
        labels = [
          { color: '#E6F0FF', text: '< 20' },
          { color: '#CCE0FF', text: '20-40' },
          { color: '#99C2FF', text: '40-60' },
          { color: '#66A3FF', text: '60-80' },
          { color: '#3385FF', text: '80-100' },
          { color: '#0066FF', text: '> 100' }
        ];
      } else if (mapType === 'co2') {
        title = 'CO₂ Concentration';
        unit = 'ppm';
        labels = [
          { color: '#00FF00', text: '< 300' },
          { color: '#ADFF2F', text: '300-350' },
          { color: '#FFFF00', text: '350-400' },
          { color: '#FFA500', text: '400-450' },
          { color: '#FF0000', text: '450-500' },
          { color: '#800080', text: '> 500' }
        ];
      }
      
      div.innerHTML = `<h4>${title} (${unit})</h4>`;
      
      labels.forEach(label => {
        div.innerHTML += `
          <div class="legend-item">
            <span class="legend-color" style="background-color: ${label.color}"></span>
            <span class="legend-text">${label.text}</span>
          </div>
        `;
      });
      
      return div;
    };
    
    legend.addTo(map);
  };

  return <div ref={mapRef} className="world-map"></div>;
};

export default WorldMap;