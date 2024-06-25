const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  billDate: { type: Date, default: Date.now },
});

const Bill = mongoose.model("Bill", billSchema);

module.exports = { Bill };
