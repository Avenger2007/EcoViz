import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB, isUsingInMemory, getInMemoryStore } from './config/db.js';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Create necessary directories
const dirs = ['./uploads', './temp'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Connect to MongoDB or use in-memory store
let dbConnected = false;
if (process.env.MONGO_URI) {
  connectDB()
    .then(connected => {
      dbConnected = connected;
      if (connected) {
        console.log('Successfully connected to MongoDB');
      } else {
        console.log('Using in-memory data store for development');
      }
    })
    .catch(err => {
      console.error('Database connection error:', err);
      console.log('Using in-memory data store for development');
    });
} else {
  console.log('No MongoDB URI provided, using in-memory data store');
}

// Import routes
const climateRoutes = require('./routes/climateRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Climate Dashboard API is running' });
});

// Use route modules
app.use('/api/climate', climateRoutes);
app.use('/api/uploads', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
  }
  
  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({ message: err.message });
  }
  
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

// Data initialization
const initializeData = async () => {
  try {
    // Import data services
    const nasaService = require('./services/nasaService');
    const noaaService = require('./services/noaaService');
    const worldBankService = require('./services/worldBankService');
    const geoDataService = require('./services/geoDataService');
    
    // Import database utilities
    const { isUsingInMemory, getInMemoryStore } = require('./config/db');
    
    if (isUsingInMemory()) {
      // Using in-memory store
      console.log('Initializing in-memory data store...');
      
      const inMemoryStore = getInMemoryStore();
      
      // Add sample climate data to in-memory store
      const tempData = nasaService.getSampleTemperatureData();
      const co2Data = nasaService.getSampleCO2Data();
      const seaLevelData = noaaService.getSampleSeaLevelData();
      const arcticIceData = noaaService.getSampleArcticIceData();
      const precipData = worldBankService.getSamplePrecipitationData();
      
      inMemoryStore.climateData.push(tempData);
      inMemoryStore.climateData.push(co2Data);
      inMemoryStore.climateData.push(seaLevelData);
      inMemoryStore.climateData.push(arcticIceData);
      inMemoryStore.climateData.push(precipData);
      
      // Add sample geo data to in-memory store
      const worldGeoData = geoDataService.getSampleWorldGeoData();
      
      inMemoryStore.geoData.push({
        name: 'world',
        type: worldGeoData.type,
        features: worldGeoData.features,
        metadata: worldGeoData.metadata
      });
      
      console.log('In-memory data store initialized with sample data');
    } else {
      // Using MongoDB
      // Import models
      const ClimateData = require('./models/ClimateData');
      const GeoData = require('./models/GeoData');
      
      // Check if we already have data in the database
      const dataCount = await ClimateData.countDocuments();
      
      if (dataCount === 0) {
        console.log('Initializing climate data in MongoDB...');
        
        // Fetch and store sample data
        try {
          const tempData = nasaService.getSampleTemperatureData();
          const co2Data = nasaService.getSampleCO2Data();
          const seaLevelData = noaaService.getSampleSeaLevelData();
          const arcticIceData = noaaService.getSampleArcticIceData();
          const precipData = worldBankService.getSamplePrecipitationData();
          
          await ClimateData.create(tempData);
          await ClimateData.create(co2Data);
          await ClimateData.create(seaLevelData);
          await ClimateData.create(arcticIceData);
          await ClimateData.create(precipData);
          
          console.log('Sample climate data initialized in MongoDB');
        } catch (error) {
          console.error('Error initializing climate data in MongoDB:', error);
        }
      }
      
      // Check if we already have geo data in the database
      const geoCount = await GeoData.countDocuments();
      
      if (geoCount === 0) {
        console.log('Initializing geo data in MongoDB...');
        
        try {
          const worldGeoData = geoDataService.getSampleWorldGeoData();
          
          await GeoData.create({
            name: 'world',
            type: worldGeoData.type,
            features: worldGeoData.features,
            metadata: worldGeoData.metadata
          });
          
          console.log('Sample geo data initialized in MongoDB');
        } catch (error) {
          console.error('Error initializing geo data in MongoDB:', error);
        }
      }
    }
  } catch (error) {
    console.error('Data initialization error:', error);
  }
};

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize data regardless of MongoDB connection
  // We'll use in-memory store if MongoDB is not available
  initializeData();
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying port ${parseInt(PORT) + 1}...`);
    // Try the next port
    app.listen(parseInt(PORT) + 1, () => {
      console.log(`Server running on port ${parseInt(PORT) + 1}`);
      
      // Update the environment variable for the frontend
      process.env.PORT = parseInt(PORT) + 1;
      
      // Initialize data regardless of MongoDB connection
      initializeData();
    });
  } else {
    console.error('Server error:', err);
  }
});