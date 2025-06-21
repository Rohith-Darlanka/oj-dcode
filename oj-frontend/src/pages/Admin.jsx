import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";

const Admin = () => {
  const navigate = useNavigate();

  const handleAddProblem = () => {
    navigate("/admin/add-problem");
  };

  const handleAddTestcase = () => {
    navigate("/admin/add-testcase");
  };
  
  const handleAddHiddenTestcase = () => {
    navigate("/admin/add-hidden-testcase");
  };

  const handleUpdateProblem = () => {
    navigate("/admin/update-problem");
  };

  const handleDeleteProblem = () => {
    navigate("/admin/delete-problem");
  };
const handleDeleteTestcase = () => {
    navigate("/admin/delete-testcase");
  };
    const handleDeleteHiddenTestcase = () => {
    navigate("/admin/delete-hidden-testcase");
  };
  return (
    <div className="min-h-screen p-8 bg-black text-gray-200">
      <div className="flex justify-between items-center mb-6 border-b border-green-900 pb-4">
        <h1 className="text-3xl font-bold text-green-500">Admin Dashboard</h1>
        <Logout />
      </div>

      <p className="mb-6 text-green-400">
        Only accessible by users with admin role.
      </p>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={handleAddProblem}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded font-semibold transition"
        >
          Add New Problem
        </button>

        <button
          onClick={handleAddTestcase}
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded font-semibold transition"
        >
          Add Testcase
        </button>

        <button
          onClick={handleAddHiddenTestcase}
          className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded font-semibold transition"
        >
          Add Hidden Testcase
        </button>

        <button
          onClick={handleUpdateProblem}
          className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded font-semibold transition"
        >
          Update Problem
        </button>

        {/* New Delete Problem Button */}
        <button
          onClick={handleDeleteProblem}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold transition"
        >
          Delete Problem
        </button>
        <button
          onClick={handleDeleteTestcase}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded font-semibold transition"
        >
          Delete Testcase
        </button>
         <button
          onClick={handleDeleteHiddenTestcase}
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded font-semibold transition"
        >
          Delete Hidden Testcase
        </button>
      </div>
    </div>
  );
};

export default Admin;