import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// NASA GISS Surface Temperature Analysis (GISTEMP) API
const NASA_GISTEMP_URL = 'https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv';

// NASA CO2 data from the Global Monitoring Laboratory
const NASA_CO2_URL = 'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv';

/**
 * Fetch and process global temperature data from NASA GISTEMP
 */
export const fetchTemperatureData = async () => {
  try {
    console.log('Fetching NASA temperature data...');
    // Add timeout to prevent long-hanging requests
    const response = await axios.get(NASA_GISTEMP_URL, { timeout: 10000 });
    
    // Save the raw CSV data to a temporary file
    const tempFilePath = path.join(__dirname, '../temp/nasa_temp.csv');
    
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
          // Filter out header rows and empty rows
          if (data.Year && !isNaN(parseInt(data.Year))) {
            const year = parseInt(data.Year);
            // Annual mean temperature anomaly
            const annualMean = parseFloat(data.J_D) || null;
            
            if (annualMean !== null) {
              results.push({
                year: year,
                value: annualMean
              });
            }
          }
        })
        .on('end', () => {
          // Clean up the temporary file
          try {
            fs.unlinkSync(tempFilePath);
          } catch (err) {
            console.warn('Could not delete temporary file:', err.message);
          }
          
          // Check if we have any results
          if (results.length === 0) {
            console.log('No temperature data was parsed from the CSV. Using sample data instead.');
            resolve(getSampleTemperatureData());
            return;
          }
          
          // Format the data for our application
          const formattedData = {
            dataType: 'temperature',
            source: 'NASA GISTEMP',
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
              unit: '°C',
              description: 'Global Land-Ocean Temperature Index, annual mean temperature anomalies in degrees Celsius from the base period 1951-1980.',
              methodology: 'NASA Goddard Institute for Space Studies (GISS) Surface Temperature Analysis (GISTEMP v4)',
              lastUpdated: new Date()
            }
          };
          
          resolve(formattedData);
        })
        .on('error', (error) => {
          console.error('Error parsing temperature CSV data:', error);
          // If there's an error parsing the CSV, use sample data
          resolve(getSampleTemperatureData());
        });
    });
  } catch (error) {
    console.error('Error fetching NASA temperature data:', error);
    // Return sample data instead of throwing an error
    return getSampleTemperatureData();
  }
};

/**
 * Fetch and process CO2 concentration data from NASA/NOAA
 */
export const fetchCO2Data = async () => {
  try {
    console.log('Fetching CO2 data...');
    const response = await axios.get(NASA_CO2_URL, { timeout: 10000 });
    
    // Save the raw CSV data to a temporary file
    const tempFilePath = path.join(__dirname, '../temp/nasa_co2.csv');
    
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
          // Filter out header rows and empty rows
          if (data.year && !isNaN(parseInt(data.year))) {
            const year = parseInt(data.year);
            // Annual mean CO2 concentration
            const annualMean = parseFloat(data.mean) || null;
            
            if (annualMean !== null) {
              results.push({
                year: year,
                value: annualMean
              });
            }
          }
        })
        .on('end', () => {
          // Clean up the temporary file
          try {
            fs.unlinkSync(tempFilePath);
          } catch (err) {
            console.warn('Could not delete temporary file:', err.message);
          }
          
          // Check if we have any results
          if (results.length === 0) {
            console.log('No CO2 data was parsed from the CSV. Using sample data instead.');
            resolve(getSampleCO2Data());
            return;
          }
          
          // Format the data for our application
          const formattedData = {
            dataType: 'co2',
            source: 'NOAA Global Monitoring Laboratory',
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
              unit: 'ppm',
              description: 'Atmospheric CO2 concentrations from Mauna Loa, Hawaii.',
              methodology: 'Direct measurements of atmospheric CO2 using infrared absorption techniques.',
              lastUpdated: new Date()
            }
          };
          
          resolve(formattedData);
        })
        .on('error', (error) => {
          console.error('Error parsing CO2 CSV data:', error);
          // If there's an error parsing the CSV, use sample data
          resolve(getSampleCO2Data());
        });
    });
  } catch (error) {
    console.error('Error fetching CO2 data:', error);
    // Return sample data instead of throwing an error
    return getSampleCO2Data();
  }
};

/**
 * Fallback function to use sample data when API is unavailable
 */
export const getSampleTemperatureData = () => {
  return {
    dataType: 'temperature',
    source: 'NASA GISTEMP (Sample)',
    region: 'global',
    timeRange: {
      start: 1880,
      end: 2023
    },
    data: {
      labels: [
        '1880', '1890', '1900', '1910', '1920', '1930', '1940', '1950', 
        '1960', '1970', '1980', '1990', '2000', '2010', '2020', '2023'
      ],
      values: [
        -0.16, -0.27, -0.15, -0.28, -0.21, -0.03, 0.13, -0.02, 
        0.03, 0.01, 0.27, 0.45, 0.61, 0.82, 1.02, 1.18
      ]
    },
    metadata: {
      unit: '°C',
      description: 'Global Land-Ocean Temperature Index, annual mean temperature anomalies in degrees Celsius from the base period 1951-1980.',
      methodology: 'NASA Goddard Institute for Space Studies (GISS) Surface Temperature Analysis (GISTEMP v4)',
      lastUpdated: new Date()
    }
  };
};

/**
 * Fallback function to use sample CO2 data when API is unavailable
 */
export const getSampleCO2Data = () => {
  return {
    dataType: 'co2',
    source: 'NOAA Global Monitoring Laboratory (Sample)',
    region: 'global',
    timeRange: {
      start: 1960,
      end: 2023
    },
    data: {
      labels: [
        '1960', '1965', '1970', '1975', '1980', '1985', '1990', '1995', 
        '2000', '2005', '2010', '2015', '2020', '2023'
      ],
      values: [
        316.91, 320.04, 325.68, 331.08, 338.68, 346.04, 354.35, 360.80, 
        369.40, 379.80, 389.85, 400.83, 412.44, 420.76
      ]
    },
    metadata: {
      unit: 'ppm',
      description: 'Atmospheric CO2 concentrations from Mauna Loa, Hawaii.',
      methodology: 'Direct measurements of atmospheric CO2 using infrared absorption techniques.',
      lastUpdated: new Date()
    }
  };
};
