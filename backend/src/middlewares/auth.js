const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new ApiError(401, "Not authorized. No token provided."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ApiError(401, "User not found."));
    }

    if (user.status === "blocked") {
      return next(new ApiError(403, "Your account has been blocked."));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, "Not authorized. Invalid token."));
  }
};

// Role restriction middleware factory
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Access denied. Requires role: ${roles.join(", ")}`)
      );
    }
    next();
  };
};

// Instructor must be approved by admin
const requireApproved = (req, res, next) => {
  if (req.user.role === "instructor" && !req.user.isApproved) {
    return next(
      new ApiError(403, "Your instructor account is pending admin approval.")
    );
  }
  next();
};

module.exports = { protect, restrictTo, requireApproved };
