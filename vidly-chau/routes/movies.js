const express = require("express");
const router = express.Router();
const { Movies, validate } = require("../models/movies");
const { Genres } = require("../models/nestedGenres");

async function createGenres(name) {
  const genre = new Genres({ name });
  const result = await genre.save();
  console.log(result);
}

//createGenres("dramma");

async function createMovies(title, genres, numberInStock, dailyRentalRate) {
  const movies = new Movies({
    title,
    genres,
    numberInStock,
    dailyRentalRate,
  });
  const result = await movies.save();
  console.log(result);
}

//createMovies("movie with genresObject", new Genres({ name: "comady" }), 5, 5);

async function listMovie() {
  const movie = await Movies.find().select("name title").populate("genre");
  // console.log(movie);
}

listMovie();

router.get("/", async (req, res) => {
  const movies = await Movies.find().sort("name");
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check valid genre in genre's collection
  const genre = await Genres.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  let movie = new Movies({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  try {
    movie = await movie.save();
    res.send(movie);
  } catch (ex) {
    for (n in ex.errors) {
      console.log(ex.errors[n]);
    }
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Movies.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        genre: req.body.genre,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
    },
    { new: true }
  );

  if (!genre)
    return res.status(404).send("The movie with the given ID was not found.");

  //genre.name = req.body.name;
  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Movies.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const genre = await Movies.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The movie with the given ID was not found.");
  res.send(genre);
});

module.exports = router;
