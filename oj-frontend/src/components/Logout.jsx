import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../utils/api';


axios.defaults.withCredentials = true;

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint to clear cookies
      await API.post('/auth/logout');
      
      // Maintain the same callback and navigation logic
      if (onLogout) onLogout(); 
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to navigation even if logout fails
      if (onLogout) onLogout();
      navigate('/');
    }
  };
  
  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
    >
      Logout
    </button>
  );
};

export default Logout;