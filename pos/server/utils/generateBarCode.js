const bwipjs = require("bwip-js");

// Function to generate barcode image with product details
const generateBarcode = async (product) => {
  try {
    const text = `${product.uniqueId}|${product.name}|${product.price}|${product.category}|${product.mrp}|${product.sellingPrice}`;
    const png = await bwipjs.toBuffer({
      bcid: "code128",
      text: text,
      scale: 3,
      height: 10,
      includetext: true,
    });
    return png.toString("base64");
  } catch (err) {
    console.error("Error generating barcode:", err);
    return null;
  }
};

module.exports = generateBarcode;
