import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DocumentForm.css';
import api from '../../services/api';

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
    { name: 'business_address', label: 'Business Address', type: 'text', required: false },
  ],
};
function DocumentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requestDate: '',
    residentName: '',
    documentType: 'Barangay Clearance',
    purpose: '',
    status: 'pending',
    issuedDate: '',
    appointmentDatetime: '',
    pickup: false,
    pickupCode: '',
    formFields: {},
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      // Try backend first
      try {
        const res = await api.get(`documents/${id}`);
        if (!mounted) return;
        const d = res.data;
        setFormData({
          requestDate: d.requestDate ? d.requestDate.split('T')[0] : '',
          residentName: d.residentName || '',
          documentType: d.documentType || d.docType || 'Barangay Clearance',
          purpose: d.formFields?.purpose || d.purpose || '',
          status: d.status || 'pending',
          issuedDate: d.issuedAt ? d.issuedAt.split('T')[0] : (d.issuedDate || ''),
          appointmentDatetime: d.appointmentDatetime || d.appointment_datetime || '',
          pickup: d.formFields?.pickup || d.pickup || false,
          pickupCode: d.pickupCode || d.pickup_code || '',
          formFields: d.formFields || {},
        });
        return;
      } catch (err) {
        // fallback to localStorage
      }

      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      const doc = documents.find(d => String(d.id) === String(id));
      if (mounted && doc) setFormData(doc);
    };

    load();
    return () => { mounted = false; };
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    });
  };

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, formFields: { ...prev.formFields, [name]: value } }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');

    const payload = {
      residentName: formData.residentName,
      docType: formData.documentType,
      formFields: { ...formData.formFields, purpose: formData.purpose, pickup: formData.pickup },
      purpose: formData.purpose,
      status: formData.status,
      appointmentDatetime: formData.appointmentDatetime,
      pickup: formData.pickup,
      pickupCode: formData.pickupCode,
      remarks: formData.remarks || '',
      issuedAt: formData.issuedDate ? new Date(formData.issuedDate).toISOString() : undefined,
    };

    if (id) {
      // try backend update, fall back to localStorage
      api.patch(`documents/${id}/`, payload).catch(() => {
        const index = documents.findIndex(d => String(d.id) === String(id));
        if (index !== -1) documents[index] = { ...formData, id };
        localStorage.setItem('documents', JSON.stringify(documents));
      });
    } else {
      // try backend create
      api.post('documents/', payload).then((res) => {
        // successful, navigate to admin documents
      }).catch(() => {
        const newDoc = { ...formData, id: Date.now() };
        if (newDoc.pickup && !newDoc.pickupCode) {
          newDoc.pickupCode = Math.random().toString(36).slice(2, 10).toUpperCase();
        }
        documents.push(newDoc);
        localStorage.setItem('documents', JSON.stringify(documents));
      });
    }

    navigate('/admin/documents');
  };

  return (
    <div className="form-container">
      <h1>{id ? 'Edit' : 'Issue'} Document</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Request Date</label>
          <input type="date" name="requestDate" value={formData.requestDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Resident Name</label>
          <input type="text" name="residentName" value={formData.residentName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Document Type</label>
          <select name="documentType" value={formData.documentType} onChange={handleChange} required>
            <option value="Barangay Clearance">Barangay Clearance</option>
            <option value="Certificate of Residency">Certificate of Residency</option>
            <option value="Certificate of Indigency">Certificate of Indigency</option>
            <option value="Good Moral Certificate">Good Moral Certificate</option>
            <option value="Business Permit">Business Permit</option>
          </select>
        </div>
        {/* Dynamic fields per document type */}
        {(DOCUMENT_FIELDS[formData.documentType] || []).map((f) => (
          <div className="form-group" key={f.name}>
            <label>{f.label}</label>
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
          <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="issued">Issued</option>
          </select>
        </div>
        <div className="form-group">
          <label>Issued Date</label>
          <input type="date" name="issuedDate" value={formData.issuedDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Request Appointment / Pickup</label>
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            <input type="datetime-local" name="appointmentDatetime" value={formData.appointmentDatetime} onChange={handleChange} />
            <label style={{display:'flex',gap:'6px',alignItems:'center'}}><input type="checkbox" name="pickup" checked={formData.pickup} onChange={handleChange} /> Pickup at Barangay Hall</label>
          </div>
        </div>
        {formData.pickup && (
          <div className="form-group">
            <label>Pickup Code (auto-generated)</label>
            <input type="text" name="pickupCode" value={formData.pickupCode || ''} readOnly />
          </div>
        )}
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}

export default DocumentForm;
