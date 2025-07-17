import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStockById } from '../services/stockService';
import '../styles/StockDetail.css'; // ✅ Import scoped CSS

const StockDetail = () => {
  const { id } = useParams();
  const [stock, setStock] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await getStockById(id);
        setStock(response.data);
      } catch (error) {
        console.error('Error fetching stock details:', error);
      }
    };

    fetchStock();
  }, [id]);

  if (!stock) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="stock-detail-container">
      <h1>Stock Details</h1>
      <div className="stock-info">
        <p><strong>Product Name:</strong> {stock.productName}</p>
        <p><strong>SKU:</strong> {stock.sku}</p>
        <p><strong>Category:</strong> {stock.category}</p>
        <p><strong>Supplier:</strong> {stock.supplier}</p>
        <p><strong>Price:</strong> ${stock.price}</p>
        <p><strong>Quantity:</strong> {stock.quantity}</p>
        <p><strong>Minimum Stock Threshold:</strong> {stock.minStockThreshold}</p>
        <p><strong>Expiration Date:</strong> {stock.expirationDate}</p>
      </div>
    </div>
  );
};

export default StockDetail;
