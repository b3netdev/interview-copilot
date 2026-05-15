const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    skillId: { type: Number, required: true },
    fieldId: { type: Number, required: true },
    skillName: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const resumeSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'email is required'],
    },

    phone: {
      type: String,
      trim: true,
    },

    experience: {
      type: String,
      trim: true,
    },

    age: {
      type: Number,
    },

    fieldName: {
      type: String,
      trim: true,
    },

    otherfieldName: {
      type: String,
      trim: true,
    },

    field: {
      type: String,
      trim: true,
    },

    skills: [skillSchema],

    qualification: {
      type: String,
      trim: true,
      required: [true, 'Qualification is required'],
    },

    position: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ['active', 'deleted' , 'disabled'],
      default: 'active',
    },

    password: {
      type: String,
      required: [true, 'password is required'],
    },

    otherSkills: {
      type: String,
    },

    resume: resumeSchema,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } }
);

module.exports = mongoose.model('User', userSchema);