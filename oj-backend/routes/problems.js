const express = require('express');
const router = express.Router();
const { getAllProblems } = require('../controllers/ProblemController');
const Problem = require('../models/Problem');

router.get('/', getAllProblems);

router.get('/:problem_id', async (req, res) => {
  try {
    const problemId = parseInt(req.params.problem_id);

    if (isNaN(problemId)) {
      return res.status(400).json({ message: 'Invalid problem ID - must be numeric' });
    }

    const problem = await Problem.findOne({ problem_id: problemId });

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json(problem);
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message 
    });
  }
});

router.put('/:problem_id', async (req, res) => {
  try {
    const problemId = parseInt(req.params.problem_id);

    if (isNaN(problemId)) {
      return res.status(400).json({ message: 'Invalid problem ID - must be numeric' });
    }

    const updatedProblem = await Problem.findOneAndUpdate(
      { problem_id: problemId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json(updatedProblem);
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to update problem',
      error: err.message,
      ...(err.name === 'ValidationError' ? { validationErrors: err.errors } : {})
    });
  }
});

module.exports = router;
