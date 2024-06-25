const express = require("express");
const router = express.Router();
const multer = require("multer");

const uploadCsv = require("../Controller/uploadCsvController");

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Upload CSV and add products
router.post("/upload-csv", upload.single("file"), uploadCsv);

module.exports = router;
