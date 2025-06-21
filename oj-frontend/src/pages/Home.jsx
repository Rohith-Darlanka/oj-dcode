import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Logout from '../components/Logout';
import API from '../utils/api';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API.get('/auth/verify', {
          withCredentials: true
        });

        if (response.data.user) {
          const { username, role } = response.data.user;

          if (role === 'admin') {
            navigate('/admin');
          } else {
            setUser({ username, role });
          }
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error('Authentication check failed:', error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-black shadow-lg">
        <div className="text-2xl font-extrabold text-green-600 tracking-wide">Dcode</div>

        {user ? (
          <div className="flex items-center space-x-6">
            <div className="text-right text-sm">
              <Link 
                to="/profile" 
                className="text-green-500 font-semibold hover:underline"
              >
                {user.username}
              </Link>
            </div>
            <Logout onLogout={() => setUser(null)} />
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/enter"
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Enter
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center flex-1">
        <h1 className="text-5xl font-bold text-green-600 mb-3 text-center">Welcome to Dcode</h1>
        <span className="text-gray-400 mt-2 text-lg">Version 1.0</span>
      </div>
    </div>
  );
};

export default Home;
