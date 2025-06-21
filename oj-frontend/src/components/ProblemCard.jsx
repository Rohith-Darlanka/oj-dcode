import React from 'react';
import { Link } from 'react-router-dom';

const ProblemCard = ({ problem, isLast }) => {
  return (
    <Link to={`/problemset/${problem.problem_id}`}>
      <div
        className={`bg-black px-5 py-3 hover:bg-gray-900 transition-all border-b border-gray-800 ${
          isLast ? 'border-b-0' : ''
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-green-400">{problem.title}</h2>
            <p className="text-gray-400 text-sm">{problem.description?.slice(0, 80)}...</p>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>
              <span className="text-green-400">Difficulty:</span> {problem.difficulty}
            </p>
            <p>ID: {problem.problem_id}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProblemCard;
