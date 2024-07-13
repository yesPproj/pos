// src/App.js
import React, { useEffect, useState } from 'react';
import {
  createCustomer,
  getAllCustomers,
  deleteCustomerByID,
} from '../service/customerService';
// import './App.css';

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState({
    customerType: '',
    name: '',
    phone: '',
    address: '',
    companyName: '',
    gstNumber: '',
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomers();
        setCustomers(response.data);
      } catch (error) {
        console.error(error);
        alert('Error fetching customers');
      }
    };

    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCustomer(customer);
      setCustomer({
        customerType: '',
        name: '',
        phone: '',
        address: '',
        companyName: '',
        gstNumber: '',
      });
      const response = await getAllCustomers();
      setCustomers(response.data);
      alert('Customer created successfully');
    } catch (error) {
      console.error(error);
      alert('Error creating customer');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomerByID(id);
      setCustomers(customers.filter((customer) => customer._id !== id));
    } catch (error) {
      console.error(error);
      alert('Error deleting customer');
    }
  };

  return (
    <div className="App">
      <h1>Customer Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="customerType"
          placeholder="Customer Type"
          value={customer.customerType}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={customer.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={customer.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={customer.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={customer.companyName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="gstNumber"
          placeholder="GST Number"
          value={customer.gstNumber}
          onChange={handleChange}
        />
        <button type="submit">Add Customer</button>
      </form>
      <h2>Customer List</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer._id}>
            {customer.name} - {customer.phone}
            <button onClick={() => handleDelete(customer._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
