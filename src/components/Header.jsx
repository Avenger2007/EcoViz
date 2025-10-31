import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/dashboard">
            <h1>EcoViz</h1>
            <span>Climate Change Dashboard</span>
          </Link>
        </div>

        <button className={`mobile-menu-toggle ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li className={isActive('/dashboard')}>
              <Link to="/dashboard">
                <i className="nav-icon dashboard-icon"></i>
                Enhanced Dashboard
              </Link>
            </li>
            <li className={isActive('/classic')}>
              <Link to="/classic">
                <i className="nav-icon classic-icon"></i>
                Classic View
              </Link>
            </li>
            <li className={isActive('/upload')}>
              <Link to="/upload">
                <i className="nav-icon upload-icon"></i>
                Upload Data
              </Link>
            </li>
            <li className={isActive('/about')}>
              <Link to="/about">
                <i className="nav-icon about-icon"></i>
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
