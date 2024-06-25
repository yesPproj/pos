import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bwipjs from 'bwip-js';
import jsPDF from 'jspdf';
import ProductForm from './ProductForm';
import Sidebar from './Sidebar';
import Report from './Report';
import BarcodeScanner from './BarcodeScanner';
import Notification from './Notification';
import BusinessForm from './AddBusiness'; // Import BusinessForm component
import './ProductList.css';
import CustomerForm from './Customerdb';
import BillingForm from './Invoicing';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [view, setView] = useState('form'); // Initialize default view
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '', isVisible: false });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = applyFilters(products, searchQuery);
    setFilteredProducts(filtered);
  }, [products, searchQuery, sortOption]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/products');
      setProducts(response.data);
      showNotification('Products fetched successfully ', 'success');
    } catch (error) {
      setErrorMessage('Error fetching products: ' + error.message);
      showNotification('Error fetching products', 'error');
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (products, filterText) => {
    if (!filterText) return products;

    return products.filter((product) => {
      return product.name && typeof product.name === 'string'
        ? product.name.toLowerCase().includes(filterText.toLowerCase())
        : false;
    }).sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'price') {
        return a.price - b.price;
      }
      return 0;
    });
  };

  const handleAddProduct = async (product) => {
    setIsLoading(true);
    try {
      if (editingProduct) {
        const response = await axios.put(`http://localhost:3000/products/${editingProduct._id}`, product);
        setProducts(products.map((p) => (p._id === editingProduct._id ? response.data : p)));
        setEditingProduct(null);
        showNotification('Product updated successfully ', 'success');
      } else {
        const response = await axios.post('http://localhost:3000/products', product);
        setProducts([...products, response.data]);
        showNotification('Product added successfully', 'success');
      }
    } catch (error) {
      setErrorMessage('Error adding/updating product: ' + error.message);
      showNotification('Error adding/updating product ', 'error');
      console.error('Error adding/updating product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:3000/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
      showNotification('Product deleted successfully', 'success');
    } catch (error) {
      setErrorMessage('Error deleting product: ' + error.message);
      showNotification('Error deleting product', 'error');
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setView('form'); // Switch to form view when editing product
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleProductSelection = (product) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(product)) {
        return prevSelected.filter((p) => p !== product);
      } else {
        return [...prevSelected, product];
      }
    });
  };

  const handleSelectAll = (e) => {
    setSelectedProducts(e.target.checked ? filteredProducts : []);
  };

  const handleDeleteSelectedProducts = async () => {
    setIsDeleting(true);
    try {
      const selectedIds = selectedProducts.map((product) => product._id);
      await axios.post('http://localhost:3000/products/delete', { ids: selectedIds });
      setProducts(products.filter((product) => !selectedIds.includes(product._id)));
      setSelectedProducts([]);
      showNotification('Selected products deleted successfully', 'success');
    } catch (error) {
      setErrorMessage('Error deleting selected products: ' + error.message);
      showNotification('Error deleting selected products', 'error');
      console.error('Error deleting selected products:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const generateBarcodeCanvas = async (uuid) => {
    const canvas = document.createElement('canvas');
    await bwipjs.toCanvas(canvas, {
      bcid: 'code128',
      text: uuid,
      scale: 3,
      height: 20,
      includetext: true,
      textxalign: 'center',
    });
    return canvas;
  };

  const generatePrintablePDF = async () => {
    setIsGeneratingPDF(true);
    const pdf = new jsPDF();
    let yPosition = 10;

    for (const product of selectedProducts) {
      try {
        const canvas = await generateBarcodeCanvas(product._id);
        const imgData = canvas.toDataURL('image/png');
        if (imgData) {
          pdf.addImage(imgData, 'PNG', 10, yPosition, 180, 60);
          yPosition += 70;

          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 10;
          }
        } else {
          console.error('Empty or invalid data URL for barcode image');
        }
      } catch (error) {
        console.error('Error generating data URL for barcode image:', error);
      }
    }

    pdf.save('selected_barcodes.pdf');
    showNotification('PDF generated successfully', 'success');
    setIsGeneratingPDF(false);
  };

  const handleBarcodeScan = (barcode) => {
    setScannedBarcode(barcode);
  };

  const handleNavigate = (view) => {
    setView(view);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const clearErrorMessage = () => {
    setErrorMessage('');
  };

  const formatPriceINR = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => {
      setNotification({ message: '', type: '', isVisible: false });
    }, 3000);
  };

  return (
    <div className="product-list-container">
      {notification.isVisible && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '', isVisible: false })} />
      )}
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
          <button onClick={clearErrorMessage}>Dismiss</button>
        </div>
      )}
      {(isLoading || isDeleting || isGeneratingPDF) && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? '=' : '='}
      </button>
      <Sidebar onNavigate={handleNavigate} isSidebarOpen={isSidebarOpen} />
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Conditional rendering based on view state */}
        {view === 'form' && (
          <>
            <h2>Add/Edit Product</h2>
            <BarcodeScanner onBarcodeScan={handleBarcodeScan} />
            <ProductForm onSubmit={handleAddProduct} initialData={editingProduct || {}} scannedBarcode={scannedBarcode} />
          </>
        )}
        {view === 'list' && (
          <>
            <h2>Product List</h2>
            <div className="product-list-header">
              <input
                type="text"
                placeholder="Search products"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <select value={sortOption} onChange={handleSortChange}>
                <option value="name">Sort by Name (A-Z)</option>
                <option value="price">Sort by Price (Low to High)</option>
              </select>
              <button onClick={generatePrintablePDF} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? 'Generating PDF...' : 'Download Barcodes'}
              </button>
              <button onClick={handleDeleteSelectedProducts} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete Selected'}
              </button>
            </div>
            <ul className="product-list">
              <li>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                />
                Select All
              </li>
              {filteredProducts.map((product) => (
                <li key={product._id}>
                  <div className="product-info">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product)}
                      onChange={() => handleProductSelection(product)}
                    />
                    <div className="details">
                      <strong>{product.name}</strong> - {formatPriceINR(product.price)}
                      <p>{product.description}</p>
                      <p>Stock: {product.stock}</p>
                    </div>
                  </div>
                  <div className="barcode-image">
                    <canvas id={`barcode-${product._id}`} width="150" height="60"></canvas>
                  </div>
                  <div className="product-list-actions">
                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                    <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {view === 'report' && (
          <div>
            <Report products={products} />
          </div>
        )}
        {view === 'BusinessForm' && (
          <div>
            <BusinessForm />
          </div>
        )}
          {view === 'CustomerForm' && (
          <div>
            <CustomerForm />
          </div>
        )}
          
          {view === 'BillingForm' && (
          <div>
            <BillingForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
