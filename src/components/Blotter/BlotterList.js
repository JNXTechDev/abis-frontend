import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './BlotterList.css';

function BlotterList() {
  const [blotters, setBlotters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlotters();
  }, []);

  const fetchBlotters = async () => {
    try {
      setLoading(true);
      const response = await api.get('blotter');
      setBlotters(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching blotters:', err);
      setError('Failed to load blotter records');
      setBlotters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`blotter/${id}`);
        setBlotters(blotters.filter(b => b._id !== id));
      } catch (err) {
        console.error('Error deleting blotter:', err);
        alert('Failed to delete record');
      }
    }
  };

  if (loading) return <div className="loading">Loading blotter records...</div>;

  return (
    <div className="blotter-list-container">
      <div className="header">
        <h1>Blotter Records</h1>
        <Link to="/blotter/new" className="btn btn-primary">Add New Record</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Reporter</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blotters.length === 0 ? (
            <tr><td colSpan="6" className="text-center">No blotter records found</td></tr>
          ) : (
            blotters.map(blotter => (
              <tr key={blotter._id}>
                <td>{new Date(blotter.incidentDate).toLocaleDateString()}</td>
                <td>{blotter.reporterName}</td>
                <td>{blotter.title}</td>
                <td>{blotter.description.substring(0, 50)}...</td>
                <td><span className={`badge badge-${blotter.status}`}>{blotter.status}</span></td>
                <td>
                  <Link to={`/blotter/view/${blotter._id}`} className="btn btn-sm btn-info">View</Link>
                  <button onClick={() => handleDelete(blotter._id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BlotterList;
