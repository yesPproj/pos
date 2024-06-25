import React, { useState, useEffect } from 'react';
import './ProductForm.css';
import UploadCSV from './UploadCSV';
import bwipjs from 'bwip-js';

const ProductForm = ({ onSubmit, initialData, scannedBarcode }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [stock, setStock] = useState('');
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setPrice(initialData.price || '');
      setSellingPrice(initialData.sellingPrice || '');
      setMrp(initialData.mrp || '');
      setStock(initialData.stock || '');
      setBarcode(initialData.barcode || '');
    }
  }, [initialData]);

  useEffect(() => {
    if (scannedBarcode) {
      setBarcode(scannedBarcode);
    }
  }, [scannedBarcode]);

  const generateBarcode = () => {
    const canvas = document.createElement('canvas');
    bwipjs.toCanvas(canvas, {
      bcid: 'code128',
      text: name + Date.now(), // Using name and current timestamp for uniqueness
      scale: 3,
      height: 10,
    }, (err) => {
      if (err) {
        console.error('Error generating barcode:', err);
      } else {
        setBarcode(canvas.toDataURL('image/png'));
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!barcode) {
      generateBarcode();
    }
    onSubmit({
      name,
      description,
      price,
      sellingPrice,
      mrp,
      stock,
      barcode,
    });
    // Clear the form after submission
    setName('');
    setDescription('');
    setPrice('');
    setSellingPrice('');
    setMrp('');
    setStock('');
    setBarcode('');
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <UploadCSV />
      <h3>Product Form</h3>
      <label htmlFor="barcode">Barcode</label>
      <input
        
        id="barcode"
        placeholder="Barcode"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        
      />
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      ></textarea>
      <label htmlFor="price">Price</label>
      <input
        type="number"
        id="price"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <label htmlFor="sellingPrice">Selling Price</label>
      <input
        type="number"
        id="sellingPrice"
        placeholder="Selling Price"
        value={sellingPrice}
        onChange={(e) => setSellingPrice(e.target.value)}
        required
      />
      <label htmlFor="mrp">MRP</label>
      <input
        type="number"
        id="mrp"
        placeholder="MRP"
        value={mrp}
        onChange={(e) => setMrp(e.target.value)}
        required
      />
      <label htmlFor="stock">Stock</label>
      <input
        type="number"
        id="stock"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductForm;
