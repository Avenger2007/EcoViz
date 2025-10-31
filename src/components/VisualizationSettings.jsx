import { useState } from 'react';
import './VisualizationSettings.css';

const VisualizationSettings = ({ 
  settings, 
  onSettingsChange,
  onApplySettings
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
    
    // If not using apply button, update settings immediately
    if (!onApplySettings) {
      onSettingsChange({ [name]: value });
    }
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: checked }));
    
    // If not using apply button, update settings immediately
    if (!onApplySettings) {
      onSettingsChange({ [name]: checked });
    }
  };
  
  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    setLocalSettings(prev => ({ ...prev, [name]: numValue }));
    
    // If not using apply button, update settings immediately
    if (!onApplySettings) {
      onSettingsChange({ [name]: numValue });
    }
  };
  
  const handleApply = () => {
    if (onApplySettings) {
      onApplySettings(localSettings);
    } else {
      onSettingsChange(localSettings);
    }
  };
  
  return (
    <div className="visualization-settings">
      <h2>Visualization Settings</h2>
      
      <div className="settings-section">
        <h3>Chart Type</h3>
        <div className="chart-type-options">
          <div 
            className={`chart-type-option ${localSettings.chartType === 'line' ? 'selected' : ''}`}
            onClick={() => {
              setLocalSettings(prev => ({ ...prev, chartType: 'line' }));
              if (!onApplySettings) {
                onSettingsChange({ chartType: 'line' });
              }
            }}
          >
            <div className="chart-type-icon line-chart-icon"></div>
            <span>Line</span>
          </div>
          
          <div 
            className={`chart-type-option ${localSettings.chartType === 'bar' ? 'selected' : ''}`}
            onClick={() => {
              setLocalSettings(prev => ({ ...prev, chartType: 'bar' }));
              if (!onApplySettings) {
                onSettingsChange({ chartType: 'bar' });
              }
            }}
          >
            <div className="chart-type-icon bar-chart-icon"></div>
            <span>Bar</span>
          </div>
          
          <div 
            className={`chart-type-option ${localSettings.chartType === 'scatter' ? 'selected' : ''}`}
            onClick={() => {
              setLocalSettings(prev => ({ ...prev, chartType: 'scatter' }));
              if (!onApplySettings) {
                onSettingsChange({ chartType: 'scatter' });
              }
            }}
          >
            <div className="chart-type-icon scatter-chart-icon"></div>
            <span>Scatter</span>
          </div>
          
          <div 
            className={`chart-type-option ${localSettings.chartType === 'pie' ? 'selected' : ''}`}
            onClick={() => {
              setLocalSettings(prev => ({ ...prev, chartType: 'pie' }));
              if (!onApplySettings) {
                onSettingsChange({ chartType: 'pie' });
              }
            }}
          >
            <div className="chart-type-icon pie-chart-icon"></div>
            <span>Pie</span>
          </div>
          
          <div 
            className={`chart-type-option ${localSettings.chartType === 'map' ? 'selected' : ''}`}
            onClick={() => {
              setLocalSettings(prev => ({ ...prev, chartType: 'map' }));
              if (!onApplySettings) {
                onSettingsChange({ chartType: 'map' });
              }
            }}
          >
            <div className="chart-type-icon map-icon"></div>
            <span>Map</span>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Color Scheme</h3>
        <div className="color-scheme-options">
          <div 
            className={`color-option ${localSettings.colorScheme === 'blue' ? 'selected' : ''}`}
            style={{ backgroundColor: '#1e88e5' }}
            onClick={() => {
              setLocalSettings(prev => ({ ...prev, colorScheme: 'blue' }));
              if (!onApplySettings) {
                onSettingsChange({ colorScheme: 'blue' });
              }
            }}
          ></div>
          
          <div 
            className={`color-option ${localSettings.colorScheme === 'green' ? 'selected' : ''}`}
            style={{ backgroundColor: '#43a047' }}
            onClick={() => {
              setLocalSettings(prev => ({ ...prev, colorScheme: 'green' }));
              if (!onApplySettings) {
                onSettingsChange({ colorScheme: 'green' });
              }
            }}
          ></div>
          
          <div 
            className={`color-option ${localSettings.colorScheme === 'red' ? 'selected' : ''}`}
            style={{ backgroundColor: '#e53935' }}
            onClick={() => {
              setLocalSettings(prev => ({ ...prev, colorScheme: 'red' }));
              if (!onApplySettings) {
                onSettingsChange({ colorScheme: 'red' });
              }
            }}
          ></div>
          
          <div 
            className={`color-option ${localSettings.colorScheme === 'purple' ? 'selected' : ''}`}
            style={{ backgroundColor: '#8e24aa' }}
            onClick={() => {
              setLocalSettings(prev => ({ ...prev, colorScheme: 'purple' }));
              if (!onApplySettings) {
                onSettingsChange({ colorScheme: 'purple' });
              }
            }}
          ></div>
          
          <div 
            className={`color-option ${localSettings.colorScheme === 'orange' ? 'selected' : ''}`}
            style={{ backgroundColor: '#fb8c00' }}
            onClick={() => {
              setLocalSettings(prev => ({ ...prev, colorScheme: 'orange' }));
              if (!onApplySettings) {
                onSettingsChange({ colorScheme: 'orange' });
              }
            }}
          ></div>
          
          <div 
            className={`color-option ${localSettings.colorScheme === 'temperature' ? 'selected' : ''}`}
            style={{ background: 'linear-gradient(to right, #2196f3, #f44336)' }}
            onClick={() => {
              setLocalSettings(prev => ({ ...prev, colorScheme: 'temperature' }));
              if (!onApplySettings) {
                onSettingsChange({ colorScheme: 'temperature' });
              }
            }}
          ></div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Display Options</h3>
        
        <div className="settings-option checkbox">
          <label>
            <input 
              type="checkbox" 
              name="showLegend" 
              checked={localSettings.showLegend} 
              onChange={handleCheckboxChange}
            />
            Show Legend
          </label>
        </div>
        
        <div className="settings-option checkbox">
          <label>
            <input 
              type="checkbox" 
              name="showGrid" 
              checked={localSettings.showGrid} 
              onChange={handleCheckboxChange}
            />
            Show Grid
          </label>
        </div>
        
        <div className="settings-option checkbox">
          <label>
            <input 
              type="checkbox" 
              name="showTrendline" 
              checked={localSettings.showTrendline} 
              onChange={handleCheckboxChange}
            />
            Show Trend Line
          </label>
        </div>
        
        <div className="settings-option checkbox">
          <label>
            <input 
              type="checkbox" 
              name="animated" 
              checked={localSettings.animated} 
              onChange={handleCheckboxChange}
            />
            Animated Visualization
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Chart Size</h3>
        
        <div className="settings-option">
          <label htmlFor="chartHeight">Height</label>
          <div className="range-with-value">
            <input 
              type="range" 
              id="chartHeight" 
              name="chartHeight" 
              min="200" 
              max="800" 
              step="50" 
              value={localSettings.chartHeight} 
              onChange={handleRangeChange}
            />
            <span className="range-value">{localSettings.chartHeight}px</span>
          </div>
        </div>
        
        <div className="settings-option">
          <label htmlFor="chartWidth">Width</label>
          <div className="range-with-value">
            <input 
              type="range" 
              id="chartWidth" 
              name="chartWidth" 
              min="300" 
              max="1200" 
              step="50" 
              value={localSettings.chartWidth} 
              onChange={handleRangeChange}
            />
            <span className="range-value">{localSettings.chartWidth}px</span>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Data Display</h3>
        
        <div className="settings-option">
          <label htmlFor="dataPointSize">Data Point Size</label>
          <div className="range-with-value">
            <input 
              type="range" 
              id="dataPointSize" 
              name="dataPointSize" 
              min="1" 
              max="10" 
              value={localSettings.dataPointSize} 
              onChange={handleRangeChange}
            />
            <span className="range-value">{localSettings.dataPointSize}px</span>
          </div>
        </div>
        
        <div className="settings-option">
          <label htmlFor="lineThickness">Line Thickness</label>
          <div className="range-with-value">
            <input 
              type="range" 
              id="lineThickness" 
              name="lineThickness" 
              min="1" 
              max="5" 
              value={localSettings.lineThickness} 
              onChange={handleRangeChange}
            />
            <span className="range-value">{localSettings.lineThickness}px</span>
          </div>
        </div>
      </div>
      
      {onApplySettings && (
        <button 
          className="btn btn-primary apply-settings" 
          onClick={handleApply}
        >
          Apply Settings
        </button>
      )}
    </div>
  );
};

// Default settings
VisualizationSettings.defaultProps = {
  settings: {
    chartType: 'line',
    colorScheme: 'blue',
    showLegend: true,
    showGrid: true,
    showTrendline: false,
    animated: false,
    chartHeight: 400,
    chartWidth: 800,
    dataPointSize: 4,
    lineThickness: 2
  }
};

export default VisualizationSettings;
