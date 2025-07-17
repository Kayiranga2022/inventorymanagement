import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import loogo from "../images/loogo.png"; // Changed logo import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faUserCircle,
    faBell,
    faSearch,
    faCog,
    faSignOutAlt,
    faHome,
    faNewspaper,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import Logout from "./Logout";

const Navbar = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const { authState } = useAuth();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const getDashboardLink = () => {
        if (authState.roles && authState.roles.includes("ROLE_ADMIN")) {
            return <Link to="/dashboard" className="navbar-link">Dashboard</Link>;
        } else if (authState.roles && authState.roles.includes("ROLE_MANAGER")) {
            return <Link to="/manager-dashboard" className="navbar-link">Dashboard</Link>;
        } else {
            return <Link to="/dashboard" className="navbar-link">Dashboard</Link>;
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src={loogo} alt="Loogo" className="logo-image" />
                </Link>
            </div>

            <div className="navbar-menu">
                <Link to="/home" className="navbar-link"><FontAwesomeIcon icon={faHome} /> Home</Link>
                {getDashboardLink()}
                <Link to="/news" className="navbar-link"><FontAwesomeIcon icon={faNewspaper} /> News</Link>
                <Link to="/about-us" className="navbar-link"><FontAwesomeIcon icon={faInfoCircle} /> About Us</Link>
            </div>

            <div className="navbar-search">
                <input type="text" placeholder="Search..." />
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>

            <div className="navbar-user">
                <FontAwesomeIcon icon={faBell} className="notification-icon" />
                <div className="profile-container" onClick={toggleProfileDropdown}>
                    <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
                    {isProfileDropdownOpen && (
                        <div className="profile-dropdown">
                            <Link to="/profile">Profile</Link>
                            <Link to="/settings">Settings</Link>
                            <Logout />
                        </div>
                    )}
                </div>
            </div>

            <div className="hamburger" onClick={toggleMobileMenu}>
                <FontAwesomeIcon icon={faBars} />
            </div>

            <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
                <Link to="/" className="navbar-link"><FontAwesomeIcon icon={faHome} /> Home</Link>
                {getDashboardLink()}
                <Link to="/news" className="navbar-link"><FontAwesomeIcon icon={faNewspaper} /> News</Link>
                <Link to="/about" className="navbar-link"><FontAwesomeIcon icon={faInfoCircle} /> About Us</Link>
            </div>
        </nav>
    );
};

export default Navbar;