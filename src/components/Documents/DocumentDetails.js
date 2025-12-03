import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './DocumentDetails.css';
import api from '../../services/api';

function DocumentDetails() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchDoc = async () => {
      try {
        const res = await api.get(`documents/${id}/`);
        if (!mounted) return;
        const d = res.data;
        const mapped = {
          id: d.id,
          trackingNumber: d.trackingNumber || d.tracking_number || d.pickupCode || `API-${d.id}`,
          requestDate: d.requestDate ? d.requestDate.split('T')[0] : '',
          residentName: d.residentName || '',
          documentType: d.documentType || '',
          status: d.status || 'pending',
          appointmentDatetime: d.appointmentDatetime ? d.appointmentDatetime.split('T')[0] : '',
          pickupCode: d.pickupCode || '',
          remarks: d.remarks || '',
          formFields: d.formFields || {},
        };
        setDoc(mapped);
      } catch (err) {
        const documents = JSON.parse(localStorage.getItem('documents') || '[]');
        const d = documents.find((x) => x.id === parseInt(id));
        if (mounted && d) setDoc(d);
      }
    };

    fetchDoc();
    return () => { mounted = false; };
  }, [id]);

  if (!doc) return <div className="container">Document not found.</div>;

  return (
    <div className="document-details-page">
      <div className="details-header">
        <h1>{doc.documentType} Request</h1>
        <span className={`status-badge status-${doc.status}`}>{doc.status.toUpperCase()}</span>
      </div>

      <div className="details-card tracking-info-card">
        <div className="tracking-number-section">
          <label>Tracking Number</label>
          <div className="tracking-display">{doc.trackingNumber || 'N/A'}</div>
          <p className="help-text">Use this number to track your request status</p>
        </div>
      </div>

      <div className="details-card">
        <h3>Request Information</h3>
        <div className="info-row">
          <label>Resident Name:</label>
          <span>{doc.residentName}</span>
        </div>
        <div className="info-row">
          <label>Request Date:</label>
          <span>{doc.requestDate}</span>
        </div>
        <div className="info-row">
          <label>Status:</label>
          <span className={`status-badge status-${doc.status}`}>{doc.status}</span>
        </div>
        <div className="info-row">
          <label>Will Pick Up at Barangay Hall:</label>
          <span>{doc.formFields?.pickup === true || doc.formFields?.pickup === 'true' ? '✓ Yes' : '✗ No'}</span>
        </div>
        {doc.formFields?.purpose && (
          <div className="info-row">
            <label>Purpose:</label>
            <span>{doc.formFields.purpose}</span>
          </div>
        )}
      </div>

      {doc.appointmentDatetime && (
        <div className="details-card">
          <h3>Appointment Details</h3>
          <div className="info-row">
            <label>Appointment Date & Time:</label>
            <span>{doc.appointmentDatetime}</span>
          </div>
        </div>
      )}

      {doc.pickupCode && (
        <div className="details-card pickup-info-card">
          <h3>Pickup Information</h3>
          <div className="info-row">
            <label>Pickup Code:</label>
            <code className="pickup-code-display">{doc.pickupCode}</code>
          </div>
          <p className="help-text">Bring this code when picking up the document at the barangay hall.</p>
        </div>
      )}

      {doc.remarks && (
        <div className="details-card remarks-card">
          <h3>Admin Remarks</h3>
          <div className="remarks-content">{doc.remarks}</div>
        </div>
      )}

      <div className="actions-section">
        <Link to="/admin/documents" className="btn btn-secondary">Back to Documents</Link>
        <button className="btn btn-primary" onClick={() => window.history.back()}>Go Back</button>
      </div>
    </div>
  );
}

export default DocumentDetails;
