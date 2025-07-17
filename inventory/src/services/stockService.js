import axios from "axios";

const API_URL = "http://localhost:8080/api/stocks";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
    };
};

export const getStocks = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching stocks", error);
        throw error;
    }
};

export const getStockById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching stock by ID", error);
        throw error;
    }
};

export const createStock = async (productId, stockData) => {
    try {
        const response = await axios.post(
            `http://localhost:8080/api/stocks/save/${productId}`,
            stockData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error creating stock:", error.response?.data || error.message);
        throw error;
    }
};

export const updateStock = async (id, stockData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, stockData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error updating stock", error);
        throw error;
    }
};

export const deleteStock = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    } catch (error) {
        console.error("Error deleting stock", error);
        throw error;
    }
};