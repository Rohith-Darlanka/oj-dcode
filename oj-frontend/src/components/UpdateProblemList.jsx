import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from '../utils/api';

const UpdateProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await API.get("/problems");
        setProblems(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch problems");
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleProblemClick = (problemId) => {
    navigate(`/admin/update-problem/${problemId}`);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen p-8 bg-black text-gray-200">
      <h1 className="text-3xl font-bold text-green-500 mb-6">Select Problem to Update</h1>
      
      <div className="grid gap-4">
        {problems.map((problem) => (
          <div 
            key={problem._id} 
            onClick={() => handleProblemClick(problem._id)}
            className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer transition"
          >
            <h2 className="text-xl font-semibold text-blue-400">{problem.title}</h2>
            <p className="text-gray-400">{problem.difficulty}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdateProblemList;