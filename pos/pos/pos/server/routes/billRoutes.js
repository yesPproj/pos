const express = require("express");
const router = express.Router();

const {
  createBill,
  getAllBills,
  getBillByID,
  exportBillsToExcel,
} = require("../Controller/billController");

router.post("/bills", createBill);
router.get("/bills", getAllBills);
router.get("/bills/:id", getBillByID);
router.get("/export-bills", exportBillsToExcel);

module.exports = router;
