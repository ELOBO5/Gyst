require("dotenv").config();

const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await User.create({ ...req.body, password: hashedPassword });
    res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (!user) {
      throw new Error("No user with this email");
    }
    const authed = await bcrypt.compare(req.body.password, user.password);
    if (!!authed) {
      const payload = {
        username: user.username,
        email: user.email,
        id: user.id
      };
      const sendToken = (err, token) => {
        if (err) {
          throw new Error("Error in token generation");
        }
        res.status(200).json({ success: true, token: "Bearer " + token });
      };
      jwt.sign(payload, process.env.SECRET, sendToken);
    } else {
      throw new Error("User could not be authenticated");
    }
  } catch (err) {
    res.status(401).json({ err });
  }
});

module.exports = router;
