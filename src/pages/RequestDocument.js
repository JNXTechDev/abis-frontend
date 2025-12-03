import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './RequestDocument.css';
import api from '../services/api';

const DOCUMENT_FIELDS = {
  'Barangay Clearance': [
    { name: 'purpose', label: 'Purpose', type: 'text', required: true },
  ],
  'Certificate of Residency': [
    { name: 'years_resided', label: 'Years of Residency', type: 'number', required: false },
  ],
  'Certificate of Indigency': [
    { name: 'household_income', label: 'Household Monthly Income', type: 'number', required: false },
  ],
  'Good Moral Certificate': [
    { name: 'school', label: 'School / Employer', type: 'text', required: false },
  ],
  'Business Permit': [
    { name: 'business_name', label: 'Business Name', type: 'text', required: true },
    { name: 'business_address', label: 'Business Address', type: 'text', required: true },
    { name: 'business_owner', label: "Owner's Full Name", type: 'text', required: true },
    { name: 'business_type', label: 'Type of Business', type: 'text', required: false },
    { name: 'business_registration', label: 'Business Registration / DTI Number', type: 'text', required: false },
  ],
  'Certificate of Death': [
    { name: 'deceased_name', label: 'Deceased Name', type: 'text', required: true },
  ],
  'Certificate for PWD': [
    { name: 'disability_type', label: 'Type of Disability', type: 'text', required: false },
  ],
  'Certificate of Vaccination': [
    { name: 'vaccine_type', label: 'Vaccine Type', type: 'text', required: false },
  ],
  'Certificate of Appearance': [
    { name: 'purpose', label: 'Purpose', type: 'text', required: false },
  ],
  'Certificate for Achiever': [
    { name: 'achievement', label: 'Achievement Details', type: 'text', required: false },
  ],
  'First Time Jobseeker Oath': [
    { name: 'school_graduated', label: 'School Graduated From', type: 'text', required: false },
  ],
  'Certificate of Live-In': [
    { name: 'partner_name', label: 'Partner Name', type: 'text', required: false },
  ],
};

function RequestDocument() {
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get('type') || 'Barangay Clearance';
  const [formData, setFormData] = useState({
    requestDate: new Date().toISOString().slice(0, 10),
    residentName: '',
    documentType: serviceType,
    purpose: '',
    appointmentDatetime: '',
    pickup: false,
    pickupCode: '',
    formFields: {},
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, formFields: { ...prev.formFields, [name]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        residentName: formData.residentName,
        documentType: formData.documentType,
        formFields: formData.formFields,
        purpose: formData.purpose,
        appointmentDatetime: formData.appointmentDatetime || null,
        pickup: formData.pickup,
      };

      // Try to save to backend
      let newDoc = null;
      try {
        const response = await api.post('/documents', payload);
        newDoc = response.data;
      } catch (apiErr) {
        // Fallback: save to localStorage if backend fails
        console.warn('Backend unavailable, saving to localStorage:', apiErr.message);
        const documents = JSON.parse(localStorage.getItem('documents') || '[]');
        const trackingNumber = `ABIS-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        const pickupCode = formData.pickup ? Math.random().toString(36).slice(2, 10).toUpperCase() : '';
        newDoc = {
          id: Date.now(),
          trackingNumber,
          requestDate: formData.requestDate,
          ...payload,
          pickupCode,
          remarks: '',
        };
        documents.push(newDoc);
        localStorage.setItem('documents', JSON.stringify(documents));
      }

      setSubmitted(true);
      setTimeout(() => {
        window.location.href = '/track/' + (newDoc.trackingNumber || newDoc.id);
      }, 2000);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit request. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="request-success">
        <div className="success-box">
          <h2>✓ Request Submitted Successfully!</h2>
          <p>Your document request has been received.</p>
          <p>Redirecting to tracking page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="request-container">
        <h1>Request {formData.documentType}</h1>
        <form onSubmit={handleSubmit} className="request-form">
          <div className="form-row">
            <div className="form-group">
              <label>Your Full Name *</label>
              <input
                type="text"
                name="residentName"
                value={formData.residentName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Request Date</label>
              <input type="date" name="requestDate" value={formData.requestDate} readOnly />
            </div>
          </div>

          {(DOCUMENT_FIELDS[formData.documentType] || []).map((f) => (
            <div className="form-group" key={f.name}>
              <label>{f.label}{f.required && ' *'}</label>
              <input
                type={f.type}
                name={f.name}
                value={formData.formFields?.[f.name] || ''}
                onChange={(e) => handleFieldChange(f.name, e.target.value)}
                required={f.required}
              />
            </div>
          ))}

          <div className="form-group">
            <label>Purpose</label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Why do you need this document?"
            />
          </div>

          <div className="form-divider">Pickup Details</div>

          <div className="form-group">
            <label>Preferred Pickup Date & Time</label>
            <input
              type="datetime-local"
              name="appointmentDatetime"
              value={formData.appointmentDatetime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="pickup"
                checked={formData.pickup}
                onChange={handleChange}
              />
              I will pick up the document at the barangay hall
            </label>
          </div>

          {formData.pickup && (
            <div className="info-box">
              <p>You will receive a pickup code. Save it to collect your document at the barangay hall.</p>
            </div>
          )}

          <div className="form-actions">
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
            <button type="submit" className="submit-btn">Submit Request</button>
            <Link to="/services" className="cancel-btn">Back to Services</Link>
          </div>
        </form>
    </div>
  );
}

export default RequestDocument;
