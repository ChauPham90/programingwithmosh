const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 5,
    trim: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 200,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPriviteKey"));
  return token;
};
const User = mongoose.model("users", userSchema);

const userValidation = (user) => {
  const schema = {
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  };
  return Joi.validate(user, schema);
};

exports.Users = User;
exports.validate = userValidation;
exports.userSchema = userSchema;
