// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Home from './pages/Home';
import PublicLayout from './components/Layout/PublicLayout';
import Services from './pages/Services';
import RequestDocument from './pages/RequestDocument';
import About from './pages/About';
import TrackRequest from './pages/TrackRequest';
import TrackBlotter from './pages/TrackBlotter';
import Login from './components/Auth/Login';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './components/Dashboard/Dashboard';
// Removed unused admin pages: Residents, Blotter, Officials
import DocumentsList from './components/Documents/DocumentsList';
import DocumentForm from './components/Documents/DocumentForm';
import DocumentDetails from './components/Documents/DocumentDetails';
import DocumentPickup from './components/Documents/DocumentPickup';
import PublicBlotter from './pages/PublicBlotter';
import BlotterView from './pages/BlotterView';
import AdminBlotterReview from './pages/AdminBlotterReview';
// Removed Settings and Reports (not used)

import './App.css';

function App() {
  // Debug: log imported component types to help locate invalid element types
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    try {
      // eslint-disable-next-line no-console
      console.log('component types:', {
        PublicLayout: typeof PublicLayout,
        Home: typeof Home,
        Services: typeof Services,
        RequestDocument: typeof RequestDocument,
        About: typeof About,
        TrackRequest: typeof TrackRequest,
        PublicBlotter: typeof PublicBlotter,
        BlotterView: typeof BlotterView,
        DashboardLayout: typeof DashboardLayout,
        Dashboard: typeof Dashboard,
      });
    } catch (e) {
      // ignore
    }
  }

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (err) {
        // If localStorage contains malformed data, remove it to avoid app crash
        console.warn('Failed to parse saved user; clearing localStorage.user', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/request" element={<PublicLayout><RequestDocument /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/track" element={<PublicLayout><TrackRequest /></PublicLayout>} />
          <Route path="/track-blotter" element={<PublicLayout><TrackBlotter /></PublicLayout>} />
          <Route path="/blotter" element={<PublicLayout><PublicBlotter /></PublicLayout>} />
          <Route path="/blotter/view/:id" element={<PublicLayout><BlotterView /></PublicLayout>} />

          <Route path="/login" element={user?.type === 'admin' ? <Navigate to="/admin/documents" /> : <Login onLogin={handleLogin} />} />
          {/* Admin Dashboard Routes */}
          <Route
            path="/admin"
            element={user?.type === 'admin' ? <PublicLayout><Dashboard /></PublicLayout> : <Navigate to="/login" />}
          />
          
          {/* Removed resident, blotter, and officials routes - admin interface now limited */}

          {/* Documents & Certificate Generation Routes */}
          <Route
            path="/admin/documents"
            element={user?.type === 'admin' ? <PublicLayout><DocumentsList /></PublicLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/blotter-review"
            element={user?.type === 'admin' ? <PublicLayout><AdminBlotterReview /></PublicLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/documents/new"
            element={user?.type === 'admin' ? <PublicLayout><DocumentForm /></PublicLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/documents/edit/:id"
            element={user?.type === 'admin' ? <PublicLayout><DocumentForm /></PublicLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/documents/view/:id"
            element={user?.type === 'admin' ? <PublicLayout><DocumentDetails /></PublicLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/documents/pickup"
            element={user?.type === 'admin' ? <PublicLayout><DocumentPickup /></PublicLayout> : <Navigate to="/login" />}
          />

          {/* Removed Reports and Settings routes - admin interface limited to Dashboard & Documents */}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;