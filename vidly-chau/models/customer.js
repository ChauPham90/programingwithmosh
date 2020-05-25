const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
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
});

const Customers = mongoose.model("vidly.customers", customerSchema);

const customersValidation = (customer) => {
  const schema = {
    isGold: Joi.boolean().required(),
    name: Joi.string().min(5).max(200).required(),
    phone: Joi.number(),
  };
  return Joi.validate(customer, schema);
};

exports.Customers = Customers;
exports.validate = customersValidation;
exports.customerSchema = customerSchema;
