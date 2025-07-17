import React from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import { Link } from "react-router-dom";
import "../../styles/Dashboard.css";

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Inventory</h2>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/stockmanagers">Stock Managers</Link>
          <Link to="/products">Products</Link>
          <Link to="/stocks">Stocks</Link>
          <Link to="/stockmovements">Stock Movements</Link>
          <Link to="/stockhistory">Stock History</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/suppliers">Suppliers</Link>
          <Link to="/stockmovements/report/pdf">Reports</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <h1>Admin Dashboard</h1>

        <div className="summary-cards">
          <div className="card">
            <h3>Total Stocks</h3>
            <p>1,200</p>
          </div>
          <div className="card">
            <h3>Low Stock Alerts</h3>
            <p>15</p>
          </div>
          <div className="card">
            <h3>Stock Movements</h3>
            <p>320</p>
          </div>
          <div className="card">
            <h3>Expired Stock</h3>
            <p>5</p>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-container">
            <h3>Stock Movements</h3>
            <Bar
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  {
                    label: "Stock In",
                    data: [30, 50, 40, 70, 60, 90],
                    backgroundColor: "#4CAF50",
                  },
                  {
                    label: "Stock Out",
                    data: [20, 40, 30, 50, 40, 60],
                    backgroundColor: "#F44336",
                  },
                ],
              }}
            />
          </div>

          <div className="chart-container">
            <h3>Stock Trends</h3>
            <Line
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  {
                    label: "Total Stock",
                    data: [100, 120, 150, 140, 160, 180],
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

export default AdminDashboard