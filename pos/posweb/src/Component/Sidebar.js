import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ onNavigate, isSidebarOpen }) => {
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    // Fetch the business name from the database
    const fetchBusinessName = async () => {
      try {
        const response = await axios.get('http://localhost:3000/businesses');
        if (response.data.length > 0) {
          setBusinessName(response.data[0].name);
        }
      } catch (err) {
        console.error('Error fetching business name:', err);
      }
    };

    fetchBusinessName();
  }, []);

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <h1>Yesp</h1>
      <ul>
        <li onClick={() => onNavigate('form')}>Products</li>
        <li onClick={() => onNavigate('list')}>List</li>
        <li onClick={() => onNavigate('report')}>Report</li>
        <li onClick={() => onNavigate('BusinessForm')}>Profile</li>
        <li onClick={() => onNavigate('CustomerForm')}>Customer</li>
        <li onClick={() => onNavigate('BillingForm')}>Billing</li> {/* Add this line */}
      </ul>
    </div> 
  );
};

export default Sidebar;
