import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import Dashboard from './pages/Dashboard.jsx';
import EnhancedDashboard from './pages/EnhancedDashboard.jsx';
import About from './pages/About.jsx';
import DataUpload from './pages/DataUpload.jsx';

// Components
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  // Initialize theme and language
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Simulate loading of application resources
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <Router>
      <div className="app" data-theme={theme}>
        <Header
          theme={theme}
          onThemeToggle={handleThemeToggle}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<EnhancedDashboard language={language} />} />
            <Route path="/classic" element={<Dashboard language={language} />} />
            <Route path="/about" element={<About language={language} />} />
            <Route path="/upload" element={<DataUpload language={language} />} />
          </Routes>
        </main>
        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;
