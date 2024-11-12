const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const authRoute = require("./routes/auth");

dotenv.config({ path: "./.env" });
app.use(express.json());

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err.message);
  });
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoute);

app.listen(5000, (req, res) => {
  console.log("Backend is running");
});
