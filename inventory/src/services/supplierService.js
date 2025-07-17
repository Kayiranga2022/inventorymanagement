import axios from "axios";

const API_URL = "http://localhost:8080/api/suppliers";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        },
    };
};

export const getSuppliers = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching suppliers:", error.response?.data || error.message);
        throw error;
    }
};

export const getSupplierById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier by ID:", error.response?.data || error.message);
        throw error;
    }
};

export const createSupplier = async (supplierData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, supplierData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error creating supplier:", error.response?.data || error.message);
        throw error;
    }
};

export const updateSupplier = async (id, supplierData) => {
    try {
        const response = await axios.put(`${API_URL}/update/${id}`, supplierData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error updating supplier:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteSupplier = async (id) => {
    try {
        await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
    } catch (error) {
        console.error("Error deleting supplier:", error.response?.data || error.message);
        throw error;
    }
};