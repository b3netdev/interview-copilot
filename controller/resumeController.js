const Resume = require("../model/resumeSchema");
const User = require("../model/userSchema");
const AppError = require("../utils/Apperror");
const catchAsync = require("../utils/asynchandeler");




exports.uploadResumeProfilePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Profile photo is required", 400));
  }

  const userId = req.userId || req.body.userId;

  if (!userId) {
    return next(new AppError("userId is required", 400));
  }

  const userExists = await User.findById(userId);

  if (!userExists) {
    return next(new AppError("User not found", 404));
  }
const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.API_BASE_URL || `${req.protocol}://${req.get("host")}`
    : `${req.protocol}://${req.get("host")}`

  const imageUrl = `${baseUrl}/uploads/resumes/${req.file.filename}`;

  let resumeId = req.body.resumeId || userExists.resumeId || "";

  let resume;

  if (resumeId) {
    resume = await Resume.findOneAndUpdate(
      {
        _id: resumeId,
        userId,
      },
      {
        $set: {
          "profile.profilePhoto": imageUrl,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  if (!resume) {
    resume = await Resume.create({
      userId,
      profile: {
        profilePhoto: imageUrl,
      },
    });

    await User.findByIdAndUpdate(userId, {
      $set: {
        resumeId: resume._id,
      },
    });
  }

  res.status(200).json({
    status: "success",
    message: "Profile photo uploaded and saved successfully",
    data: {
      imageUrl,
      resumeId: resume._id,
      resume,
    },
  });
});

exports.addResumeData = catchAsync(async (req, res, next) => {
  const userId = req.body?.userId;
  if (!userId) return next(new AppError("userId is required", 400));

  const userExists = await User.findById(userId);
  if (!userExists) return next(new AppError("User not found", 404));

  const resumeData = { ...req.body, userId };

  const newResume = await Resume.create(resumeData);

  await User.findByIdAndUpdate(userId, { $set: { resumeId: newResume._id } });

  res.status(201).json({
    status: "success",
    data: { resume: newResume },
  });
});

// GET /resume/:id  — get a resume by id
exports.getResumeDetails = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  if (!userId) return next(new AppError("Unauthorized", 401));

  const { id } = req.params;
  const resume = await Resume.findById(id);

  if (!resume) {
    return next(new AppError("Resume not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { resume },
  });
});

// PATCH /resume/:id  — update an existing resume (partial update)
exports.updateResumeData = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  if (!userId) return next(new AppError("Unauthorized", 401));

  const { id } = req.params;

  const updatedResume = await Resume.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!updatedResume) {
    return next(new AppError("Resume not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { resume: updatedResume },
  });
});
