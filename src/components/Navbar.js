import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const location = useLocation();

  useEffect(() => {
    // Apply dark mode to the document body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌍</span>
          <span className="logo-text">EcoViz</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`menu-icon-bar ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`menu-icon-bar ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`menu-icon-bar ${isMenuOpen ? 'open' : ''}`}></div>
        </div>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link 
              to="/" 
              className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/dashboard" 
              className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/upload" 
              className={`navbar-link ${location.pathname === '/upload' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Upload Data
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/about" 
              className={`navbar-link ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </li>
          <li className="navbar-item theme-toggle">
            <button 
              className="theme-toggle-btn" 
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;