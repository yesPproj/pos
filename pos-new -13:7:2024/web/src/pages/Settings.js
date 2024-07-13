// BusinessDetailsForm.js

import React, { useState } from 'react';
import '../Styles/Setting.css'; // Import your CSS file

const BusinessDetailsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    gstNumber: '',
    gstPercentage: '',
    cgst: '',
    sgst: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic (e.g., send data to backend or store locally)
    console.log(formData); // Replace with actual form submission logic
  };

  return (
    <div className="business-details-form">
      <h2 className="form-heading">Business Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="name">Business Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="address">Business Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="gstNumber">GST Number</label>
          <input
            type="text"
            id="gstNumber"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="gstPercentage">GST Percentage</label>
          <input
            type="number"
            id="gstPercentage"
            name="gstPercentage"
            value={formData.gstPercentage}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="cgst">CGST Percentage</label>
          <input
            type="number"
            id="cgst"
            name="cgst"
            value={formData.cgst}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="sgst">SGST Percentage</label>
          <input
            type="number"
            id="sgst"
            name="sgst"
            value={formData.sgst}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default BusinessDetailsForm;
