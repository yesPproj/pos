import React, { useState, useEffect, useRef } from 'react';
import { FaSignOutAlt, FaBell } from 'react-icons/fa';
import '../Styles/Navbar.css'; // Ensure this path is correct
import logo from '../assets/3.png'; 

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="right-icons">
        <img 
          src={logo} 
          alt="Logo" 
          className="logo"
        />
        <div className="icon" onClick={toggleDropdown} ref={dropdownRef}>
          <FaBell />
          {isDropdownOpen && (
            <div className="dropdown">
              <ul>
                <li>Notification 1</li>
                <li>Notification 2</li>
                <li>Notification 3</li>
              </ul>
            </div>
          )}
        </div>
        <button className="logout-button">
         
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
