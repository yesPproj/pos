const Business = require("../Schemas/businessSchema");

const getAllBusinesses = async (req, res) => {
  try {
    console.log("Businesss");
    const businesses = await Business.find();
    res.send(businesses);
  } catch (err) {
    res.status(500).send(err);
  }
};

const createBusiness = async (req, res) => {
  const { name, address, phone, email, gstNumber, gstPercentage, cgst, sgst } =
    req.body;
  const business = new Business({
    name,
    address,
    phone,
    email,
    gstNumber,
    gstPercentage,
    cgst,
    sgst,
  });
  try {
    await business.save();
    res.status(201).send(business);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getBusinessByID = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).send();
    }
    res.send(business);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateBusinessByID = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, email, gstNumber, gstPercentage, cgst, sgst } =
    req.body;
  try {
    const business = await Business.findByIdAndUpdate(
      id,
      { name, address, phone, email, gstNumber, gstPercentage, cgst, sgst },
      { new: true }
    );
    res.send(business);
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteBusinessByID = async (req, res) => {
  const { id } = req.params;
  try {
    await Business.findByIdAndDelete(id);
    res.send({ message: "Business deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getAllBusinesses,
  createBusiness,
  getBusinessByID,
  updateBusinessByID,
  deleteBusinessByID,
};
