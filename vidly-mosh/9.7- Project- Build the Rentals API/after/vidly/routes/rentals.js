const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie'); 
const {Customer} = require('../models/customer'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const ObjectId = require('mongoose').Types.ObjectId;
console.log(ObjectId.isValid('5eb3b7ee9912323fe2dccede'))

async function createRenral(customer, movie, dateOut, dateReturn, rentalFee) {
  const rental = new Rental({
    customer,
    movie,
    dateOut,
    dateReturn,
    rentalFee,
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
//   new Customer({
//       name: "Alex Hansome",
//       isGold: true,
//       phone: 88888,
//   }),

//   new Movie({
//     title: "Big Cat",
//     dailyRentalRate: 50,
//   }),
//   10
// );


router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(new ObjectId(req.body.customerId));
  console.log(customer)
  console.log(req.body)
  if (!customer) return res.status(400).send('Invalid customer.');
  
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  rental = await rental.save();

  movie.numberInStock--;
  movie.save();
  
  res.send(rental);
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 