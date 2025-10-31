import React, { useState } from 'react';
import { exportAsCSV, exportAsJSON, generateSummaryReport } from '../utils/dataExport';
import './ExportData.css';

const ExportData = ({ data, variable, region }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleExportCSV = () => {
    exportAsCSV(data, `climate-${variable}-${region}.csv`);
    setShowMenu(false);
  };

  const handleExportJSON = () => {
    exportAsJSON(data, `climate-${variable}-${region}.json`);
    setShowMenu(false);
  };

  const handleGenerateReport = () => {
    const report = generateSummaryReport(data, variable, region);
    const reportText = `Climate Data Summary Report
Variable: ${report.variable}
Region: ${report.region}
Minimum: ${report.min}
Maximum: ${report.max}
Average: ${report.avg}
Data Points: ${report.count}`;
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report-${variable}-${region}.txt`;
    link.click();
    setShowMenu(false);
  };

  return (
    <div className="export-data">
      <button 
        className="export-button"
        onClick={() => setShowMenu(!showMenu)}
        title="Export climate data"
      >
        ⬇ Export
      </button>
      
      {showMenu && (
        <div className="export-menu">
          <button onClick={handleExportCSV}>📊 Export as CSV</button>
          <button onClick={handleExportJSON}>📄 Export as JSON</button>
          <button onClick={handleGenerateReport}>📋 Generate Report</button>
        </div>
      )}
    </div>
  );
};

export default ExportData;
