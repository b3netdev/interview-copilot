const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
       
      trim: true,
    },
    text: {
      type: String,
       
      trim: true,
    },
  },
  { _id: false },
);

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
       
    },

    question: {
      type: String,
       
      trim: true,
    },
    questionNumber:{
      type:Number,
    },

    options: {
      type: [optionSchema],
    },

    correctOptionId: {
      type: String,
    },

    correctAnswer: {
      type: String,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
       
    },

    topic: {
      type: String,
       
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
       
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
       
    },
  },
  {
    timestamps: true,
  },
);




module.exports = mongoose.model('Question', questionSchema);
