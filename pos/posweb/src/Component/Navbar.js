import React, { useState, useEffect } from 'react';
import './Navbar.css';

function App() {
  const [companyName, setCompanyName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchCompanyName();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      handleLiveSearch(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const fetchCompanyName = async () => {
    try {
      const response = await fetch('http://localhost:3000/businesses');
      const data = await response.json();
      if (data.length > 0) {
        setCompanyName(data[0].name);
      }
    } catch (error) {
      console.error('Error fetching company name:', error);
    }
  };

  const handleLiveSearch = async (term) => {
    try {
      const response = await fetch(`http://localhost:3000/products/search?name=${term}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="company-name">{companyName}</div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="nav-buttons">
          <button>Debit with GST</button>
          <button>Debit without GST</button>
          <button>Credit with GST</button>
          <button>Credit without GST</button>
        </div>
      </nav>
      <br></br>
      <br></br>
      <br></br>
    
      <div className="content">
        <h2>Search Results</h2>
        <ul>
          {searchResults.map((product) => (
            <li key={product._id}>
              {product.name} - Stock: {product.stock} - Selling Price: {product.sellingPrice} - MRP: {product.mrp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
