import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBoxes, faChartLine, faUsers, faTruck, faFileInvoiceDollar,
    faCog, faSearch, faPlusCircle, faWarehouse, faTags, faChartPie,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/HomePage.css'; // Create this CSS file

const HomePage = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <div className="logo">
                    <FontAwesomeIcon icon={faWarehouse} size="2x" />
                    <h1>Inventory App</h1>
                </div>

                {/* <div className="search-bar">
                    <input type="text" placeholder="Search..." />
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>*/}
               
                <div className="user-profile">
                    <FontAwesomeIcon icon={faUsers} size="lg" />
                    <span>Nestaa Kayiranga</span>
                </div>
            </header>

            <nav className="home-nav">
                <a href="/dashboard">
                    <FontAwesomeIcon icon={faChartLine} /> Dashboard
                </a>
                <a href="/products">
                    <FontAwesomeIcon icon={faBoxes} /> Products
                </a>
                <a href="/suppliers">
                    <FontAwesomeIcon icon={faTruck} /> Suppliers
                </a>
                <a href="/customers">
                    <FontAwesomeIcon icon={faUsers} /> Customers
                </a>
                <a href="/invoices">
                    <FontAwesomeIcon icon={faFileInvoiceDollar} /> Invoices
                </a>
                <a href="/reports">
                    <FontAwesomeIcon icon={faChartPie} /> Reports
                </a>
                <a href="/settings">
                    <FontAwesomeIcon icon={faCog} /> Settings
                </a>
            </nav>

            <main className="home-main">
                <section className="summary-section">
                    <div className="summary-card">
                        <FontAwesomeIcon icon={faBoxes} className="summary-icon" />
                        <div className="summary-content">
                            <h2>Total Products</h2>
                            <p>1250</p>
                        </div>
                    </div>
                    <div className="summary-card">
                        <FontAwesomeIcon icon={faUsers} className="summary-icon" />
                        <div className="summary-content">
                            <h2>Total Customers</h2>
                            <p>500</p>
                        </div>
                    </div>
                    <div className="summary-card">
                        <FontAwesomeIcon icon={faTruck} className="summary-icon" />
                        <div className="summary-content">
                            <h2>Total Suppliers</h2>
                            <p>150</p>
                        </div>
                    </div>
                    <div className="summary-card">
                        <FontAwesomeIcon icon={faFileInvoiceDollar} className="summary-icon" />
                        <div className="summary-content">
                            <h2>Pending Invoices</h2>
                            <p>25</p>
                        </div>
                    </div>
                </section>

                <section className="recent-activity-section">
                    <h2>Recent Activity</h2>
                    <div className="activity-item">
                        <FontAwesomeIcon icon={faPlusCircle} className="activity-icon" />
                        <span>New product "Laptop X1" added.</span>
                        <span className="activity-time">1 hour ago</span>
                    </div>
                    <div className="activity-item">
                        <FontAwesomeIcon icon={faTruck} className="activity-icon" />
                        <span>Supplier "Electronics Ltd." updated.</span>
                        <span className="activity-time">2 hours ago</span>
                    </div>
                    <div className="activity-item">
                        <FontAwesomeIcon icon={faUsers} className="activity-icon" />
                        <span>New customer "Gasaro Maeva" registered.</span>
                        <span className="activity-time">3 hours ago</span>
                    </div>
                    <div className="activity-item">
                        <FontAwesomeIcon icon={faTags} className="activity-icon" />
                        <span>Stock adjusted for "Tablet Pro".</span>
                        <span className="activity-time">4 hours ago</span>
                    </div>
                </section>

                <section className="charts-section">
                    <h2>Inventory Overview</h2>
                    <div className="chart-container">
                        {/* Placeholder for charts (e.g., using Chart.js or similar) */}
                        <div className="chart-placeholder">
                            <FontAwesomeIcon icon={faChartPie} size="5x" />
                            <p>Inventory Chart Placeholder</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} Inventory Pro. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;