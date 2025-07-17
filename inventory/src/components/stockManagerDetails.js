import React, { useEffect, useState } from 'react';
import { getStockManagerById } from '../services/stockManagerService';
import { useParams } from 'react-router-dom';
import '../styles/StockManagerDetail.css'; // Import external CSS file for styling

const StockManagerDetails = () => {
  const { id } = useParams();
  const [manager, setManager] = useState(null);

  useEffect(() => {
    const fetchManager = async () => {
      const { data } = await getStockManagerById(id);
      setManager(data);
    };
    fetchManager();
  }, [id]);

  if (!manager) return <p>Loading...</p>;

  return (
    <div className="stock-manager-details">
      <h2 className="stock-manager-details-name">{manager.firstName} {manager.lastName}</h2>
      <p className="stock-manager-details-info"><strong>Username:</strong> {manager.username}</p>
      <p className="stock-manager-details-info"><strong>Email:</strong> {manager.email}</p>
    </div>
  );
};

export default StockManagerDetails;
