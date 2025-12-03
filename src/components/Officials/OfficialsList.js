import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './OfficialsList.css';

function OfficialsList() {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call
    const savedOfficials = localStorage.getItem('officials');
    setOfficials(savedOfficials ? JSON.parse(savedOfficials) : []);
    setLoading(false);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      const updated = officials.filter(o => o.id !== id);
      setOfficials(updated);
      localStorage.setItem('officials', JSON.stringify(updated));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="officials-list-container">
      <div className="header">
        <h1>Barangay Officials</h1>
        <Link to="/officials/new" className="btn btn-primary">Add Official</Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Contact</th>
            <th>Term Start</th>
            <th>Term End</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {officials.map(official => (
            <tr key={official.id}>
              <td>{official.name}</td>
              <td>{official.position}</td>
              <td>{official.contact}</td>
              <td>{official.termStart}</td>
              <td>{official.termEnd}</td>
              <td>
                <Link to={`/officials/edit/${official.id}`} className="btn btn-sm btn-warning">Edit</Link>
                <button onClick={() => handleDelete(official.id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OfficialsList;
