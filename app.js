const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

const userRoutes = require("./routes/user-routes");

app.use("/api/users", userRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
