import React, { useState } from 'react';

function DocumentPickup() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const d = documents.find(x => x.pickupCode === code.trim().toUpperCase());
    if (!d) {
      setResult({ found: false });
      return;
    }
    setResult({ found: true, doc: d });
  };

  const markCollected = (id) => {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const updated = documents.map(x => x.id === id ? { ...x, status: 'collected' } : x);
    localStorage.setItem('documents', JSON.stringify(updated));
    setResult({ found: true, doc: { ...result.doc, status: 'collected' } });
  };

  return (
    <div className="container">
      <h2>Pickup Documents</h2>
      <p>Enter the pickup code provided to the requester to retrieve document details and mark as collected.</p>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter pickup code" />
        <button onClick={handleCheck} className="btn btn-primary">Check</button>
      </div>

      {result && !result.found && (
        <div style={{marginTop:12}}>No document found for that code.</div>
      )}

      {result && result.found && (
        <div style={{marginTop:12}}>
          <h3>{result.doc.documentType}</h3>
          <p><strong>Requested by:</strong> {result.doc.residentName}</p>
          <p><strong>Status:</strong> {result.doc.status}</p>
          <p><strong>Request Date:</strong> {result.doc.requestDate}</p>
          <div style={{marginTop:8}}>
            <button className="btn btn-success" onClick={() => markCollected(result.doc.id)}>Mark Collected</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentPickup;
