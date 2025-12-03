import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlotterList.css';

function BlotterList() {
  const [blotters, setBlotters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call
    const savedBlotters = localStorage.getItem('blotters');
    setBlotters(savedBlotters ? JSON.parse(savedBlotters) : []);
    setLoading(false);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updated = blotters.filter(b => b.id !== id);
      setBlotters(updated);
      localStorage.setItem('blotters', JSON.stringify(updated));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="blotter-list-container">
      <div className="header">
        <h1>Blotter Records</h1>
        <Link to="/blotter/new" className="btn btn-primary">Add New Record</Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Complainant</th>
            <th>Respondent</th>
            <th>Incident Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blotters.map(blotter => (
            <tr key={blotter.id}>
              <td>{blotter.date}</td>
              <td>{blotter.complainant}</td>
              <td>{blotter.respondent}</td>
              <td>{blotter.incidentType}</td>
              <td><span className={`badge badge-${blotter.status}`}>{blotter.status}</span></td>
              <td>
                <Link to={`/blotter/edit/${blotter.id}`} className="btn btn-sm btn-warning">Edit</Link>
                <button onClick={() => handleDelete(blotter.id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BlotterList;
