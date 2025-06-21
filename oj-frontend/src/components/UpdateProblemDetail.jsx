import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../utils/api';

const UpdateProblemDetail = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [state, setState] = useState({
    loading: true,
    error: null,
    problem: null,
    editMode: false,
    editedValues: null,
    numericProblemId: null
  });

  // Fetch problem data
  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const allProblemsRes = await API.get('/problems');
        const foundProblem = allProblemsRes.data.find(
          p => p._id === problemId || p.problem_id?.toString() === problemId
        );

        if (!foundProblem) {
          throw new Error('Problem not found in database');
        }

        if (!foundProblem.problem_id) {
          throw new Error('Problem missing numeric ID');
        }

        const response = await API.get(`/problems/${foundProblem.problem_id}`);
        
        setState(prev => ({
          ...prev,
          loading: false,
          problem: response.data,
          editedValues: response.data,
          numericProblemId: foundProblem.problem_id
        }));
      } catch (error) {
        console.error('Fetch error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to load problem',
          problem: null,
          editedValues: null
        }));
      }
    };

    fetchProblemData();
  }, [problemId]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      editedValues: {
        ...prev.editedValues,
        [name]: value
      }
    }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setState(prev => ({
      ...prev,
      editMode: !prev.editMode,
      editedValues: prev.editMode ? prev.problem : { ...prev.editedValues }
    }));
  };

  // Save changes to backend
  const saveChanges = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      if (!state.numericProblemId) {
        throw new Error('Missing problem ID for update');
      }

      const response = await API.put(
        `/problems/${state.numericProblemId}`,
        state.editedValues
      );

      setState(prev => ({
        ...prev,
        loading: false,
        problem: response.data,
        editMode: false,
        error: null
      }));
    } catch (error) {
      console.error('Update error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to update problem'
      }));
    }
  };

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading problem details...</div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="bg-red-700 text-white p-4 rounded mb-6">
          Error: {state.error}
        </div>
        <button
          onClick={() => navigate('/admin/update-problem')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Problems List
        </button>
      </div>
    );
  }

  // Problem not found
  if (!state.problem) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="bg-red-700 text-white p-4 rounded mb-6">
          Problem not found
        </div>
        <button
          onClick={() => navigate('/admin/update-problem')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Problems List
        </button>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-400">Problem Editor</h1>
        <button 
          onClick={() => navigate('/admin/update-problem')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Problems
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Display Panel */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-blue-400">{state.problem.title}</h2>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              state.problem.difficulty === 'easy' ? 'bg-green-600' : 
              state.problem.difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
            }`}>
              {state.problem.difficulty}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <div className="bg-gray-700 p-4 rounded whitespace-pre-wrap">
                {state.problem.description}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Input Format</h3>
              <div className="bg-gray-700 p-4 rounded whitespace-pre-wrap">
                {state.problem.input_format}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Output Format</h3>
              <div className="bg-gray-700 p-4 rounded whitespace-pre-wrap">
                {state.problem.output_format}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Panel */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-400">
              {state.editMode ? 'Edit Problem' : 'Problem Details'}
            </h2>
            
            <div className="flex gap-2">
              {state.editMode ? (
                <>
                  <button
                    onClick={saveChanges}
                    disabled={state.loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {state.loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={toggleEditMode}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleEditMode}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {state.editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Problem ID</label>
                <input
                  type="text"
                  value={state.problem.problem_id}
                  readOnly
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={state.editedValues.title || ''}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Difficulty</label>
                <select
                  name="difficulty"
                  value={state.editedValues.difficulty || 'easy'}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Description</label>
                <textarea
                  name="description"
                  value={state.editedValues.description || ''}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white min-h-[200px]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Input Format</label>
                <textarea
                  name="input_format"
                  value={state.editedValues.input_format || ''}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Output Format</label>
                <textarea
                  name="output_format"
                  value={state.editedValues.output_format || ''}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white min-h-[100px]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-400">Problem ID</h3>
                <p className="bg-gray-700 p-3 rounded">{state.problem.problem_id}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-400">Title</h3>
                <p className="bg-gray-700 p-3 rounded">{state.problem.title}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-400">Difficulty</h3>
                <p className="bg-gray-700 p-3 rounded">{state.problem.difficulty}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProblemDetail;