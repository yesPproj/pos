const express = require("express");
const router = express.Router();
const {
  createProduct,
  getLiveProductByName,
  getAllProducts,
  getProductByID,
  getAllProductsOfABusiness,
  updateProductByID,
  deleteProductByID,
} = require("../Controller/productController");

router.post("/products", createProduct);
router.get("/products/search", getLiveProductByName);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductByID);
router.get("/businesses/:businessId/products", getAllProductsOfABusiness);
router.put("/products/:id", updateProductByID);
router.delete("/products/:id", deleteProductByID);

module.exports = router;
