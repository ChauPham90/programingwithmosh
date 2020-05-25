const Joi = require("joi");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Users } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status("400").send(error.details[0].message);
  }
  let user = await Users.findOne({ email: req.body.email });
  if (!user) return res.status("400").send("invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password); //return true /false
  if (!validPassword)
    return res.status("400").send("invalid email or password");
  res.send(true);
});

const validate = (req) => {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  };
  return Joi.validate(req, schema);
};
module.exports = router;
