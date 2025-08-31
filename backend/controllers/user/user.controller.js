const expressAsyncHandler = require("express-async-handler");
const userCollection = require("../../models/user.model");
const ApiResponse = require("../../utils/ApiResponse.utils");
const ErrorHandler = require("../../utils/ErrorHandler.utils");
const { generateJwtToken } = require("../../utils/jwt.util");

const register = expressAsyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  const user = await userCollection.create({ userName, email, password });
  new ApiResponse(true, "User created successfully", user, 201).send(res);
});

const login = expressAsyncHandler(async (req, res, next) => {
  let { email, password } = req.body;
  let user = await userCollection.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  let isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  const token = generateJwtToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  new ApiResponse(true, "User logged in successfully", user, 200, token).send(res);
});

const logout = expressAsyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return new ApiResponse(true, "User logged out successfully", null, 200).send(res);
});

//! for frontend
const getCurrentUser = expressAsyncHandler(async (req, res) => {
  const user = req.user;  
  new ApiResponse(true, "User fetched successfully", user, 200).send(res);
});

module.exports = { register, login, logout, getCurrentUser };
