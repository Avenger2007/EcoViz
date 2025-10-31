import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchClimateData, fetchRegions, fetchClimateVariables } from '../services/api';
import Globe3D from '../components/visualizations/Globe3D';
import ChoroplethMap from '../components/visualizations/ChoroplethMap';
import LineChart from '../components/visualizations/LineChart';
import BarChart from '../components/visualizations/BarChart';
import ScatterPlot from '../components/visualizations/ScatterPlot';
import TimeSeries from '../components/visualizations/TimeSeries';
import FilterPanel from '../components/FilterPanel';
import ComparisonPanel from '../components/ComparisonPanel';
import AnnotationTool from '../components/AnnotationTool';
import VisualizationSettings from '../components/VisualizationSettings';
import './EnhancedDashboard.css';

const EnhancedDashboard = () => {
  // State for data and loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [climateData, setClimateData] = useState(null);
  const [regions, setRegions] = useState([]);
  const [variables, setVariables] = useState([]);
  
  // State for UI
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTool, setActiveTool] = useState('filter');
  const [annotations, setAnnotations] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisons, setComparisons] = useState([]);
  
  // State for filters and settings
  const [filters, setFilters] = useState({
    region: 'global',
    variable: 'temperature',
    timeframe: 'yearly',
    startYear: 1950,
    endYear: 2023
  });
  
  const [settings, setSettings] = useState({
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
  });
  
  // Refs
  const chartRef = useRef(null);
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // For demonstration purposes, we'll use mock data
        // In a real application, you would fetch data from the API
        const mockRegions = [
          { id: 'global', name: 'Global' },
          { id: 'north-america', name: 'North America' },
          { id: 'europe', name: 'Europe' },
          { id: 'asia', name: 'Asia' },
          { id: 'africa', name: 'Africa' },
          { id: 'south-america', name: 'South America' },
          { id: 'oceania', name: 'Oceania' }
        ];
        
        const mockVariables = [
          { id: 'temperature', name: 'Temperature' },
          { id: 'co2', name: 'CO2 Levels' },
          { id: 'sea-level', name: 'Sea Level Rise' },
          { id: 'ice-sheets', name: 'Ice Sheet Mass' },
          { id: 'precipitation', name: 'Precipitation' }
        ];
        
        const mockClimateData = {
          temperature: {
            global: generateMockTimeSeriesData(1950, 2023, 0.01, 0.5),
            'north-america': generateMockTimeSeriesData(1950, 2023, 0.015, 0.6),
            europe: generateMockTimeSeriesData(1950, 2023, 0.02, 0.7),
            asia: generateMockTimeSeriesData(1950, 2023, 0.018, 0.65),
            africa: generateMockTimeSeriesData(1950, 2023, 0.016, 0.55),
            'south-america': generateMockTimeSeriesData(1950, 2023, 0.014, 0.5),
            oceania: generateMockTimeSeriesData(1950, 2023, 0.012, 0.45)
          },
          co2: {
            global: generateMockTimeSeriesData(1950, 2023, 1.5, 315, 'ppm')
          },
          'sea-level': {
            global: generateMockTimeSeriesData(1950, 2023, 0.3, 0, 'mm')
          }
        };
        
        setRegions(mockRegions);
        setVariables(mockVariables);
        setClimateData(mockClimateData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch climate data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);
  
  // Helper function to generate mock time series data
  function generateMockTimeSeriesData(startYear, endYear, increment, baseValue, unit = '°C') {
    const data = [];
    let value = baseValue;
    
    for (let year = startYear; year <= endYear; year++) {
      // Add some randomness to make the data look more realistic
      const randomFactor = Math.random() * 0.4 - 0.2; // Random value between -0.2 and 0.2
      value += increment + randomFactor;
      
      data.push({
        year,
        value: parseFloat(value.toFixed(2)),
        unit
      });
    }
    
    return data;
  }
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  // Handle settings changes
  const handleSettingsChange = (newSettings) => {
    setSettings({ ...settings, ...newSettings });
  };
  
  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle tool changes
  const handleToolChange = (tool) => {
    setActiveTool(tool);
  };
  
  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Handle annotation add
  const handleAddAnnotation = (annotation) => {
    setAnnotations([...annotations, annotation]);
  };
  
  // Handle annotation remove
  const handleRemoveAnnotation = (id) => {
    setAnnotations(annotations.filter(a => a.id !== id));
  };
  
  // Handle comparison
  const handleCompare = (comparisonData) => {
    setComparisons(comparisonData);
    setIsComparing(true);
  };
  
  // Handle exit comparison
  const handleExitComparison = () => {
    setIsComparing(false);
  };
  
  // Get current data based on filters
  const getCurrentData = () => {
    if (!climateData) return [];
    
    const variableData = climateData[filters.variable];
    if (!variableData) return [];
    
    const regionData = variableData[filters.region];
    if (!regionData) return [];
    
    return regionData.filter(item => 
      item.year >= filters.startYear && item.year <= filters.endYear
    );
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-globe">
          <div className="globe-spinner"></div>
        </div>
        <h2>Loading Climate Data...</h2>
        <p>Preparing your interactive dashboard experience</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  const currentData = getCurrentData();
  
  return (
    <div className="enhanced-dashboard">
      {/* Header with tabs */}
      <header className="dashboard-header">
        <h1>Global Climate Change Dashboard</h1>
        
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <i className="tab-icon overview-icon"></i>
            Overview
          </button>
          
          <button 
            className={`tab-button ${activeTab === 'maps' ? 'active' : ''}`}
            onClick={() => handleTabChange('maps')}
          >
            <i className="tab-icon maps-icon"></i>
            Maps
          </button>
          
          <button 
            className={`tab-button ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => handleTabChange('charts')}
          >
            <i className="tab-icon charts-icon"></i>
            Charts
          </button>
          
          <button 
            className={`tab-button ${activeTab === 'timeseries' ? 'active' : ''}`}
            onClick={() => handleTabChange('timeseries')}
          >
            <i className="tab-icon timeseries-icon"></i>
            Time Series
          </button>
          
          <button 
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => handleTabChange('upload')}
          >
            <i className="tab-icon upload-icon"></i>
            Upload Data
          </button>
        </div>
        
        <button 
          className="sidebar-toggle"
          onClick={handleSidebarToggle}
          title={sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
        >
          <i className={`sidebar-icon ${sidebarOpen ? 'open' : 'closed'}`}></i>
        </button>
      </header>
      
      <div className="dashboard-content">
        {/* Sidebar with tools */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside 
              className="dashboard-sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="sidebar-tools">
                <button 
                  className={`tool-button ${activeTool === 'filter' ? 'active' : ''}`}
                  onClick={() => handleToolChange('filter')}
                >
                  <i className="tool-icon filter-icon"></i>
                  Filters
                </button>
                
                <button 
                  className={`tool-button ${activeTool === 'compare' ? 'active' : ''}`}
                  onClick={() => handleToolChange('compare')}
                >
                  <i className="tool-icon compare-icon"></i>
                  Compare
                </button>
                
                <button 
                  className={`tool-button ${activeTool === 'settings' ? 'active' : ''}`}
                  onClick={() => handleToolChange('settings')}
                >
                  <i className="tool-icon settings-icon"></i>
                  Settings
                </button>
              </div>
              
              <div className="sidebar-content">
                {activeTool === 'filter' && (
                  <FilterPanel 
                    regions={regions}
                    variables={variables}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    advanced={true}
                  />
                )}
                
                {activeTool === 'compare' && (
                  <ComparisonPanel 
                    regions={regions}
                    variables={variables}
                    onCompare={handleCompare}
                  />
                )}
                
                {activeTool === 'settings' && (
                  <VisualizationSettings 
                    settings={settings}
                    onSettingsChange={handleSettingsChange}
                  />
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Main visualization area */}
        <main className="visualization-area">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                className="tab-content overview-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="overview-header">
                  <h2>Climate Change Overview</h2>
                  <p className="overview-description">
                    Explore global climate data through interactive visualizations. 
                    Use the sidebar tools to filter data, compare regions, and customize your view.
                  </p>
                </div>
                
                <div className="overview-globe-container">
                  <Globe3D 
                    data={currentData}
                    year={filters.endYear}
                    colorScale={filters.variable === 'temperature' ? 'temperature' : 'other'}
                    height={500}
                  />
                </div>
                
                <div className="overview-stats">
                  <div className="stat-card">
                    <h3>Temperature Change</h3>
                    <div className="stat-value">+{currentData[currentData.length - 1]?.value.toFixed(2)}°C</div>
                    <p>since pre-industrial era</p>
                  </div>
                  
                  <div className="stat-card">
                    <h3>CO2 Levels</h3>
                    <div className="stat-value">415 ppm</div>
                    <p>current atmospheric concentration</p>
                  </div>
                  
                  <div className="stat-card">
                    <h3>Sea Level Rise</h3>
                    <div className="stat-value">3.3 mm/year</div>
                    <p>current rate of increase</p>
                  </div>
                </div>
                
                <div className="overview-charts">
                  <div className="overview-chart" ref={chartRef}>
                    <h3>Global Temperature Trend</h3>
                    <LineChart 
                      data={currentData}
                      variable={filters.variable}
                      region={filters.region}
                      startYear={filters.startYear}
                      endYear={filters.endYear}
                      colorScheme={settings.colorScheme}
                      showTrendline={true}
                    />
                    <AnnotationTool 
                      chartRef={chartRef}
                      onAddAnnotation={handleAddAnnotation}
                      onRemoveAnnotation={handleRemoveAnnotation}
                      annotations={annotations}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Maps Tab */}
            {activeTab === 'maps' && (
              <motion.div 
                key="maps"
                className="tab-content maps-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Climate Impact Maps</h2>
                
                <div className="maps-container">
                  <div className="map-card">
                    <h3>3D Globe Visualization</h3>
                    <Globe3D 
                      data={currentData}
                      year={filters.endYear}
                      colorScale={filters.variable === 'temperature' ? 'temperature' : 'other'}
                    />
                  </div>
                  
                  <div className="map-card">
                    <h3>Choropleth Map</h3>
                    <ChoroplethMap 
                      data={currentData}
                      variable={filters.variable}
                      region={filters.region}
                      colorScheme={settings.colorScheme}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Charts Tab */}
            {activeTab === 'charts' && (
              <motion.div 
                key="charts"
                className="tab-content charts-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Climate Data Charts</h2>
                
                <div className="charts-container">
                  <div className="chart-card" ref={chartRef}>
                    {settings.chartType === 'line' && (
                      <LineChart 
                        data={currentData}
                        variable={filters.variable}
                        region={filters.region}
                        startYear={filters.startYear}
                        endYear={filters.endYear}
                        colorScheme={settings.colorScheme}
                        showTrendline={settings.showTrendline}
                      />
                    )}
                    
                    {settings.chartType === 'bar' && (
                      <BarChart 
                        data={currentData}
                        variable={filters.variable}
                        region={filters.region}
                        startYear={filters.startYear}
                        endYear={filters.endYear}
                        colorScheme={settings.colorScheme}
                      />
                    )}
                    
                    {settings.chartType === 'scatter' && (
                      <ScatterPlot 
                        data={currentData}
                        xVariable={filters.variable}
                        yVariable="co2"
                        region={filters.region}
                        startYear={filters.startYear}
                        endYear={filters.endYear}
                        colorScheme={settings.colorScheme}
                        showTrendline={settings.showTrendline}
                      />
                    )}
                    
                    <AnnotationTool 
                      chartRef={chartRef}
                      onAddAnnotation={handleAddAnnotation}
                      onRemoveAnnotation={handleRemoveAnnotation}
                      annotations={annotations}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Time Series Tab */}
            {activeTab === 'timeseries' && (
              <motion.div 
                key="timeseries"
                className="tab-content timeseries-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Climate Change Over Time</h2>
                
                <div className="timeseries-container">
                  <TimeSeries 
                    data={currentData}
                    variable={filters.variable}
                    region={filters.region}
                    startYear={filters.startYear}
                    endYear={filters.endYear}
                    colorScheme={settings.colorScheme}
                    animated={true}
                  />
                </div>
              </motion.div>
            )}
            
            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <motion.div 
                key="upload"
                className="tab-content upload-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Upload Your Climate Data</h2>
                
                <div className="upload-container">
                  <div className="upload-dropzone">
                    <i className="upload-icon"></i>
                    <h3>Drag & Drop Files Here</h3>
                    <p>or click to browse files</p>
                    <p className="upload-formats">Supported formats: CSV, JSON, Excel</p>
                    <input type="file" className="file-input" accept=".csv,.json,.xlsx,.xls" />
                  </div>
                  
                  <div className="upload-instructions">
                    <h3>Data Format Instructions</h3>
                    <p>
                      Your data should include columns for date/time, values, and optionally units.
                      For example:
                    </p>
                    <pre className="code-sample">
{`year,temperature,unit
1950,0.1,°C
1951,0.15,°C
1952,0.08,°C
...`}
                    </pre>
                    <p>
                      After uploading, you'll be able to map your data fields and customize how they're displayed.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      
      {/* Comparison overlay */}
      <AnimatePresence>
        {isComparing && (
          <motion.div 
            className="comparison-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="comparison-header">
              <h2>Data Comparison</h2>
              <button className="close-comparison" onClick={handleExitComparison}>×</button>
            </div>
            
            <div className="comparison-charts">
              {comparisons.map((comparison, index) => (
                <div key={comparison.id} className="comparison-chart">
                  <h3>{comparison.label}</h3>
                  <LineChart 
                    data={climateData[comparison.variable]?.[comparison.region] || []}
                    variable={comparison.variable}
                    region={comparison.region}
                    startYear={comparison.startYear}
                    endYear={comparison.endYear}
                    colorScheme={['blue', 'green', 'red', 'purple'][index % 4]}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedDashboard;
