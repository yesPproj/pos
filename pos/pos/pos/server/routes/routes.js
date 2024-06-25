const businessRoutes = require("./businessRoutes");
const customerRoutes = require("./customerRoutes");
const productRoutes = require("./productRoutes");
const billRoutes = require("./billRoutes");
const uploadCsv = require("./uploadCscRoutes");
const saveInvoice = require("./invoiceRoutes");

module.exports = [
  businessRoutes,
  customerRoutes,
  productRoutes,
  billRoutes,
  uploadCsv,
  saveInvoice,
];
