// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../styles/Login.css";
import loogo from '../images/loogo.png'; //import loogo

const API_BASE_URL = "http://localhost:8080/api/auth";
const API_SESSIONS_URL = "http://localhost:8080/api/sessions";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // ... (rest of the login logic remains the same)
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, { username, password });

            console.log("Login response:", response.data);

            let tokenKey = "accessToken";
            if (!response.data.accessToken && response.data.token) {
                tokenKey = "token";
            }

            const { [tokenKey]: token, roles } = response.data;

            if (!token || !roles?.length) {
                throw new Error("Invalid login response");
            }

            setAuth(token, roles);
            localStorage.setItem("token", token);
            localStorage.setItem("roles", JSON.stringify(roles));

            if (roles.includes("ROLE_ADMIN")) {
                navigate("/dashboard");
            } else if (roles.includes("ROLE_MANAGER")) {
                navigate("/manager-dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_SESSIONS_URL}/end`);
            localStorage.removeItem("token");
            localStorage.removeItem("roles");
            setAuth(null, []);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
        }
    };

    return (
        <div className="full-page-container">
            <div className="login-info-container">
                <div className="login-form-section">
                    <div className="login-header">
                        <img src={loogo} alt="Loogo" className="login-logo" /> {/* use loogo */}
                        <h2>Inventory Management Login</h2>
                    </div>
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <FontAwesomeIcon icon={faUser} className="icon" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <FontAwesomeIcon icon={faLock} className="icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                   
                </div>
                <div className="app-info-section">
                    <h2>About Our Inventory Management App</h2>
                    <p>Streamline your inventory with our powerful and intuitive app.</p>
                    <ul>
                        <li>Real-time stock tracking</li>
                        <li>Automated reports and analytics</li>
                        <li>User-friendly interface</li>
                        <li>Secure and reliable access</li>
                    </ul>
                    <p>Join us and optimize your inventory management today!</p>
                </div>
            </div>
        </div>
    );
};

export default Login;