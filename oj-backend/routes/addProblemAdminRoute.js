const express = require('express');
const Problem = require('../models/Problem');

const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { title, description, input_format, output_format, difficulty } = req.body;
    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: "Title, description, and difficulty are required" });
    }

    const validDifficulties = ["easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        message: `Difficulty must be one of: ${validDifficulties.join(", ")}`,
      });
    }

    const newProblem = new Problem({
      title,
      description,
      input_format,
      output_format,
      difficulty: difficulty.toLowerCase(),
    });

    const savedProblem = await newProblem.save();
    res.status(201).json({ message: "Problem added successfully", problem: savedProblem });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;