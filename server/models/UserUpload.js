import mongoose from 'mongoose';
import { isUsingInMemory } from '../config/db.js';
import { UserUpload as InMemoryUserUpload } from './inMemoryModels.js';

// Define the schema only if we're using MongoDB
let UserUpload;

if (!isUsingInMemory()) {
  const UserUploadSchema = new mongoose.Schema({
    fileName: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    dataType: {
      type: String,
      required: true,
      enum: ['temperature', 'co2', 'seaLevel', 'arcticIce', 'precipitation', 'other']
    },
    region: {
      type: String,
      required: true
    },
    timeRange: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    data: {
      type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  try {
    // Try to create the model
    UserUpload = mongoose.model('UserUpload');
  } catch (e) {
    // Model doesn't exist yet, create it
    UserUpload = mongoose.model('UserUpload', UserUploadSchema);
  }
} else {
  // Use in-memory implementation
  UserUpload = InMemoryUserUpload;
}

export default UserUpload;
