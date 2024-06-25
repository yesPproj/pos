// src/components/BillingPage.js
import React, { useState } from 'react';
import CustomerSearch from './CustomerSearch';
import ProductSearch from './ProductSearch';
import CustomerForm from './CustomerForm';
import api from './Api';

const BillingPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [productsInBill, setProductsInBill] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleAddProduct = async (product) => {
    const quantity = prompt(`Enter quantity for ${product.name}`, 1);
    if (!quantity || isNaN(quantity)) return;

    const productToAdd = {
      ...product,
      quantity: Number(quantity),
      total: product.sellingPrice * Number(quantity)
    };

    setProductsInBill([...productsInBill, productToAdd]);
    setTotalAmount(totalAmount + productToAdd.total);
  };

  const handleFinalizeBill = async () => {
    try {
      const response = await api.post('/bills', {
        customerId: selectedCustomer._id,
        products: productsInBill.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        totalAmount
      });
      console.log('Bill finalized:', response.data);
      // Reset state after successful finalization
      setSelectedCustomer(null);
      setProductsInBill([]);
      setTotalAmount(0);
      alert('Bill finalized successfully!');
    } catch (error) {
      console.error('Error finalizing bill:', error);
      alert('Failed to finalize bill. Please try again.');
    }
  };

  const handleAddNewCustomer = () => {
    setShowCustomerForm(true);
  };

  const handleCustomerAdded = (newCustomer) => {
    setSelectedCustomer(newCustomer);
    setShowCustomerForm(false);
  };

  return (
    <div>
      <h1>Billing System</h1>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <div style={{ marginRight: '20px' }}>
          <CustomerSearch onSelectCustomer={handleSelectCustomer} />
          <button onClick={handleAddNewCustomer}>Add New Customer</button>
          {showCustomerForm && <CustomerForm onCustomerAdded={handleCustomerAdded} />}
          {selectedCustomer && (
            <div style={{ marginTop: '20px' }}>
              <h3>Selected Customer: {selectedCustomer.name}</h3>
              <ProductSearch onAddProduct={handleAddProduct} />
            </div>
          )}
        </div>
        {selectedCustomer && (
          <div>
            <h3>Products in Bill</h3>
            <ul>
              {productsInBill.map(item => (
                <li key={item._id}>
                  {item.name} - Qty: {item.quantity} - Total: ${item.total}
                </li>
              ))}
            </ul>
            <p>Total Amount: ${totalAmount}</p>
            <button onClick={handleFinalizeBill}>Finalize Bill</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
