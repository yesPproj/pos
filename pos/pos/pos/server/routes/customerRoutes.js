const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getAllCustomers,
  getCustomerByID,
  getCustomerByName,
  updateCustomerByID,
  deleteCustomerByID,
} = require("../Controller/customerController");

router.post("/customers", createCustomer);
router.get("/customers", getAllCustomers);
router.get("/customers/search", getCustomerByName);
router.get("/customers/:id", getCustomerByID);
router.put("/customers/:id", updateCustomerByID);
router.delete("/customers/:id", deleteCustomerByID);

module.exports = router;
