const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const router = express.Router();
const HiddenTestcase = require("../models/HiddenTestcase");
const Submission = require("../models/Submission");
const UserSolvedProblem = require("../models/UserSolvedProblem");
const verifyToken = require("../middlewares/authMiddleware"); // Add this line

router.post("/", verifyToken, async (req, res) => {
  const { code, language, problem_id, user_id, username } = req.body;

  try {
    const hiddenTestcases = await HiddenTestcase.find({ problem_id });
    let allCorrect = true;
    let firstFailureMessage = null;

    for (const tc of hiddenTestcases) {
      try {
        // Call the code runner service
        const response = await axios.post(`${process.env.RUNNER_URL}`, {
          code,
          language,
          input: tc.input,
        });

        if (response.data.status !== "SUCCESS") {
          allCorrect = false;
          firstFailureMessage = response.data.status;
          break; 
        }

        const actualOutput = response.data.output.trim();
        const expectedOutput = tc.expected_output.trim();

        if (actualOutput !== expectedOutput) {
          allCorrect = false;
          firstFailureMessage = `Testcase failed: Expected "${expectedOutput}", got "${actualOutput}"`;
          break; 
        }

      } catch (err) {
        console.error("Testcase execution error:", err.response?.data || err.message);
        allCorrect = false;
        firstFailureMessage = "Error executing testcase";
        break; 
      }
    }

    const verdict = firstFailureMessage || (allCorrect ? "Accepted" : "Wrong Answer");
    
    const submission = new Submission({
      user_id,
      username,
      problem_id,
      language,
      code,
      is_correct: allCorrect,
      verdict: verdict,
      submitted_at: new Date(),
    });

    await submission.save();

    if (allCorrect) {
      await UserSolvedProblem.findOneAndUpdate(
        { user_id, problem_id },
        { $setOnInsert: { user_id, problem_id, solved_at: new Date() } },
        { upsert: true }
      );
    }
    res.json({
      success: true,
      is_correct: allCorrect,
      verdict: verdict,
      message: allCorrect 
        ? "All hidden testcases passed!" 
        : firstFailureMessage || "Some testcases failed",
    });

  } catch (err) {
    console.error("Submission error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Server error during submission processing",
      error: err.response?.data?.error || err.message,
    });
  }
});

module.exports = router;