const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-header-token");
  if (!token) return res.status(400).send("Access denied. No token provided.");
  try {
    const decoded = jwt.verify(token, config.get("jwtPriviteKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).send("Invalid token");
  }
};
