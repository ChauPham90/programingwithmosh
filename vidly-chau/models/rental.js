const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { customerSchema } = require("./customer");
const { movieSchema } = require("./movies");
const { genreSchema } = require("./nestedGenres");

const rentalSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema({
      isGold: {
        type: Boolean,
        required: true,
      },
      name: {
        type: String,
        minlength: 5,
        maxlength: 200,
        required: true,
        trim: true,
      },
      phone: {
        type: Number,
      },
    }),
  },
  movie: {
    type: mongoose.Schema({
      title: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
      },
      genre: {
        type: String,
        enum: ["Action", "Commedy", "Horror", "Romance", "Dramma", "Fantasy"],
        upercase: true,
        required: function (value) {
          return value && value.length > 5;
        },
        numberInStock: {
          type: Number,
          min: 0,
          max: 50,
        },
        dailyRentalRate: {
          type: Number,
          min: 0,
          max: 5,
        },
      },
    }),
  },
  dateOut: {
    type: Date,
    default: () => Date.now(),
  },
  dateReturn: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
  fee: {
    type: Number,
    min: 0,
  },
});
const Rental = mongoose.model("rental", rentalSchema);

function validateRental(rental) {
  const schema = {
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required(),
  };

  return Joi.validate(rental, schema);
}
exports.Rental = Rental;
exports.validate = validateRental;
