const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Movies, validate } = require("../models/genre");
mongoose.set("useFindAndModify", false);

mongoose
  .connect("mongodb://localhost/vidly", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("connecting to vidly database"))
  .catch(() => console.log("can not connect to DB"));

async function createMovie() {
  const movie = new Movies({
    name: "Tom & Jerry",
    country: "american",
    length: 150,
    rating: 5.0,
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
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0]);

  let genre = new Movies({
    name: req.body.name,
    country: req.body.country,
    length: req.body.length,
    rating: req.body.rating,
    genres: req.body.genres,
  });
  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validatez(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Movies.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        country: req.body.country,
        length: req.body.length,
        rating: req.body.rating,
        genres: req.body.genres,
      },
    },
    { new: true }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  //genre.name = req.body.name;
  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Movies.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const genre = await Movies.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

module.exports = router;
