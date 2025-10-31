import axios from 'axios';

// Natural Earth GeoJSON data for world countries
const NATURAL_EARTH_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

// NASA GISTEMP country-level temperature anomalies
const NASA_COUNTRY_TEMP_URL = 'https://data.giss.nasa.gov/gistemp/tabledata_v4/';

/**
 * Fetch and process world GeoJSON data with climate indicators
 */
export const fetchWorldGeoData = async () => {
  try {
    console.log('Fetching world GeoJSON data...');
    
    // Fetch base GeoJSON data
    const response = await axios.get(NATURAL_EARTH_URL);
    const baseGeoJson = response.data;
    
    if (!baseGeoJson || !baseGeoJson.features) {
      throw new Error('Invalid GeoJSON data format');
    }
    
    // Enhance GeoJSON with climate data
    // In a real application, we would fetch actual climate data for each country
    // For this demo, we'll add sample climate data
    const enhancedFeatures = baseGeoJson.features.map(feature => {
      // Generate sample climate data based on latitude
      const coords = feature.geometry.type === 'Point' 
        ? feature.geometry.coordinates 
        : feature.geometry.type === 'Polygon'
          ? feature.geometry.coordinates[0][0]
          : feature.geometry.coordinates[0][0][0];
      
      const latitude = Array.isArray(coords) ? coords[1] : 0;
      
      // Temperature tends to be higher near equator, lower at poles
      const temperatureBase = 15 - Math.abs(latitude) * 0.2;
      const temperature = parseFloat((temperatureBase + Math.random() * 2 - 1).toFixed(1));
      
      // Precipitation tends to be higher in tropics, lower at poles and in deserts
      let precipitationBase = 1000;
      if (Math.abs(latitude) < 23.5) {
        // Tropical regions
        precipitationBase = 2000;
      } else if (Math.abs(latitude) > 60) {
        // Polar regions
        precipitationBase = 300;
      }
      const precipitation = Math.round(precipitationBase + Math.random() * 500 - 250);
      
      // CO2 is fairly uniform globally but with some variation
      const co2 = Math.round(410 + Math.random() * 20 - 10);
      
      // Add climate properties to the feature
      return {
        ...feature,
        properties: {
          ...feature.properties,
          temperature,
          precipitation,
          co2
        }
      };
    });
    
    // Create the enhanced GeoJSON
    const enhancedGeoJson = {
      type: "FeatureCollection",
      features: enhancedFeatures,
      metadata: {
        source: "Natural Earth, enhanced with climate data",
        description: "World countries with climate indicators",
        year: new Date().getFullYear(),
        lastUpdated: new Date()
      }
    };
    
    return enhancedGeoJson;
  } catch (error) {
    console.error('Error fetching world GeoJSON data:', error);
    return getSampleWorldGeoData();
  }
};

/**
 * Fallback function to use sample world GeoJSON data when API is unavailable
 */
export const getSampleWorldGeoData = () => {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Global",
          temperature: 1.1,
          precipitation: 60,
          co2: 420
        },
        geometry: {
          type: "Point",
          coordinates: [0, 0]
        }
      },
      {
        type: "Feature",
        properties: {
          name: "North America",
          temperature: 1.4,
          precipitation: 70,
          co2: 415
        },
        geometry: {
          type: "Point",
          coordinates: [-100, 40]
        }
      },
      {
        type: "Feature",
        properties: {
          name: "South America",
          temperature: 0.9,
          precipitation: 90,
          co2: 410
        },
        geometry: {
          type: "Point",
          coordinates: [-60, -15]
        }
      },
      {
        type: "Feature",
        properties: {
          name: "Europe",
          temperature: 1.6,
          precipitation: 65,
          co2: 425
        },
        geometry: {
          type: "Point",
          coordinates: [15, 50]
        }
      },
      {
        type: "Feature",
        properties: {
          name: "Africa",
          temperature: 1.2,
          precipitation: 40,
          co2: 405
        },
        geometry: {
          type: "Point",
          coordinates: [20, 0]
        }
      },
      {
        type: "Feature",
        properties: {
          name: "Asia",
          temperature: 1.5,
          precipitation: 75,
          co2: 430
        },
        geometry: {
          type: "Point",
          coordinates: [100, 30]
        }
      },
      {
        type: "Feature",
        properties: {
          name: "Australia",
          temperature: 1.3,
          precipitation: 30,
          co2: 415
        },
        geometry: {
          type: "Point",
          coordinates: [135, -25]
        }
      },
      {
        type: "Feature",
        properties: {
          name: "Antarctica",
          temperature: 2.0,
          precipitation: 10,
          co2: 400
        },
        geometry: {
          type: "Point",
          coordinates: [0, -80]
        }
      }
    ],
    metadata: {
      source: "Sample Data",
      description: "Sample world regions with climate indicators",
      year: new Date().getFullYear(),
      lastUpdated: new Date()
    }
  };
};
