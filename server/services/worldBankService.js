const axios = require('axios');

// World Bank Climate Data API
const WORLD_BANK_API_BASE = 'https://climatedata.worldbank.org/api/v1';

/**
 * Fetch precipitation data from World Bank Climate API
 * @param {string} region - ISO country code or region code
 * @param {number} startYear - Start year for data
 * @param {number} endYear - End year for data
 */
const fetchPrecipitationData = async (region = 'global', startYear = 1980, endYear = 2020) => {
  try {
    console.log(`Fetching precipitation data for ${region}...`);
    
    // For global data, we'll aggregate data from major regions
    const regions = region === 'global' 
      ? ['NAM', 'LAC', 'ECS', 'MEA', 'SSA', 'SAS', 'EAS'] // Major World Bank regions
      : [region];
    
    const aggregatedData = {};
    
    for (const r of regions) {
      const url = `${WORLD_BANK_API_BASE}/timeseries/pr/annual/${r}`;
      
      try {
        const response = await axios.get(url);
        
        if (response.data && response.data.data) {
          response.data.data.forEach(item => {
            const year = item.year;
            
            if (year >= startYear && year <= endYear) {
              if (!aggregatedData[year]) {
                aggregatedData[year] = {
                  count: 0,
                  sum: 0
                };
              }
              
              aggregatedData[year].count += 1;
              aggregatedData[year].sum += item.value;
            }
          });
        }
      } catch (regionError) {
        console.warn(`Error fetching data for region ${r}:`, regionError.message);
        // Continue with other regions
      }
    }
    
    // Calculate averages and format data
    const years = Object.keys(aggregatedData).sort();
    const values = years.map(year => {
      const avg = aggregatedData[year].sum / aggregatedData[year].count;
      return parseFloat(avg.toFixed(2));
    });
    
    // Format the data for our application
    const formattedData = {
      dataType: 'precipitation',
      source: 'World Bank Climate Data',
      region: region,
      timeRange: {
        start: parseInt(years[0]),
        end: parseInt(years[years.length - 1])
      },
      data: {
        labels: years,
        values: values
      },
      metadata: {
        unit: 'mm',
        description: `Annual precipitation for ${region === 'global' ? 'global average' : region}.`,
        methodology: 'World Bank Climate Data API, aggregated from multiple climate models.',
        lastUpdated: new Date()
      }
    };
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching precipitation data:', error);
    return getSamplePrecipitationData(region);
  }
};

/**
 * Fetch regional temperature data from World Bank Climate API
 * @param {string} region - ISO country code or region code
 * @param {number} startYear - Start year for data
 * @param {number} endYear - End year for data
 */
const fetchRegionalTemperatureData = async (region, startYear = 1980, endYear = 2020) => {
  try {
    console.log(`Fetching temperature data for ${region}...`);
    
    const url = `${WORLD_BANK_API_BASE}/timeseries/tas/annual/${region}`;
    const response = await axios.get(url);
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid data format from World Bank API');
    }
    
    // Filter and format the data
    const filteredData = response.data.data
      .filter(item => item.year >= startYear && item.year <= endYear)
      .sort((a, b) => a.year - b.year);
    
    const years = filteredData.map(item => item.year.toString());
    const values = filteredData.map(item => parseFloat(item.value.toFixed(2)));
    
    // Format the data for our application
    const formattedData = {
      dataType: 'temperature',
      source: 'World Bank Climate Data',
      region: region,
      timeRange: {
        start: startYear,
        end: endYear
      },
      data: {
        labels: years,
        values: values
      },
      metadata: {
        unit: '°C',
        description: `Annual mean temperature for ${region}.`,
        methodology: 'World Bank Climate Data API, aggregated from multiple climate models.',
        lastUpdated: new Date()
      }
    };
    
    return formattedData;
  } catch (error) {
    console.error(`Error fetching temperature data for ${region}:`, error);
    return getSampleRegionalTemperatureData(region);
  }
};

/**
 * Fallback function to use sample precipitation data when API is unavailable
 */
const getSamplePrecipitationData = (region = 'global') => {
  return {
    dataType: 'precipitation',
    source: 'World Bank Climate Data (Sample)',
    region: region,
    timeRange: {
      start: 1980,
      end: 2020
    },
    data: {
      labels: [
        '1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020'
      ],
      values: [
        1050, 1030, 1080, 1020, 1060, 1040, 1010, 990, 970
      ]
    },
    metadata: {
      unit: 'mm',
      description: `Annual precipitation for ${region === 'global' ? 'global average' : region}.`,
      methodology: 'World Bank Climate Data API, aggregated from multiple climate models.',
      lastUpdated: new Date()
    }
  };
};

/**
 * Fallback function to use sample regional temperature data when API is unavailable
 */
const getSampleRegionalTemperatureData = (region) => {
  // Different sample data based on region
  let values;
  
  switch (region) {
    case 'NAM': // North America
      values = [13.2, 13.4, 13.6, 13.8, 14.0, 14.2, 14.5, 14.7, 14.9];
      break;
    case 'ECS': // Europe & Central Asia
      values = [9.8, 10.0, 10.3, 10.5, 10.8, 11.0, 11.3, 11.5, 11.8];
      break;
    case 'LAC': // Latin America & Caribbean
      values = [22.5, 22.6, 22.8, 23.0, 23.2, 23.4, 23.6, 23.8, 24.0];
      break;
    case 'MEA': // Middle East & North Africa
      values = [19.5, 19.7, 20.0, 20.2, 20.5, 20.8, 21.0, 21.3, 21.5];
      break;
    case 'SSA': // Sub-Saharan Africa
      values = [24.0, 24.2, 24.3, 24.5, 24.7, 24.9, 25.1, 25.3, 25.5];
      break;
    case 'SAS': // South Asia
      values = [24.5, 24.7, 24.9, 25.1, 25.3, 25.5, 25.7, 25.9, 26.1];
      break;
    case 'EAS': // East Asia & Pacific
      values = [14.8, 15.0, 15.2, 15.4, 15.6, 15.8, 16.0, 16.2, 16.4];
      break;
    default:
      values = [14.0, 14.2, 14.4, 14.6, 14.8, 15.0, 15.2, 15.4, 15.6];
  }
  
  return {
    dataType: 'temperature',
    source: 'World Bank Climate Data (Sample)',
    region: region,
    timeRange: {
      start: 1980,
      end: 2020
    },
    data: {
      labels: [
        '1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020'
      ],
      values: values
    },
    metadata: {
      unit: '°C',
      description: `Annual mean temperature for ${region}.`,
      methodology: 'World Bank Climate Data API, aggregated from multiple climate models.',
      lastUpdated: new Date()
    }
  };
};

module.exports = {
  fetchPrecipitationData,
  fetchRegionalTemperatureData,
  getSamplePrecipitationData,
  getSampleRegionalTemperatureData
};