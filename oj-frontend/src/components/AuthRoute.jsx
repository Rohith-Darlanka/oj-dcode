import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import API from '../utils/api';

// Configure axios to send credentials
axios.defaults.withCredentials = true;

const AuthRoute = ({ role, children }) => {
  const location = useLocation();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await API.get("/auth/verify");
        const { user } = res.data;
        
        if (!user) {
          setStatus("unauthorized");
          return;
        }

        if (role === "admin" && user.role !== "admin") {
          setStatus("unauthorized");
          return;
        }

        setStatus(user.role);
      } catch (error) {
        setStatus("unauthorized");
      }
    };

    verifyAuth();
  }, [role]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/enter" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;