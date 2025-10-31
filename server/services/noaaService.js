import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// NOAA Sea Level Data
const NOAA_SEA_LEVEL_URL = 'https://climate.nasa.gov/system/internal_resources/details/original/121_Global_Sea_Level_Data_File.txt';

// NOAA Arctic Sea Ice Extent
const NOAA_ARCTIC_ICE_URL = 'https://climate.nasa.gov/system/internal_resources/details/original/2352_minimum_extent_and_area_plot_N_v3.1.csv';

/**
 * Fetch and process sea level data from NOAA
 */
export const fetchSeaLevelData = async () => {
  try {
    console.log('Fetching sea level data...');
    const response = await axios.get(NOAA_SEA_LEVEL_URL);
    
    // Save the raw data to a temporary file
    const tempFilePath = path.join(__dirname, '../temp/noaa_sea_level.txt');
    
    // Ensure the temp directory exists
    if (!fs.existsSync(path.join(__dirname, '../temp'))) {
      fs.mkdirSync(path.join(__dirname, '../temp'), { recursive: true });
    }
    
    fs.writeFileSync(tempFilePath, response.data);
    
    // Process the data
    const fileContent = fs.readFileSync(tempFilePath, 'utf8');
    const lines = fileContent.split('\n');
    
    const results = [];
    
    // Skip header lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines and comments
      if (line === '' || line.startsWith('#')) {
        continue;
      }
      
      // Parse data lines
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const year = parseFloat(parts[0]);
        const seaLevel = parseFloat(parts[1]);
        
        if (!isNaN(year) && !isNaN(seaLevel)) {
          results.push({
            year: Math.round(year),
            value: seaLevel
          });
        }
      }
    }
    
    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);
    
    // Format the data for our application
    const formattedData = {
      dataType: 'seaLevel',
      source: 'NOAA/NASA',
      region: 'global',
      timeRange: {
        start: results[0].year,
        end: results[results.length - 1].year
      },
      data: {
        labels: results.map(item => item.year.toString()),
        values: results.map(item => item.value)
      },
      metadata: {
        unit: 'mm',
        description: 'Global mean sea level change relative to the 1993-2008 average.',
        methodology: 'Satellite sea level observations.',
        lastUpdated: new Date()
      }
    };
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching sea level data:', error);
    return getSampleSeaLevelData();
  }
};

/**
 * Fetch and process Arctic sea ice data from NOAA
 */
export const fetchArcticIceData = async () => {
  try {
    console.log('Fetching Arctic sea ice data...');
    const response = await axios.get(NOAA_ARCTIC_ICE_URL);
    
    // Save the raw CSV data to a temporary file
    const tempFilePath = path.join(__dirname, '../temp/noaa_arctic_ice.csv');
    
    // Ensure the temp directory exists
    if (!fs.existsSync(path.join(__dirname, '../temp'))) {
      fs.mkdirSync(path.join(__dirname, '../temp'), { recursive: true });
    }
    
    fs.writeFileSync(tempFilePath, response.data);
    
    // Process the CSV data
    const results = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(tempFilePath)
        .pipe(csv())
        .on('data', (data) => {
          // Extract year and extent data
          if (data.year && !isNaN(parseInt(data.year))) {
            const year = parseInt(data.year);
            // Arctic sea ice extent in million square kilometers
            const extent = parseFloat(data.extent) || null;
            
            if (extent !== null) {
              results.push({
                year: year,
                value: extent
              });
            }
          }
        })
        .on('end', () => {
          // Clean up the temporary file
          fs.unlinkSync(tempFilePath);
          
          // Format the data for our application
          const formattedData = {
            dataType: 'arcticIce',
            source: 'NOAA/NASA',
            region: 'arctic',
            timeRange: {
              start: results[0].year,
              end: results[results.length - 1].year
            },
            data: {
              labels: results.map(item => item.year.toString()),
              values: results.map(item => item.value)
            },
            metadata: {
              unit: 'million km²',
              description: 'Arctic sea ice minimum extent (September average).',
              methodology: 'Satellite observations of sea ice extent.',
              lastUpdated: new Date()
            }
          };
          
          resolve(formattedData);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  } catch (error) {
    console.error('Error fetching Arctic sea ice data:', error);
    return getSampleArcticIceData();
  }
};

/**
 * Fallback function to use sample sea level data when API is unavailable
 */
export const getSampleSeaLevelData = () => {
  return {
    dataType: 'seaLevel',
    source: 'NOAA/NASA (Sample)',
    region: 'global',
    timeRange: {
      start: 1900,
      end: 2020
    },
    data: {
      labels: [
        '1900', '1910', '1920', '1930', '1940', '1950', '1960', '1970', 
        '1980', '1990', '2000', '2010', '2020'
      ],
      values: [
        -120, -110, -100, -80, -60, -40, -20, 0, 
        20, 40, 70, 110, 160
      ]
    },
    metadata: {
      unit: 'mm',
      description: 'Global mean sea level change relative to the 1993-2008 average.',
      methodology: 'Satellite sea level observations.',
      lastUpdated: new Date()
    }
  };
};

/**
 * Fallback function to use sample Arctic sea ice data when API is unavailable
 */
export const getSampleArcticIceData = () => {
  return {
    dataType: 'arcticIce',
    source: 'NOAA/NASA (Sample)',
    region: 'arctic',
    timeRange: {
      start: 1979,
      end: 2023
    },
    data: {
      labels: [
        '1979', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020', '2023'
      ],
      values: [
        7.05, 6.93, 6.24, 6.13, 6.32, 5.57, 4.90, 4.68, 4.27, 4.23
      ]
    },
    metadata: {
      unit: 'million km²',
      description: 'Arctic sea ice minimum extent (September average).',
      methodology: 'Satellite observations of sea ice extent.',
      lastUpdated: new Date()
    }
  };
};
