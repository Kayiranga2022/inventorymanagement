import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStockHistoryById } from '../services/stockHistoryService';

const StockHistoryDetail = () => {
    const { id } = useParams(); // Get history ID from URL
    const [history, setHistory] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getStockHistoryById(id);
                console.log("Stock History API Response:", data); // Debugging response

                if (!data || Object.keys(data).length === 0) {
                    setError("Stock history not found.");
                } else {
                    setHistory(data);
                }
            } catch (error) {
                console.error('Error fetching stock history details:', error);
                setError("Failed to load stock history details.");
            }
        };

        fetchHistory();
    }, [id]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!history) {
        return <div>Loading...</div>;
    }

    return (
        <div className="stock-history-detail">
            <h2>Stock History Details</h2>
            <p><strong>Product ID:</strong> {history.productId || 'N/A'}</p>
            <p><strong>Change Type:</strong> {history.changeType || 'N/A'}</p>
            <p><strong>Quantity:</strong> {history.quantity || 'N/A'}</p>
            <p><strong>Previous Quantity:</strong> {history.previousQuantity || 'N/A'}</p>
            <p><strong>New Quantity:</strong> {history.newQuantity || 'N/A'}</p>
            <p><strong>Timestamp:</strong> {history.timestamp ? new Date(history.timestamp).toLocaleString() : 'N/A'}</p>
            <p><strong>User ID:</strong> {history.userId || 'N/A'}</p>
            <p><strong>Reference ID:</strong> {history.referenceId || 'N/A'}</p>
            <p><strong>Notes:</strong> {history.notes || 'N/A'}</p>
        </div>
    );
};

export default StockHistoryDetail;
