import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';    


const SERVICES = [
  {
    id: 'barangay-clearance',
    title: 'Barangay Clearance',
    icon: '📄',
    description: 'Official certification that you are a resident with no pending obligations.',
    type: 'Barangay Clearance',
  },
  {
    id: 'certificate-residency',
    title: 'Certificate of Residency',
    icon: '📋',
    description: 'Proof that you reside in the barangay.',
    type: 'Certificate of Residency',
  },
  {
    id: 'certificate-indigency',
    title: 'Certificate of Indigency',
    icon: '🤝',
    description: 'Document for assistance programs for low-income families.',
    type: 'Certificate of Indigency',
  },
  {
    id: 'good-moral',
    title: 'Good Moral Certificate',
    icon: '✅',
    description: 'Character reference from the barangay.',
    type: 'Good Moral Certificate',
  },
  {
    id: 'business-permit',
    title: 'Business Permit',
    icon: '💼',
    description: 'Required clearance for local businesses.',
    type: 'Business Permit',
  },
  {
    id: 'certificate-death',
    title: 'Certificate of Death',
    icon: '📌',
    description: 'Official record of death in the barangay.',
    type: 'Certificate of Death',
  },
  {
    id: 'pwd-certificate',
    title: 'Certificate for PWD',
    icon: '♿',
    description: 'Recognition for persons with disability.',
    type: 'Certificate for PWD',
  },
  {
    id: 'certificate-vaccination',
    title: 'Certificate of Vaccination',
    icon: '💉',
    description: 'Proof of vaccination issued by the barangay.',
    type: 'Certificate of Vaccination',
  },
  {
    id: 'certificate-appearance',
    title: 'Certificate of Appearance',
    icon: '👤',
    description: 'Issued to certify official appearance in the barangay.',
    type: 'Certificate of Appearance',
  },
  {
    id: 'certificate-achiever',
    title: 'Certificate for Achiever',
    icon: '🏆',
    description: 'Recognition for academic or community achievement.',
    type: 'Certificate for Achiever',
  },
  {
    id: 'jobseeker-oath',
    title: 'First Time Jobseeker Oath',
    icon: '📑',
    description: 'Oath certificate for first-time jobseekers.',
    type: 'First Time Jobseeker Oath',
  },
  {
    id: 'certificate-livein',
    title: 'Certificate of Live-In',
    icon: '❤️',
    description: 'Certification of live-in relationship status.',
    type: 'Certificate of Live-In',
  },
];

function Services() {
  return (
    <div className="services-modern">
      {/* Hero Section */}
      <div className="services-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-icon">📋</div>
          <h1>Barangay Services</h1>
          <p>Request official documents and certificates online</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="services-container">
        <div className="services-grid">
          {SERVICES.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link
                to={`/request?type=${encodeURIComponent(service.type)}`}
                className="service-btn"
              >
                Request Now →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;
