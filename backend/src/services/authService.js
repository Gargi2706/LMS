const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, "Email already registered.");

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isApproved: user.isApproved,
    },
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid email or password.");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password.");

  if (user.status === "blocked")
    throw new ApiError(403, "Your account has been blocked. Contact admin.");

  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isApproved: user.isApproved,
    },
  };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new ApiError(404, "User not found.");
  return user;
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found.");

  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) throw new ApiError(401, "Incorrect current password.");

  if (newPassword.length < 6) throw new ApiError(400, "New password must be at least 6 characters.");

  user.password = newPassword;
  await user.save();
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "There is no user with that email.");
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Reset URL pointing to React frontend route
  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  const message = `You requested a password reset. Please go to this link to reset your password:\n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "EduFlow - Password Reset Request",
      message,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    console.error("Email error:", err);
    throw new ApiError(500, "Email could not be sent.");
  }
};

const resetPassword = async (resetToken, newPassword) => {
  // Hash the incoming token to compare with DB
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token.");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters.");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
};

module.exports = { registerUser, loginUser, getProfile, changePassword, forgotPassword, resetPassword };
