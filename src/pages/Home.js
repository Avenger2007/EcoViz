import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Import sample data for the hero section
import { globalTemperatureData } from '../utils/sampleData';
import ClimateChart from '../components/ClimateChart';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Interactive Global Climate Change Dashboard</h1>
            <p className="hero-subtitle">
              Explore and visualize climate data from around the world to better understand the impacts of climate change.
            </p>
            <div className="hero-buttons">
              <Link to="/dashboard" className="btn btn-primary">Explore Dashboard</Link>
              <Link to="/about" className="btn btn-secondary">Learn More</Link>
            </div>
          </div>
          <div className="hero-chart">
            <ClimateChart 
              data={globalTemperatureData} 
              title="Global Temperature Anomaly (1880-2023)" 
              xLabel="Year"
              yLabel="Temperature Anomaly (°C)"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">Interactive Maps</h3>
              <p className="feature-description">
                Explore climate data through interactive maps showing temperature changes, precipitation patterns, and more.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Data Visualization</h3>
              <p className="feature-description">
                View climate trends through various charts and graphs that make complex data easy to understand.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Comparative Analysis</h3>
              <p className="feature-description">
                Compare climate data across different regions and time periods to identify patterns and trends.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📤</div>
              <h3 className="feature-title">Data Upload</h3>
              <p className="feature-description">
                Upload your own climate datasets to visualize and analyze using our powerful tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="data-sources-section">
        <div className="container">
          <h2 className="section-title">Data Sources</h2>
          <p className="section-description">
            Our dashboard integrates climate data from multiple reliable sources to provide a comprehensive view of global climate change.
          </p>
          <div className="data-sources-grid">
            <a href="https://climate.nasa.gov/" target="_blank" rel="noopener noreferrer" className="data-source-card">
              <img src="https://climate.nasa.gov/img/layout/nasa_logo@2x.png" alt="NASA Climate" className="data-source-logo" />
              <h3 className="data-source-title">NASA Climate</h3>
              <p className="data-source-description">
                Global temperature data, sea level rise, and carbon dioxide levels from NASA's Earth Science Division.
              </p>
            </a>
            <a href="https://www.noaa.gov/climate" target="_blank" rel="noopener noreferrer" className="data-source-card">
              <img src="https://www.noaa.gov/sites/default/files/styles/square_width_650/public/2021-02/FocusArea__Weather-02.jpg" alt="NOAA Climate" className="data-source-logo" />
              <h3 className="data-source-title">NOAA Climate</h3>
              <p className="data-source-description">
                Weather patterns, ocean temperature, and climate monitoring data from the National Oceanic and Atmospheric Administration.
              </p>
            </a>
            <a href="https://data.worldbank.org/topic/climate-change" target="_blank" rel="noopener noreferrer" className="data-source-card">
              <img src="https://www.worldbank.org/content/dam/wbr/logo/logo-wb-header-en.svg" alt="World Bank Climate Data" className="data-source-logo" />
              <h3 className="data-source-title">World Bank</h3>
              <p className="data-source-description">
                Climate change indicators, emissions data, and vulnerability assessments from the World Bank's climate change knowledge portal.
              </p>
            </a>
            <a href="https://openclimatedata.net/" target="_blank" rel="noopener noreferrer" className="data-source-card">
              <img src="https://openclimatedata.net/assets/img/logo.svg" alt="Open Climate Data" className="data-source-logo" />
              <h3 className="data-source-title">Open Climate Data</h3>
              <p className="data-source-description">
                Open-source climate datasets from various research institutions and climate scientists around the world.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Explore Climate Data?</h2>
          <p className="cta-description">
            Dive into our interactive dashboard to discover climate trends and patterns from around the world.
          </p>
          <Link to="/dashboard" className="btn btn-primary cta-button">
            Launch Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;