import React, { useState } from 'react';
import axios from 'axios';

const CustomerForm = ({ onCustomerAdded }) => {
  const [customerType, setCustomerType] = useState('B2C');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    companyName: '',
    gstNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/customers', { ...formData, customerType });
      console.log('Customer added:', response.data);
      onCustomerAdded(response.data); // Notify parent component about new customer added
      setFormData({
        name: '',
        phone: '',
        address: '',
        companyName: '',
        gstNumber: ''
      });
    } catch (error) {
      console.error('Error adding customer:', error.message); // Log specific error message
      // Optionally, handle error state in your component or show a user-friendly message
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <select name="customerType" value={customerType} onChange={(e) => setCustomerType(e.target.value)}>
        <option value="B2C">B2C</option>
        <option value="B2B">B2B</option>
        <option value="B2G">B2G</option>
      </select>

      {customerType === 'B2C' && (
        <>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
        </>
      )}

      {customerType === 'B2B' && (
        <>
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
          <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST Number" required />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
        </>
      )}

      {customerType === 'B2G' && (
        <>
          <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST Number" required />
        </>
      )}

      <button type="submit">Add Customer</button>
    </form>
  );
};

export default CustomerForm;
