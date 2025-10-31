/**
 * Data seeding script for the Climate Dashboard
 * This script populates the database with initial climate data
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import models
import ClimateData from '../models/ClimateData.js';
import GeoData from '../models/GeoData.js';

// Import services
import * as nasaService from '../services/nasaService.js';
import * as noaaService from '../services/noaaService.js';
import * as worldBankService from '../services/worldBankService.js';
import * as geoDataService from '../services/geoDataService.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/climate-dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Create necessary directories
const dirs = ['../uploads', '../temp'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

/**
 * Seed climate data
 */
const seedClimateData = async () => {
  try {
    // Clear existing data
    await ClimateData.deleteMany({});
    console.log('Cleared existing climate data');
    
    // Seed temperature data
    console.log('Seeding temperature data...');
    try {
      const tempData = await nasaService.fetchTemperatureData()
        .catch(() => nasaService.getSampleTemperatureData());
      await ClimateData.create(tempData);
      console.log('Temperature data seeded');
    } catch (error) {
      console.error('Error seeding temperature data:', error);
      // Use sample data as fallback
      const sampleTempData = nasaService.getSampleTemperatureData();
      await ClimateData.create(sampleTempData);
      console.log('Sample temperature data seeded');
    }
    
    // Seed CO2 data
    console.log('Seeding CO2 data...');
    try {
      const co2Data = await nasaService.fetchCO2Data()
        .catch(() => nasaService.getSampleCO2Data());
      await ClimateData.create(co2Data);
      console.log('CO2 data seeded');
    } catch (error) {
      console.error('Error seeding CO2 data:', error);
      // Use sample data as fallback
      const sampleCO2Data = nasaService.getSampleCO2Data();
      await ClimateData.create(sampleCO2Data);
      console.log('Sample CO2 data seeded');
    }
    
    // Seed sea level data
    console.log('Seeding sea level data...');
    try {
      const seaLevelData = await noaaService.fetchSeaLevelData()
        .catch(() => noaaService.getSampleSeaLevelData());
      await ClimateData.create(seaLevelData);
      console.log('Sea level data seeded');
    } catch (error) {
      console.error('Error seeding sea level data:', error);
      // Use sample data as fallback
      const sampleSeaLevelData = noaaService.getSampleSeaLevelData();
      await ClimateData.create(sampleSeaLevelData);
      console.log('Sample sea level data seeded');
    }
    
    // Seed Arctic ice data
    console.log('Seeding Arctic ice data...');
    try {
      const arcticIceData = await noaaService.fetchArcticIceData()
        .catch(() => noaaService.getSampleArcticIceData());
      await ClimateData.create(arcticIceData);
      console.log('Arctic ice data seeded');
    } catch (error) {
      console.error('Error seeding Arctic ice data:', error);
      // Use sample data as fallback
      const sampleArcticIceData = noaaService.getSampleArcticIceData();
      await ClimateData.create(sampleArcticIceData);
      console.log('Sample Arctic ice data seeded');
    }
    
    // Seed precipitation data
    console.log('Seeding precipitation data...');
    try {
      const precipData = await worldBankService.fetchPrecipitationData()
        .catch(() => worldBankService.getSamplePrecipitationData());
      await ClimateData.create(precipData);
      console.log('Precipitation data seeded');
    } catch (error) {
      console.error('Error seeding precipitation data:', error);
      // Use sample data as fallback
      const samplePrecipData = worldBankService.getSamplePrecipitationData();
      await ClimateData.create(samplePrecipData);
      console.log('Sample precipitation data seeded');
    }
    
    // Seed regional temperature data for major regions
    const regions = ['NAM', 'ECS', 'LAC', 'MEA', 'SSA', 'SAS', 'EAS'];
    
    for (const region of regions) {
      console.log(`Seeding temperature data for ${region}...`);
      try {
        const regionData = await worldBankService.fetchRegionalTemperatureData(region)
          .catch(() => worldBankService.getSampleRegionalTemperatureData(region));
        await ClimateData.create(regionData);
        console.log(`Temperature data for ${region} seeded`);
      } catch (error) {
        console.error(`Error seeding temperature data for ${region}:`, error);
        // Use sample data as fallback
        const sampleRegionData = worldBankService.getSampleRegionalTemperatureData(region);
        await ClimateData.create(sampleRegionData);
        console.log(`Sample temperature data for ${region} seeded`);
      }
    }
    
    console.log('All climate data seeded successfully');
  } catch (error) {
    console.error('Error seeding climate data:', error);
  }
};

/**
 * Seed GeoJSON data
 */
const seedGeoData = async () => {
  try {
    // Clear existing data
    await GeoData.deleteMany({});
    console.log('Cleared existing geo data');
    
    // Seed world geo data
    console.log('Seeding world geo data...');
    try {
      const worldGeoData = await geoDataService.fetchWorldGeoData()
        .catch(() => geoDataService.getSampleWorldGeoData());
      
      await GeoData.create({
        name: 'world',
        type: worldGeoData.type,
        features: worldGeoData.features,
        metadata: worldGeoData.metadata
      });
      
      console.log('World geo data seeded');
    } catch (error) {
      console.error('Error seeding world geo data:', error);
      // Use sample data as fallback
      const sampleWorldGeoData = geoDataService.getSampleWorldGeoData();
      
      await GeoData.create({
        name: 'world',
        type: sampleWorldGeoData.type,
        features: sampleWorldGeoData.features,
        metadata: sampleWorldGeoData.metadata
      });
      
      console.log('Sample world geo data seeded');
    }
    
    console.log('All geo data seeded successfully');
  } catch (error) {
    console.error('Error seeding geo data:', error);
  }
};

/**
 * Main seeding function
 */
const seedAll = async () => {
  try {
    console.log('Starting data seeding...');
    
    await seedClimateData();
    await seedGeoData();
    
    console.log('All data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedAll();
