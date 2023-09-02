const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user-routes");
const orderRoutes = require("./routes/order-routes");
const HttpError = require("./utils/http-error");

app.use(express.json());
app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
