import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const getStoredRoles = () => {
        try {
            const roles = localStorage.getItem('roles');
            return roles ? JSON.parse(roles) : [];
        } catch (error) {
            console.error('Error parsing roles from localStorage:', error);
            return [];
        }
    };

    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token') || null,
        roles: getStoredRoles(),
        isLoading: true,
    });

    const clearAuth = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        setAuthState({ token: null, roles: [], isLoading: false });
    }, [setAuthState]);

    const setAuth = useCallback((token, roles) => {
        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('roles', JSON.stringify(roles));
            setAuthState({ token, roles, isLoading: false });
        } else {
            clearAuth();
        }
    }, [setAuthState, clearAuth]);

    useEffect(() => {
        let isSubscribed = true;
        const checkAuthStatus = async () => {
            try {
                const storedToken = localStorage.getItem('token');
                if (storedToken) {
                    const response = await axios.get('http://localhost:8080/api/auth/validate', {
                        headers: { Authorization: `Bearer ${storedToken}` },
                    });

                    if (isSubscribed && response.status === 200) {
                        const storedRoles = JSON.parse(localStorage.getItem('roles')) || [];
                        setAuthState(prevState => {
                            if (prevState.token !== storedToken || JSON.stringify(prevState.roles) !== JSON.stringify(storedRoles)) {
                                return { token: storedToken, roles: storedRoles, isLoading: false };
                            }
                            return prevState;
                        });
                        console.log("AuthContext: Token validated successfully");
                    } else {
                        console.error('AuthContext: Token validation failed: Server returned non-200 status', response);
                        clearAuth();
                    }
                } else {
                    clearAuth();
                }
            } catch (error) {
                console.error('AuthContext: Token validation failed', error);
                if (error.response) {
                    console.error('AuthContext: Token validation failed: Server responded with', error.response.status, error.response.data);
                }
                clearAuth();
            } finally {
                if (isSubscribed) {
                    setAuthState(prevState => ({ ...prevState, isLoading: false }));
                }
            }
        };

        checkAuthStatus();

        return () => isSubscribed = false;
    }, [clearAuth]);

    return (
        <AuthContext.Provider value={{ authState, setAuth, clearAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);