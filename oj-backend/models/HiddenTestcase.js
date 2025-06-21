// models/HiddenTestcase.js
const mongoose = require("mongoose");
const Counter = require("./Counter");

const hiddenTestcaseSchema = new mongoose.Schema({
  testcase_id: {
    type: Number,
    unique: true,
  },
  problem_id: {
    type: Number,
    required: true,
  },
  input: {
    type: String,
    required: true,
  },
  expected_output: {
    type: String,
    required: true,
  },
});

hiddenTestcaseSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "hidden_testcase_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.testcase_id = counter.seq;
  }
  next();
});

module.exports = mongoose.model("HiddenTestcase", hiddenTestcaseSchema);
