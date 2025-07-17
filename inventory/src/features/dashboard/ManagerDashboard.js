import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import { Link } from "react-router-dom";
import "../../styles/Dashboard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartLine, faBoxes, faExclamationTriangle, faExchangeAlt, faCalendarTimes, faUsers, faTruck, faFilePdf, faCog, faListAlt, faCaretDown, faShoppingCart, faUndo, faArrowRight, faTruckLoading } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";

const ManagerDashboard = () => {
    const [managerStockData, setManagerStockData] = useState({
        totalStocks: 0,
        lowStockAlerts: 0,
        stockMovements: 0,
        stockMovementsChartData: { labels: [], datasets: [] },
        stockTrendsChartData: { labels: [], datasets: [] }
    });
    const { authState } = useAuth();
    const [loading, setLoading] = useState(true);
    const [transactionsOpen, setTransactionsOpen] = useState(false);
    const [error, setError] = useState(null);
    const API_BASE_URL = 'http://localhost:8080/api';

    const toggleTransactions = () => {
        setTransactionsOpen(!transactionsOpen);
    };

    useEffect(() => {
        const fetchManagerData = async () => {
            if (!authState.token) {
                console.error("Token is missing. Cannot fetch manager data.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const headers = {
                    Authorization: `Bearer ${authState.token}`,
                };

                const response = await axios.get(`${API_BASE_URL}/manager/dashboard-data`, { headers });

                setManagerStockData({
                    totalStocks: response.data.totalStocks,
                    lowStockAlerts: response.data.lowStockAlerts,
                    stockMovements: response.data.stockMovements,
                    stockMovementsChartData: response.data.stockMovementsChartData || { labels: [], datasets: [] },
                    stockTrendsChartData: response.data.stockTrendsChartData || { labels: [], datasets: [] }
                });

                setLoading(false);

            } catch (error) {
                console.error("Error fetching manager data:", error);
                setError("Failed to load dashboard data.");
                setLoading(false);
            }
        };

        if (!authState.isLoading) {
            fetchManagerData();
        }
    }, [authState.token, authState.isLoading]);

    if (loading) {
        return <div className="dashboard-container">Loading...</div>;
    }

    if (error) {
        return <div className="dashboard-container">Error: {error}</div>;
    }

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2>Inventory</h2>
                <nav>
                    <Link to="/dashboard"><FontAwesomeIcon icon={faChartBar} /> Dashboard</Link>
                    <div className="dropdown">
                        <button className="dropdown-button" onClick={toggleTransactions}>
                            <FontAwesomeIcon icon={faListAlt} /> Transactions <FontAwesomeIcon icon={faCaretDown} />
                        </button>
                        {transactionsOpen && (
                            <div className="dropdown-content">
                                <Link to="/transactions"> <FontAwesomeIcon icon={faListAlt} /> All Transactions</Link>
                                <Link to="/transactions/add/sale"><FontAwesomeIcon icon={faShoppingCart} /> Sales</Link>
                                <Link to="/transactions/add/purchase"><FontAwesomeIcon icon={faTruckLoading} /> Purchases</Link>
                                <Link to="/transactions/add/return"><FontAwesomeIcon icon={faUndo} /> Purchase Returns</Link>
                                <Link to="/transactions/add/transfer"><FontAwesomeIcon icon={faArrowRight} /> Transfers</Link>
                            </div>
                        )}
                    </div>
                    <Link to="/stockmanagers"><FontAwesomeIcon icon={faUsers} /> Stock Managers</Link>
                    <Link to="/products"><FontAwesomeIcon icon={faBoxes} /> Products</Link>
                    <Link to="/stocks"><FontAwesomeIcon icon={faBoxes} /> Stocks</Link>
                    <Link to="/stockmovements"><FontAwesomeIcon icon={faExchangeAlt} /> Stock Transactions</Link>
                    <Link to="/stockhistory"><FontAwesomeIcon icon={faListAlt} /> Stock History</Link>
                    <Link to="/customers"><FontAwesomeIcon icon={faUsers} /> Customers</Link>
                    <Link to="/suppliers"><FontAwesomeIcon icon={faTruck} /> Suppliers</Link>
                    <Link to="/stockmovements/report/pdf"><FontAwesomeIcon icon={faFilePdf} /> Reports</Link>
                    <Link to="/settings"><FontAwesomeIcon icon={faCog} /> Settings</Link>
                </nav>
            </aside>

            <main className="dashboard-main">
                <h1>Manager Dashboard</h1>

                <div className="summary-cards">
                    <div className="card">
                        <h3><FontAwesomeIcon icon={faBoxes} /> Total Stocks</h3>
                        <p>{managerStockData.totalStocks}</p>
                    </div>
                    <div className="card">
                        <h3><FontAwesomeIcon icon={faExclamationTriangle} /> Low Stock Alerts</h3>
                        <p>{managerStockData.lowStockAlerts}</p>
                    </div>
                    <div className="card">
                        <h3><FontAwesomeIcon icon={faExchangeAlt} /> Stock Transactions</h3>
                        <p>{managerStockData.stockMovements}</p>
                    </div>
                </div>

                <div className="charts-section">
                    <div className="chart-container">
                        <h3><FontAwesomeIcon icon={faChartBar} /> Stock Transactions</h3>
                        {managerStockData.stockMovementsChartData && managerStockData.stockMovementsChartData.labels && managerStockData.stockMovementsChartData.labels.length > 0 && (
                            <Bar data={managerStockData.stockMovementsChartData} />
                        )}
                    </div>

                    <div className="chart-container">
                        <h3><FontAwesomeIcon icon={faChartLine} /> Stock Trends</h3>
                        {managerStockData.stockTrendsChartData && managerStockData.stockTrendsChartData.labels && managerStockData.stockTrendsChartData.labels.length > 0 && (
                            <Line data={managerStockData.stockTrendsChartData} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManagerDashboard;