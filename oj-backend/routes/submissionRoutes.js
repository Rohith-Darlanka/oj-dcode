const express = require("express");
const router = express.Router();
const Submission = require("../models/Submission");

router.get("/:problem_id/:user_id", async (req, res) => {
  const { problem_id, user_id } = req.params;
  try {
    const submissions = await Submission.find({
      problem_id: parseInt(problem_id),
      user_id: parseInt(user_id),
    }).sort({ submitted_at: -1 });
    res.json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
