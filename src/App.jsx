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

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<EnhancedDashboard />} />
            <Route path="/classic" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/upload" element={<DataUpload />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
