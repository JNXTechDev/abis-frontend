// src/components/Auth/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Admin-only authentication (demo)
      if (username === 'admin' && password === 'aaaaaa') {
        const userData = {
          id: 1,
          username: 'admin',
          name: 'Administrator',
          email: 'admin@barangay-pulao.gov.ph',
          role: 'admin',
          type: 'admin'
        };
        handleLogin(userData);
        navigate('/admin');
      } else {
        setError('Invalid username or password. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-modern">
      {/* Background Pattern */}
      <div className="login-background">
        <div className="pattern-overlay"></div>
      </div>

      {/* Login Container */}
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <h1>Admin Login</h1>
            <p>Automated Barangay Information System</p>
            <div className="system-badge">ABIS</div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                <span className="label-icon">👤</span>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔑</span>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  🚀 Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="demo-credentials">
            <div className="demo-header">
              <span className="demo-icon">ℹ️</span>
              <strong>Demo Credentials</strong>
            </div>
            <div className="demo-info">
              <div className="demo-row">
                <span className="demo-label">Username:</span>
                <code className="demo-value">admin</code>
              </div>
              <div className="demo-row">
                <span className="demo-label">Password:</span>
                <code className="demo-value">aaaaaa</code>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="login-footer">
            <Link to="/" className="back-link">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Info Card */}
        <div className="info-card">
          <h3>🏛️ Barangay Admin Portal</h3>
          <p>
            Access the administrative dashboard to manage document requests, 
            blotter reports, and barangay services.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Manage Document Requests</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>View Blotter Reports</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Update Request Status</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Generate Reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
