import { useState, useEffect } from 'react';
import './ComparisonPanel.css';

const ComparisonPanel = ({ 
  regions, 
  variables, 
  onCompare,
  maxComparisons = 3
}) => {
  const [comparisons, setComparisons] = useState([
    {
      id: 1,
      region: 'global',
      variable: 'temperature',
      startYear: 1950,
      endYear: 2023,
      label: 'Comparison 1'
    }
  ]);
  
  const handleAddComparison = () => {
    if (comparisons.length >= maxComparisons) {
      return;
    }
    
    const newId = Math.max(0, ...comparisons.map(c => c.id)) + 1;
    
    setComparisons([
      ...comparisons,
      {
        id: newId,
        region: 'global',
        variable: 'temperature',
        startYear: 1950,
        endYear: 2023,
        label: `Comparison ${newId}`
      }
    ]);
  };
  
  const handleRemoveComparison = (id) => {
    if (comparisons.length <= 1) {
      return;
    }
    
    setComparisons(comparisons.filter(c => c.id !== id));
  };
  
  const handleComparisonChange = (id, field, value) => {
    setComparisons(comparisons.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };
  
  const handleCompare = () => {
    if (onCompare) {
      onCompare(comparisons);
    }
  };
  
  return (
    <div className="comparison-panel">
      <h2>Compare Data</h2>
      <p className="comparison-info">
        Compare climate data across different regions, variables, or time periods.
      </p>
      
      <div className="comparisons-container">
        {comparisons.map((comparison) => (
          <div key={comparison.id} className="comparison-item">
            <div className="comparison-header">
              <input 
                type="text" 
                className="comparison-label" 
                value={comparison.label} 
                onChange={(e) => handleComparisonChange(comparison.id, 'label', e.target.value)}
                placeholder="Comparison Label"
              />
              
              {comparisons.length > 1 && (
                <button 
                  className="remove-comparison-btn" 
                  onClick={() => handleRemoveComparison(comparison.id)}
                  title="Remove Comparison"
                >
                  ×
                </button>
              )}
            </div>
            
            <div className="comparison-content">
              <div className="comparison-field">
                <label htmlFor={`region-${comparison.id}`}>Region</label>
                <select 
                  id={`region-${comparison.id}`}
                  value={comparison.region} 
                  onChange={(e) => handleComparisonChange(comparison.id, 'region', e.target.value)}
                >
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="comparison-field">
                <label htmlFor={`variable-${comparison.id}`}>Variable</label>
                <select 
                  id={`variable-${comparison.id}`}
                  value={comparison.variable} 
                  onChange={(e) => handleComparisonChange(comparison.id, 'variable', e.target.value)}
                >
                  {variables.map(variable => (
                    <option key={variable.id} value={variable.id}>{variable.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="comparison-years">
                <div className="comparison-field year-field">
                  <label htmlFor={`startYear-${comparison.id}`}>From</label>
                  <input 
                    type="number" 
                    id={`startYear-${comparison.id}`}
                    min="1900" 
                    max="2023" 
                    value={comparison.startYear} 
                    onChange={(e) => handleComparisonChange(comparison.id, 'startYear', parseInt(e.target.value, 10))}
                  />
                </div>
                
                <div className="comparison-field year-field">
                  <label htmlFor={`endYear-${comparison.id}`}>To</label>
                  <input 
                    type="number" 
                    id={`endYear-${comparison.id}`}
                    min="1900" 
                    max="2023" 
                    value={comparison.endYear} 
                    onChange={(e) => handleComparisonChange(comparison.id, 'endYear', parseInt(e.target.value, 10))}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {comparisons.length < maxComparisons && (
        <button 
          className="add-comparison-btn" 
          onClick={handleAddComparison}
        >
          + Add Comparison
        </button>
      )}
      
      <button 
        className="btn btn-primary compare-btn" 
        onClick={handleCompare}
      >
        Compare Data
      </button>
    </div>
  );
};

export default ComparisonPanel;
