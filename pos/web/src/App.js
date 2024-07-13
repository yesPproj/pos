import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import Help from './pages/Help';
import './App.css'; // Optional for styling
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Navbar />

        <div className="content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
