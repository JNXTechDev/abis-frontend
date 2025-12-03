import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  return (
    <div className="about-modern">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-icon">ℹ️</div>
          <h1>About ABIS</h1>
          <p>Automated Barangay Information System</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-container">
        {/* About Card */}
        <div className="about-card">
          <div className="card-icon">🏛️</div>
          <h2>About Us</h2>
          <p>
            The Automated Barangay Information System (ABIS) of Brgy. Pulao, Dumangas, Iloilo 
            is dedicated to providing efficient, transparent, and resident-centered services. 
            Our goal is to streamline barangay processes by making document requests, clearances, 
            and certificates accessible online, ensuring faster service and better community engagement.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="mission-vision-grid">
          <div className="mv-card">
            <div className="mv-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>
              To modernize and streamline the management of barangay data and services by automating 
              routine tasks, improving accessibility to information, enhancing transparency, facilitating 
              communication between officials and residents, supporting informed decision-making, and 
              reducing paperwork to create a more efficient and organized community management system.
            </p>
          </div>

          <div className="mv-card">
            <div className="mv-icon">👁️</div>
            <h2>Our Vision</h2>
            <p>
              A barangay where technology empowers both officials and residents to work together for 
              better governance, faster services, and stronger community bonds.
            </p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="contact-card">
          <h2>📍 Contact Information</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <span className="contact-icon">🏢</span>
              <div className="contact-details">
                <strong>Location</strong>
                <p>Barangay Pulao, Dumangas, Iloilo</p>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div className="contact-details">
                <strong>Email</strong>
                <p>abis@barangay-pulao.gov.ph</p>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div className="contact-details">
                <strong>Phone</strong>
                <p>(033) XXX-XXXX</p>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">🕐</span>
              <div className="contact-details">
                <strong>Office Hours</strong>
                <p>Monday - Friday, 8:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="about-cta">
          <h2>Ready to Get Started?</h2>
          <p>Experience our efficient and transparent barangay services today</p>
          <div className="cta-buttons">
            <Link to="/services" className="cta-btn-primary">Browse Services</Link>
            <Link to="/track" className="cta-btn-secondary">Track Request</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
