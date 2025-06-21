const mongoose = require("mongoose");
const Counter = require("./Counter");

const submissionSchema = new mongoose.Schema({
  submission_id: {
    type: Number,
    unique: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  problem_id: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true, 
  },
  language: {
    type: String,
    required: true,
  },
  submitted_at: {
    type: Date,
    default: Date.now,
  },
  is_correct: {
    type: Boolean,
    required: true,
  },
  verdict: {
  type: String,
  required: true,
  default: "Pending",
}
});

submissionSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "submission_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.submission_id = counter.seq;
  }
  next();
});

module.exports = mongoose.model("Submission", submissionSchema);