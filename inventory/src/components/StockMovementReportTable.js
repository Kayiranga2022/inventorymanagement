import React from 'react';

const StockMovementReportTable = ({ reports }) => {
    return (
        <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Stock Name</th>
                    <th className="border p-2">Movement Type</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {reports.map((report, index) => (
                    <tr key={index} className="border">
                        <td className="border p-2">{report.id}</td>
                        <td className="border p-2">{report.stock.name}</td>
                        <td className="border p-2">{report.movementType}</td>
                        <td className="border p-2">{report.quantity}</td>
                        <td className="border p-2">{report.timestamp}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default StockMovementReportTable;
