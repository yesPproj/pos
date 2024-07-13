const express = require("express");
const router = express.Router();

const saveInvoice = require("../Controller/invoiceController");

router.post("/save-invoice", saveInvoice);

module.exports = router;
