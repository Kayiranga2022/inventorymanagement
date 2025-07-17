import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStockMovementById } from '../services/stockMovementService';

const ViewStockMovement = () => {
  const { id } = useParams();
  const [movement, setMovement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovement();
  }, [id]); // ✅ Add id to dependency array

  const fetchMovement = async () => {
    try {
      setLoading(true);
      const data = await getStockMovementById(id); // ✅ Remove { data } destructuring
      setMovement(data);
    } catch (err) {
      setError('Error fetching stock movement details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!movement) return <p>No stock movement found.</p>;

  return (
    <div>
      <h1>Stock Movement Details</h1>
      <p><strong>Stock ID:</strong> {movement.stock?.id || 'N/A'}</p>
      <p><strong>Movement Type:</strong> {movement.movementType || 'N/A'}</p>
      <p><strong>Quantity:</strong> {movement.quantity || 'N/A'}</p>
      <p><strong>Timestamp:</strong> {movement.timestamp ? new Date(movement.timestamp).toLocaleString() : 'N/A'}</p>
      <p><strong>Stock Manager:</strong> {movement.stockManager?.username || 'N/A'}</p>
    </div>
  );
};

export default ViewStockMovement;
