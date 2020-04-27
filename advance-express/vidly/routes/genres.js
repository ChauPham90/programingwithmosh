const express = require("express");
const router = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/vidly", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("connecting to vidly database"))
  .catch(() => console.log("can not connect to DB"));

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
// const genres = [
//   { id: 1, name: "Action" },
//   { id: 2, name: "Horror" },
//   { id: 3, name: "Romance" },
// ];

const Movies = new mongoose.model("vidly", moviesSchema);

async function createMovie() {
  const movie = new Movies({
    name: "The Mandalorian",
    country: "california",
    rating: 4.8,
    genres: "Fantasy",
  });
  try {
    const result = await movie.save();
    console.log(result);
  } catch (ex) {
    for (n in ex.errors) {
      console.log(ex.errors[n]);
    }
  }
}

//createMovie();

router.get("/", async (req, res) => {
  const movies = await Movies.find().sort("name");
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0]);

  let genre = new Movies({
    name: req.body.name,
    country: req.body.country,
    rating: req.body.rating,
    genres: req.body.genres,
  });
  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

router.delete("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

router.get("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}

module.exports = router;
