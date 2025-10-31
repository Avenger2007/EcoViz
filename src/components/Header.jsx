import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ theme = 'light', onThemeToggle, language = 'en', onLanguageChange }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const translations = {
    en: { dashboard: 'Dashboard', classic: 'Classic', upload: 'Upload', about: 'About' },
    es: { dashboard: 'Panel', classic: 'Clásico', upload: 'Subir', about: 'Acerca' },
    fr: { dashboard: 'Tableau', classic: 'Classique', upload: 'Télécharger', about: 'À propos' },
    de: { dashboard: 'Dashboard', classic: 'Klassisch', upload: 'Hochladen', about: 'Über' },
    zh: { dashboard: '仪表板', classic: '经典', upload: '上传', about: '关于' }
  };

  const t = translations[language] || translations['en'];

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/dashboard">
            <h1>🌍 EcoViz</h1>
            <span>Climate Change Dashboard</span>
          </Link>
        </div>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li className={isActive('/dashboard')}>
              <Link to="/dashboard">
                <span>📊</span>
                {t.dashboard}
              </Link>
            </li>
            <li className={isActive('/classic')}>
              <Link to="/classic">
                <span>📈</span>
                {t.classic}
              </Link>
            </li>
            <li className={isActive('/upload')}>
              <Link to="/upload">
                <span>📤</span>
                {t.upload}
              </Link>
            </li>
            <li className={isActive('/about')}>
              <Link to="/about">
                <span>ℹ️</span>
                {t.about}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-controls">
          {/* Theme Toggle */}
          <button
            className="control-btn theme-toggle"
            onClick={onThemeToggle}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Language Selector */}
          <div className="language-selector">
            <button
              className="control-btn lang-btn"
              onClick={() => setLangDropdown(!langDropdown)}
            >
              {languages.find(l => l.code === language)?.flag || '🌐'} {language.toUpperCase()}
            </button>
            {langDropdown && (
              <div className="lang-dropdown">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    className={`lang-option ${language === lang.code ? 'active' : ''}`}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangDropdown(false);
                    }}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className={`mobile-menu-toggle ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
