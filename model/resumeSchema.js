const mongoose = require("mongoose");

const timePeriodSchema = new mongoose.Schema(
  {
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    currentlyStudying: {
      type: Boolean,
      default: false,
    },
    currentlyOngoing: {
      type: Boolean,
      default: false,
    },
    currentlyWorking: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const linkSchema = new mongoose.Schema(
  {
    linkedin: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    portfolio: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: "",
    },
    professionalTitle: {
      type: String,
      default: "",
    },
    professionType: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: String,
      default: "",
    },
    nationality: {
      type: String,
      default: "",
    },
    primaryLanguage: {
      type: String,
      default: "",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    links: {
      type: linkSchema,
      default: {},
    },
    bio: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const professionSpecificSchema = new mongoose.Schema(
  {
    primaryTechStack: {
      type: String,
      default: "",
    },
    preferredRole: {
      type: String,
      default: "",
    },
    totalExperienceYears: {
      type: String,
      default: "",
    },
    coreTools: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const skillRatingSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      default: "",
    },
    proficiencyPercent: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      default: "",
    },
    institutionName: {
      type: String,
      default: "",
    },
    studyField: {
      type: String,
      default: "",
    },
    details: {
      type: String,
      default: "",
    },
    timePeriod: {
      type: timePeriodSchema,
      default: {},
    },
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    certificationName: {
      type: String,
      default: "",
    },
    details: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const dateDurationSchema = new mongoose.Schema(
  {
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const awardSchema = new mongoose.Schema(
  {
    awardName: {
      type: String,
      default: "",
    },
    organizationName: {
      type: String,
      default: "",
    },
    dateDuration: {
      type: dateDurationSchema,
      default: {},
    },
  },
  { _id: false }
);

const personalProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      default: "",
    },
    projectLink: {
      type: String,
      default: "",
    },
    projectDetails: {
      type: String,
      default: "",
    },
    timePeriod: {
      type: timePeriodSchema,
      default: {},
    },
  },
  { _id: false }
);

const professionalExperienceSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: "",
    },
    workDetail: {
      type: String,
      default: "",
    },
    timePeriod: {
      type: timePeriodSchema,
      default: {},
    },
  },
  { _id: false }
);

const referenceSchema = new mongoose.Schema(
  {
    referencePersonName: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const additionalSchema = new mongoose.Schema(
  {
    achievements: {
      type: String,
      default: "",
    },
    references: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    templateId: {
      type: String,
      default: "",
    },
    profile: {
      type: profileSchema,
      default: {},
    },
    bio:{
      type: String,
      default: "",
    },

    professionSpecific: {
      type: professionSpecificSchema,
      default: {},
    },

    skills: {
      type: [String],
      default: [],
    },

      hobbies: {
        type: [String],
        default: [],
      },

    skillsWithRatings: {
      type: [skillRatingSchema],
      default: [],
    },

    languagesKnown: {
      type: [String],
      default: [],
    },

    education: {
      type: [educationSchema],
      default: [],
    },

    certifications: {
      type: [certificationSchema],
      default: [],
    },

    award: {
      type: [awardSchema],
      default: [],
    },

    personalProjects: {
      type: [personalProjectSchema],
      default: [],
    },

    professionalExperience: {
      type: [professionalExperienceSchema],
      default: [],
    },

    references: {
      type: [referenceSchema],
      default: [],
    },

    additional: {
      type: additionalSchema,
      default: {},
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);