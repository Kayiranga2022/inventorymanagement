import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../styles/PurchaseForm.css';

const API_URL = "http://localhost:8080/api/";

const PurchaseForm = ({ onSubmit }) => {
    const [purchaseData, setPurchaseData] = useState({
        supplier: "",
        stockManager: "",
        items: [{ stockId: "", quantity: 1, pricePerUnit: 0 }],
        totalAmount: 0,
        paymentMethod: "CASH",
        paymentStatus: "UNPAID",
        amountPaid: 0,
    });

    const [suppliers, setSuppliers] = useState([]);
    const [stockManagers, setStockManagers] = useState([]);
    const [displayStocks, setDisplayStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return {
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [suppliersRes, stockManagersRes, stocksRes] = await Promise.all([
                    axios.get(`${API_URL}suppliers/all`, getAuthHeaders()),
                    axios.get(`${API_URL}stock-managers/all`, getAuthHeaders()),
                    axios.get(`${API_URL}stocks/all`, getAuthHeaders()),
                ]);

                setSuppliers(suppliersRes.data);
                setStockManagers(stockManagersRes.data);

                const transformedStocks = stocksRes.data.map(stock => ({
                    id: stock.id,
                    name: `${stock.name} - ${stock.productName}`,
                    productId: stock.productId,
                }));

                setDisplayStocks(transformedStocks);
                setLoading(false);
            } catch (err) {
                setError("Failed to load data. Please try again.");
                setLoading(false);
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    const calculateTotalAmount = (items) => {
        return items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
    };

    const handleChange = (e, index = null) => {
        const { name, value } = e.target;
        if (name === "amountPaid") {
            console.log("amount paid input value: ", value);
        }
        let newItems = [...purchaseData.items];

        if (index !== null) {
            const parsedValue = parseInt(value, 10);
            if (isNaN(parsedValue) || parsedValue < 0) {
                return;
            }
            newItems[index][name] = parsedValue;

            setPurchaseData({
                ...purchaseData,
                items: newItems,
                totalAmount: calculateTotalAmount(newItems),
            });
        } else {
            setPurchaseData({ ...purchaseData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Purchase data being sent:", purchaseData);
        setError("");
        setIsSubmitting(true);
        try {
            let parsedAmountPaid = Number(purchaseData.amountPaid);

            if (isNaN(parsedAmountPaid)) {
                parsedAmountPaid = 0;
            }

            const transactionData = {
                movementType: "PURCHASE",
                supplierId: parseInt(purchaseData.supplier, 10),
                stockManagerId: parseInt(purchaseData.stockManager, 10),
                paymentMethod: purchaseData.paymentMethod,
                paymentStatus: purchaseData.paymentStatus,
                items: purchaseData.items.map(item => ({
                    stockId: parseInt(item.stockId, 10),
                    quantity: parseInt(item.quantity, 10),
                    pricePerUnit: parseFloat(item.pricePerUnit),
                })),
                amountPaid: parsedAmountPaid,
            };
            console.log("Transaction data being sent:", transactionData);
            await axios.post(`${API_URL}transactions`, transactionData, getAuthHeaders());
            if (onSubmit) {
                onSubmit();
            }

            setPurchaseData({
                supplier: "",
                stockManager: "",
                items: [{ stockId: "", quantity: 1, pricePerUnit: 0 }],
                totalAmount: 0,
                paymentMethod: "CASH",
                paymentStatus: "UNPAID",
                amountPaid: 0,
            });

        } catch (err) {
            setError(err.response?.data?.message || "Failed to create purchase. Please try again.");
            console.error("Purchase submission failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addItem = () => {
        setPurchaseData({
            ...purchaseData,
            items: [...purchaseData.items, { stockId: "", quantity: 1, pricePerUnit: 0 }],
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <form onSubmit={handleSubmit} className="purchase-form">
            <h2>Create Purchase</h2>
            {error && <div className="error">{error}</div>}
            <div>
                <label>Supplier:</label>
                <select name="supplier" value={purchaseData.supplier} onChange={handleChange} required>
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Stock Manager:</label>
                <select name="stockManager" value={purchaseData.stockManager} onChange={handleChange} required>
                    <option value="">Select Stock Manager</option>
                    {stockManagers.map((manager) => (
                        <option key={manager.id} value={manager.id}>
                            {manager.firstName} {manager.lastName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Payment Method:</label>
                <select name="paymentMethod" value={purchaseData.paymentMethod} onChange={handleChange} required>
                    <option value="">Select Payment Method</option>
                    <option value="CASH">CASH</option>
                    <option value="CREDIT">CREDIT</option>
                    <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                </select>
            </div>
            <div>
                <label>Payment Status:</label>
                <select name="paymentStatus" value={purchaseData.paymentStatus} onChange={handleChange} required>
                    <option value="">Select Payment Status</option>
                    <option value="FULL">FULL</option>
                    <option value="PARTIAL">PARTIAL</option>
                    <option value="UNPAID">UNPAID</option>
                </select>
            </div>
            <div>
                <label>Items:</label>
                {purchaseData.items.map((item, index) => (
                    <div key={index} className="purchase-item">
                        <label>Stock:</label>
                        <select name="stockId" value={item.stockId} onChange={(e) => handleChange(e, index)} required>
                            <option value="">Select Stock</option>
                            {displayStocks.map((stock) => (
                                <option key={stock.id} value={stock.id}>{stock.name}</option>
                            ))}
                        </select>
                        <label>Quantity:</label>
                        <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleChange(e, index)} min="1" required />
                        <label>Price per Unit:</label>
                        <input type="number" name="pricePerUnit" value={item.pricePerUnit} onChange={(e) => handleChange(e, index)} min="0" required />
                    </div>
                ))}
                <button type="button" onClick={addItem}>Add Item</button>
            </div>
            <div>
                <label>Amount Paid:</label>
                <input
                    type="number"
                    name="amountPaid"
                    value={purchaseData.amountPaid}
                    onChange={handleChange}
                    min="0"
                    required
                />
            </div>
            <div>
                <label>Total Amount:</label>
                <input type="number" name="totalAmount" value={purchaseData.totalAmount} readOnly />
</div>
<button type="submit" disabled={isSubmitting}>
{isSubmitting ? "Submitting..." : "Submit"}
</button>
</form>
);
};

export default PurchaseForm;