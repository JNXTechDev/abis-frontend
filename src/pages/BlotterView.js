import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './BlotterView.css';

function BlotterView() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.get(`/blotter/${id}`).then(res => {
      if (!mounted) return;
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      setError('Failed to load blotter report.');
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [id]);

  const getStatusColor = (status) => {
    const colors = {
      'published': '#10b981',
      'under_review': '#f59e0b',
      'resolved': '#3b82f6',
      'archived': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Attachment viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  const isImageFile = (file) => {
    const name = (file && (file.originalname || file.filename || file.path || file)).toString();
    return /\.(jpe?g|png|gif|heic)$/i.test(name);
  };

  const getAttachmentUrl = (att) => {
    if (!att) return '';
    if (typeof att === 'string') return `http://localhost:8000${att}`;
    if (att.path) return `http://localhost:8000${att.path}`;
    if (att.filename) return `http://localhost:8000/uploads/blotter/${att.filename}`;
    return '';
  };

  const openViewer = (index) => {
    setViewerIndex(index);
    setZoom(1);
    setViewerOpen(true);
  };

  const changeZoom = (delta) => setZoom(z => Math.min(Math.max(0.25, z + delta), 5));

  if (loading) {
    return (
      <div className="blotter-view-loading">
        <div className="loading-spinner"></div>
        <p>Loading blotter report...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="blotter-view-modern">
        <div className="blotter-view-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-icon">❌</div>
            <h1>Report Not Found</h1>
            <p>Unable to load the requested blotter report</p>
          </div>
        </div>
        <div className="blotter-view-container">
          <div className="error-card">
            <div className="error-icon">😕</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error || 'The blotter report you\'re looking for could not be found.'}</p>
            <Link to="/blotter" className="back-btn">
              ← Back to Blotter List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blotter-view-modern">
      {/* Hero Section */}
      <div className="blotter-view-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-icon">📋</div>
          <h1>Blotter Report Details</h1>
          <p>Complete information about this incident report</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="blotter-view-container">
        {/* Back Button */}
        <div className="nav-section">
          <Link to="/blotter" className="back-link">
            ← Back to All Reports
          </Link>
        </div>

        {/* Report Card */}
        <div className="report-card">
          {/* Header */}
          <div className="report-header">
            <div className="header-icon">🚨</div>
            <div className="header-info">
              <h2>{data.title || 'Untitled Report'}</h2>
              <div className="header-meta">
                <span className="meta-date">
                  📅 Reported: {formatDate(data.createdAt)}
                </span>
                <span 
                  className="meta-status"
                  style={{ backgroundColor: getStatusColor(data.status) }}
                >
                  {data.status?.replace(/_/g, ' ') || 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="report-section">
            <h3>📝 Incident Description</h3>
            <div className="description-content">
              <p>{data.description || data.shortDescription || 'No description provided.'}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="report-section">
            <h3>📊 Report Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-icon">👤</span>
                <div className="detail-content">
                  <span className="detail-label">Reporter Name</span>
                  <span className="detail-value">{data.reporterName || 'Anonymous'}</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">📞</span>
                <div className="detail-content">
                  <span className="detail-label">Contact Number</span>
                  <span className="detail-value">{data.reporterContact || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">📆</span>
                <div className="detail-content">
                  <span className="detail-label">Incident Date</span>
                  <span className="detail-value">
                    {data.incidentDate ? new Date(data.incidentDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </span>
                </div>
              </div>

              {data.publicToken && (
                <div className="detail-item">
                  <span className="detail-icon">🔖</span>
                  <div className="detail-content">
                    <span className="detail-label">Tracking Token</span>
                    <code className="token-badge">{data.publicToken}</code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Attachments */}
          {data.attachments && data.attachments.length > 0 && (
            <div className="report-section">
              <h3>📎 Attachments ({data.attachments.length})</h3>
              <div className="attachments-grid">
                {data.attachments.map((att, idx) => {
                  const url = getAttachmentUrl(att);
                  const isImg = isImageFile(att);
                  return (
                    <div key={idx} className="attachment-card" style={{ cursor: 'pointer' }}>
                      {isImg ? (
                        <div onClick={() => openViewer(idx)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <img src={url} alt={`Attachment ${idx + 1}`} style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} />
                          <div style={{ marginTop: 8, fontSize: 14 }}>Attachment {idx + 1} · Image</div>
                        </div>
                      ) : (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="attachment-link">
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className="attachment-icon">📄</span>
                            <div style={{ marginTop: 8, fontSize: 14 }}>Attachment {idx + 1}</div>
                          </div>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Remarks */}
          {data.remarks && (
            <div className="report-section">
              <div className="remarks-card">
                <div className="remarks-header">
                  <span className="remarks-icon">⚠️</span>
                  <h3>Official Remarks</h3>
                </div>
                <p className="remarks-text">{data.remarks}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="report-section">
            <h3>🕐 Timeline</h3>
            <div className="timeline-list">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <strong>Report Submitted</strong>
                  <span>{formatDate(data.createdAt)}</span>
                </div>
              </div>
              {data.updatedAt && data.updatedAt !== data.createdAt && (
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <strong>Last Updated</strong>
                    <span>{formatDate(data.updatedAt)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="action-section">
          <Link to="/blotter" className="action-btn primary">
            ← Back to All Reports
          </Link>
          <Link to="/blotter" className="action-btn secondary">
            Report New Incident
          </Link>
        </div>
      </div>
        {/* Image Viewer Modal */}
        {viewerOpen && (
          <div className="modal-overlay" onClick={() => setViewerOpen(false)}>
            <div className="image-viewer" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90%', maxHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', gap: 8 }}>
                <button onClick={() => changeZoom(-0.25)} className="btn-ghost">−</button>
                <button onClick={() => setZoom(1)} className="btn-ghost">Reset</button>
                <button onClick={() => changeZoom(0.25)} className="btn-ghost">+</button>
                <button onClick={() => setViewerOpen(false)} className="btn-ghost">Close</button>
              </div>
              <div style={{ overflow: 'auto', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 12 }}>
                <img src={getAttachmentUrl(data.attachments[viewerIndex])} alt={`Attachment ${viewerIndex + 1}`} style={{ transform: `scale(${zoom})`, transition: 'transform 120ms ease', maxWidth: '100%', maxHeight: '80vh' }} />
              </div>
              <div style={{ marginTop: 8, color: '#666' }}>Attachment {viewerIndex + 1} of {data.attachments.length} · Zoom: {(zoom * 100).toFixed(0)}%</div>
            </div>
          </div>
        )}
    </div>
  );
}

export default BlotterView;
