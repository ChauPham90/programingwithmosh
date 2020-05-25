const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: { type: String, minlength: 5, maxlength: 255, required: true },
});
const Genres = mongoose.model("genres", genreSchema);

function validateNestedGenres(genre) {
  const schema = {
    name: Joi.string().min(3).max(255).required(),
  };

  return Joi.validate(genre, schema);
}

exports.Genres = Genres;
exports.genreSchema = genreSchema;
exports.validate = validateNestedGenres;
