const { v4: uuidv4 } = require("uuid");
const generateBarcode = require("../utils/generateBarCode");

const Product = require("../Schemas/productSchema");

const createProduct = async (req, res) => {
  const { name, description, price, sellingPrice, mrp, stock, businessId } =
    req.body;
  const product = new Product({
    uniqueId: uuidv4(),
    name,
    description,
    price,
    sellingPrice,
    mrp,
    stock,
    businessId,
  });
  try {
    product.barcode = await generateBarcode(product);
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getLiveProductByName = async (req, res) => {
  const { name } = req.query;
  try {
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });
    res.send(products);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getProductByID = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAllProductsOfABusiness = async (req, res) => {
  const { businessId } = req.params;
  try {
    const products = await Product.find({ businessId });
    res.send(products);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateProductByID = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, sellingPrice, mrp, stock } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price, sellingPrice, mrp, stock },
      { new: true }
    );
    res.send(product);
  } catch (err) {
    res.status(500).send(err); // Corrected line
  }
};

const deleteProductByID = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.send({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  createProduct,
  getLiveProductByName,
  getAllProducts,
  getProductByID,
  getAllProductsOfABusiness,
  updateProductByID,
  deleteProductByID,
};
