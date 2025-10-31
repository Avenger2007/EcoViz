/**
 * In-memory model implementations for when MongoDB is not available
 * This provides a simple API compatible with Mongoose models
 */

import { getInMemoryStore } from '../config/db.js';

// Helper to generate a random ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Helper to find items in an array by criteria
const findByCriteria = (array, criteria) => {
  return array.filter(item => {
    for (const key in criteria) {
      // Handle special MongoDB operators
      if (key.startsWith('$')) {
        continue;
      }
      
      // Handle nested properties with dot notation
      if (key.includes('.')) {
        const parts = key.split('.');
        let value = item;
        for (const part of parts) {
          if (value === undefined || value === null) {
            return false;
          }
          value = value[part];
        }
        
        if (value !== criteria[key]) {
          return false;
        }
      } else if (item[key] !== criteria[key]) {
        return false;
      }
    }
    return true;
  });
};

// ClimateData model
const ClimateData = {
  find: async (criteria = {}) => {
    const store = getInMemoryStore();
    return findByCriteria(store.climateData, criteria);
  },
  
  findOne: async (criteria = {}) => {
    const store = getInMemoryStore();
    const results = findByCriteria(store.climateData, criteria);
    return results.length > 0 ? results[0] : null;
  },
  
  create: async (data) => {
    const store = getInMemoryStore();
    const newItem = {
      ...data,
      _id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    store.climateData.push(newItem);
    return newItem;
  },
  
  countDocuments: async () => {
    const store = getInMemoryStore();
    return store.climateData.length;
  }
};

// GeoData model
const GeoData = {
  find: async (criteria = {}) => {
    const store = getInMemoryStore();
    return findByCriteria(store.geoData, criteria);
  },
  
  findOne: async (criteria = {}) => {
    const store = getInMemoryStore();
    const results = findByCriteria(store.geoData, criteria);
    return results.length > 0 ? results[0] : null;
  },
  
  create: async (data) => {
    const store = getInMemoryStore();
    const newItem = {
      ...data,
      _id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    store.geoData.push(newItem);
    return newItem;
  },
  
  countDocuments: async () => {
    const store = getInMemoryStore();
    return store.geoData.length;
  }
};

// UserUpload model
const UserUpload = {
  find: async (criteria = {}) => {
    const store = getInMemoryStore();
    return findByCriteria(store.userUploads, criteria);
  },
  
  findOne: async (criteria = {}) => {
    const store = getInMemoryStore();
    const results = findByCriteria(store.userUploads, criteria);
    return results.length > 0 ? results[0] : null;
  },
  
  findById: async (id) => {
    const store = getInMemoryStore();
    return store.userUploads.find(item => item._id === id);
  },
  
  findByIdAndUpdate: async (id, update) => {
    const store = getInMemoryStore();
    const index = store.userUploads.findIndex(item => item._id === id);
    if (index !== -1) {
      store.userUploads[index] = {
        ...store.userUploads[index],
        ...update,
        updatedAt: new Date()
      };
      return store.userUploads[index];
    }
    return null;
  },
  
  create: async (data) => {
    const store = getInMemoryStore();
    const newItem = {
      ...data,
      _id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    store.userUploads.push(newItem);
    return newItem;
  }
};

export {
  ClimateData,
  GeoData,
  UserUpload
};
