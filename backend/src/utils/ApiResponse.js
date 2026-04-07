class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
};

module.exports = { ApiResponse, sendResponse };
