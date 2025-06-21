const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  input_format: { type: String },
  output_format: { type: String },
  difficulty: { type: String },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

problemSchema.plugin(AutoIncrement, { inc_field: 'problem_id' });

module.exports = mongoose.model('Problem', problemSchema);