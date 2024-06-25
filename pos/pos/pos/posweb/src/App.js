// src/App.js
import React from 'react';
import ProductList from './Component/ProductList';
import UploadCSV from './Component/UploadCSV';
import Bill from './Component/bill';
import ErrorBoundary from './Component/ErrorBoundary';
// import Invoice from './Component/Invoicing';
import Dwgst from './Component/dwgst';
import Navbar from './Component/Navbar';
import Invoice from './Component/Invoice';

const App = () => {
  return (
    
    <div>
      <Navbar />
      {/* <ErrorBoundary>
      <ProductList />
      
      </ErrorBoundary> */}
    {/* <Invoice /> */}
      {/* <Bill /> */}
      <Invoice />
      
      <Dwgst />
    </div>
  );
};

export default App;
