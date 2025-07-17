import axios from 'axios';

const API_URL = 'http://localhost:8080/api/stock-movements';

// ✅ Fetch all stock movements
export const getAllStockMovements = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    console.log("Raw API Response:", response); // 🔍 Debug API response

    if (response && response.data && Array.isArray(response.data)) {
      return response.data; // ✅ Ensure it's an array
    } else {
      console.error("Unexpected response format:", response);
      return []; // ✅ Return an empty array instead of undefined
    }
  } catch (error) {
    console.error('Error fetching stock movements:', error.response?.data || error.message);
    throw error;
  }
};



// ✅ Fetch stock movements by Stock ID (from backend: `/{stockId}`)
export const getStockMovementsByStockId = async (stockId) => {
  if (!stockId) {
    console.error("Error: Invalid stock ID");
    return Promise.reject("Invalid stock ID");
  }
  try {
    const response = await axios.get(`${API_URL}/${stockId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock movements for stock ID ${stockId}:`, error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch a stock movement by its own ID (`/movement/{id}`)

export const getStockMovementById = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/stock-movements/movement/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data); // Debugging

    if (Array.isArray(data)) {
      console.warn("Expected an object but received an array:", data);
    }

    return data; // This should return an object
  } catch (error) {
    console.error("Error fetching stock movement by ID:", error);
    throw error;
  }
};


// ✅ Create a new stock movement (`POST /add`)
export const createStockMovement = async (movement) => {
  try {
    const response = await axios.post(`${API_URL}/add`, movement);
    return response.data;
  } catch (error) {
    console.error('Error creating stock movement:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Generate and download stock movement report (`POST /report/pdf`)
export const generateStockMovementReport = async (filters = {}) => {
  try {
    const response = await axios.post(`${API_URL}/report/pdf`, filters, {
      responseType: 'blob', // PDF response
    });
    return response.data;
  } catch (error) {
    console.error('Error generating stock movement report:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Alternative download stock movement report (`POST /downloadReport`)
export const downloadStockMovementReport = async (filters = {}) => {
  try {
    const response = await axios.post(`${API_URL}/downloadReport`, filters, {
      responseType: 'blob', // PDF response
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading stock movement report:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Update a stock movement (`PUT /{id}`)
export const updateStockMovement = async (id, updatedMovement) => {
  if (!id) {
    console.error("Error: Invalid stock movement ID");
    return Promise.reject("Invalid stock movement ID");
  }
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedMovement);
    return response.data;
  } catch (error) {
    console.error(`Error updating stock movement with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const fetchStockMovementReport = async (filters = {}) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/stock-movements/report/pdf",
      filters,  // ✅ Send filters as POST request body
      { responseType: "blob" } // Expect PDF as response
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching stock movement report:", error.response?.data || error.message);
    throw error;
  }
};

// Assuming you have the API endpoint to fetch all suppliers
export const getAllSuppliers = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/suppliers');
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error.response?.data || error.message);
    throw error;
  }
};

// Assuming you have the API endpoint to fetch all customers
export const getAllCustomers = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error.response?.data || error.message);
    throw error;
  }
};


