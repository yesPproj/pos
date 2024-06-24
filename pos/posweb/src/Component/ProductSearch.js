// src/components/ProductSearch.js
import React, { useState, useEffect } from 'react';
import api from './Api';

const ProductSearch = ({ onAddProduct }) => {
  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products/search?name=${productName}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = async () => {
    fetchProducts();
  };

  const handleAdd = (product) => {
    onAddProduct(product);
    setProductName('');
    setProducts([]);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search product by name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {products.map(product => (
          <li key={product._id} onClick={() => handleAdd(product)}>
            {product.name} - ${product.sellingPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSearch;
