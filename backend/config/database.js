const mongoose = require("mongoose");
const expressAsyncHandler = require("express-async-handler");

const connectDB = expressAsyncHandler(async () => {
  let client = await mongoose.connect(process.env.MONGODB_LOCAL_URL);
  console.log("Connected to MongoDB: ", client.connection.host);
});

module.exports = { connectDB };
