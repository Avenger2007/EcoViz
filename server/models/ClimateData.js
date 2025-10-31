import mongoose from 'mongoose';
import { isUsingInMemory } from '../config/db.js';
import { ClimateData as InMemoryClimateData } from './inMemoryModels.js';

// Define the schema only if we're using MongoDB
let ClimateData;

if (!isUsingInMemory()) {
  const ClimateDataSchema = new mongoose.Schema({
    dataType: {
      type: String,
      required: true,
      enum: ['temperature', 'co2', 'seaLevel', 'arcticIce', 'precipitation', 'other']
    },
    source: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true,
      default: 'global'
    },
    timeRange: {
      start: {
        type: Number,
        required: true
      },
      end: {
        type: Number,
        required: true
      }
    },
    data: {
      labels: [String],
      values: [Number]
    },
    metadata: {
      unit: String,
      description: String,
      methodology: String,
      lastUpdated: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  try {
    // Try to create the model
    ClimateData = mongoose.model('ClimateData');
  } catch (e) {
    // Model doesn't exist yet, create it
    ClimateData = mongoose.model('ClimateData', ClimateDataSchema);
  }
} else {
  // Use in-memory implementation
  ClimateData = InMemoryClimateData;
}

export default ClimateData;
