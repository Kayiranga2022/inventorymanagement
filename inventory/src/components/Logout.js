import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate();
    const { clearAuth } = useAuth();
    const apiUrl = 'http://localhost:8080/api/auth/logout'; // Updated API URL

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found, redirecting to login.");
                    clearAuth();
                    navigate('/login');
                    return;
                }

                await axios.post(apiUrl, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Ensure token is sent
                    },
                });

                clearAuth();
                navigate('/login');
            } catch (error) {
                console.error("Logout failed:", error);
                alert("Logout failed. Please try again.");
            }
        }
    };

    return (
        <button 
            onClick={handleLogout} 
            style={{
                padding: "10px", 
                backgroundColor: "red", 
                color: "white", 
                border: "none", 
                cursor: "pointer"
            }}
        >
            Logout
        </button>
    );
};

export default Logout;
