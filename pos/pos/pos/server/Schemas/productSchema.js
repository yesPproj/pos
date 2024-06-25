const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  uniqueId: { type: String, unique: true },
  name: String,
  price: Number,
  description: String,
  category: String,
  mrp: Number,
  sellingPrice: Number,
  barcode: String,
  stock: { type: Number, default: 0 },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
