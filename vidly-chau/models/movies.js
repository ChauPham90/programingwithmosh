const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./nestedGenres");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
  },
  genres: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    // required: true,
    min: 0,
    max: 50,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 5,
    // required: true,
  },
});

const Movies = mongoose.model("movies", movieSchema);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(3).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
  };

  return Joi.validate(movie, schema);
}
exports.Movies = Movies;
exports.validate = validateMovie;
exports.movieSchema = movieSchema;
