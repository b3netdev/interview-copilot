const mongoose = require('mongoose');
const { type } = require('node:os');

const examSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      required: true,
    },
    examType: {
      type: String,
      enum: ['mcq', 'long'],
    },
    accuracy: {
      type: String,
    },
    toalQuestion: {
      type: Number,
    },
    skipped: {
      type: Number,
    },
    attempted: {
      type: Number,
    },
    correct: {
      type: Number,
    },
    wrong: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    skill: {
      type: String,
    },
    lavel: {
      type: String,
    },
    fieldName: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Exam', examSchema);
