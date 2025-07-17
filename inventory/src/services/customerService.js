// services/customerService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/customers";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found in localStorage");
    }
    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
    };
};

export const getCustomers = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching customers", error);
        throw error;
    }
};

export const getCustomerById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching customer by ID", error);
        throw error;
    }
};

export const createCustomer = async (customerData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, customerData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error creating customer:", error.response?.data || error.message);
        throw error;
    }
};

export const updateCustomer = async (id, customerData) => {
    try {
        const response = await axios.put(`${API_URL}/update/${id}`, customerData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error updating customer", error);
        throw error;
    }
};

export const deleteCustomer = async (id) => {
    try {
        await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
    } catch (error) {
        console.error("Error deleting customer", error);
        throw error;
    }
};