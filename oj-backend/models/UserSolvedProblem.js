const mongoose = require("mongoose");

const userSolvedProblemSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
  },
  problem_id: {
    type: Number,
    required: true,
  },
});


userSolvedProblemSchema.index({ user_id: 1, problem_id: 1 }, { unique: true });

module.exports = mongoose.model("UserSolvedProblem", userSolvedProblemSchema);
