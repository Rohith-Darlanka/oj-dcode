import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from '../../utils/api';

const DeleteTestcasePage = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [testcases, setTestcases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await API.get("/problems");
        setProblems(response.data);
      } catch (err) {
        setError("Failed to fetch problems");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const fetchTestcases = async (problemId) => {
    try {
      setLoading(true);
      const response = await API.get(`/testcases/${problemId}`);
      setTestcases(response.data);
      setSelectedProblem(problemId);
    } catch (err) {
      setError("Failed to fetch testcases");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestcase = async (testcaseId) => {
    if (window.confirm("Are you sure you want to delete this testcase?")) {
      try {
        await API.delete(`/testcases/${testcaseId}`);
        // Refresh the testcases list after deletion
        fetchTestcases(selectedProblem);
      } catch (err) {
        setError("Failed to delete testcase");
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen p-8 bg-black text-gray-200">
      <h1 className="text-3xl font-bold text-green-500 mb-6">Delete Testcases</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-green-400 mb-4">Select a Problem</h2>
        {loading ? (
          <p>Loading problems...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((problem) => (
              <div
                key={problem.problem_id}
                onClick={() => fetchTestcases(problem.problem_id)}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-900 ${
                  selectedProblem === problem.problem_id 
                    ? "border-green-500 bg-gray-900" 
                    : "border-gray-700"
                }`}
              >
                <h3 className="font-bold">{problem.title}</h3>
                <p className="text-sm text-gray-400">ID: {problem.problem_id}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProblem && (
        <div>
          <h2 className="text-xl font-semibold text-green-400 mb-4">
            Testcases for Problem {selectedProblem}
          </h2>
          {loading ? (
            <p>Loading testcases...</p>
          ) : testcases.length === 0 ? (
            <p>No testcases found for this problem.</p>
          ) : (
            <div className="space-y-4">
              {testcases.map((testcase) => (
                <div
                  key={testcase._id}
                  className="p-4 border border-gray-700 rounded-lg bg-gray-900"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">Testcase ID: {testcase.testcase_id}</h3>
                      <div className="mt-2">
                        <h4 className="text-sm font-semibold">Input:</h4>
                        <pre className="text-xs bg-gray-800 p-2 rounded overflow-auto">
                          {testcase.input}
                        </pre>
                      </div>
                      <div className="mt-2">
                        <h4 className="text-sm font-semibold">Expected Output:</h4>
                        <pre className="text-xs bg-gray-800 p-2 rounded overflow-auto">
                          {testcase.expected_output}
                        </pre>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTestcase(testcase._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeleteTestcasePage;