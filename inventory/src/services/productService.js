import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

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

export const createProduct = async (productData) => {
    try {
        const headers = getAuthHeaders().headers; // Use the getAuthHeaders function.
        console.log("Headers before createProduct:", headers);

        const response = await axios.post(`${API_URL}/create`, productData, { headers });
        console.log("Create product response:", response);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        if (error.response) {
            console.error("Server response:", error.response);
        }
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error.response?.data || error.message);
        throw error;
    }
};

export const getProductBySku = async (sku) => {
    try {
        const response = await axios.get(`${API_URL}/sku/${sku}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching product by SKU:", error.response?.data || error.message);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await axios.put(`${API_URL}/update/${id}`, productData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error.response?.data || error.message);
        throw error;
    }
};

export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching all products:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
    } catch (error) {
        console.error("Error deleting product:", error.response?.data || error.message);
        throw error;
    }
};