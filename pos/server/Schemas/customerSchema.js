const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerType: String,
  name: String,
  phone: String,
  address: String,
  companyName: String,
  gstNumber: String,
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
