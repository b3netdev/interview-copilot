const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    selectedAnswerId: {
      type: String,
      default: null,
    },

    selectedAnswer: {
      type: String,
    },

    correctAnswerId: {
      type: String,
    },
    answer:{
      type: String,
    },

    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
    },

    isCorrect: {
      type: Boolean,
    },
    exam:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Answer", answerSchema);
