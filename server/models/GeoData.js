import mongoose from 'mongoose';
import { isUsingInMemory } from '../config/db.js';
import { GeoData as InMemoryGeoData } from './inMemoryModels.js';

// Define the schema only if we're using MongoDB
let GeoData;

if (!isUsingInMemory()) {
  const GeoDataSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      default: 'FeatureCollection'
    },
    features: [{
      type: {
        type: String,
        required: true,
        default: 'Feature'
      },
      properties: {
        name: String,
        temperature: Number,
        precipitation: Number,
        co2: Number,
        year: Number,
        description: String
      },
      geometry: {
        type: {
          type: String,
          required: true,
          enum: ['Point', 'Polygon', 'MultiPolygon']
        },
        coordinates: {
          type: mongoose.Schema.Types.Mixed,
          required: true
        }
      }
    }],
    metadata: {
      source: String,
      description: String,
      year: Number,
      lastUpdated: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  try {
    // Try to create the model
    GeoData = mongoose.model('GeoData');
  } catch (e) {
    // Model doesn't exist yet, create it
    GeoData = mongoose.model('GeoData', GeoDataSchema);
  }
} else {
  // Use in-memory implementation
  GeoData = InMemoryGeoData;
}

export default GeoData;
