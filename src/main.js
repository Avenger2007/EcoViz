import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Initialize the application
const init = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }
  
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
};

// Run initialization when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export components for standalone usage
export { default as Dashboard } from './pages/Dashboard';
export { default as EnhancedDashboard } from './pages/EnhancedDashboard';
export { default as DataUpload } from './pages/DataUpload';
export { default as About } from './pages/About';

// Export visualization components
export { default as Globe3D } from './components/visualizations/Globe3D';
export { default as ChoroplethMap } from './components/visualizations/ChoroplethMap';
export { default as LineChart } from './components/visualizations/LineChart';
export { default as BarChart } from './components/visualizations/BarChart';
export { default as ScatterPlot } from './components/visualizations/ScatterPlot';
export { default as TimeSeries } from './components/visualizations/TimeSeries';

// Export utility components
export { default as FilterPanel } from './components/FilterPanel';
export { default as ComparisonPanel } from './components/ComparisonPanel';
export { default as AnnotationTool } from './components/AnnotationTool';
export { default as VisualizationSettings } from './components/VisualizationSettings';

// Export the entire application as default
export default App;
