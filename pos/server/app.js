const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bwipjs = require('bwip-js');
const ExcelJS = require('exceljs');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas connection
const mongoURI = 'mongodb+srv://admin:admin@cluster0.ka61xaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Define schemas and models
const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  email: String,
  gstNumber: String,
  gstPercentage: Number,
  cgst: Number,
  sgst: Number
});

const Business = mongoose.model('Business', businessSchema);

const productSchema = new mongoose.Schema({
  uniqueId: { type: String, unique: true },
  name: String,
  price: Number,
  description: String,
  category: String,
  mrp: Number,
  sellingPrice: Number,
  barcode: String,
  stock: { type: Number, default: 0 },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' }
});

const Product = mongoose.model('Product', productSchema);

const customerSchema = new mongoose.Schema({
  customerType: String,
  name: String,
  phone: String,
  address: String,
  companyName: String,
  gstNumber: String
});

const Customer = mongoose.model('Customer', customerSchema);

const billSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  billDate: { type: Date, default: Date.now }
});

const Bill = mongoose.model('Bill', billSchema);

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to generate barcode image with product details
const generateBarcode = async (product) => {
  try {
    const text = `${product.uniqueId}|${product.name}|${product.price}|${product.category}|${product.mrp}|${product.sellingPrice}`;
    const png = await bwipjs.toBuffer({
      bcid: 'code128',
      text: text,
      scale: 3,
      height: 10,
      includetext: true
    });
    return png.toString('base64');
  } catch (err) {
    console.error('Error generating barcode:', err);
    return null;
  }
};

// Routes

// Upload CSV and add products
app.post('/upload-csv', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const products = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      products.push(row);
    })
    .on('end', async () => {
      try {
        for (const product of products) {
          product.uniqueId = uuidv4();
          product.barcode = await generateBarcode(product);
        }
        await Product.insertMany(products);
        res.status(201).send('Products added successfully');
      } catch (err) {
        res.status(500).send(err);
      } finally {
        fs.unlinkSync(filePath); // Remove the uploaded CSV file
      }
    })
    .on('error', (err) => {
      res.status(500).send(err);
    });
});
// Fetch all businesses (for simplicity, we are assuming there is only one business)
app.get('/businesses', async (req, res) => {
  try {
    const businesses = await Business.find();
    res.send(businesses);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Live search for products by name
app.get('/products/search', async (req, res) => {
  const { name } = req.query;
  try {
    const products = await Product.find({ name: { $regex: name, $options: 'i' } });
    res.send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new business
app.post('/businesses', async (req, res) => {
  const { name, address, phone, email, gstNumber, gstPercentage, cgst, sgst } = req.body;
  const business = new Business({ name, address, phone, email, gstNumber, gstPercentage, cgst, sgst });
  try {
    await business.save();
    res.status(201).send(business);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all businesses
app.get('/businesses', async (req, res) => {
  try {
    const businesses = await Business.find();
    res.send(businesses);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a business by ID
app.get('/businesses/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).send();
    }
    res.send(business);
  } catch (err) {
    res.status  (500).send(err);
  }
});

// Update a business by ID
app.put('/businesses/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, email, gstNumber, gstPercentage, cgst, sgst } = req.body;
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
});

// Delete a business by ID
app.delete('/businesses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Business.findByIdAndDelete(id);
    res.send({ message: 'Business deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new customer
app.post('/customers', async (req, res) => {
  const { customerType, name, phone, address, companyName, gstNumber } = req.body;
  const customer = new Customer({ customerType, name, phone, address, companyName, gstNumber });
  try {
    await customer.save();
    res.status(201).send(customer);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all customers
app.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.send(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Search for customers by name
app.get('/customers/search', async (req, res) => {
  const { name } = req.query;
  try {
    const customers = await Customer.find({ name: { $regex: name, $options: 'i' } });
    res.send(customers);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a customer by ID
app.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a customer by ID
app.put('/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { customerType, name, phone, address, companyName, gstNumber } = req.body;
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
});

// Delete a customer by ID
app.delete('/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Customer.findByIdAndDelete(id);
    res.send({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new product
app.post('/products', async (req, res) => {
  const { name, description, price, sellingPrice, mrp, stock, businessId } = req.body;
  const product = new Product({
    uniqueId: uuidv4(),
    name,
    description,
    price,
    sellingPrice,
    mrp,
    stock,
    businessId
  });
  try {
    product.barcode = await generateBarcode(product);
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a product by ID
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, sellingPrice, mrp, stock } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price, sellingPrice, mrp, stock },
      { new: true }
    );
    res.send(product);
  } catch (err) {
    res.status(500).send(err); // Corrected line
  }
});

// Delete a product by ID
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.send({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a list of all products belonging to a business
app.get('/businesses/:businessId/products', async (req, res) => {
  const { businessId } = req.params;
  try {
    const products = await Product.find({ businessId });
    res.send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new bill
app.post('/bills', async (req, res) => {
  const { customer, products, totalAmount } = req.body;
  const bill = new Bill({
    billNumber: uuidv4(),
    customer,
    products,
    totalAmount
  });
  try {
    await bill.save();
    res.status(201).send(bill);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all bills
app.get('/bills', async (req, res) => {
  try {
    const bills = await Bill.find().populate('customer').populate('products.product');
    res.send(bills);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a bill by ID
app.get('/bills/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('customer').populate('products.product');
    if (!bill) {
      return res.status(404).send();
    }
    res.send(bill);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Export all bills to an Excel file
app.get('/export-bills', async (req, res) => {
  try {
    const bills = await Bill.find().populate('customer').populate('products.product');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bills');

    worksheet.columns = [
      { header: 'Bill Number', key: 'billNumber', width: 20 },
      { header: 'Customer Name', key: 'customerName', width: 20 },
      { header: 'Customer Phone', key: 'customerPhone', width: 15 },
      { header: 'Total Amount', key: 'totalAmount', width: 15 },
      { header: 'Bill Date', key: 'billDate', width: 20 },
      { header: 'Products', key: 'products', width: 50 }
    ];

    bills.forEach(bill => {
      worksheet.addRow({
        billNumber: bill.billNumber,
        customerName: bill.customer.name,
        customerPhone: bill.customer.phone,
        totalAmount: bill.totalAmount,
        billDate: bill.billDate.toLocaleString(),
        products: bill.products.map(p => `${p.product.name} (Qty: ${p.quantity})`).join(', ')
      });
    });

    const filePath = path.join(__dirname, 'bills.xlsx');
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, 'bills.xlsx', err => {
      if (err) {
        console.error('Error sending file:', err);
      }
      fs.unlinkSync(filePath); // Remove the file after sending it
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Save invoice

  app.post('/save-invoice', async (req, res) => {
    const invoiceData = req.body;
    try {
      // Assuming you have an Invoice model
      const invoice = new Invoice(invoiceData);
      await invoice.save();
      res.status(201).json({ message: 'Invoice saved successfully', invoice });
    } catch (err) {
      console.error('Error saving invoice:', err);
      res.status(500).json({ message: 'Failed to save invoice', error: err.message });
    }
  });
  

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
