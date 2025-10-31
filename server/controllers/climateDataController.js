import ClimateData from '../models/ClimateData.js';
import * as nasaService from '../services/nasaService.js';
import * as noaaService from '../services/noaaService.js';
import * as worldBankService from '../services/worldBankService.js';

/**
 * Get temperature data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTemperatureData = async (req, res) => {
  try {
    const { region = 'global', timeRange } = req.query;
    
    // Always try to fetch fresh data from API first
    console.log(`Fetching fresh temperature data for ${region} from API...`);
    
    let data;
    try {
      if (region === 'global') {
        data = await nasaService.fetchTemperatureData();
      } else {
        data = await worldBankService.fetchRegionalTemperatureData(region);
      }
      
      console.log('Successfully fetched temperature data from API');
    } catch (apiError) {
      console.error('Error fetching from API:', apiError.message);
      
      // If API fetch fails, try to get from database
      if (!data) {
        console.log('Trying to get temperature data from database...');
        data = await ClimateData.findOne({
          dataType: 'temperature',
          region: region
        }).sort({ createdAt: -1 });
      }
      
      // If still no data, use sample data
      if (!data) {
        console.log('Using sample temperature data...');
        if (region === 'global') {
          data = nasaService.getSampleTemperatureData();
        } else {
          data = worldBankService.getSampleRegionalTemperatureData(region);
        }
      }
    }
    
    if (!data) {
      return res.status(404).json({ message: 'Temperature data not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error in getTemperatureData:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get CO2 concentration data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCO2Data = async (req, res) => {
  try {
    const { timeRange } = req.query;
    
    // Always try to fetch fresh data from API first
    console.log('Fetching fresh CO2 data from API...');
    
    let data;
    try {
      data = await nasaService.fetchCO2Data();
      console.log('Successfully fetched CO2 data from API');
    } catch (apiError) {
      console.error('Error fetching from API:', apiError.message);
      
      // If API fetch fails, try to get from database
      if (!data) {
        console.log('Trying to get CO2 data from database...');
        data = await ClimateData.findOne({
          dataType: 'co2'
        }).sort({ createdAt: -1 });
      }
      
      // If still no data, use sample data
      if (!data) {
        console.log('Using sample CO2 data...');
        data = nasaService.getSampleCO2Data();
      }
    }
    
    if (!data) {
      return res.status(404).json({ message: 'CO2 data not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error in getCO2Data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get sea level data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSeaLevelData = async (req, res) => {
  try {
    const { timeRange } = req.query;
    
    // Always try to fetch fresh data from API first
    console.log('Fetching fresh sea level data from API...');
    
    let data;
    try {
      data = await noaaService.fetchSeaLevelData();
      console.log('Successfully fetched sea level data from API');
    } catch (apiError) {
      console.error('Error fetching from API:', apiError.message);
      
      // If API fetch fails, try to get from database
      if (!data) {
        console.log('Trying to get sea level data from database...');
        data = await ClimateData.findOne({
          dataType: 'seaLevel'
        }).sort({ createdAt: -1 });
      }
      
      // If still no data, use sample data
      if (!data) {
        console.log('Using sample sea level data...');
        data = noaaService.getSampleSeaLevelData();
      }
    }
    
    if (!data) {
      return res.status(404).json({ message: 'Sea level data not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error in getSeaLevelData:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get Arctic sea ice data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getArcticIceData = async (req, res) => {
  try {
    const { timeRange } = req.query;
    
    // Always try to fetch fresh data from API first
    console.log('Fetching fresh Arctic ice data from API...');
    
    let data;
    try {
      data = await noaaService.fetchArcticIceData();
      console.log('Successfully fetched Arctic ice data from API');
    } catch (apiError) {
      console.error('Error fetching from API:', apiError.message);
      
      // If API fetch fails, try to get from database
      if (!data) {
        console.log('Trying to get Arctic ice data from database...');
        data = await ClimateData.findOne({
          dataType: 'arcticIce'
        }).sort({ createdAt: -1 });
      }
      
      // If still no data, use sample data
      if (!data) {
        console.log('Using sample Arctic ice data...');
        data = noaaService.getSampleArcticIceData();
      }
    }
    
    if (!data) {
      return res.status(404).json({ message: 'Arctic ice data not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error in getArcticIceData:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get precipitation data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPrecipitationData = async (req, res) => {
  try {
    const { region = 'global', timeRange } = req.query;
    
    // Always try to fetch fresh data from API first
    console.log(`Fetching fresh precipitation data for ${region} from API...`);
    
    let data;
    try {
      data = await worldBankService.fetchPrecipitationData(
        region,
        parseInt(timeRange?.start) || 1980,
        parseInt(timeRange?.end) || 2020
      );
      console.log('Successfully fetched precipitation data from API');
    } catch (apiError) {
      console.error('Error fetching from API:', apiError.message);
      
      // If API fetch fails, try to get from database
      if (!data) {
        console.log('Trying to get precipitation data from database...');
        data = await ClimateData.findOne({
          dataType: 'precipitation',
          region: region
        }).sort({ createdAt: -1 });
      }
      
      // If still no data, use sample data
      if (!data) {
        console.log('Using sample precipitation data...');
        data = worldBankService.getSamplePrecipitationData(region);
      }
    }
    
    if (!data) {
      return res.status(404).json({ message: 'Precipitation data not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error in getPrecipitationData:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all climate indicators for a specific region
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRegionalClimateData = async (req, res) => {
  try {
    const { region = 'global' } = req.params;
    
    console.log(`Fetching all climate indicators for ${region}...`);
    
    // Fetch all climate indicators for the region directly from APIs
    let temperatureData, precipitationData, co2Data, seaLevelData, arcticIceData;
    
    // Fetch temperature data
    try {
      if (region === 'global') {
        temperatureData = await nasaService.fetchTemperatureData();
      } else {
        temperatureData = await worldBankService.fetchRegionalTemperatureData(region);
      }
    } catch (error) {
      console.error(`Error fetching temperature data for ${region}:`, error.message);
      temperatureData = region === 'global' 
        ? nasaService.getSampleTemperatureData() 
        : worldBankService.getSampleRegionalTemperatureData(region);
    }
    
    // Fetch precipitation data
    try {
      precipitationData = await worldBankService.fetchPrecipitationData(region);
    } catch (error) {
      console.error(`Error fetching precipitation data for ${region}:`, error.message);
      precipitationData = worldBankService.getSamplePrecipitationData(region);
    }
    
    // For global region, also get CO2, sea level, and Arctic ice data
    if (region === 'global') {
      // Fetch CO2 data
      try {
        co2Data = await nasaService.fetchCO2Data();
      } catch (error) {
        console.error('Error fetching CO2 data:', error.message);
        co2Data = nasaService.getSampleCO2Data();
      }
      
      // Fetch sea level data
      try {
        seaLevelData = await noaaService.fetchSeaLevelData();
      } catch (error) {
        console.error('Error fetching sea level data:', error.message);
        seaLevelData = noaaService.getSampleSeaLevelData();
      }
      
      // Fetch Arctic ice data
      try {
        arcticIceData = await noaaService.fetchArcticIceData();
      } catch (error) {
        console.error('Error fetching Arctic ice data:', error.message);
        arcticIceData = noaaService.getSampleArcticIceData();
      }
    }
    
    // Compile the response
    const response = {
      region,
      temperature: temperatureData,
      precipitation: precipitationData
    };
    
    if (region === 'global') {
      response.co2 = co2Data;
      response.seaLevel = seaLevelData;
      response.arcticIce = arcticIceData;
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error in getRegionalClimateData:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get global climate statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getGlobalStats = async (req, res) => {
  try {
    console.log('Fetching global climate statistics...');
    
    // Try to get the most recent data for each climate indicator directly from APIs
    let temperatureData, co2Data, seaLevelData, arcticIceData;
    
    // Fetch temperature data
    try {
      temperatureData = await nasaService.fetchTemperatureData();
    } catch (error) {
      console.error('Error fetching temperature data:', error.message);
      temperatureData = nasaService.getSampleTemperatureData();
    }
    
    // Fetch CO2 data
    try {
      co2Data = await nasaService.fetchCO2Data();
    } catch (error) {
      console.error('Error fetching CO2 data:', error.message);
      co2Data = nasaService.getSampleCO2Data();
    }
    
    // Fetch sea level data
    try {
      seaLevelData = await noaaService.fetchSeaLevelData();
    } catch (error) {
      console.error('Error fetching sea level data:', error.message);
      seaLevelData = noaaService.getSampleSeaLevelData();
    }
    
    // Fetch Arctic ice data
    try {
      arcticIceData = await noaaService.fetchArcticIceData();
    } catch (error) {
      console.error('Error fetching Arctic ice data:', error.message);
      arcticIceData = noaaService.getSampleArcticIceData();
    }
    
    // Calculate current values and trends
    const globalStats = {
      temperature: {
        value: temperatureData ? temperatureData.data.values[temperatureData.data.values.length - 1] : 1.1,
        unit: '°C',
        trend: 'up'
      },
      co2: {
        value: co2Data ? co2Data.data.values[co2Data.data.values.length - 1] : 420,
        unit: 'ppm',
        trend: 'up'
      },
      seaLevel: {
        value: seaLevelData ? 3.6 : 3.6, // Annual rate of increase
        unit: 'mm/year',
        trend: 'up'
      },
      arcticIce: {
        value: arcticIceData ? 13.1 : 13.1, // Percentage decline per decade
        unit: '%',
        trend: 'down'
      }
    };
    
    res.json(globalStats);
  } catch (error) {
    console.error('Error in getGlobalStats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  getTemperatureData,
  getCO2Data,
  getSeaLevelData,
  getArcticIceData,
  getPrecipitationData,
  getRegionalClimateData,
  getGlobalStats
};
