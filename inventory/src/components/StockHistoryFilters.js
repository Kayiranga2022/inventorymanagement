// src/components/StockHistoryFilters.js

import React, { useState } from 'react';

const StockHistoryFilters = ({ onFilterChange }) => {
    const [productId, setProductId] = useState('');
    const [changeType, setChangeType] = useState('');
    const [userId, setUserId] = useState('');

    const handleFilterChange = () => {
        const filters = {};
        if (productId) filters.productId = productId;
        if (changeType) filters.changeType = changeType;
        if (userId) filters.userId = userId;

        onFilterChange(filters);
    };

    return (
        <div className="stock-history-filters">
            <h3>Filters</h3>
            <div>
                <label htmlFor="productId">Product ID:</label>
                <input
                    type="text"
                    id="productId"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="changeType">Change Type:</label>
                <select
                    id="changeType"
                    value={changeType}
                    onChange={(e) => setChangeType(e.target.value)}
                >
                    <option value="">Select Change Type</option>
                    <option value="PURCHASE">Purchase</option>
                    <option value="SALE">Sale</option>
                    <option value="TRANSFER">Transfer</option>
                    <option value="RETURN">Return</option>
                </select>
            </div>
            <div>
                <label htmlFor="userId">User ID:</label>
                <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
            </div>
            <button onClick={handleFilterChange}>Apply Filters</button>
        </div>
    );
};

export default StockHistoryFilters;
