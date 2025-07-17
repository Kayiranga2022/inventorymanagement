import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import {
    getAllStockHistory,
    getStockHistoryByProduct,
    getStockHistoryByChangeType,
    getStockHistoryByUser,
} from '../services/stockHistoryService'; // Corrected import path
import '../styles/StockHistory.css'; // Corrected import path
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faRedo, faSpinner } from '@fortawesome/free-solid-svg-icons';

const StockHistoryReport = ({ filters }) => {
    const [stockHistory, setStockHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        fetchStockHistory();
    }, [currentPage, filters]);

    const fetchStockHistory = async () => {
        setLoading(true);
        console.log("Fetching stock history, current page:", currentPage, "Filters:", filters);

        try {
            let data;
            if (Object.keys(filters).length === 0) {
                // No filters, get all
                data = await getAllStockHistory(currentPage);
            } else {
                // Apply filters
                if (filters.productId) {
                    data = await getStockHistoryByProduct(filters.productId);
                } else if (filters.changeType) {
                    data = await getStockHistoryByChangeType(filters.changeType);
                } else if (filters.userId) {
                    data = await getStockHistoryByUser(filters.userId);
                } else {
                    data = await getAllStockHistory(currentPage); // If no filters match, fetch all
                }
            }
            console.log("API Response:", data);
            if (data && Array.isArray(data.content)) {
                setStockHistory(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
            } else {
                console.error("API did not return an array:", data);
                setStockHistory([]);
                setError('API did not return an array or an error occurred.');
            }
        } catch (err) {
            console.error("Error fetching stock history:", err);
            setError(err.message || 'An unexpected error occurred.');
            setStockHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div className="loading-message"><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="stock-history-report">
            <table className="stock-history-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product ID</th>
                        <th>Change Type</th>
                        <th>Quantity Change</th>
                        <th>User ID</th>
                        <th>Stock ID</th>
                        <th>Timestamp</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stockHistory.map(history => (
                        <tr key={history.id}>
                            <td>{history.id}</td>
                            <td>{history.productId}</td>
                            <td>{history.changeType}</td>
                            <td>{history.quantityChange}</td>
                            <td>{history.userId}</td>
                            <td>{history.stockId}</td>
                            <td>{new Date(history.timestamp).toLocaleString()}</td>
                            <td>
                                <Link to={`/stock-history/${history.id}`} className="view-details">
                                    View Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    Previous
                </button>
                <span>Page {currentPage + 1} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default StockHistoryReport;