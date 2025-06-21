// routes/deletep.js
const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const Testcase = require('../models/Testcase');
const HiddenTestcase = require('../models/HiddenTestcase');
const UserSolvedProblem = require('../models/UserSolvedProblem');
const Submission = require('../models/Submission');

router.delete('/:problem_id', async (req, res) => {
  try {
    const problemId = req.params.problem_id;
    await Testcase.deleteMany({ problem_id: problemId });
    await HiddenTestcase.deleteMany({ problem_id: problemId });
    await UserSolvedProblem.deleteMany({ problem_id: problemId });
    
    await Submission.deleteMany({ problem_id: problemId });
    
    const deletedProblem = await Problem.findOneAndDelete({ problem_id: problemId });

    if (!deletedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({ 
      success: true,
      message: 'Problem and all associated data (testcases, hidden testcases, solved records, submissions) deleted successfully',
      deletedProblem
    });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete problem and its associated data',
      error: err.message
    });
  }
});

module.exports = router;