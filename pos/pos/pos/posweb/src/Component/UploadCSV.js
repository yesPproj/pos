import React, { useState } from 'react';
import axios from 'axios';
import Notification from './Notification';
import './UploadCSV.css';

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '', isVisible: false });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setNotification({ message: 'Please select a file first', type: 'error', isVisible: true });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);

    try {
      await axios.post('http://localhost:3000/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNotification({ message: 'File uploaded successfully', type: 'success', isVisible: true });
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      setNotification({ message: 'Error uploading file', type: 'error', isVisible: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-csv-container">
      <h2>Upload CSV File</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>
      {isLoading && <div className="loader"></div>}
      {notification.isVisible && <Notification {...notification} onClose={() => setNotification({ message: '', type: '', isVisible: false })} />}
    </div>
  );
};

export default UploadCSV;
