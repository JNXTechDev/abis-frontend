import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TrackRequest.css';
import api from '../services/api';

function TrackBlotter() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const t = token.trim();
    if (!t) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/blotter/by-token/${encodeURIComponent(t)}`);
      if (res && res.data) {
        setResult({ found: true, data: res.data });
      } else {
        setResult({ found: false });
      }
    } catch (err) {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="track-modern">
      <div className="track-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-icon">🔎</div>
          <h1>Track Blotter Report</h1>
          <p>Enter your public blotter token to check status (private details are hidden)</p>
        </div>
      </div>

      <div className="track-container">
        <div className="search-card">
          <h2>🔐 Track by Public Token</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter public blotter token (e.g., ab12cd34)"
                className="search-input"
              />
              <button type="submit" className="search-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Searching...
                  </>
                ) : (
                  '🔍 Track Blotter'
                )}
              </button>
            </div>
          </form>

          <div className="quick-actions">
            <Link to="/blotter" className="quick-link">📂 View Public Blotter</Link>
            <Link to="/services" className="quick-link">➕ Report Incident</Link>
          </div>
        </div>

        {searched && result && !result.found && (
          <div className="no-result-card">
            <div className="no-result-icon">😕</div>
            <h3>Report Not Found</h3>
            <p>We couldn't find any blotter report with token:</p>
            <div className="search-term">"{token}"</div>
            <p className="help-text">Please double-check your token.</p>
          </div>
        )}

        {result && result.found && (
          <div className="result-card">
            <div className="result-header">
              <div className="header-icon">📌</div>
              <div className="header-info">
                <h2>Blotter Report</h2>
                <div className="tracking-display">
                  <span className="tracking-label">Public Token:</span>
                  <code className="tracking-code">{result.data.publicToken}</code>
                </div>
              </div>
            </div>

            <div className="status-section">
              <div className="status-header">
                <span className="status-label">Current Status:</span>
                <span className="status-badge">{result.data.status || 'Pending'}</span>
              </div>
            </div>

            <div className="result-actions">
              <button onClick={() => { setResult(null); setSearched(false); setToken(''); }} className="action-btn secondary">Search Again</button>
            </div>
          </div>
        )}

        {!searched && (
          <div className="info-section">
            <h3>ℹ️ How to Track a Blotter Report</h3>
            <p>Enter the public token provided when you submitted your blotter report. Only the report status and token are displayed to protect privacy.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackBlotter;
