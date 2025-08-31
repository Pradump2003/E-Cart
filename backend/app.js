require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const { error } = require("./middleware/error.middleware");
const { authenticate, authorize } = require("./middleware/auth.middleware");

const userRoutes = require("./routes/user/user.routes");
const adminProductRoutes = require("./routes/admin/product.routes");
const shopProductRoutes = require("./routes/shop/product.routes");
const shopCartRoutes = require("./routes/shop/cart.routes");
const shopAddressRoutes = require("./routes/shop/address.routes");
const shopOrderRoutes = require("./routes/shop/order.routes");

//! seed admin details according to node.argv
console.log(process.argv);
if (process.argv[2] === "seed") {
  let adminSeeder = require("./seeder/adminSeeder");
  adminSeeder();
}

const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin/product", authenticate, authorize, adminProductRoutes);
app.use("/api/v1/shop/product", shopProductRoutes);
app.use("/api/v1/shop/cart", authenticate, shopCartRoutes);
app.use("/api/v1/shop/address", authenticate, shopAddressRoutes);
app.use("/api/v1/shop/order", authenticate, shopOrderRoutes);

app.use(error);

module.exports = app;
