import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import './AdminBlotterReview.css';

function AdminBlotterReview() {
  const { user } = useContext(AuthContext);
  const [pending, setPending] = useState([]);
  const [published, setPublished] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [filterPending, setFilterPending] = useState('');
  const [filterPublished, setFilterPublished] = useState('');
  const [filterAll, setFilterAll] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('pending');
  
  // Modal states
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);

  const getAttachmentUrl = (att) => {
    if (!att) return '';
    
    if (typeof att === 'object' && att.url) {
      return att.url;
    }
    
    if (typeof att === 'object' && att.secure_url) {
      return att.secure_url;
    }
    
    if (typeof att === 'string' && att.startsWith('http')) {
      return att;
    }
    
    if (typeof att === 'object' && att.path) {
      if (att.path.startsWith('http')) return att.path;
      const match = att.path.match(/[\/\\]([^\/\\]+)$/);
      const filename = match ? match[1] : att.path;
      return `http://localhost:8000/uploads/blotter/${filename}`;
    }
    
    return '';
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [resPending, resAll] = await Promise.all([
          api.get('/blotter/pending'),
          api.get('/blotter'),
        ]);

        if (!mounted) return;

        const pendingData = Array.isArray(resPending.data) ? resPending.data : [];
        setPending(pendingData);

        const allData = Array.isArray(resAll.data) ? resAll.data : [];
        setAll(allData);
        
        const publishedData = allData.filter(b => b.status === 'published');
        setPublished(publishedData);
      } catch (err) {
        setError(
          err.response && err.response.data && err.response.data.error
            ? err.response.data.error
            : err.message || 'Failed to load blotters'
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const refreshData = async () => {
    try {
      const [resPending, resAll] = await Promise.all([
        api.get('/blotter/pending'),
        api.get('/blotter'),
      ]);

      const pendingData = Array.isArray(resPending.data) ? resPending.data : [];
      setPending(pendingData);

      const allData = Array.isArray(resAll.data) ? resAll.data : [];
      setAll(allData);
      
      const publishedData = allData.filter(b => b.status === 'published');
      setPublished(publishedData);
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  };

  const openViewModal = async (id) => {
    try {
      // request admin-level details (includes reporter name/contact)
      const response = await api.get(`/blotter/${id}?admin=1`);
      setViewModal(response.data);
    } catch (err) {
      alert('Failed to load blotter details: ' + (err.message || 'error'));
    }
  };

  const openEditModal = (blotter) => {
    setEditModal({
      ...blotter,
      _id: blotter._id || blotter.id
    });
  };

  const closeViewModal = () => setViewModal(null);
  const closeEditModal = () => setEditModal(null);

  const saveEdit = async () => {
    if (!editModal) return;
    const blotterId = editModal._id || editModal.id;
    try {
      await api.patch(`/blotter/${blotterId}`, {
        showReporter: editModal.showReporter,
      });
      await refreshData();
      closeEditModal();
    } catch (err) {
      alert('Failed to save changes: ' + (err.message || 'error'));
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const copy = new Set(Array.from(prev));
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const selectAll = () => {
    setSelected(new Set(pending.map((p) => p._id || p.id)));
  };

  const clearSelection = () => setSelected(new Set());

  const publish = async (id) => {
    try {
      const include = window.confirm(
        'Include reporter name & contact in public view? OK = include, Cancel = anonymize'
      );
      await api.patch(`/blotter/${id}`, {
        status: 'published',
        showReporter: include,
      });
      await refreshData();
      setSelected((s) => {
        const copy = new Set(s);
        copy.delete(id);
        return copy;
      });
    } catch (err) {
      alert('Failed to publish: ' + (err.message || 'error'));
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      await api.patch(`/blotter/${id}`, { status: newStatus });
      await refreshData();
    } catch (err) {
      alert('Failed to update status: ' + (err.message || 'error'));
    }
  };

  const reject = async (id) => {
    try {
      await api.patch(`/blotter/${id}`, { status: 'rejected' });
      await refreshData();
      setSelected((s) => {
        const copy = new Set(s);
        copy.delete(id);
        return copy;
      });
    } catch (err) {
      alert('Failed to reject: ' + (err.message || 'error'));
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await api.delete(`/blotter/${id}`);
      await refreshData();
      setSelected((s) => {
        const copy = new Set(s);
        copy.delete(id);
        return copy;
      });
    } catch (err) {
      alert('Failed to delete: ' + (err.message || 'error'));
    }
  };

  const bulkPublish = async () => {
    if (selected.size === 0) return alert('No reports selected');
    const include = window.confirm(
      `Include reporter name & contact in public view for these ${selected.size} reports? OK = include, Cancel = anonymize`
    );
    if (!window.confirm(`Publish ${selected.size} reports?`)) return;

    const ids = Array.from(selected);
    for (const id of ids) {
      try {
        await api.patch(`/blotter/${id}`, {
          status: 'published',
          showReporter: include,
        });
      } catch (err) {
        console.warn('Failed to publish', id, err.message || err);
      }
    }
    await refreshData();
    setSelected(new Set());
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return alert('No reports selected');
    if (!window.confirm(`Delete ${selected.size} reports?`)) return;

    const ids = Array.from(selected);
    for (const id of ids) {
      try {
        await api.delete(`/blotter/${id}`);
      } catch (err) {
        console.warn('Failed to delete', id, err.message || err);
      }
    }
    await refreshData();
    setSelected(new Set());
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      published: '#10b981',
      rejected: '#ef4444',
      under_review: '#f59e0b',
      resolved: '#0066cc',
      archived: '#6b7280',
      investigating: '#f59e0b',
      closed: '#6b7280',
    };
    return colors[status] || '#6b7280';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredPending = pending.filter((b) =>
    b.title?.toLowerCase().includes(filterPending.toLowerCase())
  );

  const filteredPublished = published.filter((b) =>
    b.title?.toLowerCase().includes(filterPublished.toLowerCase())
  );

  const filteredAll = all.filter((b) => {
    const matchesTitle = b.title?.toLowerCase().includes(filterAll.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesTitle && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner-admin"></div>
        <p>Loading blotter reports...</p>
      </div>
    );
  }

  return (
    <div className="admin-blotter-modern">
      {/* Hero Section */}
      <div className="admin-hero">
        <div className="admin-hero-overlay"></div>
        <div className="admin-hero-content">
          <div className="admin-hero-info">
            <h1>🚨 Blotter Management</h1>
            <p>Review, approve, and manage all incident reports</p>
          </div>
          <div className="admin-hero-stats">
            <div className="stat-card">
              <span className="stat-number">{pending.length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{published.length}</span>
              <span className="stat-label">Published</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{all.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Container */}
      <div className="admin-blotter-container">
        {error && <div className="admin-error">❌ {error}</div>}

        {/* Tabs */}
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({pending.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Published ({published.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Reports ({all.length})
          </button>
        </div>

        {/* Pending Section */}
        {activeTab === 'pending' && (
          <div className="admin-section">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">⏳</div>
                <div>
                  <h2>
                    Pending Blotter Reports
                    <span className="section-badge">{filteredPending.length}</span>
                  </h2>
                </div>
              </div>
            </div>

            <div className="admin-controls">
              <input
                type="text"
                placeholder="Filter by title..."
                value={filterPending}
                onChange={(e) => setFilterPending(e.target.value)}
                className="filter-input"
              />
              <div className="control-group">
                <button onClick={selectAll} className="admin-btn btn-secondary">
                  Select All
                </button>
                <button onClick={clearSelection} className="admin-btn btn-secondary">
                  Clear
                </button>
                <button onClick={bulkPublish} className="admin-btn btn-success" disabled={selected.size === 0}>
                  ✅ Publish Selected ({selected.size})
                </button>
                <button onClick={bulkDelete} className="admin-btn btn-danger" disabled={selected.size === 0}>
                  🗑️ Delete Selected ({selected.size})
                </button>
              </div>
            </div>

            <div className="admin-blotter-list">
              {filteredPending.length === 0 ? (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon">📭</div>
                  <h3>No Pending Reports</h3>
                  <p>All reports have been reviewed.</p>
                </div>
              ) : (
                filteredPending.map((b) => {
                  const blotterId = b._id || b.id;
                  return (
                    <div
                      key={blotterId}
                      className={`admin-blotter-card ${selected.has(blotterId) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(blotterId)}
                        onChange={() => toggleSelect(blotterId)}
                        className="card-checkbox"
                      />

                      <div className="card-main">
                        <div className="card-header-admin">
                          <div className="card-title-group">
                            <h3>{b.title}</h3>
                            <div className="card-meta-info">
                              <span className="meta-item-admin">
                                📅 Reported: {formatDate(b.createdAt)}
                              </span>
                              <span className="meta-item-admin">
                                📆 Incident: {formatDate(b.incidentDate)}
                              </span>
                            </div>
                          </div>
                          <span
                            className="status-badge-admin"
                            style={{ backgroundColor: getStatusColor(b.status) }}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="card-description-admin">
                          {(b.description || b.shortDescription || 'No description').slice(0, 150)}...
                        </div>

                        <div className="card-actions-admin">
                          <button onClick={() => openViewModal(blotterId)} className="action-btn btn-view">
                            👁️ View Details
                          </button>
                          <button onClick={() => publish(blotterId)} className="action-btn btn-publish">
                            ✅ Publish
                          </button>
                          <button onClick={() => reject(blotterId)} className="action-btn btn-reject">
                            ⚠️ Reject
                          </button>
                          <button onClick={() => remove(blotterId)} className="action-btn btn-delete">
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Published Section */}
        {activeTab === 'published' && (
          <div className="admin-section">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">✅</div>
                <div>
                  <h2>
                    Published Blotter Reports
                    <span className="section-badge">{filteredPublished.length}</span>
                  </h2>
                </div>
              </div>
            </div>

            <div className="admin-controls">
              <input
                type="text"
                placeholder="Filter by title..."
                value={filterPublished}
                onChange={(e) => setFilterPublished(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="admin-blotter-list">
              {filteredPublished.length === 0 ? (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon">📭</div>
                  <h3>No Published Reports</h3>
                  <p>No blotters have been published yet.</p>
                </div>
              ) : (
                filteredPublished.map((b) => {
                  const blotterId = b._id || b.id;
                  return (
                    <div key={blotterId} className="admin-blotter-card">
                      <div className="card-main" style={{ paddingLeft: 0 }}>
                        <div className="card-header-admin">
                          <div className="card-title-group">
                            <h3>{b.title}</h3>
                            <div className="card-meta-info">
                              <span className="meta-item-admin">
                                📅 Reported: {formatDate(b.createdAt)}
                              </span>
                              <span className="meta-item-admin">
                                📆 Incident: {formatDate(b.incidentDate)}
                              </span>
                              <span className="meta-item-admin">
                                {b.showReporter ? '✅ Reporter Visible' : '❌ Reporter Anonymous'}
                              </span>
                            </div>
                          </div>
                          <span
                            className="status-badge-admin"
                            style={{ backgroundColor: getStatusColor(b.status) }}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="card-description-admin">
                          {(b.description || b.shortDescription || 'No description').slice(0, 150)}...
                        </div>

                        <div className="card-actions-admin">
                          <button onClick={() => openViewModal(blotterId)} className="action-btn btn-view">
                            👁️ View Details
                          </button>
                          <button onClick={() => openEditModal(b)} className="action-btn btn-edit">
                            ✏️ Edit Visibility
                          </button>
                          <button 
                            onClick={() => changeStatus(blotterId, 'investigating')} 
                            className="action-btn btn-status"
                          >
                            🔍 Investigating
                          </button>
                          <button 
                            onClick={() => changeStatus(blotterId, 'closed')} 
                            className="action-btn btn-status"
                          >
                            ✔️ Close
                          </button>
                          <button onClick={() => remove(blotterId)} className="action-btn btn-delete">
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* All Reports Section */}
        {activeTab === 'all' && (
          <div className="admin-section">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">📋</div>
                <div>
                  <h2>
                    All Blotter Reports
                    <span className="section-badge">{filteredAll.length}</span>
                  </h2>
                </div>
              </div>
            </div>

            <div className="admin-controls">
              <input
                type="text"
                placeholder="Filter by title..."
                value={filterAll}
                onChange={(e) => setFilterAll(e.target.value)}
                className="filter-input"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
                <option value="investigating">Investigating</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="admin-blotter-list">
              {filteredAll.length === 0 ? (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon">📭</div>
                  <h3>No Reports Found</h3>
                  <p>Try adjusting your filters.</p>
                </div>
              ) : (
                filteredAll.map((b) => {
                  const blotterId = b._id || b.id;
                  return (
                    <div key={blotterId} className="admin-blotter-card">
                      <div className="card-main" style={{ paddingLeft: 0 }}>
                        <div className="card-header-admin">
                          <div className="card-title-group">
                            <h3>{b.title}</h3>
                            <div className="card-meta-info">
                              <span className="meta-item-admin">
                                📅 Reported: {formatDate(b.createdAt)}
                              </span>
                              <span className="meta-item-admin">
                                📆 Incident: {formatDate(b.incidentDate)}
                              </span>
                            </div>
                          </div>
                          <span
                            className="status-badge-admin"
                            style={{ backgroundColor: getStatusColor(b.status) }}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="card-description-admin">
                          {(b.description || b.shortDescription || 'No description').slice(0, 150)}...
                        </div>

                        <div className="card-actions-admin">
                          <button onClick={() => openViewModal(blotterId)} className="action-btn btn-view">
                            👁️ View Details
                          </button>
                          <button onClick={() => remove(blotterId)} className="action-btn btn-delete">
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewModal && (
        <div className="modal-overlay" onClick={closeViewModal}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeViewModal}>✕</button>
            
            <div className="modal-header">
              <h2>{viewModal.title}</h2>
              <span
                className="status-badge-admin"
                style={{ backgroundColor: getStatusColor(viewModal.status) }}
              >
                {viewModal.status}
              </span>
            </div>

            <div className="modal-body">
              <div className="modal-meta">
                <span>📅 Reported: {formatDate(viewModal.createdAt)}</span>
                <span>📆 Incident: {formatDate(viewModal.incidentDate)}</span>
              </div>

              <div className="modal-section">
                <h3>Description</h3>
                <p>{viewModal.description || 'No description provided'}</p>
              </div>

              {(viewModal.reporterName || viewModal.reporterContact) && (
                <div className="modal-section">
                  <h3>Reporter Information</h3>
                  <div className="reporter-info-box">
                    {viewModal.reporterName && <p><strong>Name:</strong> {viewModal.reporterName}</p>}
                    {viewModal.reporterContact && <p><strong>Contact:</strong> {viewModal.reporterContact}</p>}
                    <p><strong>Public Visibility:</strong> {viewModal.showReporter ? '✅ Visible to public' : '❌ Hidden from public'}</p>
                  </div>
                </div>
              )}

              {viewModal.attachments && viewModal.attachments.length > 0 && (
                <div className="modal-section">
                  <h3>Attachments ({viewModal.attachments.length})</h3>
                  <div className="modal-attachments">
                    {viewModal.attachments.map((att, idx) => {
                      const url = getAttachmentUrl(att);
                      return url ? (
                        <img
                          key={idx}
                          src={url}
                          alt={att.originalname || `Attachment ${idx + 1}`}
                          className="modal-attachment-img"
                          onClick={() => window.open(url, '_blank')}
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeEditModal}>✕</button>
            
            <div className="modal-header">
              <h2>Edit Reporter Visibility</h2>
            </div>

            <div className="modal-body">
              <p><strong>Blotter:</strong> {editModal.title}</p>
              <p><strong>Reporter:</strong> {editModal.reporterName || 'N/A'}</p>
              <p><strong>Contact:</strong> {editModal.reporterContact || 'N/A'}</p>

              <div className="edit-option">
                <label>
                  <input
                    type="radio"
                    name="showReporter"
                    checked={editModal.showReporter === true}
                    onChange={() => setEditModal({ ...editModal, showReporter: true })}
                  />
                  <span>✅ Show reporter name and contact to public</span>
                </label>
              </div>

              <div className="edit-option">
                <label>
                  <input
                    type="radio"
                    name="showReporter"
                    checked={editModal.showReporter === false}
                    onChange={() => setEditModal({ ...editModal, showReporter: false })}
                  />
                  <span>❌ Keep reporter anonymous (hide from public)</span>
                </label>
              </div>

              <div className="modal-actions">
                <button onClick={saveEdit} className="admin-btn btn-success">
                  💾 Save Changes
                </button>
                <button onClick={closeEditModal} className="admin-btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBlotterReview;
  