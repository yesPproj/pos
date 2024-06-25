import React, { useState, useEffect } from 'react';
import './BarcodeScanner.css';

const BarcodeScanner = ({ onBarcodeScan }) => {
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        onBarcodeScan(barcode);
        setBarcode('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [barcode, onBarcodeScan]);

  return (
    <div className="barcode-scanner">
      <h3>Scan Barcode</h3>
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Scan or enter barcode"
        autoFocus
      />
    </div>
  );
};

export default BarcodeScanner;
