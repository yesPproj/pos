const Customer = require("../Schemas/customerSchema");

const createCustomer = async (req, res) => {
  const { customerType, name, phone, address, companyName, gstNumber } =
    req.body;
  const customer = new Customer({
    customerType,
    name,
    phone,
    address,
    companyName,
    gstNumber,
  });
  try {
    await customer.save();
    res.status(201).send(customer);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.send(customers);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).send("Internal Server Error");
  }
};

const getCustomerByName = async (req, res) => {
  const { name } = req.query;
  try {
    const customers = await Customer.find({
      name: { $regex: name, $options: "i" },
    });
    res.send(customers);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getCustomerByID = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateCustomerByID = async (req, res) => {
  const { id } = req.params;
  const { customerType, name, phone, address, companyName, gstNumber } =
    req.body;
  try {
    const customer = await Customer.findByIdAndUpdate(
      id,
      { customerType, name, phone, address, companyName, gstNumber },
      { new: true }
    );
    res.send(customer);
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteCustomerByID = async (req, res) => {
  const { id } = req.params;
  try {
    await Customer.findByIdAndDelete(id);
    res.send({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerByID,
  getCustomerByName,
  updateCustomerByID,
  deleteCustomerByID,
};
