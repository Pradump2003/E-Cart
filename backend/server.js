const app = require("./app");
const { connectDB } = require("./config/database");

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("Error in connecting to server: ", err);
      process.exit(1);
    });

    app.listen(process.env.PORT, (err) => {
      if (err) {
        console.log("Error in connecting to server: ", err);
        process.exit(1);
      }
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error in connecting to MongoDB: ${err}`);
    process.exit(1);
  });
