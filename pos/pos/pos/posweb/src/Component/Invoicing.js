import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

function BillingForm() {
  const [customerFormData, setCustomerFormData] = useState({
    name: '',
    phone: '',
    address: '',
    gstNumber: '',
    customerType: 'B2C' // Default to B2C
  });
  const [selectedBillingOption, setSelectedBillingOption] = useState('debitWithGST');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomerFormData({ ...customerFormData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/customers', customerFormData);
      console.log('New customer added successfully:', response.data);
      // Reset form after submission
      setCustomerFormData({
        name: '',
        phone: '',
        address: '',
        gstNumber: '',
        customerType: 'B2C'
      });
    } catch (error) {
      console.error('Error adding new customer:', error);
    }
  };

  const handleBillingOptionChange = (event) => {
    setSelectedBillingOption(event.target.value); // Update state with the selected billing option
  };

  return (
    <div className="billing-form-container">
      <div className="customer-form">
        <h2>Add New Customer</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={customerFormData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={customerFormData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={customerFormData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>GST Number:</label>
            <input
              type="text"
              name="gstNumber"
              value={customerFormData.gstNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Customer Type:</label>
            <select
              name="customerType"
              value={customerFormData.customerType}
              onChange={handleChange}
              required
            >
              <option value="B2C">B2C</option>
              <option value="B2B">B2B</option>
            </select>
          </div>
          <button type="submit">Add Customer</button>
        </form>
      </div>
      <div className="billing-options">
        <h2>Billing Options</h2>
        <div>
          <input
            type="radio"
            id="debitWithGST"
            name="billingOption"
            value="debitWithGST"
            checked={selectedBillingOption === 'debitWithGST'}
            onChange={handleBillingOptionChange}
          />
          <label htmlFor="debitWithGST">Debit with GST</label>
        </div>
        <div>
          <input
            type="radio"
            id="debitWithoutGST"
            name="billingOption"
            value="debitWithoutGST"
            checked={selectedBillingOption === 'debitWithoutGST'}
            onChange={handleBillingOptionChange}
          />
          <label htmlFor="debitWithoutGST">Debit without GST</label>
        </div>
        <div>
          <input
            type="radio"
            id="creditWithGST"
            name="billingOption"
            value="creditWithGST"
            checked={selectedBillingOption === 'creditWithGST'}
            onChange={handleBillingOptionChange}
          />
          <label htmlFor="creditWithGST">Credit with GST</label>
        </div>
        <div>
          <input
            type="radio"
            id="creditWithoutGST"
            name="billingOption"
            value="creditWithoutGST"
            checked={selectedBillingOption === 'creditWithoutGST'}
            onChange={handleBillingOptionChange}
          />
          <label htmlFor="creditWithoutGST">Credit without GST</label>
        </div>
      </div>
    </div>
  );
}

export default BillingForm;
