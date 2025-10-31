import React, { useState, useEffect } from 'react';
import './DataUpload.css';
import { uploadDataset } from '../services/api.js';

const DataUpload = () => {
  const [file, setFile] = useState(null);
  const [dataType, setDataType] = useState('temperature');
  const [region, setRegion] = useState('global');
  const [timeRange, setTimeRange] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [recentUploads, setRecentUploads] = useState([]);
  const [loadingUploads, setLoadingUploads] = useState(false);

  // Fetch recent uploads
  useEffect(() => {
    const getRecentUploads = async () => {
      setLoadingUploads(true);
      try {
        // Since fetchUserUploads is not available, we'll use mock data for now
        // In a real application, you would implement this API endpoint
        const mockUploads = [
          { _id: '1', fileName: 'temperature_data.csv', status: 'approved', dataType: 'temperature', region: 'global', createdAt: new Date() },
          { _id: '2', fileName: 'co2_levels_2020.json', status: 'pending', dataType: 'co2', region: 'NAM', createdAt: new Date(Date.now() - 86400000) }
        ];
        setRecentUploads(mockUploads);
      } catch (error) {
        console.error('Error fetching recent uploads:', error);
      } finally {
        setLoadingUploads(false);
      }
    };
    
    getRecentUploads();
  }, [uploadSuccess]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadSuccess(false);
    setUploadError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!file) {
      setUploadError('Please select a file to upload');
      return;
    }
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataType', dataType);
    formData.append('region', region);
    formData.append('timeRange', timeRange);
    formData.append('description', description);
    
    setIsUploading(true);
    setUploadError('');
    
    try {
      // Send the file to the server
      const response = await uploadDataset(file);
      
      setUploadSuccess(true);
      
      // Reset form
      setFile(null);
      setTimeRange('');
      setDescription('');
      
      // Reset file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) {
        fileInput.value = '';
      }
      
      console.log('Upload successful:', response);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError(error.response?.data?.message || 'Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="data-upload-page">
      <div className="container">
        <h1 className="page-title">Upload Climate Data</h1>
        
        <div className="upload-container">
          <div className="upload-info">
            <h2>Data Upload Guidelines</h2>
            <p>
              Share your climate data with the community to enhance our collective understanding of climate change.
              Your contributions help create a more comprehensive and accurate dashboard.
            </p>
            
            <h3>Accepted File Formats</h3>
            <ul>
              <li><strong>CSV</strong> - Comma-separated values file</li>
              <li><strong>JSON</strong> - JavaScript Object Notation file</li>
              <li><strong>Excel</strong> - Microsoft Excel spreadsheet (.xlsx)</li>
            </ul>
            
            <h3>Data Structure Requirements</h3>
            <p>Your data should include:</p>
            <ul>
              <li>Time values (years, months, or dates)</li>
              <li>Measurement values</li>
              <li>Units of measurement</li>
              <li>Geographic information (if applicable)</li>
            </ul>
            
            <h3>Example Data Format</h3>
            <div className="code-example">
              <pre>
{`Year,Temperature (°C)
1990,14.35
1991,14.40
1992,14.25
...`}
              </pre>
            </div>
            
            <h3>Data Validation</h3>
            <p>
              All uploaded data undergoes validation to ensure quality and consistency.
              You will receive feedback if there are any issues with your data.
            </p>
            
            {/* Recent Uploads Section */}
            <h3>Recent Community Uploads</h3>
            {loadingUploads ? (
              <p>Loading recent uploads...</p>
            ) : recentUploads.length > 0 ? (
              <div className="recent-uploads">
                {recentUploads.map(upload => (
                  <div key={upload._id} className="recent-upload-item">
                    <div className="upload-item-header">
                      <span className="upload-item-name">{upload.fileName}</span>
                      <span className={`upload-item-status status-${upload.status}`}>
                        {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                      </span>
                    </div>
                    <div className="upload-item-details">
                      <span>Type: {upload.dataType}</span>
                      <span>Region: {upload.region}</span>
                      <span>Uploaded: {formatDate(upload.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recent uploads available.</p>
            )}
          </div>
          
          <div className="upload-form-container">
            <form className="upload-form" onSubmit={handleSubmit}>
              <h2>Upload Your Data</h2>
              
              <div className="form-group">
                <label htmlFor="file-upload">Select File</label>
                <input 
                  type="file" 
                  id="file-upload" 
                  accept=".csv,.json,.xlsx" 
                  onChange={handleFileChange}
                />
                {file && (
                  <div className="file-info">
                    <p>Selected file: {file.name}</p>
                    <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="data-type">Data Type</label>
                <select 
                  id="data-type" 
                  value={dataType} 
                  onChange={(e) => setDataType(e.target.value)}
                >
                  <option value="temperature">Temperature</option>
                  <option value="co2">CO₂ Concentration</option>
                  <option value="seaLevel">Sea Level</option>
                  <option value="precipitation">Precipitation</option>
                  <option value="arcticIce">Arctic Ice</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="region">Region</label>
                <select 
                  id="region" 
                  value={region} 
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="global">Global</option>
                  <option value="NAM">North America</option>
                  <option value="LAC">Latin America & Caribbean</option>
                  <option value="ECS">Europe & Central Asia</option>
                  <option value="MEA">Middle East & North Africa</option>
                  <option value="SSA">Sub-Saharan Africa</option>
                  <option value="SAS">South Asia</option>
                  <option value="EAS">East Asia & Pacific</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="time-range">Time Range</label>
                <input 
                  type="text" 
                  id="time-range" 
                  placeholder="e.g., 1990-2020" 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  placeholder="Provide a brief description of your data..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              
              {uploadError && <div className="error-message">{uploadError}</div>}
              {uploadSuccess && (
                <div className="success-message">
                  Data uploaded successfully! Thank you for your contribution.
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn btn-primary upload-button"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Data'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;