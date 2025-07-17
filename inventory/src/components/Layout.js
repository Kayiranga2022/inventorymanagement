import React from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Logout from "./Logout";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
    const { authState } = useAuth();

    const getDashboardLink = () => {
        if (authState.roles && authState.roles.includes("ROLE_ADMIN")) {
            return <Link to="/dashboard">Dashboard</Link>;
        } else if (authState.roles && authState.roles.includes("ROLE_MANAGER")) {
            return <Link to="/manager-dashboard">Dashboard</Link>;
        } else {
            return <Link to="/dashboard">Dashboard</Link>; // Default link
        }
    };

    return (
        <div>
            <Navbar>
                {authState.token && (
                    <>
                        {getDashboardLink()}
                        <Link to="/stocks">Stocks</Link>
                        <Link to="/stockmanagers">Stock Managers</Link>
                        <Link to="/stockmovements">Stock Movements</Link>
                        <Link to="/stockhistory">Stock History</Link>
                        <Link to="/products">Products</Link>
                        <Link to="/customers">Customers</Link>
                        <Link to="/suppliers">Suppliers</Link>
                        <Link to="/transactions">Transactions</Link>
                        <Link to="/news">News</Link>
                        <Link to="/about-us">About Us</Link>
                        <Link to="/home">Home</Link>
                        <Logout /> {/* Removed authState prop */}
                    </>
                )}
            </Navbar>
            <main>
                <Outlet />
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default Layout;