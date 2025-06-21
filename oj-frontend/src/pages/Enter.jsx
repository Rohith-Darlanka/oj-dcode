import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from '../utils/api';

const Enter = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await API.post("/auth/login", 
        data,
        { withCredentials: true } 
      );
      
      const { user } = response.data;

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-500 mb-8">Login to Dcode</h2>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium mb-1 text-green-400">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 bg-black text-green-200 border border-green-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1 font-bold">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-green-400">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 bg-black text-green-200 border border-green-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1 font-bold">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold tracking-wide transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Enter;