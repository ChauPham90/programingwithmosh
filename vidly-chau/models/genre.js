const Joi = require("joi");
const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    minlength: 5,
  },
  country: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    minlength: 5,
  },
  length: {
    type: Number,
    set: (v) => Math.round(v),
  },
  rating: {
    type: Number,
  },
  genres: {
    type: String,
    enum: ["Action", "Commedy", "Horror", "Romance", "Dramma", "Fantasy"],
    upercase: true,
    required: function (value) {
      return value && value.length > 5;
    },
  },
});

const Movies = mongoose.model("vidly", moviesSchema);

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
    country: Joi.string().min(5).required(),
    length: Joi.number(),
    rating: Joi.number(),
    genres: Joi.string().required(),
  };

  return Joi.validate(genre, schema);
}
exports.Movies = Movies;
exports.validate = validateGenre;
