const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../model/user.model");
const BlacklistToken = require("../model/blacklistToken.model");
const { isAuthenticated } = require("../middlewares/user.middleware");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({
        message: "blank field",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "email already exists",
      });
    }

    const userInstance = new User({
      name: name,
      email: email,
      password: await bcrypt.hash(password, saltRounds),
    });

    const user = await userInstance.save();
    res.status(201).json({ data: user });
  } catch (err) {
    return res.status(500).json({
      title: "internal server error",
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        message: "email and password is required!!",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user)
      return res.status(401).json({
        message: "invalid username or password!!",
      });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "invalid username or password!!",
      });
    }

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({
      token,
    });
  } catch (err) {
    return res.status(500).json({
      title: "internal server error",
      message: err.message,
    });
  }
});

router.post("/logout", isAuthenticated, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const record = new BlacklistToken({ token });

    await record.save();
    res.status(204).end();
  } catch (err) {
    return res.status(500).json({
      title: "internal server error",
      message: err.message,
    });
  }
});

router.get("/verify-token", isAuthenticated, async (_, res) => {
  res.json({
    message: "valid token!!",
  });
});

module.exports = router;
