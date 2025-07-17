import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    getAllStockHistory,
    getStockHistoryByProduct,
    getStockHistoryByChangeType,
    getStockHistoryByUser,
} from '../../services/stockHistoryService';
import '../../styles/StockHistory.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faRedo, faSpinner } from '@fortawesome/free-solid-svg-icons';

const StockHistoryListPage = () => {
    const [stockHistory, setStockHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [productId, setProductId] = useState('');
    const [changeType, setChangeType] = useState('');
    const [userId, setUserId] = useState('');

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        fetchStockHistory();
    }, [currentPage]);

    const fetchStockHistory = async () => {
        setLoading(true);
        console.log("Fetching stock history, current page:", currentPage);
        try {
            const data = await getAllStockHistory(currentPage);
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

    const applyFilters = async () => {
        setLoading(true);
        try {
            let filteredData = [];

            let productData = productId ? await getStockHistoryByProduct(productId) : null;
            let changeTypeData = changeType ? await getStockHistoryByChangeType(changeType) : null;
            let userData = userId ? await getStockHistoryByUser(userId) : null;

            if (productData && Array.isArray(productData)) {
                filteredData = productData;
            }
            console.log("Filtered Data after product filter:", filteredData);

            if (changeTypeData && Array.isArray(changeTypeData)) {
                if (filteredData.length > 0) {
                    filteredData = filteredData.filter(item => item.changeType === changeType);
                } else {
                    filteredData = changeTypeData;
                }
            }
            console.log("Filtered Data after changeType filter:", filteredData);

            if (userData && Array.isArray(userData)) {
                if (filteredData.length > 0) {
                    filteredData = filteredData.filter(item => item.userId === userId);
                } else {
                    filteredData = userData;
                }
            }
            console.log("Filtered Data after user filter:", filteredData);

            if (filteredData.length === 0 && !productId && !changeType && !userId) {
                const allData = await getAllStockHistory(currentPage);
                if (allData && Array.isArray(allData.content)) {
                    filteredData = allData.content;
                }
            }

            if (filteredData && Array.isArray(filteredData)) {
                setStockHistory(filteredData);
            } else {
                console.error("API did not return an array:", filteredData);
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
        <div className="stock-history-container">
            <h1 className="stock-history-title">Stock History</h1>

            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Filter by Product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Filter by Change Type"
                    value={changeType}
                    onChange={(e) => setChangeType(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Filter by User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button onClick={applyFilters}>
                    <FontAwesomeIcon icon={faSearch} className="filter-icon" /> Apply Filters
                </button>
                <button onClick={() => { setCurrentPage(0); fetchStockHistory(); }}>
                    <FontAwesomeIcon icon={faRedo} className="reset-icon" /> Reset
                </button>
            </div>

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

export default StockHistoryListPage;