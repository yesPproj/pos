// PrintComponent.js
import React from 'react';

class PrintComponent extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', width: '80%', margin: 'auto' }}>
        <h2>Invoice</h2>
        <p>Date: {data.date}</p>
        <p>Customer Name: {data.customerName}</p>
        <p>Amount: ${data.amount}</p>
      </div>
    );
  }
}

export default PrintComponent;
