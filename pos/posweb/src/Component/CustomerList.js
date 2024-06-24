import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

const CustomerList = ({ onCustomerDeleted }) => {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('all');

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

  const handleDeleteCustomer = async (customerId) => {
    try {
      await axios.delete(`http://localhost:3000/customers/${customerId}`);
      console.log('Customer deleted:', customerId);
      onCustomerDeleted(customerId); // Notify parent component about deleted customer
      setCustomers(customers.filter(customer => customer._id !== customerId));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:3000/customers/export', {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'customers.xlsx');
    } catch (error) {
      console.error('Error exporting customers:', error);
    }
  };

  const filteredCustomers = customers.filter((customer) => 
    filter === 'all' || customer.customerType === filter
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '80%', margin: '0 auto', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Customer List</h2>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button onClick={() => setFilter('all')} style={{ margin: '0 10px' }}>All</button>
        <button onClick={() => setFilter('B2B')} style={{ margin: '0 10px' }}>B2B</button>
        <button onClick={() => setFilter('B2C')} style={{ margin: '0 10px' }}>B2C</button>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={handleExport} 
          style={{
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '3px', 
            cursor: 'pointer'
          }}
        >
          Export to Excel
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f1f1f1' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Phone</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Address</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Company Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>GST Number</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date Added</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer._id} style={{ backgroundColor: '#fff', borderBottom: '1px solid #ddd' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.customerType}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.phone}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.address}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.companyName}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.gstNumber}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatDate(customer.createdAt)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                <button
                  onClick={() => handleDeleteCustomer(customer._id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#ff4d4d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
