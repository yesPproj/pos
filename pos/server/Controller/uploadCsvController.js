const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const generateBarcode = require("../utils/generateBarCode");

const Product = require("../Schemas/productSchema");

const uploadCsv = (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const products = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => {
      products.push(row);
    })
    .on("end", async () => {
      try {
        for (const product of products) {
          product.uniqueId = uuidv4();
          product.barcode = await generateBarcode(product);
        }
        await Product.insertMany(products);
        res.status(201).send("Products added successfully");
      } catch (err) {
        res.status(500).send(err);
      } finally {
        fs.unlinkSync(filePath); // Remove the uploaded CSV file
      }
    })
    .on("error", (err) => {
      res.status(500).send(err);
    });
};

module.exports = uploadCsv;
