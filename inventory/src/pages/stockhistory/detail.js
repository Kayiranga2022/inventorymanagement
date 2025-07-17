import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StockHistoryDetailPage = () => {
  const { id } = useParams(); // Get stock history ID from URL
  const [stockHistory, setStockHistory] = useState(null); // Store a single stock history object
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockHistory = async () => {
      try {
        // Update the URL to fetch by the stock history's own ID
        const response = await axios.get(`http://localhost:8080/api/stock-history/${id}`);
        console.log("Fetched Data:", response.data); // Debug response

        // Check if the response data is valid
        if (response.data) {
          setStockHistory(response.data);
        } else {
          setError("Stock history not found.");
        }
      } catch (err) {
        console.error("Error fetching stock history details:", err);

        if (err.response) {
          console.error("Response Data:", err.response.data);
          console.error("Response Status:", err.response.status);
          console.error("Response Headers:", err.response.headers);
          setError(`Error: ${err.response.status} - ${err.response.data.message || "Failed to load stock history."}`);
        } else if (err.request) {
          console.error("No response received:", err.request);
          setError("Error: No response from server.");
        } else {
          console.error("Axios error:", err.message);
          setError("Error: Unable to fetch stock history.");
        }
      }
    };

    fetchStockHistory();
  }, [id]);

  return (
    <div className="stock-history-container">
      <h1>Stock History Details</h1>
      {error ? (
        <p className="error-message">{error}</p>
      ) : stockHistory ? (
        <div className="stock-history-detail">
          <p><strong>Product ID:</strong> {stockHistory.productId || 'N/A'}</p>
          <p><strong>Change Type:</strong> {stockHistory.changeType || 'N/A'}</p>
          <p><strong>Quantity:</strong> {stockHistory.quantityChange || 'N/A'}</p>
          <p><strong>Previous Quantity:</strong> {stockHistory.previousQuantity || 'N/A'}</p>
          <p><strong>New Quantity:</strong> {stockHistory.newQuantity || 'N/A'}</p>
          <p><strong>Timestamp:</strong> {stockHistory.timestamp ? new Date(stockHistory.timestamp).toLocaleString() : 'N/A'}</p>
          <p><strong>User ID:</strong> {stockHistory.userId || 'N/A'}</p>
          <p><strong>Reference ID:</strong> {stockHistory.referenceId || 'N/A'}</p>
          <p><strong>Notes:</strong> {stockHistory.notes || 'N/A'}</p>
        </div>
      ) : (
        <p>No stock history available.</p>
      )}
    </div>
  );
};

export default StockHistoryDetailPage;
