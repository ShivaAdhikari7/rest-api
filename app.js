const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

const userRoutes = require("./routes/user-routes");

app.use("/api/users", userRoutes);

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
