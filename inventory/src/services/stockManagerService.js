import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/stock-managers';

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is stored
    },
});

// ✅ Include headers in all requests
export const getAllStockManagers = () => axios.get(`${BASE_URL}/all`, getAuthHeaders());
export const getStockManagerById = (id) => axios.get(`${BASE_URL}/${id}`, getAuthHeaders());
export const getStockManagerByEmail = (email) => axios.get(`${BASE_URL}/email/${email}`, getAuthHeaders());
export const createStockManager = (stockManager) => axios.post(`${BASE_URL}/add`, stockManager, getAuthHeaders());
export const deleteStockManager = (id) => axios.delete(`${BASE_URL}/delete/${id}`, getAuthHeaders());
export const updateStockManager = (id, stockManager) => axios.put(`${BASE_URL}/update/${id}`, stockManager, getAuthHeaders());
