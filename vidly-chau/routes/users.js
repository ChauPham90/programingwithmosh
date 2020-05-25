const _ = require("lodash");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Users, validate } = require("../models/user");

router.get("/", async (req, res) => {
  const users = await Users.find().sort("name");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status("400").send(error.details[0].message);
  }
  let user = await Users.findOne({ email: req.body.email });
  if (user) return res.status("400").send("the user has already registered");

  user = new Users(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();
  try {
    res.send(_.pick(req.body, ["_id", "name", "email"]));
  } catch (ex) {
    return console.error(ex);
  }
});

module.exports = router;
