import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../../utils/api';

const DeleteProblem = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({});

  // Fetch all problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await API.get('/problems');
        setProblems(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // Handle problem deletion
  const handleDelete = async (problemId) => {
    if (!window.confirm(`Are you sure you want to delete problem ${problemId}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteStatus(prev => ({ ...prev, [problemId]: 'deleting' }));
      
      const response = await API.delete(`/delete/${problemId}`);

      
      if (response.data.success) {
        setProblems(prev => prev.filter(p => p.problem_id !== problemId));
        setDeleteStatus(prev => ({ ...prev, [problemId]: 'success' }));
        
        // Clear success status after 2 seconds
        setTimeout(() => {
          setDeleteStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[problemId];
            return newStatus;
          });
        }, 2000);
      }
    } catch (err) {
      setDeleteStatus(prev => ({
        ...prev,
        [problemId]: err.response?.data?.message || err.message
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading problems...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="bg-red-700 text-white p-4 rounded mb-6">
          Error: {error}
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Admin Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-500">Delete Problems</h1>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Problems List</h2>
        <p className="text-red-300 mb-4">
          Warning: Deleting a problem will permanently remove it from the system.
        </p>

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {problems.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              No problems found
            </div>
          ) : (
            problems.map(problem => (
              <div
                key={problem.problem_id}
                className="p-4 rounded bg-gray-700 hover:bg-gray-600"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {problem.problem_id}. {problem.title}
                    </span>
                    <span className={`ml-3 text-xs px-2 py-1 rounded ${
                      problem.difficulty === 'easy' ? 'bg-green-600' : 
                      problem.difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {deleteStatus[problem.problem_id] === 'deleting' && (
                      <span className="text-yellow-400 text-sm">Deleting...</span>
                    )}
                    {deleteStatus[problem.problem_id] === 'success' && (
                      <span className="text-green-400 text-sm">Deleted!</span>
                    )}
                    {typeof deleteStatus[problem.problem_id] === 'string' && 
                      deleteStatus[problem.problem_id] !== 'deleting' && 
                      deleteStatus[problem.problem_id] !== 'success' && (
                      <span className="text-red-400 text-sm">
                        {deleteStatus[problem.problem_id]}
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(problem.problem_id)}
                      disabled={deleteStatus[problem.problem_id] === 'deleting'}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteProblem;