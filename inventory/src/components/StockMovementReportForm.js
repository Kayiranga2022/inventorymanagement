import React, { useState } from 'react';

const StockMovementReportForm = ({ onSubmit }) => {
    const [filters, setFilters] = useState({
        stockId: '',
        movementType: '',
        startDate: '',
        endDate: ''
    });

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(filters);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-md shadow">
            <div>
                <label>Stock ID:</label>
                <input type="text" name="stockId" value={filters.stockId} onChange={handleChange} className="border p-2" />
            </div>
            <div>
                <label>Movement Type:</label>
                <select name="movementType" value={filters.movementType} onChange={handleChange} className="border p-2">
                    <option value="">All</option>
                    <option value="PURCHASE">Purchase</option>
                    <option value="SALE">Sale</option>
                    <option value="TRANSFER">Transfer</option>
                    <option value="RETURN">Return</option>
                </select>
            </div>
            <div>
                <label>Start Date:</label>
                <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} className="border p-2" />
            </div>
            <div>
                <label>End Date:</label>
                <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} className="border p-2" />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">Generate Report</button>
        </form>
    );
};

export default StockMovementReportForm;