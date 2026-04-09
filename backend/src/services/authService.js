const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

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

module.exports = { registerUser, loginUser, getProfile, changePassword };
