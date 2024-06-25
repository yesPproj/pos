import React, { useState } from 'react';
import { CSVLink } from 'react-csv';

const Report = ({ products }) => {
  const [selectedReport, setSelectedReport] = useState('overall');

  const computeOverallReportData = () => {
    let totalStock = 0;
    let totalPrice = 0;

    products.forEach((product) => {
      totalStock += product.stock || 0; // Ensure stock is not undefined
      totalPrice += product.price || 0; // Ensure price is not undefined
    });

    const averagePrice = products.length > 0 ? totalPrice / products.length : 0;
    return { totalStock, averagePrice };
  };

  const computeCategoryWiseReport = () => {
    const categoryMap = new Map();

    products.forEach((product) => {
      const { category, stock, price } = product || {}; // Ensure product is not undefined
      if (categoryMap.has(category)) {
        const current = categoryMap.get(category);
        categoryMap.set(category, {
          totalStock: current.totalStock + (stock || 0), // Ensure stock is not undefined
          totalPrice: current.totalPrice + (price || 0), // Ensure price is not undefined
          count: current.count + 1,
        });
      } else {
        categoryMap.set(category, {
          totalStock: stock || 0,
          totalPrice: price || 0,
          count: 1,
        });
      }
    });

    const categoryReport = [];
    categoryMap.forEach((value, key) => {
      const averagePrice = value.totalPrice / value.count;
      categoryReport.push({
        category: key,
        totalStock: value.totalStock,
        averagePrice,
      });
    });

    return categoryReport;
  };

  const computeProductWiseReport = () => {
    return products.map((product) => ({
      id: product._id,
      name: product.name,
      category: product.category,
      stock: product.stock || 0, // Ensure stock is not undefined
      price: product.price || 0, // Ensure price is not undefined
    }));
  };

  const convertToCSV = (reportData) => {
    return reportData.map((product) => ({
      ID: product.id,
      Name: product.name,
      Category: product.category,
      Stock: product.stock,
      Price: product.price,
    }));
  };

  let reportData = {};
  let csvData = [];
  let title = '';
  switch (selectedReport) {
    case 'overall':
      reportData = computeOverallReportData();
      title = 'Overall Report';
      break;
    case 'category':
      reportData = computeCategoryWiseReport();
      title = 'Category-wise Report';
      break;
    case 'product':
      reportData = computeProductWiseReport();
      csvData = convertToCSV(reportData);
      title = 'Product-wise Report';
      break;
    default:
      reportData = computeOverallReportData();
      title = 'Overall Report';
  }

  const renderReportData = () => {
    if (selectedReport === 'product') {
      return (
        <>
          <CSVLink
            data={csvData}
            filename={"product_wise_report.csv"}
            className="btn btn-primary"
            target="_blank"
            style={styles.csvLink}
          >
            Download Product-wise Report CSV
          </CSVLink>

          <ul style={styles.ul}>
            {reportData.map((product) => (
              <li key={product.id} style={styles.li}>
                <p style={styles.p}>Name: {product.name}</p>
                <p style={styles.p}>Category: {product.category}</p>
                <p style={styles.p}>Stock: {product.stock}</p>
                <p style={styles.p}>Price: ${product.price}</p>
              </li>
            ))}
          </ul>
        </>
      );
    }

    return (
      <>
        <p style={styles.p}>Total Stock: {reportData.totalStock}</p>
        <p style={styles.p}>Average Price: ${reportData.averagePrice.toFixed(2)}</p>
      </>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.h2}>{title}</h2>
      <div style={styles.buttonContainer}>
        <button
          onClick={() => setSelectedReport('overall')}
          style={selectedReport === 'overall' ? styles.activeButton : styles.button}
        >
          Overall Report
        </button>
        <button
          onClick={() => setSelectedReport('category')}
          style={selectedReport === 'category' ? styles.activeButton : styles.button}
        >
          Category-wise Report
        </button>
        <button
          onClick={() => setSelectedReport('product')}
          style={selectedReport === 'product' ? styles.activeButton : styles.button}
        >
          Product-wise Report
        </button>
      </div>
      {renderReportData()}
    </div>
  );
};

// Inline styles object
const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  h2: {
    fontSize: '24px',
    marginBottom: '15px',
  },
  buttonContainer: {
    marginBottom: '15px',
  },
  button: {
    padding: '10px 20px',
    marginRight: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s, transform 0.2s',
  },
  activeButton: {
    backgroundColor: '#357dbf',
    transform: 'translateY(-2px)',
  },
  csvLink: {
    display: 'inline-block',
    padding: '10px 20px',
    fontSize: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#50e3c2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s, transform 0.2s',
    marginRight: '10px',
  },
  ul: {
    listStyle: 'none',
    padding: '0',
  },
  li: {
    marginBottom: '10px',
    borderBottom: '1px solid #ccc',
    paddingBottom: '10px',
  },
  p: {
    fontSize: '16px',
    margin: '0',
  },
};

export default Report;
