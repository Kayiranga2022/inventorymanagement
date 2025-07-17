import { useState, useEffect } from "react";
import { createReturn } from "../../services/transactionService";
import '../../styles/ReturnForm.css';
import axios from "axios";

const API_URL = "http://localhost:8080/api/";

const ReturnForm = ({ onSubmit }) => {
    const [returnData, setReturnData] = useState({
        referenceNumber: "",
        stockManager: "",
        items: [{ stockId: "", quantity: "" }],
        reason: "",
    });

    const [stockManagers, setStockManagers] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [displayStocks, setDisplayStocks] = useState([]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
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

    useEffect(() => {
        console.log("ReturnForm useEffect running");
        const fetchData = async () => {
            try {
                const stockManagersRes = await axios.get(`${API_URL}stock-managers/all`, getAuthHeaders());
                const stocksRes = await axios.get(`${API_URL}stocks/all`, getAuthHeaders());

                setStockManagers(stockManagersRes.data);
                setStocks(stocksRes.data);

                const transformedStocks = stocksRes.data.map(stock => {
                    return {
                        id: stock.id,
                        name: stock.name,
                        price: stock.price,
                    };
                });
                setDisplayStocks(transformedStocks);

                console.log("Stock Managers:", stockManagersRes.data);
                console.log("Stocks:", stocksRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                if (error.response) {
                    console.error("Error Response Status:", error.response.status);
                    console.error("Error Response Data:", error.response.data);
                }
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("items")) {
            const itemIndex = parseInt(name.split("-")[1], 10);
            const newItems = [...returnData.items];
            newItems[itemIndex] = {
                ...newItems[itemIndex],
                [name.split("-")[0]]: value,
            };
            setReturnData({ ...returnData, items: newItems });
        } else {
            setReturnData({ ...returnData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createReturn(returnData);
            onSubmit();
            console.log("Return submitted successfully:", returnData);
        } catch (error) {
            console.error("Return submission failed:", error);
            if (error.response) {
                console.error("Error Response Status:", error.response.status);
                console.error("Error Response Data:", error.response.data);
            }
        }
    };

    const addItem = () => {
        setReturnData({
            ...returnData,
            items: [...returnData.items, { stockId: "", quantity: "" }],
        });
    };

    return (
        <form onSubmit={handleSubmit} className="return-form">
            <h2>Create Return</h2>
            <div>
                <label>Reference Number:</label>
                <input type="text" name="referenceNumber" value={returnData.referenceNumber} onChange={handleChange} placeholder="Reference Number" required />
            </div>
            <div>
                <label>Stock Manager:</label>
                <select name="stockManager" value={returnData.stockManager} onChange={handleChange} required>
                    <option value="">Select Stock Manager</option>
                    {stockManagers.map((manager) => (
                        <option key={manager.id} value={manager.id}>
                            {manager.firstName} {manager.lastName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Items:</label>
                {returnData.items.map((item, index) => (
                    <div key={index} className="return-item">
                        <label>Stock:</label>
                        <select name={`items-${index}-stockId`} value={item.stockId} onChange={handleChange} required>
                            <option value="">Select Stock</option>
                            {displayStocks.map((stock) => (
                                <option key={stock.id} value={stock.id}>
                                    {stock.name} - ${stock.price}
                                </option>
                            ))}
                        </select>
                        <label>Quantity:</label>
                        <input type="number" name={`items-${index}-quantity`} value={item.quantity} onChange={handleChange} placeholder="Quantity" required />
                    </div>
                ))}
                <button type="button" onClick={addItem}>Add Item</button>
            </div>
            <div>
                <label>Reason:</label>
                <textarea name="reason" value={returnData.reason} onChange={handleChange} placeholder="Reason for Return" required />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default ReturnForm;