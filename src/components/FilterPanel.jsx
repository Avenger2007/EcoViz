import { useState, useEffect } from 'react';
import './FilterPanel.css';

const FilterPanel = ({
  regions,
  variables,
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  advanced = false
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));

    // If not using apply button, update filters immediately
    if (!onApplyFilters) {
      onFilterChange({ [name]: value });
    }
  };

  const handleYearChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);

    // Validate year range
    if (name === 'startYear' && numValue > localFilters.endYear) {
      return;
    }
    if (name === 'endYear' && numValue < localFilters.startYear) {
      return;
    }

    setLocalFilters(prev => ({ ...prev, [name]: numValue }));

    // If not using apply button, update filters immediately
    if (!onApplyFilters) {
      onFilterChange({ [name]: numValue });
    }
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;

    // For a real range slider, we would parse the values
    // For this example, we'll just use the current values
    if (name === 'yearRange') {
      // This would be implemented with a proper range slider component
      console.log('Year range changed:', value);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: checked }));

    // If not using apply button, update filters immediately
    if (!onApplyFilters) {
      onFilterChange({ [name]: checked });
    }
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    } else {
      onFilterChange(localFilters);
    }
  };

  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      // Default reset behavior
      const defaultFilters = {
        region: 'global',
        variable: 'temperature',
        timeframe: 'yearly',
        startYear: 1950,
        endYear: 2023
      };
      setLocalFilters(defaultFilters);
      onFilterChange(defaultFilters);
    }
  };

  const toggleAdvanced = () => {
    setIsAdvancedOpen(!isAdvancedOpen);
  };

  return (
    <div className="filter-panel">
      <h2>Data Filters</h2>

      <div className="filter-group">
        <label htmlFor="region">Region</label>
        <select
          id="region"
          name="region"
          value={localFilters.region}
          onChange={handleChange}
        >
          {regions.map(region => (
            <option key={region.id} value={region.id}>{region.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="variable">Climate Variable</label>
        <select
          id="variable"
          name="variable"
          value={localFilters.variable}
          onChange={handleChange}
        >
          {variables.map(variable => (
            <option key={variable.id} value={variable.id}>{variable.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="timeframe">Time Frame</label>
        <select
          id="timeframe"
          name="timeframe"
          value={localFilters.timeframe}
          onChange={handleChange}
        >
          <option value="yearly">Yearly</option>
          <option value="monthly">Monthly</option>
          <option value="decade">By Decade</option>
        </select>
      </div>

      <div className="filter-group year-range">
        <label>Year Range</label>
        <div className="year-inputs">
          <div className="year-input">
            <label htmlFor="startYear">From</label>
            <input
              type="number"
              id="startYear"
              name="startYear"
              min="1900"
              max="2023"
              value={localFilters.startYear}
              onChange={handleYearChange}
            />
          </div>
          <div className="year-input">
            <label htmlFor="endYear">To</label>
            <input
              type="number"
              id="endYear"
              name="endYear"
              min="1900"
              max="2023"
              value={localFilters.endYear}
              onChange={handleYearChange}
            />
          </div>
        </div>
      </div>

      {advanced && (
        <div className="advanced-filters">
          <button
            type="button"
            className="advanced-toggle"
            onClick={toggleAdvanced}
          >
            {isAdvancedOpen ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
          </button>

          {isAdvancedOpen && (
            <div className="advanced-filters-content">
              <div className="filter-group">
                <label htmlFor="visualization">Visualization Type</label>
                <select
                  id="visualization"
                  name="visualization"
                  value={localFilters.visualization || 'line'}
                  onChange={handleChange}
                >
                  <option value="line">Line Chart</option>
                  <option value="bar">Bar Chart</option>
                  <option value="scatter">Scatter Plot</option>
                  <option value="pie">Pie Chart</option>
                  <option value="map">Map</option>
                  <option value="heatmap">Heat Map</option>
                  <option value="timeseries">Time Series</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="colorScheme">Color Scheme</label>
                <select
                  id="colorScheme"
                  name="colorScheme"
                  value={localFilters.colorScheme || 'blue'}
                  onChange={handleChange}
                >
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="temperature">Temperature Scale</option>
                  <option value="category10">Category 10</option>
                </select>
              </div>

              <div className="filter-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="showTrendline"
                    checked={localFilters.showTrendline || false}
                    onChange={handleCheckboxChange}
                  />
                  Show Trend Line
                </label>
              </div>

              <div className="filter-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="animated"
                    checked={localFilters.animated || false}
                    onChange={handleCheckboxChange}
                  />
                  Animated Visualization
                </label>
              </div>

              <div className="filter-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="showLegend"
                    checked={localFilters.showLegend || true}
                    onChange={handleCheckboxChange}
                  />
                  Show Legend
                </label>
              </div>

              <div className="filter-group">
                <label htmlFor="dataSource">Data Source</label>
                <select
                  id="dataSource"
                  name="dataSource"
                  value={localFilters.dataSource || 'default'}
                  onChange={handleChange}
                >
                  <option value="default">Default</option>
                  <option value="nasa">NASA</option>
                  <option value="noaa">NOAA</option>
                  <option value="worldbank">World Bank</option>
                  <option value="custom">Custom Upload</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="filter-actions">
        <button
          className="btn btn-primary apply-filters"
          onClick={handleApply}
        >
          Apply Filters
        </button>

        <button
          className="btn btn-secondary reset-filters"
          onClick={handleReset}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
