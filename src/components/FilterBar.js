import React from 'react';
import './FilterBar.css';

const FilterBar = ({ 
  filters, 
  activeFilters, 
  onFilterChange,
  title = 'Filters'
}) => {
  // Handle filter click
  const handleFilterClick = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  return (
    <div className="filter-bar">
      <h3 className="filter-bar-title">{title}</h3>
      
      <div className="filter-sections">
        {Object.keys(filters).map((filterType) => (
          <div key={filterType} className="filter-section">
            <h4 className="filter-section-title">{filterType}</h4>
            <div className="filter-options">
              {filters[filterType].map((option) => (
                <button
                  key={option.value}
                  className={`filter-option ${activeFilters[filterType] === option.value ? 'active' : ''}`}
                  onClick={() => handleFilterClick(filterType, option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;