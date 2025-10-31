import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#263238" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="container footer-container">
        <div className="footer-info">
          <div className="footer-logo">
            <div className="logo-icon"></div>
            <div>
              <h3>EcoViz</h3>
              <p>Climate Change Dashboard</p>
            </div>
          </div>
          <p className="footer-description">Visualizing global climate data to raise awareness and drive action on climate change.</p>
          <div className="footer-social">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter"></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon github"></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon linkedin"></a>
          </div>
        </div>

        <div className="footer-nav">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/dashboard">Enhanced Dashboard</Link></li>
            <li><Link to="/classic">Classic View</Link></li>
            <li><Link to="/upload">Upload Data</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Climate Resources</h4>
          <ul>
            <li><a href="https://climate.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA Climate</a></li>
            <li><a href="https://www.noaa.gov/climate" target="_blank" rel="noopener noreferrer">NOAA Climate</a></li>
            <li><a href="https://www.ipcc.ch/" target="_blank" rel="noopener noreferrer">IPCC</a></li>
            <li><a href="https://www.un.org/en/climatechange" target="_blank" rel="noopener noreferrer">UN Climate Action</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p><i className="contact-icon email"></i> info@ecoviz.example.com</p>
          <p><i className="contact-icon twitter"></i> @ecoviz</p>
          <p><i className="contact-icon location"></i> Global Climate Initiative</p>
          <button className="footer-btn">Subscribe to Updates</button>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} EcoViz. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Data Sources</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
