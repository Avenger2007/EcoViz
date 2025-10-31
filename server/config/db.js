import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// In-memory data store for when MongoDB is not available
const inMemoryStore = {
  climateData: [],
  geoData: [],
  userUploads: []
};

// Global flag to track if we're using in-memory mode
let usingInMemory = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/climate-dashboard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Reduce timeout for faster feedback
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    usingInMemory = false;
    return true;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('Falling back to in-memory data store for development');
    usingInMemory = true;
    return false;
  }
};

// Check if we're using in-memory mode
const isUsingInMemory = () => {
  return usingInMemory;
};

// Get the in-memory data store
const getInMemoryStore = () => {
  return inMemoryStore;
};

export { connectDB, isUsingInMemory, getInMemoryStore };