import React, { useEffect, useState } from 'react';
import { getAllStockMovements } from '../services/stockMovementService';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/StockMovementList.css';

const StockMovementList = () => {
  const [movements, setMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [error, setError] = useState(null);
  const [stockId, setStockId] = useState('');
  const [movementType, setMovementType] = useState('');
  const [stockManager, setStockManager] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const data = await getAllStockMovements();
      console.log("Stock Movements API Response:", data);
  
      if (Array.isArray(data)) {
        setMovements(data);
        setFilteredMovements(data);
      } else {
        console.error("Unexpected data format:", data);
        setMovements([]);
        setFilteredMovements([]);
      }
    } catch (error) {
      console.error("Error fetching stock movements:", error);
      setError("Failed to fetch stock movements.");
    }
  };

  const applyFilters = () => {
    let filtered = movements;
    if (stockId) {
      filtered = filtered.filter(mov => mov.stock?.id?.toString() === stockId);
    }
    if (movementType) {
      filtered = filtered.filter(mov => mov.movementType === movementType);
    }
    if (stockManager) {
      filtered = filtered.filter(mov => mov.stockManager?.username?.toLowerCase().includes(stockManager.toLowerCase()));
    }
    setFilteredMovements(filtered);
  };

  return (
    <div className="stock-movement-list-container">
      <h1 className="stock-movement-list-title">Stock Movements</h1>
      <button className="add-stock-movement-button" onClick={() => navigate('/stockmovements/add')}>
        Add Stock Movement
      </button>
      {error && <p className="error-message">{error}</p>}

      <div className="filter-container">
        <input type="text" placeholder="Filter by Stock ID" value={stockId} onChange={(e) => setStockId(e.target.value)} />
        <select value={movementType} onChange={(e) => setMovementType(e.target.value)}>
          <option value="">All Movement Types</option>
          <option value="PURCHASE">Purchase</option>
          <option value="SALE">Sale</option>
          <option value="TRANSFER">Transfer</option>
          <option value="RETURN">Return</option>
        </select>
        <input type="text" placeholder="Filter by Stock Manager" value={stockManager} onChange={(e) => setStockManager(e.target.value)} />
        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={fetchMovements}>Reset</button>
      </div>

      <table className="stock-movement-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Stock ID</th>
            <th>Movement Type</th>
            <th>Quantity</th>
            <th>Timestamp</th>
            <th>Stock Manager</th>
            <th>Supplier</th>
            <th>Customer</th>
            <th>IsPaid?</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMovements.length === 0 ? (
            <tr>
              <td colSpan="10">No stock movements found.</td>
            </tr>
          ) : (
            filteredMovements.map((movement) => (
              <tr key={movement.id}>
                <td>{movement?.product?.id ?? "N/A"}</td>
                <td>{movement?.stock?.id ?? "N/A"}</td>
                <td>{movement?.movementType ?? "N/A"}</td>
                <td>{movement?.quantity ?? "N/A"}</td>
                <td>{movement?.timestamp ? new Date(movement.timestamp).toLocaleString() : "N/A"}</td>
                <td>{movement?.stockManager?.username ?? "N/A"}</td>
                <td>{movement?.supplier?.name ?? "N/A"}</td>
                <td>{movement?.customer?.name ?? "N/A"}</td>
                <td>{movement.isPaid ? "Yes" : "No"}</td>
                <td>
                  <Link to={`/stockmovements/${movement.id}`} className="view-link">View</Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockMovementList;