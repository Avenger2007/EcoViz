import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Climate Dashboard</h3>
          <p className="footer-description">
            An interactive platform for visualizing and understanding global climate change data.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Data Sources</h3>
          <ul className="footer-links">
            <li><a href="https://climate.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA Climate</a></li>
            <li><a href="https://www.noaa.gov/climate" target="_blank" rel="noopener noreferrer">NOAA Climate</a></li>
            <li><a href="https://data.worldbank.org/topic/climate-change" target="_blank" rel="noopener noreferrer">World Bank Climate Data</a></li>
            <li><a href="https://openclimatedata.net/" target="_blank" rel="noopener noreferrer">Open Climate Data</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/upload">Upload Data</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} Climate Dashboard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;