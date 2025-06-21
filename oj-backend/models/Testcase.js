const mongoose = require("mongoose");
const Counter = require("./Counter");

const testcaseSchema = new mongoose.Schema({
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


testcaseSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "testcase_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.testcase_id = counter.seq;
  }
  next();
});

module.exports = mongoose.model("Testcase", testcaseSchema);
