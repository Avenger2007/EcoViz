const GeoData = require('../models/GeoData');
const geoDataService = require('../services/geoDataService');

/**
 * Get world GeoJSON data with climate indicators
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getWorldGeoData = async (req, res) => {
  try {
    const { dataType = 'temperature' } = req.query;
    
    // Always try to fetch fresh data from API first
    console.log('Fetching fresh world GeoJSON data from API...');
    
    let geoData;
    try {
      geoData = await geoDataService.fetchWorldGeoData();
      console.log('Successfully fetched world GeoJSON data from API');
    } catch (apiError) {
      console.error('Error fetching from API:', apiError.message);
      
      // If API fetch fails, try to get from database
      if (!geoData) {
        console.log('Trying to get world GeoJSON data from database...');
        const dbData = await GeoData.findOne({
          name: 'world'
        }).sort({ createdAt: -1 });
        
        if (dbData) {
          geoData = {
            name: dbData.name,
            type: dbData.type,
            features: dbData.features,
            metadata: dbData.metadata
          };
        }
      }
      
      // If still no data, use sample data
      if (!geoData) {
        console.log('Using sample world GeoJSON data...');
        geoData = geoDataService.getSampleWorldGeoData();
      }
    }
    
    if (!geoData) {
      return res.status(404).json({ message: 'World GeoJSON data not found' });
    }
    
    // Filter or highlight features based on dataType if needed
    // For now, we'll just return the full GeoJSON
    
    res.json(geoData);
  } catch (error) {
    console.error('Error in getWorldGeoData:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get GeoJSON data for a specific region
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRegionGeoData = async (req, res) => {
  try {
    const { region } = req.params;
    const { dataType = 'temperature' } = req.query;
    
    console.log(`Fetching GeoJSON data for region: ${region}`);
    
    // First try to get world data from API
    let worldData;
    try {
      worldData = await geoDataService.fetchWorldGeoData();
      console.log('Successfully fetched world GeoJSON data from API');
    } catch (apiError) {
      console.error('Error fetching world data from API:', apiError.message);
      
      // If API fetch fails, try to get from database
      try {
        const dbData = await GeoData.findOne({
          name: 'world'
        }).sort({ createdAt: -1 });
        
        if (dbData) {
          worldData = {
            name: dbData.name,
            type: dbData.type,
            features: dbData.features,
            metadata: dbData.metadata
          };
        }
      } catch (dbError) {
        console.error('Error fetching from database:', dbError.message);
      }
      
      // If still no data, use sample data
      if (!worldData) {
        console.log('Using sample world GeoJSON data...');
        worldData = geoDataService.getSampleWorldGeoData();
      }
    }
    
    if (!worldData) {
      return res.status(404).json({ message: 'World GeoJSON data not found' });
    }
    
    // Filter features to include only those in the specified region
    // This is a simplified approach - in a real app, you would have proper region boundaries
    const regionFeatures = worldData.features.filter(feature => {
      // Check if the feature belongs to the specified region
      // This would depend on your data structure and region definitions
      return feature.properties.region === region || 
             feature.properties.continent === region ||
             feature.properties.name === region;
    });
    
    // If no features found for the region, return the sample data point for that region
    if (regionFeatures.length === 0) {
      console.log(`No features found for region: ${region}, using sample data`);
      
      // Find the sample point for this region in the sample data
      const sampleData = geoDataService.getSampleWorldGeoData();
      const sampleRegionFeature = sampleData.features.find(feature => 
        feature.properties.name.toLowerCase() === region.toLowerCase()
      );
      
      if (sampleRegionFeature) {
        regionFeatures.push(sampleRegionFeature);
      } else {
        // Create a generic point for this region
        regionFeatures.push({
          type: "Feature",
          properties: {
            name: region,
            temperature: 1.0,
            precipitation: 50,
            co2: 415
          },
          geometry: {
            type: "Point",
            coordinates: [0, 0]  // Default coordinates
          }
        });
      }
    }
    
    // Create a new GeoJSON object for the region
    const geoData = {
      name: region,
      type: "FeatureCollection",
      features: regionFeatures,
      metadata: {
        ...worldData.metadata,
        description: `Climate data for ${region}`
      }
    };
    
    res.json(geoData);
  } catch (error) {
    console.error('Error in getRegionGeoData:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getWorldGeoData,
  getRegionGeoData
};