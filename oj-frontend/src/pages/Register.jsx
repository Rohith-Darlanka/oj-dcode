import React from 'react';
import { useForm } from 'react-hook-form';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await API.post('/auth/register', data);
      alert(response.data.message || 'Registered successfully');
      navigate('/enter'); 
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-500 mb-8">Register on Dcode</h2>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium mb-1 text-green-400">Username</label>
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="w-full px-4 py-2 bg-black text-green-200 border border-green-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.username && <p className="text-red-400 text-sm mt-1 font-bold">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-green-400">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2 bg-black text-green-200 border border-green-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1 font-bold">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-green-400">Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 bg-black text-green-200 border border-green-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1 font-bold">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-green-400">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-2 bg-black text-green-200 border border-green-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1 font-bold">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-green-400">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Confirm your password',
                validate: (value) => value === watch('password') || 'Passwords do not match',
              })}
              className="w-full px-4 py-2 bg-black text-green-200 border border-green-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1 font-bold">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold tracking-wide transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
