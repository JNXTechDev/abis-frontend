import React, { useState, useEffect } from 'react';
import './Reports.css';

function Reports() {
  const [stats, setStats] = useState({
    totalResidents: 0,
    totalBlotters: 0,
    totalDocumentsIssued: 0,
    pendingDocuments: 0
  });

  useEffect(() => {
    // TODO: Replace with API calls
    const residents = JSON.parse(localStorage.getItem('residents') || '[]');
    const blotters = JSON.parse(localStorage.getItem('blotters') || '[]');
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    
    setStats({
      totalResidents: residents.length,
      totalBlotters: blotters.length,
      totalDocumentsIssued: documents.filter(d => d.status === 'issued').length,
      pendingDocuments: documents.filter(d => d.status === 'pending').length
    });
  }, []);

  return (
    <div className="reports-container">
      <h1>Reports & Analytics</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Residents</h3>
          <p className="stat-number">{stats.totalResidents}</p>
        </div>
        <div className="stat-card">
          <h3>Blotter Records</h3>
          <p className="stat-number">{stats.totalBlotters}</p>
        </div>
        <div className="stat-card">
          <h3>Documents Issued</h3>
          <p className="stat-number">{stats.totalDocumentsIssued}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Documents</h3>
          <p className="stat-number">{stats.pendingDocuments}</p>
        </div>
      </div>

      <div className="report-section">
        <h2>Resident Summary Report</h2>
        <button className="btn btn-secondary">Generate PDF</button>
      </div>
      
      <div className="report-section">
        <h2>Blotter Report</h2>
        <button className="btn btn-secondary">Generate PDF</button>
      </div>
    </div>
  );
}

export default Reports;
