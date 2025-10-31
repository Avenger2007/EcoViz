import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with timeout and retry configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for retry logic
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;

    if (!config) {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;

    // Retry on network errors or 5xx server errors (max 3 attempts)
    if (
      (error.response?.status >= 500 || !error.response) &&
      config.__retryCount < 3
    ) {
      config.__retryCount += 1;

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, config.__retryCount - 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      console.log(`Retrying request (attempt ${config.__retryCount})...`);
      return axiosInstance(config);
    }

    return Promise.reject(error);
  }
);

/**
 * Fetches climate data based on provided filters
 * @param {Object} filters - Filters for the climate data (e.g., region, timeframe, variables)
 * @returns {Promise<Object>} - Climate data response
 */
export const fetchClimateData = async (filters) => {
  try {
    const response = await axiosInstance.get('/climate-data', {
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching climate data:', error.message);
    throw new Error(`Failed to fetch climate data: ${error.message}`);
  }
};

/**
 * Uploads a dataset to the server
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - Upload response
 */
export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading dataset:', error.message);
    throw new Error(`Failed to upload dataset: ${error.message}`);
  }
};

/**
 * Fetches available regions for climate data
 * @returns {Promise<Array>} - List of available regions
 */
export const fetchRegions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/regions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

/**
 * Fetches available climate variables
 * @returns {Promise<Array>} - List of available climate variables
 */
export const fetchClimateVariables = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/variables`);
    return response.data;
  } catch (error) {
    console.error('Error fetching climate variables:', error);
    throw error;
  }
};

/**
 * Fetches time series data for a specific region and variable
 * @param {string} region - The region identifier
 * @param {string} variable - The climate variable identifier
 * @param {Object} timeRange - The time range for the data
 * @returns {Promise<Object>} - Time series data
 */
export const fetchTimeSeriesData = async (region, variable, timeRange) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/time-series`, {
      params: { region, variable, ...timeRange }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching time series data:', error);
    throw error;
  }
};

/**
 * Fetches global statistics for climate indicators
 * @returns {Promise<Object>} - Global statistics data
 */
export const fetchGlobalStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/global-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching global stats:', error);
    throw error;
  }
};

/**
 * Fetches world geographical data with climate indicators
 * @param {string} dataType - Type of climate data to overlay on the map
 * @returns {Promise<Object>} - World geographical data with climate indicators
 */
export const fetchWorldGeoData = async (dataType) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/world-geo-data`, {
      params: { dataType }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching world geo data:', error);
    throw error;
  }
};

/**
 * Fetches temperature data for a specific region and time range
 * @param {string} region - The region identifier
 * @param {Object} timeRange - The time range for the data
 * @returns {Promise<Object>} - Temperature data
 */
export const fetchTemperatureData = async (region, timeRange) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/temperature`, {
      params: { region, ...timeRange }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    throw error;
  }
};

/**
 * Fetches CO2 concentration data for a specific time range
 * @param {Object} timeRange - The time range for the data
 * @returns {Promise<Object>} - CO2 data
 */
export const fetchCO2Data = async (timeRange) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/co2`, {
      params: timeRange
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching CO2 data:', error);
    throw error;
  }
};

/**
 * Fetches sea level data for a specific time range
 * @param {Object} timeRange - The time range for the data
 * @returns {Promise<Object>} - Sea level data
 */
export const fetchSeaLevelData = async (timeRange) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sea-level`, {
      params: timeRange
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sea level data:', error);
    throw error;
  }
};

/**
 * Fetches Arctic ice data for a specific time range
 * @param {Object} timeRange - The time range for the data
 * @returns {Promise<Object>} - Arctic ice data
 */
export const fetchArcticIceData = async (timeRange) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/arctic-ice`, {
      params: timeRange
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Arctic ice data:', error);
    throw error;
  }
};

/**
 * Fetches precipitation data for a specific region and time range
 * @param {string} region - The region identifier
 * @param {Object} timeRange - The time range for the data
 * @returns {Promise<Object>} - Precipitation data
 */
export const fetchPrecipitationData = async (region, timeRange) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/precipitation`, {
      params: { region, ...timeRange }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching precipitation data:', error);
    throw error;
  }
};
