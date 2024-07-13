import React, { useState, useEffect } from 'react';
import '../Styles/ProductForm.css';
import axios from 'axios'; // Import Axios for making HTTP requests
import bwipjs from 'bwip-js'; // Import bwip-js for barcode generation

const ProductForm = ({ productId, scannedBarcode }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sellingPrice: '',
    mrp: '',
    stock: '',
    barcode: '',
  });

  useEffect(() => {
    // Fetch product details if productId is provided
    const fetchProductDetails = async () => {
      if (productId) {
        try {
          const response = await axios.get(`http://example.com/api/products/${productId}`);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      }
    };
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (scannedBarcode) {
      setFormData((prevData) => ({ ...prevData, barcode: scannedBarcode }));
    }
  }, [scannedBarcode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateBarcode = () => {
    const canvas = document.createElement('canvas');
    bwipjs.toCanvas(canvas, {
      bcid: 'code128',
      text: formData.name + Date.now(), // Using name and current timestamp for uniqueness
      scale: 3,
      height: 10,
    }, (err) => {
      if (err) {
        console.error('Error generating barcode:', err);
      } else {
        setFormData((prevData) => ({ ...prevData, barcode: canvas.toDataURL('image/png') }));
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.barcode) {
      generateBarcode();
    }
    try {
      // Example: Post formData to backend (replace URL with your API endpoint)
      const response = await axios.post('http://example.com/api/products', formData);
      console.log(response.data); // Handle success response
      // Optionally, reset form after successful submission
      setFormData({
        name: '',
        description: '',
        price: '',
        sellingPrice: '',
        mrp: '',
        stock: '',
        barcode: '',
      });
    } catch (error) {
      console.error('Error:', error); // Handle error
    }
  };

  return (
    <div className="product-form-container">
      <h2>Product Form</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <label htmlFor="barcode">Barcode</label>
        <input
          id="barcode"
          name="barcode"
          placeholder="Barcode"
          value={formData.barcode}
          onChange={handleChange}
          required
        />
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        ></textarea>
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <label htmlFor="sellingPrice">Selling Price</label>
        <input
          type="number"
          id="sellingPrice"
          name="sellingPrice"
          placeholder="Selling Price"
          value={formData.sellingPrice}
          onChange={handleChange}
          required
        />
        <label htmlFor="mrp">MRP</label>
        <input
          type="number"
          id="mrp"
          name="mrp"
          placeholder="MRP"
          value={formData.mrp}
          onChange={handleChange}
          required
        />
        <label htmlFor="stock">Stock</label>
        <input
          type="number"
          id="stock"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProductForm;
