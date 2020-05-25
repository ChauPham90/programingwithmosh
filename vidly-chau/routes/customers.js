const express = require("express");
const customer = express.Router();
const mongoose = require("mongoose");
const { Customers, validate } = require("../models/customer");

async function createCustomer() {
  const customer = new Customers({
    isGold: false,
    name: "Chau smart",
    phone: 123456,
  });
  try {
    const result = await customer.save();
    console.log(result);
  } catch (ex) {
    for (n in ex.errors) {
      console.log(ex.errors[n]);
    }
  }
}

//createCustomer();

customer.get("/", async (req, res) => {
  const customersList = await Customers.find().sort("name");
  res.send(customersList);
});

customer.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status("400").send(error.details[0].message);
  }

  let customer = new Customers({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });

  customer = await customer.save();
  try {
    res.send(customer);
  } catch (ex) {
    return console.error(ex);
  }
});

customer.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status("400").send(error.details[0].message);
  }
  const customer = await Customers.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone,
      },
    },
    { new: true }
  );

  res.send(customer);
});

customer.delete("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status("400").send(error.details[0].message);
  }

  const customer = await Customers.findByIdAndDelete(req.params.id);
  if (!customer) return res.status("404").send("given id is unvalid!");
  res.send(customer);
});

module.exports = customer;
