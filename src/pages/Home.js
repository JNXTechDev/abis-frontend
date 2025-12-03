import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Chatbot from '../components/Chatbot/Chatbot';


function Home() {
  return (
    <div className="home-modern">
      <Chatbot />
      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">🏛️ ABIS</div>
          <h1>Automated Barangay Information System</h1>
          <p className="hero-subtitle">Brgy. Pulao, Dumangas, Iloilo</p>
          <p className="hero-description">
            Efficient, Transparent, and Resident-Centered Services
          </p>
          <Link to="/services" className="hero-cta-btn">
            Request a Document →
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="home-container">
        <div className="features-header">
          <h2>Our Services</h2>
          <p>Easy access to barangay documents and certificates</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Document Requests</h3>
            <p>Request barangay clearance, certificates, and other official documents online.</p>
            <Link to="/services" className="feature-link">Browse Services →</Link>
          </div>

          

          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Business Clearance</h3>
            <p>Apply for barangay business clearance for new and existing businesses.</p>
            <Link to="/request?type=Business%20Permit" className="feature-link">
              Get Started →
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Public Blotter</h3>
            <p>View and report community incidents through our public blotter system.</p>
            <Link to="/blotter" className="feature-link">View Reports →</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Track Requests</h3>
            <p>Monitor the status of your document requests using your tracking number.</p>
            <Link to="/track" className="feature-link">Track Now →</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔖</div>
            <h3>Track Blotter</h3>
            <p>Check the status of your blotter report using the public token (private details are hidden).</p>
            <Link to="/track-blotter" className="feature-link">Track Blotter →</Link>
          </div>

          
        </div>
      </div>

      {/* Call to Action */}
      <div className="home-cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Request your barangay documents today and experience fast, efficient service</p>
          <div className="cta-buttons">
            <Link to="/services" className="cta-btn-primary">
              Browse Services
            </Link>
            <Link to="/track" className="cta-btn-secondary">
              Track Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
