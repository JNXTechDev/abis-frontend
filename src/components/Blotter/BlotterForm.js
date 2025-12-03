import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './BlotterForm.css';

function BlotterForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reporterName: '',
    reporterContact: '',
    incidentDate: '',
    status: 'pending'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadBlotter();
    }
  }, [id]);

  const loadBlotter = async () => {
    try {
      setLoading(true);
      const response = await api.get(`blotter/${id}`);
      setFormData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading blotter:', err);
      setError('Failed to load blotter record');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await api.put(`blotter/${id}`, formData);
      } else {
        await api.post('blotter', formData);
      }
      navigate('/blotter');
    } catch (err) {
      console.error('Error saving blotter:', err);
      setError('Failed to save blotter record');
      setLoading(false);
    }
  };

  if (loading && id) return <div className="loading">Loading...</div>;

  return (
    <div className="form-container">
      <h1>{id ? 'Edit' : 'New'} Blotter Record</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Incident Date & Time</label>
          <input type="datetime-local" name="incidentDate" value={formData.incidentDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required></textarea>
        </div>
        <div className="form-group">
          <label>Reporter Name</label>
          <input type="text" name="reporterName" value={formData.reporterName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Reporter Contact</label>
          <input type="text" name="reporterContact" value={formData.reporterContact} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>Save</button>
      </form>
    </div>
  );
}

export default BlotterForm;
