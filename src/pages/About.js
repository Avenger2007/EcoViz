import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1 className="page-title">About the Climate Change Dashboard</h1>
        
        <section className="about-section">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-content">
            The Interactive Global Climate Change Dashboard aims to make climate data accessible, 
            understandable, and actionable for everyone. By visualizing complex climate data in 
            intuitive ways, we hope to raise awareness about climate change and inspire action 
            to address this global challenge.
          </p>
          <p className="section-content">
            Our goal is to bridge the gap between scientific data and public understanding, 
            providing a platform where users can explore climate trends, understand their 
            implications, and discover ways to contribute to climate solutions.
          </p>
        </section>
        
        <section className="about-section">
          <h2 className="section-title">The Data</h2>
          <p className="section-content">
            We source our data from reputable scientific organizations and research institutions, 
            including NASA, NOAA, the World Bank, and other climate research centers. All data 
            is carefully validated and regularly updated to ensure accuracy and relevance.
          </p>
          <p className="section-content">
            The dashboard presents various climate indicators, including:
          </p>
          <ul className="data-list">
            <li>
              <strong>Global Temperature Changes</strong> - Tracking temperature anomalies relative to pre-industrial levels
            </li>
            <li>
              <strong>Atmospheric CO₂ Concentrations</strong> - Monitoring greenhouse gas levels in the atmosphere
            </li>
            <li>
              <strong>Sea Level Rise</strong> - Measuring changes in global sea levels due to thermal expansion and ice melt
            </li>
            <li>
              <strong>Arctic Sea Ice Extent</strong> - Tracking the decline of polar ice coverage
            </li>
            <li>
              <strong>Precipitation Patterns</strong> - Analyzing changes in rainfall and drought conditions
            </li>
            <li>
              <strong>Extreme Weather Events</strong> - Documenting the increasing frequency of climate-related disasters
            </li>
          </ul>
        </section>
        
        <section className="about-section">
          <h2 className="section-title">How to Use the Dashboard</h2>
          <div className="usage-grid">
            <div className="usage-card">
              <div className="usage-icon">🔍</div>
              <h3>Explore Data</h3>
              <p>
                Navigate through different climate indicators using the filters on the dashboard. 
                Select data types, time ranges, and geographic regions to customize your view.
              </p>
            </div>
            <div className="usage-card">
              <div className="usage-icon">📊</div>
              <h3>Analyze Trends</h3>
              <p>
                Use the interactive charts and maps to identify patterns and trends in climate data. 
                Hover over data points for detailed information.
              </p>
            </div>
            <div className="usage-card">
              <div className="usage-icon">💾</div>
              <h3>Download Data</h3>
              <p>
                Download charts, maps, or raw data for your own research, presentations, or projects. 
                Data is available in multiple formats.
              </p>
            </div>
            <div className="usage-card">
              <div className="usage-icon">📤</div>
              <h3>Contribute</h3>
              <p>
                Upload your own climate datasets to enhance the dashboard's coverage and help build 
                a more comprehensive climate database.
              </p>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <h2 className="section-title">The Team</h2>
          <p className="section-content">
            The Climate Change Dashboard is developed by a team of climate scientists, data 
            visualization experts, and software engineers committed to making climate science 
            accessible to the public.
          </p>
        </section>
<section className="about-section">
          <h2 className="section-title">Get Involved</h2>
          <p className="section-content">
            We believe that addressing climate change requires collective action. Here are ways 
            you can get involved:
          </p>
          <div className="involvement-options">
            <div className="involvement-option">
              <h3>Contribute Data</h3>
              <p>
                Share your climate research data or observations to help expand our database.
              </p>
              <Link to="/upload" className="btn btn-primary">Upload Data</Link>
            </div>
            <div className="involvement-option">
              <h3>Spread Awareness</h3>
              <p>
                Share the dashboard with others to help raise awareness about climate change.
              </p>
              <button className="btn btn-secondary">Share Dashboard</button>
            </div>
            <div className="involvement-option">
              <h3>Take Action</h3>
              <p>
                Learn about steps you can take to reduce your carbon footprint and advocate for climate policies.
              </p>
              <a href="#" className="btn btn-secondary">Climate Action Guide</a>
            </div>
          </div>
        
        <section className="about-section contact-section">
                  <h2 className="section-title">Contact Us</h2>
                  <p className="section-content">
                    Have questions, suggestions, or feedback? We'd love to hear from you!
                  </p>
                  <div className="contact-info">
                    <div className="contact-item">
                      <div className="contact-icon">✉️</div>
                      <p>contact@climatedashboard.org</p>
                    </div>
                    <div className="contact-item">
                      <div className="contact-icon">🌐</div>
                      <p>www.climatedashboard.org</p>
                    </div>
                    <div className="contact-item">
                      <div className="contact-icon">📱</div>
                      <p>Social Media: @ClimateDashboard</p>
                    </div>
                  </div>
        </section>
        </section>
      </div>
    </div>
  );
};

export default About;