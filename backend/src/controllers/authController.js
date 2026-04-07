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

module.exports = { register, login, getProfile };
