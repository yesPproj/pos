// CustomerEdit.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerEdit = ({ customerId }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    companyName: '',
    gstNumber: ''
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/customers/${customerId}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching customer:', error);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/customers/${customerId}`, formData);
      console.log('Customer updated:', customerId);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
      <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
      <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required />
      <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST Number" required />
      <button type="submit">Update Customer</button>
    </form>
  );
};

export default CustomerEdit;
