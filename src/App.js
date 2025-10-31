import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';

// Pages
import Home from './pages/Home.js';
import Dashboard from './pages/Dashboard.js';
import DataUpload from './pages/DataUpload.js';
import About from './pages/About.js';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<DataUpload />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;