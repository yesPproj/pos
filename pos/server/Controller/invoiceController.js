const saveInvoice = async (req, res) => {
  const invoiceData = req.body;
  try {
    // Assuming you have an Invoice model
    const invoice = new Invoice(invoiceData);
    await invoice.save();
    res.status(201).json({ message: "Invoice saved successfully", invoice });
  } catch (err) {
    console.error("Error saving invoice:", err);
    res
      .status(500)
      .json({ message: "Failed to save invoice", error: err.message });
  }
};

module.exports = saveInvoice;
