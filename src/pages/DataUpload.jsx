import { useState, useRef } from 'react';
import { uploadDataset } from '../services/api';
import './DataUpload.css';

const DataUpload = () => {
  const [file, setFile] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [datasetDescription, setDatasetDescription] = useState('');
  const [datasetType, setDatasetType] = useState('temperature');
  const [region, setRegion] = useState('global');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [dataFormat, setDataFormat] = useState('csv');
  const [customFields, setCustomFields] = useState({
    dateField: 'year',
    valueField: 'value',
    unitField: 'unit'
  });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      // Determine file format from extension
      const extension = selectedFile.name.split('.').pop().toLowerCase();
      if (extension === 'json') {
        setDataFormat('json');
      } else if (extension === 'csv') {
        setDataFormat('csv');
      } else if (extension === 'xlsx' || extension === 'xls') {
        setDataFormat('excel');
      }

      // Generate preview for CSV files
      if (extension === 'csv') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const csvContent = event.target.result;
          // Get first few lines for preview
          const lines = csvContent.split('\\n').slice(0, 10);
          setFilePreview(lines);
        };
        reader.readAsText(selectedFile);
      } else if (extension === 'json') {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonContent = JSON.parse(event.target.result);
            // Format JSON for preview
            setFilePreview(JSON.stringify(jsonContent, null, 2).split('\\n').slice(0, 20));
          } catch (err) {
            setError('Invalid JSON file');
            setFilePreview(null);
          }
        };
        reader.readAsText(selectedFile);
      } else {
        setFilePreview(null);
      }
    } else {
      setFilePreview(null);
    }
  };

  const handleCustomFieldChange = (field, value) => {
    setCustomFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    if (!datasetName) {
      setError('Please provide a name for your dataset.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create form data with all fields
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', datasetName);
      formData.append('description', datasetDescription);
      formData.append('type', datasetType);
      formData.append('region', region);
      formData.append('format', dataFormat);
      formData.append('customFields', JSON.stringify(customFields));

      // In a real application, you would upload the file to the server using the API
      // For this example, we'll just simulate a successful upload
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);

        // Reset form
        setFile(null);
        setFilePreview(null);
        setDatasetName('');
        setDatasetDescription('');
        setDatasetType('temperature');
        setRegion('global');
        setDataFormat('csv');
        setCustomFields({
          dateField: 'year',
          valueField: 'value',
          unitField: 'unit'
        });

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);

      // In a real application, you would use the API like this:
      // const response = await uploadDataset(formData);
      // if (response.success) {
      //   setSuccess(true);
      //   // Reset form...
      // } else {
      //   setError(response.error || 'Failed to upload dataset');
      // }

    } catch (err) {
      setLoading(false);
      setError('Failed to upload dataset. Please try again later.');
      console.error('Error uploading dataset:', err);
    }
  };

  return (
    <div className="data-upload-page">
      <div className="container">
        <h1>Upload Your Climate Data</h1>

        <div className="upload-container">
          <div className="upload-instructions card">
            <h2>Instructions</h2>
            <p>
              Share your climate data with the EcoViz community. Your uploaded datasets will be available
              for visualization and analysis on the dashboard.
            </p>

            <h3>Accepted File Formats</h3>
            <ul>
              <li>CSV (Comma-Separated Values)</li>
              <li>JSON (JavaScript Object Notation)</li>
              <li>Excel (.xlsx, .xls)</li>
            </ul>

            <h3>Data Requirements</h3>
            <ul>
              <li>Time series data must include a date or year column</li>
              <li>Geographic data must include latitude and longitude coordinates</li>
              <li>Variable names should be clearly labeled</li>
              <li>Units of measurement should be specified</li>
            </ul>

            <h3>Sample Data Format</h3>
            <div className="code-sample">
              <pre>
{`year,temperature,unit
1950,0.1,°C
1951,0.15,°C
1952,0.08,°C
...`}
              </pre>
            </div>
          </div>

          <div className="upload-form card">
            <h2>Upload Form</h2>

            {success ? (
              <div className="success-message">
                <h3>Upload Successful!</h3>
                <p>Your dataset has been uploaded successfully and is now being processed.</p>
                <p>It will be available for visualization on the dashboard soon.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setSuccess(false)}
                >
                  Upload Another Dataset
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <label htmlFor="file-upload">Select File</label>
                  <input
                    type="file"
                    id="file-upload"
                    ref={fileInputRef}
                    accept=".csv,.json,.xlsx,.xls"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                {filePreview && (
                  <div className="form-group file-preview">
                    <label>File Preview</label>
                    <div className="preview-container">
                      <pre>
                        {filePreview.join('\n')}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="dataset-name">Dataset Name</label>
                  <input
                    type="text"
                    id="dataset-name"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    required
                    placeholder="e.g., Global Temperature Data 1950-2020"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dataset-description">Description</label>
                  <textarea
                    id="dataset-description"
                    value={datasetDescription}
                    onChange={(e) => setDatasetDescription(e.target.value)}
                    placeholder="Briefly describe your dataset, its source, and any relevant information."
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="dataset-type">Data Type</label>
                  <select
                    id="dataset-type"
                    value={datasetType}
                    onChange={(e) => setDatasetType(e.target.value)}
                  >
                    <option value="temperature">Temperature</option>
                    <option value="co2">CO2 Levels</option>
                    <option value="sea-level">Sea Level Rise</option>
                    <option value="ice-sheets">Ice Sheet Mass</option>
                    <option value="precipitation">Precipitation</option>
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
                    <option value="north-america">North America</option>
                    <option value="europe">Europe</option>
                    <option value="asia">Asia</option>
                    <option value="africa">Africa</option>
                    <option value="south-america">South America</option>
                    <option value="oceania">Oceania</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="data-format">Data Format</label>
                  <select
                    id="data-format"
                    value={dataFormat}
                    onChange={(e) => setDataFormat(e.target.value)}
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="excel">Excel</option>
                  </select>
                </div>

                <div className="field-mapping">
                  <h3>Field Mapping</h3>
                  <p className="field-mapping-info">
                    Specify which columns in your data correspond to date/time, values, and units.
                  </p>

                  <div className="form-group">
                    <label htmlFor="date-field">Date/Time Field</label>
                    <input
                      type="text"
                      id="date-field"
                      value={customFields.dateField}
                      onChange={(e) => handleCustomFieldChange('dateField', e.target.value)}
                      placeholder="e.g., year, date, time"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="value-field">Value Field</label>
                    <input
                      type="text"
                      id="value-field"
                      value={customFields.valueField}
                      onChange={(e) => handleCustomFieldChange('valueField', e.target.value)}
                      placeholder="e.g., temperature, co2, value"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="unit-field">Unit Field</label>
                    <input
                      type="text"
                      id="unit-field"
                      value={customFields.unitField}
                      onChange={(e) => handleCustomFieldChange('unitField', e.target.value)}
                      placeholder="e.g., unit, units, measurement"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Uploading...' : 'Upload Dataset'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;
