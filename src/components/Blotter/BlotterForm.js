import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BlotterForm.css';

function BlotterForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    complainant: '',
    respondent: '',
    incidentType: '',
    narrative: '',
    status: 'pending'
  });

  useEffect(() => {
    if (id) {
      // TODO: Replace with API call
      const blotters = JSON.parse(localStorage.getItem('blotters') || '[]');
      const blotter = blotters.find(b => b.id === parseInt(id));
      if (blotter) setFormData(blotter);
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const blotters = JSON.parse(localStorage.getItem('blotters') || '[]');
    
    if (id) {
      const index = blotters.findIndex(b => b.id === parseInt(id));
      blotters[index] = { ...formData, id: parseInt(id) };
    } else {
      blotters.push({ ...formData, id: Date.now() });
    }
    
    localStorage.setItem('blotters', JSON.stringify(blotters));
    navigate('/blotter');
  };

  return (
    <div className="form-container">
      <h1>{id ? 'Edit' : 'New'} Blotter Record</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Complainant Name</label>
          <input type="text" name="complainant" value={formData.complainant} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Respondent Name</label>
          <input type="text" name="respondent" value={formData.respondent} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Incident Type</label>
          <select name="incidentType" value={formData.incidentType} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="Dispute">Dispute</option>
            <option value="Theft">Theft</option>
            <option value="Assault">Assault</option>
            <option value="Disturbance">Disturbance</option>
          </select>
        </div>
        <div className="form-group">
          <label>Narrative</label>
          <textarea name="narrative" value={formData.narrative} onChange={handleChange} rows="5"></textarea>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}

export default BlotterForm;
