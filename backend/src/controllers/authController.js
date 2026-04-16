const authService = require("../services/authService");
const { sendResponse } = require("../utils/ApiResponse");

const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendResponse(res, 201, "Registration successful.", result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    return sendResponse(res, 200, "Login successful.", result);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    return sendResponse(res, 200, "Profile fetched.", user);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, oldPassword, newPassword);
    return sendResponse(res, 200, "Password updated successfully.");
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Please provide an email.");
    await authService.forgotPassword(email);
    return sendResponse(res, 200, "Email sent successfully.");
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) throw new ApiError(400, "Please provide a new password.");
    await authService.resetPassword(token, password);
    return sendResponse(res, 200, "Password reset successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, changePassword, forgotPassword, resetPassword };
