import React, { useState } from 'react';
import StockMovementReportForm from '../../components/StockMovementReportForm';
import StockMovementReportTable from '../../components/StockMovementReportTable';
import { fetchStockMovementReport } from '../../services/stockMovementService';

const StockMovementReports = () => {
    const [reports, setReports] = useState([]);

    const handleGenerateReport = async (filters) => {
        try {
            const pdfBlob = await fetchStockMovementReport(filters);
            const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'stock_movement_report.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download stock movement report', error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold">Stock Movement Reports</h2>
            <StockMovementReportForm onSubmit={handleGenerateReport} />
            <StockMovementReportTable reports={reports} />
        </div>
    );
};

export default StockMovementReports;