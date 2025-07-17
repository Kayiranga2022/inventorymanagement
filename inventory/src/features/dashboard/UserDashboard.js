import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { Link } from "react-router-dom";
import "../../styles/Dashboard.css";

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Inventory</h2>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/stocks">Stocks</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/suppliers">Suppliers</Link>
          <Link to="/stockhistory">Stock History</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <h1>User Dashboard</h1>

        <div className="summary-cards">
          <div className="card">
            <h3>Total Products</h3>
            <p>100</p>
          </div>
          <div className="card">
            <h3>Available Stocks</h3>
            <p>500</p>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-container">
            <h3>Product Trends</h3>
            <Line
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  {
                    label: "Product Availability",
                    data: [80, 90, 100, 95, 110, 120],
                    borderColor: "#2196F3",
                    fill: false,
                  },
                ],
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;