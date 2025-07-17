import React, { useState } from 'react';
import StockHistoryFilters from './StockHistoryFilters';
import StockHistoryReport from './StockHistoryReport';

const StockHistoryList = () => {
    const [filters, setFilters] = useState({});

    return (
        <div className="stock-history-list">
            <h2>Stock History</h2>
            <StockHistoryFilters onFilterChange={setFilters} />
            <StockHistoryReport filters={filters} />
        </div>
    );
};

export default StockHistoryList;