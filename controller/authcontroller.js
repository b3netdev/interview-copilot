const User = require("../model/userSchema");
const catchAsync = require("../utils/asynchandeler");
const AppError = require("../utils/Apperror");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.registerUser = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const body = { ...req.body };
  const hashedpass = await bcrypt.hash(password, 10);
  body.password = hashedpass;
  const user = await User.create(body);
  const token = generateToken(user?._id);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
    token: token,
  });
});


exports.signinuser = catchAsync(async (req, res, next) => {

  const { email } = req.body;
  const password = req?.body?.password?.trim()
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("Provided emailid doesn't exists", 400));
  if(user?.status == "deleted") return next(new AppError("Provided emailid doesn't exists", 400))
    const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError("Wrong password", 400));

  const token = generateToken(user?._id);

  res.status(201).json({
    success: true,
    message: "User logged in successfully",
    data: user,
    token: token,
  });
});

exports.verifyuser = catchAsync(async(req,res,next)=>{
  const user = await User.findById(req.userId)
  res.status(201).json({
    success: true,
    message: "User fetched in successfully",
    data: user,
  });
})

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};




const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"B3NET" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "This email does not exists",
      });
    }

    
    const resetToken = crypto.randomBytes(32).toString("hex");

    
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 

    await user.save();

    const baseUrl = process.env.API_BASE_URL.replace(/\/+$/, "");
const resetUrl = `${baseUrl}/reset-password.html?token=${resetToken}`;

    const html = `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html,
    });

    return res.status(200).json({
      success: true,
      message: "If this email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: "Reset token is required",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
      status: "active",
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

   
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};



