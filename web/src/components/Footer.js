import React from 'react';
import '../Styles/Footer.css'; // Assuming you'll style the footer in a separate CSS file
import logo from '../assets/yesplogo.svg'; // Replace with your actual logo path

const Footer = () => {
  return (
    <footer className="footer">
    
      <div className="footer-bottom">
        <img src={logo} alt="Yesp Logo" className="footer-logo" />
        
      </div>
    </footer>
  );
};

export default Footer;
