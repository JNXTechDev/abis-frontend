import React, { useState } from 'react';
import './Settings.css';

function Settings() {
  const [settings, setSettings] = useState({
    barangayName: 'Barangay Pulao',
    municipality: 'Dumangas',
    province: 'Iloilo'
  });

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    localStorage.setItem('barangaySettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-container">
      <h1>System Settings</h1>
      
      <div className="settings-section">
        <h2>Barangay Information</h2>
        <div className="form-group">
          <label>Barangay Name</label>
          <input type="text" name="barangayName" value={settings.barangayName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Municipality</label>
          <input type="text" name="municipality" value={settings.municipality} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Province</label>
          <input type="text" name="province" value={settings.province} onChange={handleChange} />
        </div>
        <button onClick={handleSave} className="btn btn-primary">Save Settings</button>
      </div>
    </div>
  );
}

export default Settings;
