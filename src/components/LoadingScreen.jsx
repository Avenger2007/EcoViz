import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <div className="globe-animation"></div>
          <div className="logo-text">
            <h1>EcoViz</h1>
            <p>Climate Change Dashboard</p>
          </div>
        </div>
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p className="loading-message">Loading climate data...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
