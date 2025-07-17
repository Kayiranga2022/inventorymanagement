import axios from 'axios';

const API_URL = 'http://localhost:8080/api/stock-history';

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
    };
};

export const getAllStockHistory = async (page = 0, size = 10) => {
    const requestConfig = {
        ...getAuthHeaders(),
        url: `${API_URL}/all?page=${page}&size=${size}`,
        method: 'get',
    };
    console.log("getAllStockHistory Request:", requestConfig);
    try {
        const response = await axios(requestConfig);
        console.log("getAllStockHistory Response:", response);
        return response.data;
    } catch (error) {
        console.error('getAllStockHistory Error:', error);
        throw error;
    }
};

export const getStockHistoryByProduct = async (productId, page = 0, size = 10) => {
    const requestConfig = {
        ...getAuthHeaders(),
        url: `${API_URL}/product/${productId}?page=${page}&size=${size}`,
        method: 'get',
    };
    console.log("getStockHistoryByProduct Request:", requestConfig);
    try {
        const response = await axios(requestConfig);
        console.log("getStockHistoryByProduct Response:", response);
        return response.data;
    } catch (error) {
        console.error('getStockHistoryByProduct Error:', error);
        throw error;
    }
};

export const getStockHistoryByChangeType = async (changeType, page = 0, size = 10) => {
    const requestConfig = {
        ...getAuthHeaders(),
        url: `${API_URL}/change-type/${changeType}?page=${page}&size=${size}`,
        method: 'get',
    };
    console.log("getStockHistoryByChangeType Request:", requestConfig);
    try {
        const response = await axios(requestConfig);
        console.log("getStockHistoryByChangeType Response:", response);
        return response.data;
    } catch (error) {
        console.error('getStockHistoryByChangeType Error:', error);
        throw error;
    }
};

export const getStockHistoryByUser = async (userId, page = 0, size = 10) => {
    const requestConfig = {
        ...getAuthHeaders(),
        url: `${API_URL}/user/${userId}?page=${page}&size=${size}`,
        method: 'get',
    };
    console.log("getStockHistoryByUser Request:", requestConfig);
    try {
        const response = await axios(requestConfig);
        console.log("getStockHistoryByUser Response:", response);
        return response.data;
    } catch (error) {
        console.error('getStockHistoryByUser Error:', error);
        throw error;
    }
};

export const getStockHistoryByStock = async (stockId, page = 0, size = 10) => {
    const requestConfig = {
        ...getAuthHeaders(),
        url: `${API_URL}/stock/${stockId}?page=${page}&size=${size}`,
        method: 'get',
    };
    console.log("getStockHistoryByStock Request:", requestConfig);
    try {
        const response = await axios(requestConfig);
        console.log("getStockHistoryByStock Response:", response);
        return response.data;
    } catch (error) {
        console.error('getStockHistoryByStock Error:', error);
        throw error;
    }
};

export const getStockHistoryById = async (historyId) => {
    const requestConfig = {
        ...getAuthHeaders(),
        url: `${API_URL}/${historyId}`,
        method: 'get',
    };
    console.log("getStockHistoryById Request:", requestConfig);
    try {
        const response = await axios(requestConfig);
        console.log("getStockHistoryById Response:", response);
        return response.data;
    } catch (error) {
        console.error('getStockHistoryById Error:', error);
        throw error;
    }
};