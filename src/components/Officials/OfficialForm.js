import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OfficialForm.css';

function OfficialForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    contact: '',
    email: '',
    termStart: '',
    termEnd: ''
  });

  useEffect(() => {
    if (id) {
      const officials = JSON.parse(localStorage.getItem('officials') || '[]');
      const official = officials.find(o => o.id === parseInt(id));
      if (official) setFormData(official);
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
    const officials = JSON.parse(localStorage.getItem('officials') || '[]');
    
    if (id) {
      const index = officials.findIndex(o => o.id === parseInt(id));
      officials[index] = { ...formData, id: parseInt(id) };
    } else {
      officials.push({ ...formData, id: Date.now() });
    }
    
    localStorage.setItem('officials', JSON.stringify(officials));
    navigate('/officials');
  };

  return (
    <div className="form-container">
      <h1>{id ? 'Edit' : 'Add'} Official</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Position</label>
          <select name="position" value={formData.position} onChange={handleChange} required>
            <option value="">Select Position</option>
            <option value="Barangay Captain">Barangay Captain</option>
            <option value="Barangay Secretary">Barangay Secretary</option>
            <option value="Barangay Treasurer">Barangay Treasurer</option>
            <option value="Barangay Councilor">Barangay Councilor</option>
          </select>
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <input type="tel" name="contact" value={formData.contact} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Term Start</label>
          <input type="date" name="termStart" value={formData.termStart} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Term End</label>
          <input type="date" name="termEnd" value={formData.termEnd} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}

export default OfficialForm;
