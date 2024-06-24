import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductSelection = (product) => {
    setSelectedProducts((prevSelected) => [...prevSelected, product]);
  };

  const handleRemoveProduct = (productToRemove) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.filter((product) => product._id !== productToRemove._id)
    );
  };

  const calculateTotal = () => {
    let totalPrice = 0;
    selectedProducts.forEach((product) => {
      totalPrice += product.price;
    });
    setTotal(totalPrice);
  };

  const handleCheckout = async () => {
    // Send selected products to the server for processing
    try {
      await axios.post('http://localhost:3000/billing', { products: selectedProducts });
      alert('Billing successful!');
      // Clear selected products after successful billing
      setSelectedProducts([]);
      setTotal(0);
    } catch (error) {
      console.error('Error processing billing:', error);
      alert('Error processing billing');
    }
  };

  return (
    <div>
      <h2>Billing</h2>
      <div>
        <h3>Available Products</h3>
        <ul>
          {products.map((product) => (
            <li key={product._id} onClick={() => handleProductSelection(product)}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Selected Products</h3>
        <ul>
          {selectedProducts.map((product) => (
            <li key={product._id} onClick={() => handleRemoveProduct(product)}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={calculateTotal}>Calculate Total</button>
        <p>Total: ${total}</p>
      </div>
      <div>
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default Billing;
