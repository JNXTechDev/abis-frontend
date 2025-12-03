// src/contexts/AuthContext.js
import React from 'react';

export const AuthContext = React.createContext({
  user: null,
  handleLogin: () => {},
  handleLogout: () => {}
});