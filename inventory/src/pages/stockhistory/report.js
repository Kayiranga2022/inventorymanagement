import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockHistoryReportPage = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/stock-history')
 // Assuming an endpoint exists for the report
      .then((response) => {
        setReportData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching stock history report:', error);
      });
  }, []);

  return (
    <div>
      <h1>Stock History Report</h1>
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Change Type</th>
            <th>Quantity</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((report) => (
            <tr key={report.id}>
              <td>{report.productId}</td>
              <td>{report.changeType}</td>
              <td>{report.quantity}</td>
              <td>{report.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockHistoryReportPage;
