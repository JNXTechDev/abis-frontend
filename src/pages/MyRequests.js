import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MyRequests.css';
import api from '../services/api';

function MyRequests() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const local = JSON.parse(localStorage.getItem('documents') || '[]');
      
      try {
        const res = await api.get('/documents');
        const fromApi = Array.isArray(res.data) ? res.data.map(d => ({
          id: d.id,
          trackingNumber: d.trackingNumber || d.tracking_number || d.pickupCode || `API-${d.id}`,
          requestDate: d.requestDate ? d.requestDate.split('T')[0] : (d.requestDate || ''),
          residentName: d.residentName || '',
          documentType: d.documentType || d.docType || '',
          status: d.status || 'pending',
          pickupCode: d.pickupCode || '',
          appointmentDatetime: d.appointmentDatetime || d.appointment_datetime || d.appointment || '',
          remarks: d.remarks || '',
          formFields: d.formFields || {},
          purpose: d.formFields?.purpose || d.purpose || '',
        })) : [];

        const map = new Map();
        fromApi.concat(local).forEach(d => {
          const key = d.trackingNumber || d.id || JSON.stringify(d);
          if (!map.has(key)) map.set(key, d);
        });
        if (mounted) setDocuments(Array.from(map.values()));
      } catch (err) {
        if (mounted) setDocuments(local);
      }
      if (mounted) setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffc107',
      'processing': '#3b82f6',
      'approved': '#17a2b8',
      'ready_for_pickup': '#10b981',
      'issued': '#059669',
      'collected': '#6c757d',
      'rejected': '#ef4444'
    };
    return colors[status] || '#999';
  };

  const handleSearch = async (e) => {
    e && e.preventDefault();
    setError(null);
    setSearchResult(null);
    if (!searchTerm.trim()) return;

    const q = searchTerm.trim();
    try {
      const res = await api.get(`/documents/track/by-number/${encodeURIComponent(q)}`);
      if (res && res.data) {
        setSearchResult(res.data);
        return;
      }
    } catch (err) {
      // fallback to local
    }

    const found = documents.find(d => 
      (d.trackingNumber || '').toString().toUpperCase() === q.toUpperCase() ||
      (d.id || '').toString() === q
    );
    
    if (found) setSearchResult(found);
    else setError(`No results found for "${q}". Please check your tracking number.`);
  };

  if (loading) {
    return (
      <div className="requests-loading">
        <div className="loading-spinner"></div>
        <p>Loading your requests...</p>
      </div>
    );
  }

  return (
    <div className="my-requests-modern">
      {/* Hero Section */}
      <div className="requests-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-icon">📂</div>
          <h1>My Document Requests</h1>
          <p>Track and manage all your barangay document requests</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="requests-container">
        {/* Search Section */}
        <div className="search-section">
          <h2>🔍 Search by Tracking Number</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter your tracking number (e.g., ABIS-123456)"
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </form>

          {error && (
            <div className="search-error">
              ⚠️ {error}
            </div>
          )}

          {searchResult && (
            <div className="search-result-card">
              <div className="result-header">
                <h3>✅ Request Found!</h3>
                <button onClick={() => setSearchResult(null)} className="close-result">✕</button>
              </div>
              <div className="result-details">
                <div className="result-row">
                  <span className="result-label">Tracking Number:</span>
                  <span className="result-value tracking">{searchResult.trackingNumber || searchResult.id}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Requested By:</span>
                  <span className="result-value">{searchResult.residentName}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Document Type:</span>
                  <span className="result-value">{searchResult.documentType}</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Status:</span>
                  <span 
                    className="result-status" 
                    style={{ backgroundColor: getStatusColor(searchResult.status) }}
                  >
                    {searchResult.status}
                  </span>
                </div>

                {/* Action buttons for the found request */}
                <div className="result-actions">
                  <button
                    className="view-details-btn"
                    onClick={() => {
                      // open the same details modal used for list items
                      setSelectedDoc(searchResult);
                    }}
                  >
                    View Details →
                  </button>

                  <a
                    className="track-link"
                    href={`/track/${encodeURIComponent(searchResult.trackingNumber || searchResult.id)}`}
                  >
                    View Tracking Page
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* All Requests Section */}
        <div className="all-requests-section">
          <h2>📋 All Your Requests</h2>

          {documents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Requests Yet</h3>
              <p>You haven't requested any documents. Start by browsing our available services.</p>
              <Link to="/services" className="empty-btn">Browse Services</Link>
            </div>
          ) : (
            <div className="requests-grid">
              {documents.map((doc) => (
                <div key={doc.id} className="request-card">
                  <div className="card-header">
                    <div className="card-icon">📄</div>
                    <div className="card-header-info">
                      <h3>{doc.documentType}</h3>
                      <span className="tracking-number">#{doc.trackingNumber || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="info-row">
                      <span className="info-label">👤 Requested By:</span>
                      <span className="info-value">{doc.residentName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">📅 Request Date:</span>
                      <span className="info-value">{doc.requestDate || 'N/A'}</span>
                    </div>
                    {doc.appointmentDatetime && (
                      <div className="info-row">
                        <span className="info-label">🕐 Appointment:</span>
                        <span className="info-value">
                          {new Date(doc.appointmentDatetime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="info-row">
                      <span className="info-label">📊 Status:</span>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(doc.status) }}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button 
                      onClick={() => setSelectedDoc(doc)} 
                      className="view-details-btn"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedDoc(null)} className="modal-close">✕</button>
            
            <div className="modal-header">
              <div className="modal-icon">📄</div>
              <h2>Request Details</h2>
            </div>

            <div className="modal-body">
              <div className="detail-group">
                <label>Tracking Number:</label>
                <div className="tracking-display">{selectedDoc.trackingNumber || selectedDoc.id}</div>
              </div>

              <div className="detail-group">
                <label>Requested By:</label>
                <p>{selectedDoc.residentName}</p>
              </div>

              <div className="detail-group">
                <label>Document Type:</label>
                <p>{selectedDoc.documentType}</p>
              </div>

              <div className="detail-group">
                <label>Purpose:</label>
                <p>{selectedDoc.purpose || selectedDoc.formFields?.purpose || '—'}</p>
              </div>

              <div className="detail-group">
                <label>Request Date:</label>
                <p>{selectedDoc.requestDate || '—'}</p>
              </div>

              {selectedDoc.appointmentDatetime && (
                <div className="detail-group">
                  <label>Appointment:</label>
                  <p>{new Date(selectedDoc.appointmentDatetime).toLocaleString()}</p>
                </div>
              )}

              <div className="detail-group">
                <label>Status:</label>
                <span 
                  className="modal-status"
                  style={{ backgroundColor: getStatusColor(selectedDoc.status) }}
                >
                  {selectedDoc.status}
                </span>
              </div>

              {selectedDoc.remarks && (
                <div className="detail-group remarks">
                  <label>⚠️ Remarks:</label>
                  <p>{selectedDoc.remarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyRequests;
