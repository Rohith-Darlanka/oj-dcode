import React, { useEffect, useState } from 'react';
import ProblemCard from '../components/ProblemCard';
import API from '../utils/api';

const Problemset = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await API.get('/problems');
        setProblems(res.data);
      } catch (err) {
        console.error('Failed to fetch problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-green-400 mb-8 text-center drop-shadow-[0_2px_8px_rgba(34,197,94,0.2)]">
        Problemset
      </h1>

      {loading ? (
        <p className="text-center text-gray-400 text-lg">Loading problems...</p>
      ) : problems.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No problems available.</p>
      ) : (
        <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-800">
          {problems.map((problem, index) => (
            <ProblemCard key={problem._id} problem={problem} isLast={index === problems.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Problemset;
