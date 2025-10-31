import UserUpload from '../models/UserUpload.js';
import ClimateData from '../models/ClimateData.js';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

/**
 * Upload a climate data file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { dataType, region, timeRange, description } = req.body;
    
    // Create a new upload record
    const newUpload = new UserUpload({
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      dataType: dataType || 'other',
      region: region || 'global',
      timeRange: timeRange || '',
      description: description || '',
      status: 'pending'
    });
    
    await newUpload.save();
    
    // Process the file based on its type
    if (req.file.mimetype === 'text/csv' || req.file.originalname.endsWith('.csv')) {
      // Process CSV file
      processCSVFile(req.file.path, newUpload._id);
    } else if (req.file.mimetype === 'application/json' || req.file.originalname.endsWith('.json')) {
      // Process JSON file
      processJSONFile(req.file.path, newUpload._id);
    } else {
      // For other file types, just store the upload record
      console.log(`File type ${req.file.mimetype} not processed automatically`);
    }
    
    res.status(201).json({
      message: 'File uploaded successfully',
      upload: {
        id: newUpload._id,
        fileName: newUpload.fileName,
        status: newUpload.status
      }
    });
  } catch (error) {
    console.error('Error in uploadFile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Process a CSV file and extract climate data
 * @param {string} filePath - Path to the CSV file
 * @param {string} uploadId - ID of the upload record
 */
const processCSVFile = async (filePath, uploadId) => {
  try {
    const results = [];
    
    // Read and parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        // Process the data
        if (results.length > 0) {
          // Try to determine the data structure
          const firstRow = results[0];
          const keys = Object.keys(firstRow);
          
          // Look for year/date column and value column
          let yearColumn = keys.find(key => 
            key.toLowerCase().includes('year') || 
            key.toLowerCase().includes('date') ||
            key.toLowerCase().includes('time')
          );
          
          let valueColumn = keys.find(key => 
            key.toLowerCase().includes('value') || 
            key.toLowerCase().includes('temp') ||
            key.toLowerCase().includes('co2') ||
            key.toLowerCase().includes('level') ||
            key.toLowerCase().includes('ice') ||
            key.toLowerCase().includes('precip')
          );
          
          // If we couldn't identify columns, use the first two columns
          if (!yearColumn) yearColumn = keys[0];
          if (!valueColumn) valueColumn = keys[1];
          
          // Extract data
          const labels = results.map(row => row[yearColumn].toString());
          const values = results.map(row => parseFloat(row[valueColumn]));
          
          // Update the upload record with the extracted data
          await UserUpload.findByIdAndUpdate(uploadId, {
            data: {
              labels,
              values
            },
            status: 'approved'
          });
          
          console.log(`Processed CSV file for upload ${uploadId}`);
        }
        
        // Clean up the temporary file
        fs.unlinkSync(filePath);
      });
  } catch (error) {
    console.error('Error processing CSV file:', error);
    
    // Update the upload record with the error
    await UserUpload.findByIdAndUpdate(uploadId, {
      status: 'rejected',
      description: `Error processing file: ${error.message}`
    });
    
    // Clean up the temporary file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

/**
 * Process a JSON file and extract climate data
 * @param {string} filePath - Path to the JSON file
 * @param {string} uploadId - ID of the upload record
 */
const processJSONFile = async (filePath, uploadId) => {
  try {
    // Read the JSON file
    const fileData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileData);
    
    // Try to determine the data structure
    let labels = [];
    let values = [];
    
    if (Array.isArray(jsonData)) {
      // Array of objects with year/date and value properties
      const yearKey = Object.keys(jsonData[0]).find(key => 
        key.toLowerCase().includes('year') || 
        key.toLowerCase().includes('date') ||
        key.toLowerCase().includes('time')
      );
      
      const valueKey = Object.keys(jsonData[0]).find(key => 
        key.toLowerCase().includes('value') || 
        key.toLowerCase().includes('temp') ||
        key.toLowerCase().includes('co2') ||
        key.toLowerCase().includes('level') ||
        key.toLowerCase().includes('ice') ||
        key.toLowerCase().includes('precip')
      );
      
      if (yearKey && valueKey) {
        labels = jsonData.map(item => item[yearKey].toString());
        values = jsonData.map(item => parseFloat(item[valueKey]));
      }
    } else if (jsonData.labels && jsonData.values) {
      // Object with labels and values arrays
      labels = jsonData.labels;
      values = jsonData.values;
    } else if (jsonData.data && Array.isArray(jsonData.data)) {
      // Object with data array
      const yearKey = Object.keys(jsonData.data[0]).find(key => 
        key.toLowerCase().includes('year') || 
        key.toLowerCase().includes('date') ||
        key.toLowerCase().includes('time')
      );
      
      const valueKey = Object.keys(jsonData.data[0]).find(key => 
        key.toLowerCase().includes('value') || 
        key.toLowerCase().includes('temp') ||
        key.toLowerCase().includes('co2') ||
        key.toLowerCase().includes('level') ||
        key.toLowerCase().includes('ice') ||
        key.toLowerCase().includes('precip')
      );
      
      if (yearKey && valueKey) {
        labels = jsonData.data.map(item => item[yearKey].toString());
        values = jsonData.data.map(item => parseFloat(item[valueKey]));
      }
    }
    
    // Update the upload record with the extracted data
    if (labels.length > 0 && values.length > 0) {
      await UserUpload.findByIdAndUpdate(uploadId, {
        data: {
          labels,
          values
        },
        status: 'approved'
      });
      
      console.log(`Processed JSON file for upload ${uploadId}`);
    } else {
      await UserUpload.findByIdAndUpdate(uploadId, {
        status: 'rejected',
        description: 'Could not extract data from JSON file'
      });
    }
    
    // Clean up the temporary file
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error processing JSON file:', error);
    
    // Update the upload record with the error
    await UserUpload.findByIdAndUpdate(uploadId, {
      status: 'rejected',
      description: `Error processing file: ${error.message}`
    });
    
    // Clean up the temporary file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

/**
 * Get all user uploads
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserUploads = async (req, res) => {
  try {
    const uploads = await UserUpload.find().sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    console.error('Error in getUserUploads:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a specific user upload by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserUploadById = async (req, res) => {
  try {
    const { id } = req.params;
    const upload = await UserUpload.findById(id);
    
    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    
    res.json(upload);
  } catch (error) {
    console.error('Error in getUserUploadById:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Approve a user upload and convert it to climate data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const approveUserUpload = async (req, res) => {
  try {
    const { id } = req.params;
    const upload = await UserUpload.findById(id);
    
    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    
    if (upload.status === 'approved') {
      return res.status(400).json({ message: 'Upload already approved' });
    }
    
    // Update the upload status
    upload.status = 'approved';
    await upload.save();
    
    // Create a new climate data record from the upload
    if (upload.data && upload.data.labels && upload.data.values) {
      const climateData = new ClimateData({
        dataType: upload.dataType,
        source: `User Upload: ${upload.fileName}`,
        region: upload.region,
        timeRange: {
          start: parseInt(upload.data.labels[0]),
          end: parseInt(upload.data.labels[upload.data.labels.length - 1])
        },
        data: {
          labels: upload.data.labels,
          values: upload.data.values
        },
        metadata: {
          unit: determineUnit(upload.dataType),
          description: upload.description || `User uploaded ${upload.dataType} data`,
          methodology: 'User contributed data',
          lastUpdated: new Date()
        }
      });
      
      await climateData.save();
    }
    
    res.json({ message: 'Upload approved successfully', upload });
  } catch (error) {
    console.error('Error in approveUserUpload:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Reject a user upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const rejectUserUpload = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const upload = await UserUpload.findById(id);
    
    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    
    // Update the upload status
    upload.status = 'rejected';
    upload.description = reason || 'Rejected by administrator';
    await upload.save();
    
    res.json({ message: 'Upload rejected', upload });
  } catch (error) {
    console.error('Error in rejectUserUpload:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Helper function to determine the unit based on data type
 * @param {string} dataType - Type of climate data
 * @returns {string} - Appropriate unit for the data type
 */
const determineUnit = (dataType) => {
  switch (dataType) {
    case 'temperature':
      return '°C';
    case 'co2':
      return 'ppm';
    case 'seaLevel':
      return 'mm';
    case 'arcticIce':
      return 'million km²';
    case 'precipitation':
      return 'mm';
    default:
      return '';
  }
};

export {
  uploadFile,
  getUserUploads,
  getUserUploadById,
  approveUserUpload,
  rejectUserUpload
};
