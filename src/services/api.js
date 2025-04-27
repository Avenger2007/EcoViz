import axios from 'axios';

// Create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api'
});

// Climate data API calls
export const fetchTemperatureData = async (region = 'global', timeRange = null) => {
  try {
    const params = { region };
    if (timeRange) {
      params.timeRange = timeRange;
    }
    
    const response = await api.get('/climate/temperature', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    throw error;
  }
};

export const fetchCO2Data = async (timeRange = null) => {
  try {
    const params = {};
    if (timeRange) {
      params.timeRange = timeRange;
    }
    
    const response = await api.get('/climate/co2', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching CO2 data:', error);
    throw error;
  }
};

export const fetchSeaLevelData = async (timeRange = null) => {
  try {
    const params = {};
    if (timeRange) {
      params.timeRange = timeRange;
    }
    
    const response = await api.get('/climate/sea-level', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching sea level data:', error);
    throw error;
  }
};

export const fetchArcticIceData = async (timeRange = null) => {
  try {
    const params = {};
    if (timeRange) {
      params.timeRange = timeRange;
    }
    
    const response = await api.get('/climate/arctic-ice', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Arctic ice data:', error);
    throw error;
  }
};

export const fetchPrecipitationData = async (region = 'global', timeRange = null) => {
  try {
    const params = { region };
    if (timeRange) {
      params.timeRange = timeRange;
    }
    
    const response = await api.get('/climate/precipitation', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching precipitation data:', error);
    throw error;
  }
};

export const fetchRegionalClimateData = async (region = 'global') => {
  try {
    const response = await api.get(`/climate/region/${region}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching climate data for ${region}:`, error);
    throw error;
  }
};

export const fetchGlobalStats = async () => {
  try {
    const response = await api.get('/climate/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching global stats:', error);
    throw error;
  }
};

// GeoJSON data API calls
export const fetchWorldGeoData = async (dataType = 'temperature') => {
  try {
    const response = await api.get('/climate/geo/world', { params: { dataType } });
    return response.data;
  } catch (error) {
    console.error('Error fetching world geo data:', error);
    throw error;
  }
};

export const fetchRegionGeoData = async (region, dataType = 'temperature') => {
  try {
    const response = await api.get(`/climate/geo/region/${region}`, { params: { dataType } });
    return response.data;
  } catch (error) {
    console.error(`Error fetching geo data for ${region}:`, error);
    throw error;
  }
};

// Data upload API calls
export const uploadClimateData = async (formData) => {
  try {
    const response = await api.post('/uploads/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading climate data:', error);
    throw error;
  }
};

export const fetchUserUploads = async () => {
  try {
    const response = await api.get('/uploads');
    return response.data;
  } catch (error) {
    console.error('Error fetching user uploads:', error);
    throw error;
  }
};

export const fetchUserUploadById = async (id) => {
  try {
    const response = await api.get(`/uploads/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching upload ${id}:`, error);
    throw error;
  }
};

export default api;