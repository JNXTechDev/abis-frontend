import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import './DocumentsList.css';

function DocumentsList() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Modal states
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/documents');
      setRequests(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      setViewModal(response.data);
    } catch (err) {
      alert('Failed to load document details: ' + err.message);
    }
  };

  const openEditModal = (request) => {
    setEditModal({
      ...request,
      _id: request._id || request.id
    });
  };

  const closeViewModal = () => setViewModal(null);
  const closeEditModal = () => setEditModal(null);

  const saveEdit = async () => {
    if (!editModal) return;
    const docId = editModal._id || editModal.id;
    try {
      await api.patch(`/documents/${docId}`, {
        status: editModal.status,
        residentName: editModal.residentName,
        documentType: editModal.documentType,
      });
      await fetchRequests();
      closeEditModal();
    } catch (err) {
      alert('Failed to save changes: ' + err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/documents/${id}`, { status: newStatus });
      fetchRequests();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await api.delete(`/documents/${id}`);
      fetchRequests();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.residentName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || req.documentType === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      approved: '#0066cc',
      issued: '#10b981',
      collected: '#6b7280',
      rejected: '#ef4444',
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

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner-admin"></div>
        <p>Loading document requests...</p>
      </div>
    );
  }

  return (
    <div className="documents-modern">
      {/* Hero Section */}
      <div className="documents-hero">
        <div className="documents-hero-overlay"></div>
        <div className="documents-hero-content">
          <div className="documents-hero-info">
            <h1>📄 Document Requests Management</h1>
            <p>Track and manage all barangay document requests</p>
          </div>
          <div className="documents-hero-stats">
            <div className="stat-card">
              <span className="stat-number">{requests.filter(r => r.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{requests.filter(r => r.status === 'approved').length}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{requests.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Container */}
      <div className="documents-container">
        {error && <div className="documents-error">❌ {error}</div>}

        {/* Filters Section */}
        <div className="documents-section">
          <div className="section-header">
            <div className="section-title">
              <div className="section-icon">🔍</div>
              <h2>
                Filter Requests
                <span className="section-badge">{filteredRequests.length}</span>
              </h2>
            </div>
          </div>

          <div className="filters-grid">
            <div className="filter-item">
              <input
                type="text"
                placeholder="Search by tracking number or resident name..."
                className="filter-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-item">
              <label>Status:</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="issued">Issued</option>
                <option value="collected">Collected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Category:</label>
              <select
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Certificate of Residency">Certificate of Residency</option>
                <option value="Barangay Clearance">Barangay Clearance</option>
                <option value="Certificate of Indigency">Certificate of Indigency</option>
                <option value="Business Permit">Business Permit</option>
              </select>
            </div>

            <div className="filter-item">
              <button className="btn-clear" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="documents-section">
          <div className="section-header">
            <div className="section-title">
              <div className="section-icon">📋</div>
              <h2>
                All Requests
                <span className="section-badge">{filteredRequests.length}</span>
              </h2>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="documents-empty-state">
              <div className="documents-empty-icon">📭</div>
              <h3>No Requests Found</h3>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="documents-grid">
              {filteredRequests.map((req) => {
                const docId = req._id || req.id;
                return (
                  <div key={docId} className="document-card">
                    <div className="card-header-doc">
                      <div className="card-title-section">
                        <div className="tracking-code">{req.trackingNumber}</div>
                        <span
                          className="status-badge-doc"
                          style={{ backgroundColor: getStatusColor(req.status) }}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>

                    <div className="card-body-doc">
                      <div className="doc-info-row">
                        <span className="doc-label">📅 Request Date:</span>
                        <span className="doc-value">{formatDate(req.requestDate)}</span>
                      </div>

                      <div className="doc-info-row">
                        <span className="doc-label">👤 Resident:</span>
                        <span className="doc-value">{req.residentName}</span>
                      </div>

                      <div className="doc-info-row">
                        <span className="doc-label">📄 Document Type:</span>
                        <span className="doc-value">{req.documentType}</span>
                      </div>

                      <div className="doc-info-row">
                        <span className="doc-label">📊 Status:</span>
                        <select
                          className={`status-select-doc status-${req.status}`}
                          value={req.status}
                          onChange={(e) => handleStatusChange(docId, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="issued">Issued</option>
                          <option value="collected">Collected</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="card-actions-doc">
                      <button 
                        className="action-btn btn-view"
                        onClick={() => openViewModal(docId)}
                      >
                        👁️ View Details
                      </button>
                      <button 
                        className="action-btn btn-edit"
                        onClick={() => openEditModal(req)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="action-btn btn-delete"
                        onClick={() => handleDelete(docId)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewModal && (
        <div className="modal-overlay" onClick={closeViewModal}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeViewModal}>✕</button>
            
            <div className="modal-header">
              <h2>📄 Complete Document Request Details</h2>
              <span
                className="status-badge-doc"
                style={{ backgroundColor: getStatusColor(viewModal.status) }}
              >
                {viewModal.status}
              </span>
            </div>

            <div className="modal-body">
              {/* Database ID Section */}
              <div className="modal-section">
                <h3>🔑 System Information</h3>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <strong>Database ID:</strong>
                    <span className="monospace-text">{viewModal._id || viewModal.id}</span>
                  </div>
                </div>
              </div>

              {/* Request Information */}
              <div className="modal-section">
                <h3>📋 Request Information</h3>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <strong>Tracking Number:</strong>
                    <span className="tracking-code">{viewModal.trackingNumber || 'N/A'}</span>
                  </div>
                  <div className="modal-info-item">
                    <strong>Document Type (docType):</strong>
                    <span>{viewModal.docType || viewModal.documentType || 'N/A'}</span>
                  </div>
                  <div className="modal-info-item">
                    <strong>Status:</strong>
                    <span>{viewModal.status || 'N/A'}</span>
                  </div>
                  <div className="modal-info-item">
                    <strong>Pickup Code:</strong>
                    <span className="monospace-text">{viewModal.pickupCode || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Resident Information */}
              <div className="modal-section">
                <h3>👤 Resident Information</h3>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <strong>Resident Name:</strong>
                    <span>{viewModal.residentName || 'N/A'}</span>
                  </div>
                  <div className="modal-info-item">
                    <strong>Contact:</strong>
                    <span>{viewModal.residentContact || viewModal.contact || 'N/A'}</span>
                  </div>
                  <div className="modal-info-item">
                    <strong>Address:</strong>
                    <span>{viewModal.residentAddress || viewModal.address || 'N/A'}</span>
                  </div>
                  <div className="modal-info-item">
                    <strong>Email:</strong>
                    <span>{viewModal.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Purpose Section */}
              {viewModal.purpose && (
                <div className="modal-section">
                  <h3>📝 Purpose</h3>
                  <div className="purpose-box">
                    <p>{viewModal.purpose}</p>
                  </div>
                </div>
              )}

              {/* Form Data Section */}
              {viewModal.formData && Object.keys(viewModal.formData).length > 0 && (
                <div className="modal-section">
                  <h3>📝 Form Data (Additional Fields)</h3>
                  <div className="modal-info-grid">
                    {Object.entries(viewModal.formData).map(([key, value]) => (
                      <div className="modal-info-item" key={key}>
                        <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
                        <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="modal-section">
                <h3>⏰ Timestamps</h3>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <strong>Request Date:</strong>
                    <span>{formatDate(viewModal.requestDate || viewModal.createdAt)}</span>
                  </div>
                  <div className="modal-info-item">
                    <strong>Created At:</strong>
                    <span>{formatDate(viewModal.createdAt)}</span>
                  </div>
                  <div className="modal-info-item">
                    <strong>Updated At:</strong>
                    <span>{formatDate(viewModal.updatedAt)}</span>
                  </div>
                  <div className="modal-info-item">
                    <strong>Appointment DateTime:</strong>
                    <span>{viewModal.appointmentDatetime ? formatDate(viewModal.appointmentDatetime) : 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Remarks Section */}
              {viewModal.remarks && (
                <div className="modal-section">
                  <h3>💬 Remarks</h3>
                  <div className="remarks-box">
                    <p>{viewModal.remarks}</p>
                  </div>
                </div>
              )}

              {/* Raw JSON Data (Expandable) */}
              <div className="modal-section">
                <h3>🔍 Complete Raw Data (JSON)</h3>
                <details className="json-details">
                  <summary className="json-summary">Click to view complete database object</summary>
                  <pre className="json-viewer">
                    {JSON.stringify(viewModal, null, 2)}
                  </pre>
                </details>
              </div>
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
              <h2>Edit Document Request</h2>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <div className="edit-form-group">
                  <label>Tracking Number:</label>
                  <input
                    type="text"
                    className="edit-input"
                    value={editModal.trackingNumber}
                    disabled
                  />
                </div>

                <div className="edit-form-group">
                  <label>Resident Name:</label>
                  <input
                    type="text"
                    className="edit-input"
                    value={editModal.residentName}
                    onChange={(e) => setEditModal({ ...editModal, residentName: e.target.value })}
                  />
                </div>

                <div className="edit-form-group">
                  <label>Document Type:</label>
                  <select
                    className="edit-input"
                    value={editModal.documentType}
                    onChange={(e) => setEditModal({ ...editModal, documentType: e.target.value })}
                  >
                    <option value="Certificate of Residency">Certificate of Residency</option>
                    <option value="Barangay Clearance">Barangay Clearance</option>
                    <option value="Certificate of Indigency">Certificate of Indigency</option>
                    <option value="Business Permit">Business Permit</option>
                  </select>
                </div>

                <div className="edit-form-group">
                  <label>Status:</label>
                  <select
                    className="edit-input"
                    value={editModal.status}
                    onChange={(e) => setEditModal({ ...editModal, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="issued">Issued</option>
                    <option value="collected">Collected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={saveEdit} className="modal-btn btn-save">
                  💾 Save Changes
                </button>
                <button onClick={closeEditModal} className="modal-btn btn-cancel">
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

export default DocumentsList;
