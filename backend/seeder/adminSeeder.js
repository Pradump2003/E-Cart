const userCollection = require("../models/user.model");
const expressAsyncHandler = require("express-async-handler");

const adminSeeder = expressAsyncHandler(async () => {
  const adminExists = await userCollection.findOne({ role: "admin" });

  if (!adminExists) {
    await userCollection.create({
      userName: "Pradum Prajapati",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD, // This will be auto-hashed in your model pre-save
      role: "admin",
    });

    console.log("✅ Admin user seeded successfully");
  } else {
    console.log("ℹ️ Admin user already exists. Skipping seeding...");
  }
});

module.exports = adminSeeder;
