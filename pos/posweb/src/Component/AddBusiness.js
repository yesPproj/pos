import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from './Notification'; // Assuming Notification component is in Notification.js
import './BusinessForm.css'; // Your custom styling for the form

const BusinessForm = () => {
  const [businessDetails, setBusinessDetails] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    gstNumber: '',
    gstPercentage: '',
    cgst: '',
    sgst: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [businessId, setBusinessId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Fetch the existing business details if any
    const fetchBusinessDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3000/businesses');
        if (response.data.length > 0) {
          setBusinessDetails(response.data[0]);
          setIsEditing(true);
          setBusinessId(response.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching business details:', err);
      }
    };

    fetchBusinessDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessDetails({ ...businessDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:3000/businesses/${businessId}`, businessDetails);
        setNotification({ type: 'success', message: 'Business updated successfully!' });
      } else {
        const response = await axios.post('http://localhost:3000/businesses', businessDetails);
        setNotification({ type: 'success', message: 'Business added successfully!' });
        setBusinessId(response.data._id);
        setIsEditing(true);
      }
    } catch (err) {
      console.error('Error saving business details:', err);
      setNotification({ type: 'error', message: 'Failed to save business details. Please try again.' });
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={closeNotification}
        />
      )}
      <h2>{isEditing ? 'Edit Business' : 'Add Business'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Business Name:</label>
          <input
            type="text"
            name="name"
            value={businessDetails.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={businessDetails.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={businessDetails.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={businessDetails.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>GST Number:</label>
          <input
            type="text"
            name="gstNumber"
            value={businessDetails.gstNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>GST Percentage:</label>
          <input
            type="number"
            name="gstPercentage"
            value={businessDetails.gstPercentage}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>CGST:</label>
          <input
            type="number"
            name="cgst"
            value={businessDetails.cgst}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>SGST:</label>
          <input
            type="number"
            name="sgst"
            value={businessDetails.sgst}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{isEditing ? 'Update Business' : 'Add Business'}</button>
      </form>
    </div>
  );
};

export default BusinessForm;
