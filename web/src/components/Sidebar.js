// src/components/Sidebar.js
import React, { useState } from 'react';
import { FaBars, FaTimes, FaTachometerAlt, FaBox, FaUsers, FaChartBar, FaCogs, FaLifeRing } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../Styles/Sidebar.css'; // Import the updated CSS
import logo from '../assets/logo.png'; // Logo for open sidebar
import logoClosed from '../assets/invoice.png'; // Logo for closed sidebar

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      <div className="company-info">
  <img 
    src={isOpen ? logo : logoClosed} 
    alt="Logo" 
    className={isOpen ? "logo-open" : "logo-closed"} 
  />
  {/* {isOpen && <span className="company-name">My App</span>} */}
</div>

      <ul>
        <li>
          <Link to="/dashboard">
            {!isOpen && <FaTachometerAlt className="icon" />}
            <span className="link-text">{isOpen && "Dashboard"}</span>
          </Link>
        </li>
        <li>
          <Link to="/products">
            {!isOpen && <FaBox className="icon" />}
            <span className="link-text">{isOpen && "Products"}</span>
          </Link>
        </li>
        <li>
          <Link to="/customers">
            {!isOpen && <FaUsers className="icon" />}
            <span className="link-text">{isOpen && "Customers"}</span>
          </Link>
        </li>
        <li>
          <Link to="/reports">
            {!isOpen && <FaChartBar className="icon" />}
            <span className="link-text">{isOpen && "Reports"}</span>
          </Link>
        </li>
        <li>
          <Link to="/integrations">
            {!isOpen && <FaCogs className="icon" />}
            <span className="link-text">{isOpen && "Integrations"}</span>
          </Link>
        </li>
      </ul>
      <div className="bottom-links">
        <ul>
          <li>
            <Link to="/help">
              {!isOpen && <FaLifeRing className="icon" />}
              <span className="link-text">{isOpen && "Help"}</span>
            </Link>
          </li>
          <li>
            <Link to="/settings">
              {!isOpen && <FaCogs className="icon" />}
              <span className="link-text">{isOpen && "Settings"}</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="footer">
        
      </div>
    </div>
  );
};

export default Sidebar;
