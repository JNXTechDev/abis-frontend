// src/components/ResidentRecords/ResidentsList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ResidentsList.css';

function ResidentsList() {
  const [residents, setResidents] = useState([
    {
      id: 1,
      firstName: 'Juan',
      middleName: 'Dela',
      lastName: 'Cruz',
      dateOfBirth: '1990-05-15',
      sex: 'Male',
      civilStatus: 'Single',
      occupation: 'Farmer',
      address: '123 Main St',
      contactNumber: '09123456789',
    },
    {
      id: 2,
      firstName: 'Maria',
      middleName: 'Santos',
      lastName: 'Reyes',
      dateOfBirth: '1992-08-20',
      sex: 'Female',
      civilStatus: 'Married',
      occupation: 'Teacher',
      address: '456 Oak Ave',
      contactNumber: '09987654321',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this resident?')) {
      setResidents(residents.filter((r) => r.id !== id));
    }
  };

  const filteredResidents = residents.filter(
    (resident) =>
      resident.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="residents-list">
      <div className="list-header">
        <h2>Resident Records</h2>
        <Link to="/residents/new" className="btn-add">
          ➕ Add New Resident
        </Link>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="residents-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Sex</th>
              <th>Civil Status</th>
              <th>Occupation</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.map((resident) => (
              <tr key={resident.id}>
                <td>
                  {resident.firstName} {resident.middleName} {resident.lastName}
                </td>
                <td>{resident.sex}</td>
                <td>{resident.civilStatus}</td>
                <td>{resident.occupation}</td>
                <td>{resident.address}</td>
                <td>{resident.contactNumber}</td>
                <td className="actions">
                  <Link to={`/residents/edit/${resident.id}`} className="btn-edit">
                    ✏️
                  </Link>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(resident.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredResidents.length === 0 && (
        <div className="no-data">No residents found</div>
      )}
    </div>
  );
}

export default ResidentsList;