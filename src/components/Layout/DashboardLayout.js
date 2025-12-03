// src/components/Layout/DashboardLayout.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from '../../contexts/AuthContext';
import './DashboardLayout.css';

function DashboardLayout({ children }) {
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <div className="main-content">
        <Navbar user={user} onLogout={handleLogoutClick} />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;