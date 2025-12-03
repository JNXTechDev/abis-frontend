import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './PublicBlotter.css';

function PublicBlotter() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    reporterName: '',
    reporterContact: '',
    incidentDate: ''
  });
  const [submitResult, setSubmitResult] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  

  const fetchDetails = async (id) => {
    setDetailsLoading(true);
    try {
      const res = await api.get(`/blotter/${id}`);
      const data = res && res.data ? res.data : {};
      const normalized = {
        _id: data._id || data.id || id,
        title: data.title,
        description: data.description || data.shortDescription || '',
        reporterName: data.reporterName,
        reporterContact: data.reporterContact,
        incidentDate: data.incidentDate,
        status: data.status,
        attachments: data.attachments || [],
        publicToken: data.publicToken,
        createdAt: data.createdAt,
        remarks: data.remarks || ''
      };
      setSelectedItem(normalized);
    } catch (err) {
      const found = items.find(i => (i._id || i.id) === id);
      if (found) {
        setSelectedItem({
          ...found,
          description: found.description || found.shortDescription || ''
        });
      } else {
        setSelectedItem(null);
      }
    } finally {
      setDetailsLoading(false);
    }
  };

  const isImageFile = (file) => {
    if (!file) return false;
    if (typeof file === 'object' && file.url) {
      return /\.(jpe?g|png|gif|heic)$/i.test(file.url);
    }
    const name = (file && (file.originalname || file.filename || file.path || file)).toString();
    return /\.(jpe?g|png|gif|heic)$/i.test(name);
  };

  const getAttachmentUrl = (att) => {
    if (!att) return '';
    if (att && typeof att === 'object' && att.url) return att.url;
    
    let pathStr = '';
    if (typeof att === 'string') {
      pathStr = att;
    } else if (att.path) {
      pathStr = att.path;
    } else if (att.filename) {
      return `${window.location.origin}/uploads/blotter/${att.filename}`;
    } else {
      return '';
    }

    if (pathStr.startsWith('http')) return pathStr;

    const apiOrigin = (api.defaults && api.defaults.baseURL)
      ? api.defaults.baseURL.replace(/\/api\/?$/, '')
      : window.location.origin;

    if (pathStr.startsWith('/')) return `${apiOrigin}${pathStr}`;

    if (pathStr.match(/uploads[\\\/]blotter/i)) {
      const match = pathStr.match(/uploads[\\\/]blotter[\\\/](.+)$/i);
      if (match) {
        const filename = match[1];
        return `${apiOrigin}/uploads/blotter/${filename}`;
      }
    }

    return `${apiOrigin}/${pathStr}`;
  };

  const openViewer = (index) => {
    const url = getAttachmentUrl(selectedItem.attachments[index]);
    console.log('[openViewer] opening image', index, 'url:', url);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  useEffect(() => {
    fetchBlotters();
  }, []);

  const fetchBlotters = () => {
    let mounted = true;
    api.get('/blotter').then(res => {
      if (!mounted) return;
      const payload = res && res.data ? res.data : [];
      const list = Array.isArray(payload) ? payload : (payload.list || []);
      const normalized = list.map(i => ({
        _id: i.id || i._id,
        title: i.title,
        shortDescription: i.shortDescription,
        incidentDate: i.incidentDate,
        status: i.status,
        createdAt: i.createdAt,
        reporterName: i.reporterName,
        reporterContact: i.reporterContact,
        attachmentsCount: i.attachmentsCount || 0,
      }));
      setItems(normalized);
      setLoading(false);
    }).catch(() => {
      setItems([]);
      setLoading(false);
    });
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const allowedExt = ['.jpg', '.jpeg', '.png', '.heic'];
    const maxSize = 2 * 1024 * 1024;
    const validFiles = [];
    const errors = [];

    selected.forEach((f) => {
      const ext = (f.name.match(/\.[^.]+$/) || [''])[0].toLowerCase();
      if (!allowedExt.includes(ext)) {
        errors.push(`${f.name}: unsupported file type (allowed: JPG, JPEG, PNG, HEIC)`);
        return;
      }
      if (f.size > maxSize) {
        errors.push(`${f.name}: file too large (max 2MB)`);
        return;
      }
      validFiles.push(f);
    });

    setFiles(validFiles);
    setFileErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('reporterName', form.reporterName);
    formData.append('reporterContact', form.reporterContact);
    formData.append('incidentDate', form.incidentDate);
    files.forEach(f => formData.append('attachments', f));

    try {
      const res = await api.post('/blotter', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const result = res.data || {};
      if (result.publicToken && !result.token) result.token = result.publicToken;
      setSubmitResult(result);
      setForm({
        title: '',
        description: '',
        reporterName: '',
        reporterContact: '',
        incidentDate: ''
      });
      setFiles([]);
      setAddOpen(false);
      fetchBlotters();
    } catch (err) {
      alert('Error submitting blotter');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'published': '#10b981',
      'under_review': '#f59e0b',
      'resolved': '#0066cc',
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

  if (loading) {
    return (
      <div className="blotter-loading">
        <div className="loading-spinner"></div>
        <p>Loading blotter reports...</p>
      </div>
    );
  }

  return (
    <div className="blotter-modern">
      {/* Hero Section */}
      <div className="blotter-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-icon">🚨</div>
          <h1>Public Blotter</h1>
          <p>Stay informed about incidents in our community</p>
          <button onClick={() => setAddOpen(true)} className="hero-cta-btn">
            📝 Report Incident
          </button>
          <Link to="/track-blotter" className="hero-track-btn" aria-label="Track blotter">
            🔎 Track Blotter
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="blotter-container">
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Reports Yet</h3>
            <p>Be the first to report an incident in your community.</p>
            <button onClick={() => setAddOpen(true)} className="empty-btn">
              Report Incident
            </button>
          </div>
        ) : (
          <div className="blotter-grid">
            {items.map((item) => (
              <div key={item._id} className="blotter-card">
                <div className="card-header">
                  <div className="card-icon">🚨</div>
                  <div className="card-header-info">
                    <h3>{item.title}</h3>
                    <span className="card-date">
                      📅 {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <span
                    className="card-status"
                    style={{ backgroundColor: getStatusColor(item.status) }}
                  >
                    {item.status?.replace(/_/g, ' ') || 'Pending'}
                  </span>
                </div>

                <div className="card-body">
                  <p className="card-description">
                    {item.shortDescription || 'No description available.'}
                  </p>

                  {item.reporterName && (
                    <div className="card-meta">
                      <span className="meta-item">
                        👤 {item.reporterName}
                      </span>
                    </div>
                  )}

                  {item.attachmentsCount > 0 && (
                    <div className="card-attachments">
                      📎 {item.attachmentsCount} attachment{item.attachmentsCount > 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button
                    onClick={() => fetchDetails(item._id)}
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

      {/* Add Report Modal */}
      {addOpen && (
        <div className="modal-overlay" onClick={() => setAddOpen(false)}>
          <div className="add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-modal-header">
              <h2>📝 Report Incident</h2>
              <button onClick={() => setAddOpen(false)} className="modal-close-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="add-modal-body">
              <div className="form-group">
                <label>Incident Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="Brief title of the incident"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of what happened..."
                  rows={5}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="reporterName"
                    value={form.reporterName}
                    onChange={handleInputChange}
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Contact Number *</label>
                  <input
                    type="tel"
                    name="reporterContact"
                    value={form.reporterContact}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Incident Date *</label>
                <input
                  type="datetime-local"
                  name="incidentDate"
                  value={form.incidentDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Attachments (Optional)</label>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.heic"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <p className="file-hint">Max 2MB per file. Formats: JPG, PNG, HEIC</p>
                {files.length > 0 && (
                  <div className="file-list">
                    {files.map((f, i) => (
                      <div key={i} className="file-item">✅ {f.name}</div>
                    ))}
                  </div>
                )}
                {fileErrors.length > 0 && (
                  <div className="file-errors">
                    {fileErrors.map((err, i) => (
                      <div key={i} className="file-error">⚠️ {err}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="cancel-btn"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : '📤 Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Success Modal */}
      {submitResult && (
        <div className="modal-overlay" onClick={() => setSubmitResult(null)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">✅</div>
            <h2>Report Submitted Successfully!</h2>
            <p>Your incident report has been recorded. Please save your tracking token:</p>
            <div className="token-display-large">
              {submitResult.publicToken || submitResult.token}
            </div>
            <p className="token-hint">Use this token to track the status of your report</p>
            <button onClick={() => setSubmitResult(null)} className="success-btn">
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Modern Details Modal */}
      {selectedItem && (
        <div className="blotter-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="blotter-modal-modern" onClick={(e) => e.stopPropagation()}>
            {detailsLoading ? (
              <div className="modal-loading">
                <div className="loading-spinner-large"></div>
                <p>Loading details...</p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="modal-header-modern">
                  <div className="modal-header-bg"></div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="modal-close-modern"
                  >
                    ✕
                  </button>

                  <div className="modal-header-content">
                    <div className="modal-icon-large">🚨</div>
                    <div className="modal-title-section">
                      <span className="modal-category">Incident Report</span>
                      <h2>{selectedItem.title}</h2>
                      <div className="modal-header-meta">
                        <span className="meta-item">
                          <span className="meta-icon">📅</span>
                          {formatDate(selectedItem.createdAt)}
                        </span>
                        <span
                          className="modal-status-badge"
                          style={{ backgroundColor: getStatusColor(selectedItem.status) }}
                        >
                          {selectedItem.status?.replace(/_/g, ' ') || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="modal-body-modern">
                  {/* Description Section */}
                  <div className="modal-section">
                    <div className="section-header">
                      <span className="section-icon">📝</span>
                      <h3>Incident Description</h3>
                    </div>
                    <div className="description-box">
                      <p>{selectedItem.description || 'No description provided.'}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="modal-section">
                    <div className="section-header">
                      <span className="section-icon">📊</span>
                      <h3>Report Information</h3>
                    </div>
                    <div className="details-grid-modern">
                      <div className="detail-card">
                        <div className="detail-card-icon">👤</div>
                        <div className="detail-card-content">
                          <span className="detail-card-label">Reporter</span>
                          <span className="detail-card-value">
                            {selectedItem.reporterName || 'Anonymous'}
                          </span>
                        </div>
                      </div>

                      <div className="detail-card">
                        <div className="detail-card-icon">📞</div>
                        <div className="detail-card-content">
                          <span className="detail-card-label">Contact</span>
                          <span className="detail-card-value">
                            {selectedItem.reporterContact || 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div className="detail-card">
                        <div className="detail-card-icon">📆</div>
                        <div className="detail-card-content">
                          <span className="detail-card-label">Incident Date</span>
                          <span className="detail-card-value">
                            {selectedItem.incidentDate
                              ? new Date(selectedItem.incidentDate).toLocaleString()
                              : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {selectedItem.publicToken && (
                        <div className="detail-card token-card">
                          <div className="detail-card-icon">🔖</div>
                          <div className="detail-card-content">
                            <span className="detail-card-label">Tracking Token</span>
                            <code className="token-display">
                              {selectedItem.publicToken}
                            </code>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attachments */}
                  {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                    <div className="modal-section">
                      <div className="section-header">
                        <span className="section-icon">📎</span>
                        <h3>Attachments ({selectedItem.attachments.length})</h3>
                      </div>
                      <div className="attachments-grid-modern">
                        {selectedItem.attachments.map((att, idx) => {
                          const url = getAttachmentUrl(att);
                          const isImage = isImageFile(att);

                          return isImage ? (
                            <div key={idx} className="attachment-thumbnail" onClick={() => openViewer(idx)}>
                              <img src={url} alt={`Attachment ${idx + 1}`} />
                              <div className="thumbnail-overlay">
                                <span className="thumbnail-icon">🔍</span>
                                <span className="thumbnail-text">View Image</span>
                              </div>
                            </div>
                          ) : (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="attachment-file"
                            >
                              <div className="file-icon">📄</div>
                              <span className="file-name">Attachment {idx + 1}</span>
                              <span className="file-action">Download →</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Remarks */}
                  {selectedItem.remarks && (
                    <div className="modal-section">
                      <div className="remarks-box-modern">
                        <div className="remarks-header">
                          <span className="remarks-icon-large">⚠️</span>
                          <h3>Official Remarks</h3>
                        </div>
                        <p className="remarks-content">{selectedItem.remarks}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="modal-footer-modern">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="modal-action-btn close-btn"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {viewerOpen && selectedItem && selectedItem.attachments && selectedItem.attachments[viewerIndex] && (
        <div className="image-viewer-overlay" onClick={() => setViewerOpen(false)}>
          <div className="image-viewer-modal" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setViewerOpen(false)} className="viewer-close">✕</button>

            {/* Zoom controls removed per user request */}

            <div className="viewer-navigation">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewerIndex(i => Math.max(0, i - 1));
                }}
                disabled={viewerIndex === 0}
                className="viewer-nav-btn"
              >
                ← Prev
              </button>
              <span className="viewer-counter">
                {viewerIndex + 1} / {selectedItem.attachments.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewerIndex(i => Math.min(selectedItem.attachments.length - 1, i + 1));
                }}
                disabled={viewerIndex === selectedItem.attachments.length - 1}
                className="viewer-nav-btn"
              >
                Next →
              </button>
            </div>

            <div className="viewer-image-container">
              <img
                src={getAttachmentUrl(selectedItem.attachments[viewerIndex])}
                alt="Attachment"
                className="viewer-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicBlotter;
