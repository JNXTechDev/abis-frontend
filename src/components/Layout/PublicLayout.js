import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Layout/Navbar.css';
import '../../pages/Home.css';
import { AuthContext } from '../../contexts/AuthContext';

import logo from '../../assets/brgyLogo.png';
import slide1 from '../../assets/1.JPG';
import slide2 from '../../assets/2.jpg';
import slide3 from '../../assets/3.jpg';
import slide4 from '../../assets/4.jpg';
import slide5 from '../../assets/5.jpg';

function PublicLayout({ children }) {
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const slides = [slide1, slide2, slide3, slide4, slide5];
  const [index, setIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAdmin = user?.type === 'admin';

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [slides.length]);

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div>
      {isAdmin ? (
        // Admin Navbar
        <nav className="public-nav">
          <div className="nav-container">
            <div className="nav-logo">
              <img src={logo} alt="Barangay Seal" className="logo-img" />
              <span>ABIS</span>
            </div>
            <ul className="nav-links">
              <li><Link to="/admin/documents">Manage Documents</Link></li>
              <li><Link to="/admin/blotter-review">Review Blotter</Link></li>
              <li><Link to="/">View Public</Link></li>
              <li>
                <button 
                  onClick={handleLogoutClick} 
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>
      ) : (
        // Public Navbar
        <nav className="public-nav">
          <div className="nav-container">
            <div className="nav-logo">
              <img src={logo} alt="Barangay Seal" className="logo-img" />
              <span>ABIS</span>
            </div>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/track">Track Request</Link></li>
              <li><Link to="/blotter">Blotter</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/login" className="nav-login">Admin Login</Link></li>
            </ul>
          </div>
        </nav>
      )}

      <section className="hero">
        {!isAdmin && (
          <div className="hero-slideshow" aria-hidden>
            {slides.map((s, i) => (
              <div key={s} className={`hero-slide ${i === index ? 'active' : ''}`} style={{ backgroundImage: `url(${s})` }} />
            ))}
          </div>
        )}
        <div className="hero-content">
          {children}
        </div>
      </section>
    </div>
  );
}

export default PublicLayout;
