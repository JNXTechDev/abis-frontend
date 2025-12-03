// src/components/Dashboard/Dashboard.jsx
import React from 'react';
import './Dashboard.css';
import DocumentsList from '../Documents/DocumentsList';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Admin Dashboard</h2>
      </div>

      {/* Show document requests directly on the dashboard */}
      <div style={{marginTop:16}}>
        <DocumentsList />
      </div>
    </div>
  );
}

export default Dashboard;