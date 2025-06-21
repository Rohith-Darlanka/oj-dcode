const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  problem_id: {
    type: Number,
    required: true,
    ref: 'Problem' // optional: for mongoose population
  },
  tag: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('Tag', tagSchema);
