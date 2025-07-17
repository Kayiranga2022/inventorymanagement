// transactionService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/transactions";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Added log for token retrieval
    if (!token) {
        console.error("No token found in localStorage");
    } else {
        console.log("Authorization Token:", token);
    }
    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
    };
};

export const fetchTransactions = async (filters) => {
    console.log("Sending request with filters:", filters);
    console.log("Request Headers:", getAuthHeaders());
    try {
        const response = await axios.get(API_URL, {
            ...getAuthHeaders(),
            params: filters,
        });
        console.log("Response Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        if (error.response) {
            console.error("Error Response Status:", error.response.status);
            console.error("Error Response Data:", error.response.data);
        }
        throw error;
    }
};

export const getTransactionById = async (id) => {
    console.log("Request Headers:", getAuthHeaders());
    try {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        console.log("Response Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching transaction details:", error);
        if (error.response) {
            console.error("Error Response Status:", error.response.status);
            console.error("Error Response Data:", error.response.data);
        }
        throw error;
    }
};

const createTransaction = async (transactionData) => {
    console.log("Request Headers:", getAuthHeaders());
    try {
        const response = await axios.post(API_URL, transactionData, getAuthHeaders());
        console.log("Response Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating transaction:", error);
        if (error.response) {
            console.error("Error Response Status:", error.response.status);
            console.error("Error Response Data:", error.response.data);
        }
        throw error;
    }
};

export const createPurchase = async (data) => {
    return createTransaction({ ...data, movementType: "PURCHASE" });
};

export const createSale = async (data) => {
    return createTransaction({ ...data, movementType: "SALE" });
};

export const createReturn = async (data) => {
    return createTransaction({ ...data, movementType: "RETURN" });
};