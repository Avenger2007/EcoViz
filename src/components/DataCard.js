import React from 'react';
import './DataCard.css';

const DataCard = ({ title, value, unit, icon, trend, description, color }) => {
  // Determine trend icon and class
  let trendIcon = '';
  let trendClass = '';
  
  if (trend === 'up') {
    trendIcon = '↑';
    trendClass = 'trend-up';
  } else if (trend === 'down') {
    trendIcon = '↓';
    trendClass = 'trend-down';
  } else if (trend === 'stable') {
    trendIcon = '→';
    trendClass = 'trend-stable';
  }

  return (
    <div className="data-card" style={{ borderTopColor: color || 'var(--primary-color)' }}>
      <div className="data-card-header">
        <div className="data-card-icon">{icon}</div>
        <h3 className="data-card-title">{title}</h3>
      </div>
      
      <div className="data-card-value-container">
        <span className="data-card-value">{value}</span>
        {unit && <span className="data-card-unit">{unit}</span>}
        {trend && (
          <span className={`data-card-trend ${trendClass}`}>
            {trendIcon}
          </span>
        )}
      </div>
      
      {description && (
        <p className="data-card-description">{description}</p>
      )}
    </div>
  );
};

export default DataCard;