import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

function App() {
  const [companyName, setCompanyName] = useState('');
  const [business, setBusiness] = useState({});
  const [searchProductTerm, setSearchProductTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [gstDetails, setGstDetails] = useState({});
  const [searchCustomerTerm, setSearchCustomerTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const printableInvoiceRef = useRef(null);

  useEffect(() => {
    fetchCompanyDetails();
    fetchGstDetails();
    fetchLastInvoiceNumber();
  }, []);

  const fetchCompanyDetails = () => {
    fetch('http://localhost:3000/businesses')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch company details');
        }
        return response.json();
      })
      .then(data => {
        setCompanyName(data.name || '');
        setBusiness(data);
      })
      .catch(error => console.error('Error fetching company details:', error));
  };

  const fetchGstDetails = () => {
    fetch('http://localhost:3000/gst')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch GST details');
        }
        return response.json();
      })
      .then(data => {
        setGstDetails(data);
      })
      .catch(error => console.error('Error fetching GST details:', error));
  };

  const fetchLastInvoiceNumber = () => {
    fetch('http://localhost:3000/invoices/last')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch last invoice number');
        }
        return response.json();
      })
      .then(data => {
        setLastInvoiceNumber(data.lastInvoiceNumber || 0);
        setInvoiceNumber(`A${String(data.lastInvoiceNumber + 1).padStart(6, '0')}`);
      })
      .catch(error => console.error('Error fetching last invoice number:', error));
  };

  const handleProductSearch = (e) => {
    setSearchProductTerm(e.target.value);
    if (e.target.value.trim() === '') {
      setProducts([]);
    }
  };

  const handleCustomerSearch = (e) => {
    setSearchCustomerTerm(e.target.value);
    if (e.target.value.trim() === '') {
      setCustomers([]);
    }
  };

  const handleLiveSearch = async (term, type) => {
    try {
      const response = await fetch(`http://localhost:3000/${type}/search?name=${term}`);
      const data = await response.json();
      if (type === 'products') {
        setProducts(data);
      } else if (type === 'customers') {
        setCustomers(data);
      }
    } catch (error) {
      console.error(`Error searching ${type}:`, error);
    }
  };

  useEffect(() => {
    if (searchProductTerm.trim() !== '') {
      handleLiveSearch(searchProductTerm, 'products');
    } else {
      setProducts([]);
    }
  }, [searchProductTerm]);

  useEffect(() => {
    if (searchCustomerTerm.trim() !== '') {
      handleLiveSearch(searchCustomerTerm, 'customers');
    } else {
      setCustomers([]);
    }
  }, [searchCustomerTerm]);

  const addProductToCart = (product) => {
    const existingProductIndex = cart.findIndex(item => item._id === product._id);
    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity++;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setSearchProductTerm('');
    setProducts([]);
  };

  const addCustomerToInvoice = (customer) => {
    setSelectedCustomer(customer);
    setSearchCustomerTerm('');
    setCustomers([]);
  };

  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map(item => {
      if (item._id === productId) {
        item.quantity = newQuantity;
      }
      return item;
    });
    setCart(updatedCart);
  };

  const removeProductFromCart = (productId) => {
    const updatedCart = cart.filter(item => item._id !== productId);
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    let totalAmount = 0;
    cart.forEach(item => {
      const gstAmount = (item.sellingPrice * (gstDetails.gstPercentage / 100));
      const totalItemPrice = (item.sellingPrice + gstAmount) * item.quantity;
      totalAmount += totalItemPrice;
    });
    setTotal(totalAmount);
  };

  useEffect(() => {
    calculateTotal();
  }, [cart, gstDetails]);

  const formatIndianPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString();
  };

  const cleanInvoiceData = (invoiceData) => {
    const cleanedData = {
      invoiceNumber: invoiceData.invoiceNumber,
      date: invoiceData.date,
      customer: {
        name: invoiceData.customer.name,
        address: invoiceData.customer.address,
        phone: invoiceData.customer.phone,
        email: invoiceData.customer.email,
      },
      products: invoiceData.products.map(product => ({
        _id: product._id,
        name: product.name,
        sellingPrice: product.sellingPrice,
        quantity: product.quantity,
      })),
      total: invoiceData.total,
    };
    return cleanedData;
  };

  const saveInvoice = async () => {
    const invoiceData = {
      invoiceNumber,
      date: getCurrentDate(),
      customer: selectedCustomer,
      products: cart,
      total,
    };
  
    const cleanedInvoiceData = cleanInvoiceData(invoiceData);
  
    await saveInvoiceToDB(cleanedInvoiceData);
  };
  
  async function saveInvoiceToDB(invoiceData) {
    try {
      console.log('Invoice data being sent:', invoiceData); // Log the data being sent
      const response = await fetch('http://localhost:3000/save-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to save invoice');
      }
  
      console.log('Invoice saved successfully');
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  }
  
  const PrintableInvoice = React.forwardRef((props, ref) => (
    <div ref={ref} style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2>{companyName}</h2>
          <p>{business.address}</p>
          <p>{business.phone}</p>
          <p>{business.email}</p>
        </div>
        <div>
          <h2>Invoice</h2>
          <p>Invoice Number: {invoiceNumber}</p>
          <p>Date: {getCurrentDate()}</p>
        </div>
      </div>
      <div>
        <h3>Customer Details:</h3>
        <p>Name: {selectedCustomer ? selectedCustomer.name : ''}</p>
        <p>Address: {selectedCustomer ? selectedCustomer.address : ''}</p>
        <p>Phone: {selectedCustomer ? selectedCustomer.phone : ''}</p>
        <p>Email: {selectedCustomer ? selectedCustomer.email : ''}</p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Product</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Quantity</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Unit Price</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item._id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.quantity}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{formatIndianPrice(item.sellingPrice)}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{formatIndianPrice((item.sellingPrice * (1 + (gstDetails.gstPercentage / 100))) * item.quantity)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" style={{ textAlign: 'right', border: '1px solid black', padding: '8px' }}>Subtotal:</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{formatIndianPrice(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  ));

  return (
    <div className="App">
      <nav className="navbar">
        <div className="container">
          <a className="navbar-brand" href="#">Invoicing System</a>
        </div>
      </nav>

      <div className="container">
        <h1>Customer Search</h1>
        <input
          type="text"
          value={searchCustomerTerm}
          placeholder="Search for a customer..."
          onChange={handleCustomerSearch}
        />
        {customers.length > 0 && (
          <ul>
            {customers.map(customer => (
              <li key={customer._id} onClick={() => addCustomerToInvoice(customer)}>
                {customer.name} - {customer.email}
              </li>
            ))}
          </ul>
        )}

        <h1>Product Search</h1>
        <input
          type="text"
          value={searchProductTerm}
          placeholder="Search for a product..."
          onChange={handleProductSearch}
        />
        {products.length > 0 && (
          <ul>
            {products.map(product => (
              <li key={product._id} onClick={() => addProductToCart(product)}>
                {product.name} - Selling Price: {formatIndianPrice(product.sellingPrice)}, MRP: {formatIndianPrice(product.mrp)}
              </li>
            ))}
          </ul>
        )}

        <h2>Cart</h2>
        {cart.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>MRP ({formatIndianPrice(1)})</th>
                <th>Selling Price ({formatIndianPrice(1)})</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{formatIndianPrice(item.mrp)}</td>
                  <td>{formatIndianPrice(item.sellingPrice)}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                      style={{ width: '50px', textAlign: 'center' }}
                    />
                  </td>
                  <td>{formatIndianPrice((item.sellingPrice * (1 + (gstDetails.gstPercentage / 100))) * item.quantity)}</td>
                  <td>
                    <button onClick={() => removeProductFromCart(item._id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items in cart</p>
        )}

        <h2>Total: {formatIndianPrice(total)}</h2>

        <button onClick={saveInvoice}>Save Invoice</button>
      </div>

      {/* Printable invoice component */}
      <PrintableInvoice ref={printableInvoiceRef} />
    </div>
  );
}

export default App;
