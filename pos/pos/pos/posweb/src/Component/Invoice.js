// src/InvoiceList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:3000/bills');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:3000/export-bills', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bills.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting invoices:', error);
    }
  };

  return (
    <div>
      <h1>Invoices</h1>
      <button onClick={handleExport}>Export to Excel</button>
      <table>
        <thead>
          <tr>
            <th>Bill Number</th>
            <th>Customer Name</th>
            <th>Total Amount</th>
            <th>Bill Date</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td>{invoice.billNumber}</td>
              <td>{invoice.customer.name}</td>
              <td>{invoice.totalAmount}</td>
              <td>{new Date(invoice.billDate).toLocaleString()}</td>
              <td>
                {invoice.products.map((productItem) => (
                  <div key={productItem.product._id}>
                    {productItem.product.name} (Qty: {productItem.quantity})
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
