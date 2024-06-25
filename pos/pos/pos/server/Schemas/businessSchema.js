const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  email: String,
  gstNumber: String,
  gstPercentage: Number,
  cgst: Number,
  sgst: Number,
});

const Business = mongoose.model("Business", businessSchema);

module.exports = Business;
