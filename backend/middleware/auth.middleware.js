const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler.utils");
const userCollection = require("../models/user.model");

const authenticate = expressAsyncHandler(async (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  let decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userCollection.findById(decoded.id).select("-password");
  if (!user) return next(new ErrorHandler("invalid session, please login", 401));
  req.user = user;
  next();
});

const authorize = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler("You are not authorized to access this resource", 403));
  }
  next();
};

module.exports = { authenticate, authorize };
