const express = require("express");
const router = express.Router();

const {
  getAllBusinesses,
  createBusiness,
  getBusinessByID,
  updateBusinessByID,
  deleteBusinessByID,
} = require("../Controller/businessController");

router.get("/businesses", getAllBusinesses);
router.post("/businesses", createBusiness);
router.get("/businesses/:id", getBusinessByID);
router.put("/businesses/:id", updateBusinessByID);
router.delete("/businesses/:id", deleteBusinessByID);

module.exports = router;
