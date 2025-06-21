import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const AddProblem = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    input_format: "",
    output_format: "",
    difficulty: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/admin/problems/add", formData);
      setSuccess("✅ Problem added successfully!");
      setFormData({
        title: "",
        description: "",
        input_format: "",
        output_format: "",
        difficulty: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "❌ Failed to add problem.");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 md:px-12 lg:px-32 bg-[#0f0f0f] text-gray-100">
      <div className="max-w-4xl mx-auto bg-[#1a1a1a] border border-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-indigo-400">Add New Problem</h1>

        {error && <p className="text-red-500 mb-4 font-semibold">{error}</p>}
        {success && <p className="text-green-500 mb-4 font-semibold">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 bg-[#0f0f0f] border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter problem title"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full p-3 bg-[#0f0f0f] border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter problem description"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Input Format</label>
            <textarea
              name="input_format"
              value={formData.input_format}
              onChange={handleChange}
              rows="2"
              className="w-full p-3 bg-[#0f0f0f] border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe input format"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Output Format</label>
            <textarea
              name="output_format"
              value={formData.output_format}
              onChange={handleChange}
              rows="2"
              className="w-full p-3 bg-[#0f0f0f] border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe output format"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
              className="w-full p-3 bg-[#0f0f0f] border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Select Difficulty
              </option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded transition"
            >
              Add Problem
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProblem;
