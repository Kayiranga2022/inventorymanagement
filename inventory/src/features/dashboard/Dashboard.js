import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import { Link } from "react-router-dom";
import "../../styles/Dashboard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartLine, faBoxes, faExclamationTriangle, faExchangeAlt, faCalendarTimes, faUsers, faTruck, faFilePdf, faCog, faListAlt, faCaretDown, faShoppingCart, faUndo, faArrowRight, faTruckLoading } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
    const [transactionsOpen, setTransactionsOpen] = useState(false);
    const [totalStocks, setTotalStocks] = useState(0);
    const [lowStockAlerts, setLowStockAlerts] = useState(0);
    const [expiredStock, setExpiredStock] = useState(0);
    const [stockTransactionsChartData, setStockTransactionsChartData] = useState({}); // Renamed
    const [stockTrendsChartData, setStockTrendsChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authState } = useAuth();
    const API_BASE_URL = 'http://localhost:8080/api'; // Define your API base URL

    const toggleTransactions = () => {
        setTransactionsOpen(!transactionsOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!authState.token) {
                console.error("Token is missing. Cannot fetch dashboard data.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                console.log("Token from authState:", authState.token);

                const headers = {
                    Authorization: `Bearer ${authState.token}`,
                };

                console.log("Authorization Header:", headers.Authorization);

                const totalStocksResponse = await axios.get(`${API_BASE_URL}/stocks/count`, { headers });
                setTotalStocks(totalStocksResponse.data);

                const lowStockAlertsResponse = await axios.get(`${API_BASE_URL}/stocks/low`, { headers });
                setLowStockAlerts(lowStockAlertsResponse.data);

                const expiredStockResponse = await axios.get(`${API_BASE_URL}/stocks/expired`, { headers });
                setExpiredStock(expiredStockResponse.data);

                const stockTrendsResponse = await axios.get(`${API_BASE_URL}/stocks/trends`, { headers });
                setStockTrendsChartData({
                    labels: Object.keys(stockTrendsResponse.data),
                    datasets: [{
                        label: "Total Stock",
                        data: Object.values(stockTrendsResponse.data).map(item => item[0]),
                        borderColor: "#3498db",
                        fill: false,
                    }]
                });

                const stockTransactionsChartResponse = await axios.get(`${API_BASE_URL}/transactions/chart-data`, { headers }); //Renamed
                setStockTransactionsChartData({ //Renamed
                    labels: stockTransactionsChartResponse.data.labels, //Renamed
                    datasets: stockTransactionsChartResponse.data.datasets, //Renamed
                });
            } catch (err) {
                console.error("Error fetching data:", err);
                if (err.response) {
                    console.error("Server responded with error:", err.response.data);
                    console.error("Status code:", err.response.status);
                    console.error("Headers:", err.response.headers);
                } else if (err.request) {
                    console.error("No response received:", err.request);
                } else {
                    console.error("Error setting up request:", err.message);
                }
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        if (!authState.isLoading) {
            fetchData();
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
                    <Link to="/stockmovements"><FontAwesomeIcon icon={faExchangeAlt} /> Stock Transactions</Link> {/* Changed Here */}
                    <Link to="/stockhistory"><FontAwesomeIcon icon={faListAlt} /> Stock History</Link>
                    <Link to="/customers"><FontAwesomeIcon icon={faUsers} /> Customers</Link>
                    <Link to="/suppliers"><FontAwesomeIcon icon={faTruck} /> Suppliers</Link>
                    <Link to="/stockmovements/report/pdf"><FontAwesomeIcon icon={faFilePdf} /> Reports</Link>
                    <Link to="/settings"><FontAwesomeIcon icon={faCog} /> Settings</Link>
                </nav>
            </aside>

            <main className="dashboard-main">
                <h1>Dashboard</h1>

                <div className="summary-cards">
                    <div className="card">
                        <h3><FontAwesomeIcon icon={faBoxes} /> Total Stocks</h3>
                        <p>{totalStocks}</p>
                    </div>
                    <div className="card">
                        <h3><FontAwesomeIcon icon={faExclamationTriangle} /> Low Stock Alerts</h3>
                        <p>{lowStockAlerts}</p>
                    </div>
                    <div className="card">
                        <h3><FontAwesomeIcon icon={faExchangeAlt} /> Stock Transactions</h3> {/* Changed Here */}
                        <p>{/*stockTransactions*/}</p> {/* Changed Here */}
                    </div>
                    <div className="card">
                        <h3><FontAwesomeIcon icon={faCalendarTimes} /> Expired Stock</h3>
                        <p>{expiredStock}</p>
                    </div>
                </div>

                <div className="charts-section">
                    <div className="chart-container">
                        <h3><FontAwesomeIcon icon={faChartBar} /> Stock Transactions</h3> {/* Changed Here */}
                        {stockTransactionsChartData.labels && <Bar data={stockTransactionsChartData} />} {/* Changed Here */}
                    </div>

                    <div className="chart-container">
                        <h3><FontAwesomeIcon icon={faChartLine} /> Stock Trends</h3>
                        {stockTrendsChartData.labels && <Line data={stockTrendsChartData} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;