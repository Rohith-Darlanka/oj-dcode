const Problem = require('../models/Problem');

const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ problem_id: 1 });
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllProblems };    