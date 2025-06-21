import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from '../../utils/api';

const AddTestcase = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [input, setInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/testcases", {
        problem_id: selectedProblem.problem_id,
        input,
        expected_output: expectedOutput,
      });
      alert("Testcase added successfully!");
      setInput("");
      setExpectedOutput("");
    } catch (err) {
      console.error("Error adding testcase:", err);
      alert("Failed to add testcase.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-gray-900 text-gray-100">
        <h2 className="text-2xl font-bold mb-6">Add New Testcase</h2>
        <p>Loading problems...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-gray-900 text-gray-100">
        <h2 className="text-2xl font-bold mb-6">Add New Testcase</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-gray-100">
      <h2 className="text-2xl font-bold mb-6">Add New Testcase</h2>

      {!selectedProblem ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">Select a Problem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((problem) => (
              <div
                key={problem.problem_id}
                onClick={() => setSelectedProblem(problem)}
                className="p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800"
              >
                <h3 className="font-bold">{problem.title}</h3>
                <p className="text-sm text-gray-400">ID: {problem.problem_id}</p>
                <p className="text-sm text-gray-400">Difficulty: {problem.difficulty}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex items-center">
            <button
              onClick={() => setSelectedProblem(null)}
              className="mr-4 text-blue-400 hover:text-blue-300"
            >
              ← Back to problems
            </button>
            <h3 className="text-xl font-semibold">
              Adding testcase for: {selectedProblem.title} (ID: {selectedProblem.problem_id})
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            <div>
              <label className="block mb-1 font-medium">Input</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-3 rounded border border-gray-700 bg-gray-800 text-white"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Expected Output</label>
              <textarea
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                className="w-full p-3 rounded border border-gray-700 bg-gray-800 text-white"
                rows={4}
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
              >
                Save Testcase
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded shadow"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddTestcase;