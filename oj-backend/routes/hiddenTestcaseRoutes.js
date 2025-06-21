// routes/hiddenTestcaseRoutes.js
const express = require("express");
const router = express.Router();
const HiddenTestcase = require("../models/HiddenTestcase");


router.get("/:problem_id", async (req, res) => {
  try {
    const problemId = req.params.problem_id;
    const hiddenTestcases = await HiddenTestcase.find({ problem_id: problemId }).sort({ testcase_id: 1 });
    res.json(hiddenTestcases);
  } catch (err) {
    console.error("Error fetching hidden testcases:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a specific hidden testcase
router.delete("/:id", async (req, res) => {
  try {
    const deletedTestcase = await HiddenTestcase.findByIdAndDelete(req.params.id);
    
    if (!deletedTestcase) {
      return res.status(404).json({ message: "Hidden testcase not found" });
    }

    res.json({ message: "Hidden testcase deleted successfully" });
  } catch (err) {
    console.error("Error deleting hidden testcase:", err);
    res.status(500).json({ message: "Failed to delete hidden testcase" });
  }
});

// Count hidden testcases for a problem (optional)
router.get("/count/:problem_id", async (req, res) => {
  try {
    const count = await HiddenTestcase.countDocuments({ 
      problem_id: req.params.problem_id 
    });
    res.json({ count });
  } catch (err) {
    console.error("Error counting hidden testcases:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { problem_id, input, expected_output } = req.body;

    const newTestcase = new HiddenTestcase({
      problem_id,
      input,
      expected_output,
    });

    await newTestcase.save();
    res.status(201).json({ message: "Hidden testcase added successfully" });
  } catch (err) {
    console.error("Error saving hidden testcase:", err);
    res.status(500).json({ message: "Failed to save hidden testcase" });
  }
});

module.exports = router;