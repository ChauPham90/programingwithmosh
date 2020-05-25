const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Fawn = require("fawn");
const { Rental, validate } = require("../models/rental");
const { Movies } = require("../models/movies");
const { Genres } = require("../models/nestedGenres");
const { Customers } = require("../models/customer");

mongoose
  .connect("mongodb://localhost/vidly", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
  })
  .then(() => console.log("connecting to rental"))
  .catch(() => console.log("can not connect to rental"));

Fawn.init(mongoose);

async function createRenral(customer, movie, dateOut, dateReturn, fee) {
  const rental = new Rental({
    customer,
    movie,
    dateOut,
    dateReturn,
    fee,
  });
  try {
    const result = await rental.save();
    console.log(result);
  } catch (ex) {
    for (n in ex.errors) {
      console.log(ex.errors[n]);
    }
  }
}

// createRenral(
//   new Customers({
//     isGold: true,
//     name: "Alex Hansome",
//     phone: 8888,
//   }),
//   new Movies({
//     title: "Big Cat",
//     genre: "Dramma",
//     numberInStock: 36,
//     dailyRentalRate: 5,
//   }),
//   10
// );

async function listRental() {
  try {
    const movie = await Rental.find()
      .select("customer,movie,dateOut")
      .populate("customer", "name")
      .populate("movie", "title")
      .populate("dateOut");
    console.log(movie);
  } catch (ex) {
    for (n in ex.errors) {
      console.log(ex.errors[n]);
    }
  }
}
//listRental();

router.get("/", async (req, res) => {
  const movies = await Rental.find().select({ movie: 1, customer: 1, fee: 1 });
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const title = await Movies.findById(req.body.movieId);
  if (!title) return res.status(400).send("Invalid movie");

  if (!title.numberInStock) return res.status(400).send(" movie");
  const customer = await Customers.findById(req.body.customerId);

  if (!customer) return res.status(400).send("Invalid customer");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: title._id,
      title: title.title,
    },
  });
  try {
    Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: title._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
    res.send(rental);
  } catch (ex) {
    for (n in ex.errors) {
      console.log(ex.errors[n]);
    }
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rentals = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        customer: req.body.customer,
        movie: req.body.movie,
        dateReturn: req.body.dateOut,
        dateReturn: req.body.dateReturn,
      },
    },
    { new: true }
  );

  if (!rentals)
    return res.status(404).send("The movie with the given ID was not found.");
  res.send(rentals);
});

// router.delete("/:id", async (req, res) => {
//   const genre = await Movies.findByIdAndDelete(req.params.id);

//   if (!genre)
//     return res.status(404).send("The movie with the given ID was not found.");

//   res.send(genre);
// });

// router.get("/:id", async (req, res) => {
//   const genre = await Movies.findById(req.params.id);
//   if (!genre)
//     return res.status(404).send("The movie with the given ID was not found.");
//   res.send(genre);
// });

module.exports = router;
