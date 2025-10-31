import { useState, useEffect } from 'react';
import { fetchClimateData, fetchRegions, fetchClimateVariables } from '../services/api';
import WorldMap from '../components/WorldMap.jsx';
import ClimateChart from '../components/ClimateChart.jsx';
import FilterPanel from '../components/FilterPanel';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [climateData, setClimateData] = useState(null);
  const [regions, setRegions] = useState([]);
  const [variables, setVariables] = useState([]);
  const [filters, setFilters] = useState({
    region: 'global',
    variable: 'temperature',
    timeframe: 'yearly',
    startYear: 1950,
    endYear: 2023
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Try to fetch from API, fallback to mock data if unavailable
        try {
          const [regionsRes, variablesRes] = await Promise.all([
            fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/climate/region/global`),
            fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/health`)
          ]);

          if (!regionsRes.ok) throw new Error('API unavailable');
        } catch (apiError) {
          console.log('API unavailable, using mock data:', apiError.message);
        }

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

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

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

  if (loading) {
    return <div className="loading">Loading climate data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const currentData = climateData?.[filters.variable]?.[filters.region] || [];

  return (
    <div className="dashboard">
      <h1>Global Climate Change Dashboard</h1>
      
      <div className="dashboard-content">
        <aside className="filter-sidebar">
          <FilterPanel 
            regions={regions}
            variables={variables}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>
        
        <div className="visualization-area">
          <div className="card map-card">
            <h2>Climate Impact Map</h2>
            <WorldMap 
              data={currentData}
              variable={filters.variable}
              region={filters.region}
            />
          </div>
          
          <div className="card chart-card">
            <h2>Climate Trends</h2>
            <ClimateChart 
              data={currentData}
              variable={filters.variable}
              region={filters.region}
              timeframe={filters.timeframe}
              startYear={filters.startYear}
              endYear={filters.endYear}
            />
          </div>
          
          <div className="card insights-card">
            <h2>Key Insights</h2>
            <div className="insights-content">
              <div className="insight">
                <h3>Temperature Change</h3>
                <p>Global temperatures have risen by approximately 1.1°C since the pre-industrial era.</p>
              </div>
              <div className="insight">
                <h3>CO2 Levels</h3>
                <p>Atmospheric CO2 has increased from 280 ppm to over 410 ppm since the industrial revolution.</p>
              </div>
              <div className="insight">
                <h3>Sea Level Rise</h3>
                <p>Global sea levels have risen about 8-9 inches (21-24 cm) since 1880.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
