import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const AddHiddenTestcase = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [input, setInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await API.get("/problems");
        setProblems(response.data);
      } catch (err) {
        setError("Failed to fetch problems.");
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
      const res = await API.post("/hidden-testcases", {
        problem_id: selectedProblem.problem_id,
        input,
        expected_output: expectedOutput,
      });

      setMessage(res.data.message || "✅ Hidden testcase added successfully!");
      setInput("");
      setExpectedOutput("");
    } catch (err) {
      console.error("Error adding hidden testcase:", err);
      setMessage("❌ Failed to add hidden testcase.");
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-[#0f0f0f] text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-red-400">Add Hidden Testcase</h1>

      {loading ? (
        <p className="text-gray-300">Loading problems...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : !selectedProblem ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select a Problem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {problems.map((problem) => (
              <div
                key={problem.problem_id}
                onClick={() => {
                  setSelectedProblem(problem);
                  setMessage("");
                }}
                className="cursor-pointer bg-[#1c1c1c] border border-gray-700 rounded-lg p-4 hover:bg-[#2a2a2a] transition"
              >
                <h3 className="text-lg font-semibold text-white">{problem.title}</h3>
                <p className="text-sm text-gray-400 mt-1">ID: {problem.problem_id}</p>
                <p className="text-sm text-gray-400">
                  Difficulty:{" "}
                  <span
                    className={`font-semibold ${
                      problem.difficulty?.toLowerCase() === "easy"
                        ? "text-green-400"
                        : problem.difficulty?.toLowerCase() === "medium"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedProblem(null);
                setMessage("");
              }}
              className="text-red-400 hover:text-red-300"
            >
              ← Back to problems
            </button>
            <h2 className="text-xl font-semibold">
              Adding hidden testcase for:{" "}
              <span className="text-white">{selectedProblem.title}</span>{" "}
              <span className="text-gray-400">(ID: {selectedProblem.problem_id})</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Input</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
                rows={4}
                className="w-full p-3 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter input for hidden testcase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Expected Output</label>
              <textarea
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                required
                rows={4}
                className="w-full p-3 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter expected output"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
              >
                Add Hidden Testcase
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>

          {message && (
            <p
              className={`mt-6 font-medium ${
                message.includes("Failed") || message.includes("❌")
                  ? "text-red-500"
                  : "text-green-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddHiddenTestcase;
