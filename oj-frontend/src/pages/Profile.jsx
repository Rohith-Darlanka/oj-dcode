import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../utils/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/getprofile', {
          withCredentials: true
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        if (err.response?.status === 401) {
          setError('Please login to view your profile');
        } else {
          setError('Failed to load profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-lg">Loading profile...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400 font-bold">
        <div className="text-lg">{error}</div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h2 className="text-3xl font-bold text-green-500 mb-8 text-center">My Profile</h2>
      <div className="space-y-5 text-lg w-full max-w-xl">
        <p>
          <span className="font-semibold text-green-400">Username:</span> {profile.username}
        </p>
        <p>
          <span className="font-semibold text-green-400">Name:</span> {profile.name || 'Not set'}
        </p>
        <p>
          <span className="font-semibold text-green-400">Email:</span> {profile.email}
        </p>
        <p>
          <span className="font-semibold text-green-400">Problems Solved:</span> {profile.solved_problems}
        </p>
      </div>
    </div>
  );
};

export default Profile;