const { OAuth2Client } = require("google-auth-library");
const User = require("../model/userSchema");
const catchAsync = require("../utils/asynchandeler");
const AppError = require("../utils/Apperror");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const googleWebClientId =
  process.env.NODE_ENV == "development"
    ? process.env.GOOGLE_WEB_CLIENT_ID_DEV
    : process.env.GOOGLE_WEB_CLIENT_ID_PROD;

const client = new OAuth2Client(googleWebClientId);


exports.registerUser = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  const body = { ...req.body };

  if (!body.email) {
    return next(new AppError("Email is required.", 400));
  }

  body.email = body.email.toLowerCase().trim();

  const existUser = await User.findOne({
    email: body.email,
    status: "active",
  });

  if (existUser && existUser.isVerified) {
    return res.status(400).json({
      success: false,
      message: "This email is already registered. Please log in.",
    });
  }

  const verifycode = Math.floor(1000 + Math.random() * 9000).toString();
  const verificationCodeExpiry = Date.now() + 10 * 60 * 1000;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #222;">Account Verification</h2>

      <p>Thank you for creating an account.</p>

      <p>To complete your registration, please use the verification code below:</p>

      <div style="
        display: inline-block;
        padding: 14px 24px;
        margin: 16px 0;
        background-color: #f4f6f8;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #111;
      ">
        ${verifycode}
      </div>

      <p>This verification code is valid for 10 minutes.</p>

      <p>
        If you did not create this account, please ignore this email.
        No further action is required.
      </p>

      <p>
        Thank you,<br/>
        Support Team
      </p>
    </div>
  `;

  if (existUser && !existUser.isVerified) {
    existUser.verificationCode = verifycode;
    existUser.verificationCodeExpiry = verificationCodeExpiry;
    existUser.isVerified = false;
    if (body?.password) {
      const hashedpass = await bcrypt.hash(password, 10);
      existUser.password = hashedpass;
    }

    await existUser.save();

    await sendEmail({
      to: existUser.email,
      subject: "Account Verification",
      html,
    });

    return res.status(200).json({
      success: true,
      message:
        "A verification code has been sent to the provided email address. Kindly verify your account.",
    });
  }

  if (!password) {
    return next(new AppError("Password is required.", 400));
  }

  const hashedpass = await bcrypt.hash(password, 10);

  body.password = hashedpass;
  body.verificationCode = verifycode;
  body.verificationCodeExpiry = verificationCodeExpiry;
  body.isVerified = false;

  const user = await User.create(body);

  await sendEmail({
    to: user.email,
    subject: "Account Verification",
    html,
  });

  return res.status(201).json({
    success: true,
    message:
      "A verification code has been sent to the provided email address. Kindly verify your account.",
  });
});

exports.verifyregistration = catchAsync(async (req, res, next) => {
  const { verificationCode, email } = req.body;
  if (!email) return next(new AppError("email is required", 400));
  if (!verificationCode)
    return next(new AppError("Verification is required", 400));
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail, status: "active" });

  if (!user) return next(new AppError("User not found", 400));
  if (!user.verificationCode || !user.verificationCodeExpiry)
    return next(
      new AppError(
        "No verification code found. Please request a new code.",
        400,
      ),
    );
  if (user.isVerified) {
    return next(
      new AppError("This account is already verified. Please log in.", 400),
    );
  }
  if (user.verificationCode !== verificationCode)
    return next(
      new AppError("Invalid verification code. Please enter a valid code", 400),
    );
  if (user.verificationCodeExpiry < Date.now())
    return next(new AppError("Code expired. Please request a new code.", 400));

  user.verificationCode = undefined;
  user.verificationCodeExpiry = undefined;
  user.isVerified = true;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "Verification completed",
    data: {
      _id: user._id,
      email: user.email,
    },
  });
});

exports.verifySignIn = catchAsync(async (req, res, next) => {
  const { email, _id } = req.body;
  if (!email) return next(new AppError("Email is required", 404));
  if (!_id) return next(new AppError("user id is required", 404));
  const user = await User.findById(_id);
  if (!user) return next(new AppError("User not found", 404));
  const token = generateToken(user?._id);
  return res.status(200).json({
    success: true,
    token,
    user,
  });
});

exports.signinuser = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const password = req?.body?.password?.trim();
  const user = await User.findOne({ email, status: "active" });
  if (!user) return next(new AppError("Provided email doesn't exists", 400));
  if (user?.status == "deleted")
    return next(new AppError("Provided emailid doesn't exists", 400));
  if (user.provider == "social")
    return next(
      new AppError(
        "This account was created using google sign in , please login with google",
        400,
      ),
    );
  if (!user.password)
    return next(new AppError("Password is not seted for this account", 400));
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

exports.gooleSignIn = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;
  if (!idToken) {
    return next(new AppError("Google ID token is required", 400));
  }

 
  const ticket = await client.verifyIdToken({
    idToken,
    audience: googleWebClientId,
  });
  const payload = ticket.getPayload();

  const email = payload.email;
  const name = payload.name;
  const photo = payload.picture;
  if (!email) {
    return next(new AppError("Email not found from Google account", 400));
  }

  const user = await User.findOne({
    email,
    status: "active",
  });
  if (user && user?._id) {
    const token = generateToken(user?._id);
    return res.status(200).json({
      success: true,
      message: "User logged In successfully",
      data: user,
      token,
    });
  }
  if (!user) {
    const payload = {};
    payload.name = name;
    payload.email = email;
    payload.profilePhoto = photo;
    payload.isVerified = true;
    payload.provider = "social";
    const newuser = await User.create(payload);
    if (!newuser) return next(new AppError("Unable to sign up", 400));
    const token = generateToken(newuser?._id);
    return res.status(200).json({
      success: true,
      message: "User logged In successfully",
      data: newuser,
      token,
    });
  }
});

exports.verifyuser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);
  res.status(201).json({
    success: true,
    message: "User fetched in successfully",
    data: user,
  });
});

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

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

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
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
