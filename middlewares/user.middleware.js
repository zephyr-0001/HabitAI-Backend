const jwt = require("jsonwebtoken");
const BlacklistToken = require("../model/blacklistToken.model");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || "";

  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const isTokenBlacklisted = await BlacklistToken.findOne({ token });

    if (isTokenBlacklisted) {
      throw new Error();
    }

    req._id = decodedToken._id;
    next();
  } catch (err) {
    res.status(401).json({
      status: "unauthorized",
    });
  }
};

module.exports = { isAuthenticated };
