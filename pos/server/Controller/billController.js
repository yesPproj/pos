const { v4: uuidv4 } = require("uuid");
const ExcelJS = require("exceljs");
const path = require("path");

const Bill = require("../Schemas/billSchema");

const createBill = async (req, res) => {
  const { customer, products, totalAmount } = req.body;
  const bill = new Bill({
    billNumber: uuidv4(),
    customer,
    products,
    totalAmount,
  });
  try {
    await bill.save();
    res.status(201).send(bill);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("customer")
      .populate("products.product");
    res.send(bills);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getBillByID = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate("customer")
      .populate("products.product");
    if (!bill) {
      return res.status(404).send();
    }
    res.send(bill);
  } catch (err) {
    res.status(500).send(err);
  }
};

const exportBillsToExcel = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("customer")
      .populate("products.product");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bills");

    worksheet.columns = [
      { header: "Bill Number", key: "billNumber", width: 20 },
      { header: "Customer Name", key: "customerName", width: 20 },
      { header: "Customer Phone", key: "customerPhone", width: 15 },
      { header: "Total Amount", key: "totalAmount", width: 15 },
      { header: "Bill Date", key: "billDate", width: 20 },
      { header: "Products", key: "products", width: 50 },
    ];

    bills.forEach((bill) => {
      worksheet.addRow({
        billNumber: bill.billNumber,
        customerName: bill.customer.name,
        customerPhone: bill.customer.phone,
        totalAmount: bill.totalAmount,
        billDate: bill.billDate.toLocaleString(),
        products: bill.products
          .map((p) => `${p.product.name} (Qty: ${p.quantity})`)
          .join(", "),
      });
    });

    const filePath = path.join(__dirname, "bills.xlsx");
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, "bills.xlsx", (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
      fs.unlinkSync(filePath); // Remove the file after sending it
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  createBill,
  getAllBills,
  getBillByID,
  exportBillsToExcel,
};
