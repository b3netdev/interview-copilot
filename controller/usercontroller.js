const User = require("../model/userSchema");
const catchAsync = require("../utils/asynchandeler");
const AppError = require("../utils/Apperror");
const path = require("path");
const fs = require("fs");

exports.updateuser = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

exports.resumeUpload = catchAsync(async (req, res, next) => {
  const userId = req.userId;

  if (!req.file) {
    return next(new AppError("Resume PDF is required", 400));
  }

  const resumeData = {
    url: `/uploads/resumes/${req.file.filename}`,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date(),
  };

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { resume: resumeData } },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) return next(new AppError("User not found", 404));

  res.status(200).json({
    success: true,
    message: "Resume uploaded successfully",
    data: updatedUser,
    resume: resumeData,
  });
});


exports.deleteResume = catchAsync(async (req, res, next) => {
  const userId = req.userId;

  const user = await User.findById(userId);
  if (!user) return next(new AppError("User not found", 404));

  if (!user.resume || !user.resume.url) {
    return next(new AppError("No resume found to delete", 400));
  }

  const resumeUrl = user.resume.url;


  let relativeUrlPath = resumeUrl;
  if (resumeUrl.startsWith("http")) {
    relativeUrlPath = new URL(resumeUrl).pathname;
  }


  if (!relativeUrlPath.startsWith("/")) {
    relativeUrlPath = "/" + relativeUrlPath;
  }


  const relativeFsPath = relativeUrlPath.replace(/^\/+/, "");


  const absolutePath = path.join(process.cwd(), relativeFsPath);

  
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }


  user.resume = undefined;  
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Resume deleted successfully",
  });
});



exports.deleteuserAccount = catchAsync(async(req,res,next)=>{
  const userId = req.userId;
  const payload = {
    status:'deleted'
  }
  
  const result = await User.findByIdAndUpdate(userId,payload,{
    new:true,
    runValidators:true
  })
  if (!result) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "User Account deteted successfully",
    data: result,
  })

})
