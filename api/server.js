const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./controllers/auth");
const habitRoutes = require("./routes/habits.js");

app.use("/auth", authRoutes);
app.use("/habits", habitRoutes);

app.get("/", (req, res) =>
  res.status(200).send("Welcome to our habit tracker!")
);

module.exports = app;
