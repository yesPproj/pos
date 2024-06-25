import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerList from './CustomerList';
import CustomerEdit from './CustomerEdit';
import Notification from './Notification'; // Import Notification component

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [notification, setNotification] = useState(null); // State for notification

  // Fetch all customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  // Function to handle deleting a customer
  const handleCustomerDeleted = async (customerId) => {
    try {
      await axios.delete(`http://localhost:3000/customers/${customerId}`);
      setCustomers(customers.filter(customer => customer._id !== customerId));
      setSelectedCustomer(null); // Clear selected customer if deleted
      showNotification('Customer deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting customer:', error);
      showNotification('Failed to delete customer', 'error');
    }
  };

  // Function to handle selecting a customer for editing
  const handleSelectCustomer = (customerId) => {
    setSelectedCustomer(customerId);
  };

  // Function to handle updating customer details
  const handleCustomerUpdated = async (updatedCustomer) => {
    try {
      await axios.put(`http://localhost:3000/customers/${updatedCustomer._id}`, updatedCustomer);
      const updatedCustomers = customers.map(customer =>
        customer._id === updatedCustomer._id ? updatedCustomer : customer
      );
      setCustomers(updatedCustomers);
      setSelectedCustomer(null); // Clear selected customer after update
      showNotification('Customer updated successfully', 'success');
    } catch (error) {
      console.error('Error updating customer:', error);
      showNotification('Failed to update customer', 'error');
    }
  };

  // Function to display notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Clear notification after 3 seconds
  };

  return (
    <div>
      <h1>Customer Management</h1>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="customer-management">
        <div className="customer-list">
          <CustomerList
            customers={customers}
            onSelectCustomer={handleSelectCustomer}
            onCustomerDeleted={handleCustomerDeleted}
          />
        </div>
      </div>
      {selectedCustomer && (
        <div className="customer-edit">
          <h2>Edit Customer Details</h2>
          <CustomerEdit
            key={selectedCustomer}
            customerId={selectedCustomer}
            onCustomerUpdated={handleCustomerUpdated}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
