const ErrorHandler = require("../utils/ErrorHandler.utils");

const error = (err, req, res, next) => {
  // Default fallback values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // Mongoose CastError (e.g., invalid ObjectId)
  else if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  // Duplicate key error (code 11000)
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 400;
  }

  // JWT errors
  else if (err.name === "JsonWebTokenError") {
    message = "JSON Web Token is invalid. Try again.";
    statusCode = 400;
  } else if (err.name === "TokenExpiredError") {
    message = "JSON Web Token is expired. Try again.";
    statusCode = 400;
  }

  // Malformed JSON
  else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    message = "Invalid JSON payload.";
    statusCode = 400;
  }

  // Send formatted response using ErrorHandler
  const customError = new ErrorHandler(message, statusCode);

  return res.status(customError.statusCode).json({
    success: false,
    message: customError.message,
    stack: err.stack,
  });
};

module.exports = { error };
