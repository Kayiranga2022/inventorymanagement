import React, { useEffect, useState } from 'react';
import { getAllStockManagers, deleteStockManager } from '../services/stockManagerService';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/StockManagerList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const StockManagerList = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const { data } = await getAllStockManagers();
      setManagers(data || []);
    } catch (err) {
      console.error('Error fetching stock managers:', err);
      setError('Failed to fetch stock managers.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStockManager(id);
      fetchManagers();
    } catch (err) {
      console.error('Error deleting stock manager:', err);
      setError('Failed to delete stock manager.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.stockManagerList}>
      <div className={styles.stockManagerHeader}>
        <h1>Stock Managers</h1>
        <button className={styles.addManagerButton} onClick={() => navigate('/stockmanagers/add')}>
          <FontAwesomeIcon icon={faPlus} className={styles.icon} />
          Add Stock Manager
        </button>
      </div>
      <table className={styles.stockManagerTable}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {managers.length > 0 ? (
            managers.map((manager) => (
              <tr key={manager.id}>
                <td>{manager.firstName}</td>
                <td>{manager.lastName}</td>
                <td>{manager.username}</td>
                <td>{manager.email}</td>
                <td>
                  <Link to={`/stockmanagers/${manager.id}`} className={styles.viewLink}>
                    <FontAwesomeIcon icon={faEye} className={styles.icon} /> View
                  </Link>
                  <button onClick={() => navigate(`/stockmanagers/edit/${manager.id}`)} className={styles.editButton}>
                    <FontAwesomeIcon icon={faEdit} className={styles.icon} /> Edit
                  </button>
                  <button onClick={() => handleDelete(manager.id)} className={styles.deleteButton}>
                    <FontAwesomeIcon icon={faTrash} className={styles.icon} /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '10px' }}>
                No stock managers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockManagerList;