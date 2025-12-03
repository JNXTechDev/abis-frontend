// src/components/Layout/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/brgyLogo.png';

function Navbar({ user, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logo} alt="Barangay Seal" style={{ width: 44, height: 44, borderRadius: 6 }} />
          <h1 className="system-title">BARANGAY MANAGEMENT SYSTEM</h1>
        </div>
      </div>

      <div className="navbar-right">
        <div className="user-profile">
          <div className="user-icon">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.username}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <button 
            className="dropdown-toggle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            ⋮
          </button>
          
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item">Profile</button>
              <button className="dropdown-item">Change Password</button>
              {user?.type === 'admin' && (
                <>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => navigate('/admin/blotter-review')}>Blotter Review</button>
                </>
              )}
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;