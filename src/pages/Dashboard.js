import React, { useState, useEffect } from 'react';
import './Dashboard.css';

// Components
import WorldMap from '../components/WorldMap.js';
import ClimateChart from '../components/ClimateChart.jsx';
import DataCard from '../components/DataCard.js';
import FilterBar from '../components/FilterBar.js';

// API Services
import { 
  fetchTemperatureData, 
  fetchCO2Data, 
  fetchSeaLevelData, 
  fetchArcticIceData,
  fetchPrecipitationData,
  fetchWorldGeoData,
  fetchGlobalStats
} from '../services/api.js';

// Fallback to sample data if API fails
import { 
  globalTemperatureData, 
  co2ConcentrationData, 
  seaLevelRiseData,
  arcticIceData,
  worldGeoData,
  globalStats as sampleGlobalStats
} from '../utils/sampleData.js';

const Dashboard = () => {
  // State for filters
  const [filters, setFilters] = useState({
    dataType: 'temperature',
    timeRange: 'all',
    region: 'global'
  });

  // State for loading status
  const [loading, setLoading] = useState({
    chart: true,
    map: true,
    stats: true
  });

  // State for error messages
  const [error, setError] = useState({
    chart: null,
    map: null,
    stats: null
  });

  // State for map data
  const [mapData, setMapData] = useState(null);
  
  // State for chart data
  const [chartData, setChartData] = useState({
    temperature: null,
    co2: null,
    seaLevel: null,
    arcticIce: null,
    precipitation: null
  });

  // State for global stats
  const [stats, setStats] = useState(null);

  // Filter options
  const filterOptions = {
    'Data Type': [
      { label: 'Temperature', value: 'temperature' },
      { label: 'CO₂ Concentration', value: 'co2' },
      { label: 'Sea Level Rise', value: 'seaLevel' },
      { label: 'Arctic Ice', value: 'arcticIce' },
      { label: 'Precipitation', value: 'precipitation' }
    ],
    'Time Range': [
      { label: 'All Time', value: 'all' },
      { label: 'Last 100 Years', value: '100y' },
      { label: 'Last 50 Years', value: '50y' },
      { label: 'Last 10 Years', value: '10y' }
    ],
    'Region': [
      { label: 'Global', value: 'global' },
      { label: 'North America', value: 'NAM' },
      { label: 'Europe & Central Asia', value: 'ECS' },
      { label: 'Latin America', value: 'LAC' },
      { label: 'Middle East & N. Africa', value: 'MEA' },
      { label: 'Sub-Saharan Africa', value: 'SSA' },
      { label: 'South Asia', value: 'SAS' },
      { label: 'East Asia & Pacific', value: 'EAS' }
    ]
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  // Fetch global stats
  useEffect(() => {
    const getGlobalStats = async () => {
      setLoading(prev => ({ ...prev, stats: true }));
      setError(prev => ({ ...prev, stats: null }));
      
      try {
        const data = await fetchGlobalStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching global stats:', err);
        setError(prev => ({ ...prev, stats: 'Failed to load global statistics' }));
        // Use sample data as fallback
        setStats(sampleGlobalStats);
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };
    
    getGlobalStats();
  }, []);

  // Fetch map data
  useEffect(() => {
    const getMapData = async () => {
      setLoading(prev => ({ ...prev, map: true }));
      setError(prev => ({ ...prev, map: null }));
      
      try {
        const data = await fetchWorldGeoData(filters.dataType);
        setMapData(data);
      } catch (err) {
        console.error('Error fetching map data:', err);
        setError(prev => ({ ...prev, map: 'Failed to load map data' }));
        // Use sample data as fallback
        setMapData(worldGeoData);
      } finally {
        setLoading(prev => ({ ...prev, map: false }));
      }
    };
    
    getMapData();
  }, [filters.dataType]);

  // Fetch chart data based on filters
  useEffect(() => {
    const getChartData = async () => {
      setLoading(prev => ({ ...prev, chart: true }));
      setError(prev => ({ ...prev, chart: null }));
      
      // Determine time range parameters
      let timeRangeParams = null;
      if (filters.timeRange !== 'all') {
        const currentYear = new Date().getFullYear();
        let startYear;
        
        switch (filters.timeRange) {
          case '100y':
            startYear = currentYear - 100;
            break;
          case '50y':
            startYear = currentYear - 50;
            break;
          case '10y':
            startYear = currentYear - 10;
            break;
          default:
            startYear = 0;
        }
        
        timeRangeParams = {
          start: startYear,
          end: currentYear
        };
      }
      
      try {
        // Fetch data based on the selected data type and region
        let temperatureData = chartData.temperature;
        let co2Data = chartData.co2;
        let seaLevelData = chartData.seaLevel;
        let arcticIceData = chartData.arcticIce;
        let precipitationData = chartData.precipitation;
        
        // Only fetch the data that's needed based on the current filter
        if (filters.dataType === 'temperature' || !temperatureData) {
          try {
            temperatureData = await fetchTemperatureData(filters.region, timeRangeParams);
          } catch (err) {
            console.error('Error fetching temperature data:', err);
            temperatureData = { data: globalTemperatureData };
          }
        }
        
        if (filters.dataType === 'co2' || !co2Data) {
          try {
            co2Data = await fetchCO2Data(timeRangeParams);
          } catch (err) {
            console.error('Error fetching CO2 data:', err);
            co2Data = { data: co2ConcentrationData };
          }
        }
        
        if (filters.dataType === 'seaLevel' || !seaLevelData) {
          try {
            seaLevelData = await fetchSeaLevelData(timeRangeParams);
          } catch (err) {
            console.error('Error fetching sea level data:', err);
            seaLevelData = { data: seaLevelRiseData };
          }
        }
        
        if (filters.dataType === 'arcticIce' || !arcticIceData) {
          try {
            arcticIceData = await fetchArcticIceData(timeRangeParams);
          } catch (err) {
            console.error('Error fetching Arctic ice data:', err);
            arcticIceData = { data: arcticIceData };
          }
        }
        
        if (filters.dataType === 'precipitation' || !precipitationData) {
          try {
            precipitationData = await fetchPrecipitationData(filters.region, timeRangeParams);
          } catch (err) {
            console.error('Error fetching precipitation data:', err);
            // Simple fallback data for precipitation
            precipitationData = { 
              data: {
                labels: ['1980', '1990', '2000', '2010', '2020'],
                values: [1000, 980, 960, 940, 920]
              }
            };
          }
        }
        
        // Update chart data state
        setChartData({
          temperature: temperatureData,
          co2: co2Data,
          seaLevel: seaLevelData,
          arcticIce: arcticIceData,
          precipitation: precipitationData
        });
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(prev => ({ ...prev, chart: 'Failed to load chart data' }));
        
        // Use sample data as fallback
        setChartData({
          temperature: { data: globalTemperatureData },
          co2: { data: co2ConcentrationData },
          seaLevel: { data: seaLevelRiseData },
          arcticIce: { data: arcticIceData },
          precipitation: { 
            data: {
              labels: ['1980', '1990', '2000', '2010', '2020'],
              values: [1000, 980, 960, 940, 920]
            }
          }
        });
      } finally {
        setLoading(prev => ({ ...prev, chart: false }));
      }
    };
    
    getChartData();
  }, [filters.dataType, filters.region, filters.timeRange]);

  // Get chart configuration based on data type
  const getChartConfig = (dataType) => {
    switch (dataType) {
      case 'temperature':
        return {
          title: `${filters.region === 'global' ? 'Global' : 'Regional'} Temperature Anomaly`,
          xLabel: 'Year',
          yLabel: 'Temperature Anomaly (°C)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)'
        };
      case 'co2':
        return {
          title: 'Atmospheric CO₂ Concentration',
          xLabel: 'Year',
          yLabel: 'CO₂ (ppm)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)'
        };
      case 'seaLevel':
        return {
          title: 'Global Sea Level Rise',
          xLabel: 'Year',
          yLabel: 'Sea Level Change (mm)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)'
        };
      case 'arcticIce':
        return {
          title: 'Arctic Sea Ice Extent',
          xLabel: 'Year',
          yLabel: 'Ice Extent (million km²)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)'
        };
      case 'precipitation':
        return {
          title: `${filters.region === 'global' ? 'Global' : 'Regional'} Precipitation`,
          xLabel: 'Year',
          yLabel: 'Precipitation (mm)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)'
        };
      default:
        return {
          title: 'Climate Data',
          xLabel: 'Year',
          yLabel: 'Value',
          backgroundColor: 'rgba(44, 140, 153, 0.2)',
          borderColor: 'rgba(44, 140, 153, 1)'
        };
    }
  };

  // Get current chart data and config
  const currentChartData = chartData[filters.dataType]?.data || { labels: [], values: [] };
  const chartConfig = getChartConfig(filters.dataType);

  // Download data as CSV
  const downloadCSV = () => {
    if (!currentChartData || !currentChartData.labels || !currentChartData.values) return;
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Year,Value\n" 
      + currentChartData.labels.map((year, i) => `${year},${currentChartData.values[i]}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filters.dataType}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download data as JSON
  const downloadJSON = () => {
    if (!currentChartData || !currentChartData.labels || !currentChartData.values) return;
    
    const jsonData = {
      dataType: filters.dataType,
      region: filters.region,
      data: {
        labels: currentChartData.labels,
        values: currentChartData.values
      }
    };
    
    const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonContent);
    link.setAttribute("download", `${filters.dataType}_data.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download chart as image
  const downloadImage = () => {
    const chartElement = document.querySelector('.climate-chart-container canvas');
    if (!chartElement) return;
    
    const link = document.createElement("a");
    link.setAttribute("href", chartElement.toDataURL("image/png"));
    link.setAttribute("download", `${filters.dataType}_chart.png`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1 className="dashboard-title">Climate Change Dashboard</h1>
        
        {/* Filters */}
        <FilterBar 
          filters={filterOptions}
          activeFilters={{
            'Data Type': filters.dataType,
            'Time Range': filters.timeRange,
            'Region': filters.region
          }}
          onFilterChange={(type, value) => {
            const filterTypeMap = {
              'Data Type': 'dataType',
              'Time Range': 'timeRange',
              'Region': 'region'
            };
            handleFilterChange(filterTypeMap[type], value);
          }}
        />
        
        {/* Key Stats */}
        <section className="dashboard-stats">
          <h2 className="section-title">Key Climate Indicators</h2>
          {loading.stats ? (
            <div className="loading-indicator">Loading global statistics...</div>
          ) : error.stats ? (
            <div className="error-message">{error.stats}</div>
          ) : (
            <div className="stats-grid">
              <DataCard 
                title="Global Temperature"
                value={stats?.temperature?.value || sampleGlobalStats.temperature.value}
                unit={stats?.temperature?.unit || sampleGlobalStats.temperature.unit}
                icon="🌡️"
                trend={stats?.temperature?.trend || sampleGlobalStats.temperature.trend}
                description="Above pre-industrial levels"
                color="#FF6B6B"
              />
              <DataCard 
                title="CO₂ Concentration"
                value={stats?.co2?.value || sampleGlobalStats.co2.value}
                unit={stats?.co2?.unit || sampleGlobalStats.co2.unit}
                icon="💨"
                trend={stats?.co2?.trend || sampleGlobalStats.co2.trend}
                description="Atmospheric carbon dioxide"
                color="#4ECDC4"
              />
              <DataCard 
                title="Sea Level Rise"
                value={stats?.seaLevel?.value || sampleGlobalStats.seaLevel.value}
                unit={stats?.seaLevel?.unit || sampleGlobalStats.seaLevel.unit}
                icon="🌊"
                trend={stats?.seaLevel?.trend || sampleGlobalStats.seaLevel.trend}
                description="Annual rate of increase"
                color="#1A535C"
              />
              <DataCard 
                title="Arctic Ice Decline"
                value={stats?.arcticIce?.value || sampleGlobalStats.arcticIce.value}
                unit={stats?.arcticIce?.unit || sampleGlobalStats.arcticIce.unit}
                icon="❄️"
                trend={stats?.arcticIce?.trend || sampleGlobalStats.arcticIce.trend}
                description="Per decade since 1979"
                color="#4D9DE0"
              />
            </div>
          )}
        </section>
        
        {/* Map Visualization */}
        <section className="dashboard-map">
          <h2 className="section-title">Global Climate Map</h2>
          {loading.map ? (
            <div className="loading-indicator">Loading map data...</div>
          ) : error.map ? (
            <div className="error-message">{error.map}</div>
          ) : (
            <WorldMap data={mapData} mapType={filters.dataType} />
          )}
        </section>
        
        {/* Chart Visualizations */}
        <section className="dashboard-charts">
          <h2 className="section-title">Climate Trends</h2>
          {loading.chart ? (
            <div className="loading-indicator">Loading chart data...</div>
          ) : error.chart ? (
            <div className="error-message">{error.chart}</div>
          ) : (
            <div className="charts-grid">
              <div className="chart-card">
                <ClimateChart 
                  data={currentChartData}
                  title={chartConfig.title}
                  xLabel={chartConfig.xLabel}
                  yLabel={chartConfig.yLabel}
                  backgroundColor={chartConfig.backgroundColor}
                  borderColor={chartConfig.borderColor}
                />
              </div>
              
              <div className="chart-card">
                <div className="chart-info">
                  <h3 className="chart-title">{chartConfig.title} - Key Insights</h3>
                  <div className="chart-insights">
                    <div className="insight-item">
                      <h4>Current Trend</h4>
                      <p>
                        {filters.dataType === 'temperature' && 'Global temperatures continue to rise, with the last decade being the warmest on record.'}
                        {filters.dataType === 'co2' && 'CO₂ levels are at their highest in 800,000 years, with a sharp increase since the industrial revolution.'}
                        {filters.dataType === 'seaLevel' && 'Sea levels are rising at an accelerating rate due to thermal expansion and ice melt.'}
                        {filters.dataType === 'arcticIce' && 'Arctic sea ice is declining rapidly, with summer ice extent decreasing by about 13% per decade.'}
                        {filters.dataType === 'precipitation' && 'Precipitation patterns are changing globally, with some regions experiencing more rainfall and others facing increased drought conditions.'}
                      </p>
                    </div>
                    <div className="insight-item">
                      <h4>Potential Impacts</h4>
                      <p>
                        {filters.dataType === 'temperature' && 'Increased frequency of extreme weather events, shifts in ecosystems, and threats to food security.'}
                        {filters.dataType === 'co2' && 'Enhanced greenhouse effect leading to further warming, ocean acidification, and impacts on marine life.'}
                        {filters.dataType === 'seaLevel' && 'Coastal flooding, erosion, and displacement of populations in low-lying areas.'}
                        {filters.dataType === 'arcticIce' && 'Changes in global weather patterns, threats to Arctic wildlife, and potential release of methane from permafrost.'}
                        {filters.dataType === 'precipitation' && 'Increased flooding in some areas, drought and water scarcity in others, affecting agriculture, infrastructure, and human settlements.'}
                      </p>
                    </div>
                    <div className="insight-item">
                      <h4>Mitigation Strategies</h4>
                      <p>
                        {filters.dataType === 'temperature' && 'Reduce greenhouse gas emissions, transition to renewable energy, and implement sustainable land use practices.'}
                        {filters.dataType === 'co2' && 'Carbon capture technologies, reforestation, and reducing fossil fuel consumption.'}
                        {filters.dataType === 'seaLevel' && 'Coastal protection measures, managed retreat from vulnerable areas, and reducing greenhouse gas emissions.'}
                        {filters.dataType === 'arcticIce' && 'Reducing black carbon emissions, protecting Arctic ecosystems, and global climate action.'}
                        {filters.dataType === 'precipitation' && 'Improved water management systems, drought-resistant agriculture, and infrastructure designed for changing precipitation patterns.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
        
        {/* Download Section */}
        <section className="dashboard-download">
          <h2 className="section-title">Download Data</h2>
          <p className="download-description">
            Download the current dataset for further analysis or use in your own projects.
          </p>
          <div className="download-buttons">
            <button className="btn btn-primary" onClick={downloadCSV}>Download CSV</button>
            <button className="btn btn-secondary" onClick={downloadJSON}>Download JSON</button>
            <button className="btn btn-secondary" onClick={downloadImage}>Download Image</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;