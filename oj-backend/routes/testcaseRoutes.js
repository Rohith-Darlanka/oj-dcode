const express = require("express");
const router = express.Router();
const Testcase = require("../models/Testcase");


router.get("/:problem_id", async (req, res) => {
  try {
    const problemId = parseInt(req.params.problem_id);
    const testcases = await Testcase.find({ problem_id: problemId }).sort({ testcase_id: 1 });
    res.json(testcases);
  } catch (err) {
    console.error("Error fetching testcases:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { problem_id, input, expected_output } = req.body;

    const newTestcase = new Testcase({
      problem_id,
      input,
      expected_output,
    });

    await newTestcase.save();
    res.status(201).json({ message: "Testcase added successfully" });
  } catch (err) {
    console.error("Error saving testcase:", err);
    res.status(500).json({ message: "Failed to save testcase" });
  }
});


router.get("/by-id/:id", async (req, res) => {
  try {
    const testcase = await Testcase.findById(req.params.id);
    if (!testcase) {
      return res.status(404).json({ message: "Testcase not found" });
    }
    res.json(testcase);
  } catch (err) {
    console.error("Error fetching testcase:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { input, expected_output } = req.body;

    const updatedTestcase = await Testcase.findByIdAndUpdate(
      req.params.id,
      { input, expected_output },
      { new: true }
    );

    if (!updatedTestcase) {
      return res.status(404).json({ message: "Testcase not found" });
    }

    res.json({ 
      message: "Testcase updated successfully",
      testcase: updatedTestcase 
    });
  } catch (err) {
    console.error("Error updating testcase:", err);
    res.status(500).json({ message: "Failed to update testcase" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedTestcase = await Testcase.findByIdAndDelete(req.params.id);
    
    if (!deletedTestcase) {
      return res.status(404).json({ message: "Testcase not found" });
    }

    res.json({ message: "Testcase deleted successfully" });
  } catch (err) {
    console.error("Error deleting testcase:", err);
    res.status(500).json({ message: "Failed to delete testcase" });
  }
});


router.get("/count/:problem_id", async (req, res) => {
  try {
    const count = await Testcase.countDocuments({ 
      problem_id: parseInt(req.params.problem_id) 
    });
    res.json({ count });
  } catch (err) {
    console.error("Error counting testcases:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;