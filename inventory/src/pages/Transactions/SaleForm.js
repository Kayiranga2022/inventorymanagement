import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "../../styles/SaleForm.css";

const API_URL = "http://localhost:8080/api/";

const SaleForm = ({ onSubmit }) => {
    const [saleData, setSaleData] = useState({
        customer: "",
        stockManager: "",
        items: [{ stockId: "", quantity: 1, pricePerUnit: 0 }],
        totalAmount: 0,
        paymentMethod: "CASH",
        paymentStatus: "UNPAID",
        amountPaid: 0,
    });

    const [customers, setCustomers] = useState([]);
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
                const [customersRes, stockManagersRes, stocksRes] = await Promise.all([
                    axios.get(`${API_URL}customers/all`, getAuthHeaders()),
                    axios.get(`${API_URL}stock-managers/all`, getAuthHeaders()),
                    axios.get(`${API_URL}stocks/all`, getAuthHeaders()),
                ]);

                setCustomers(customersRes.data);
                setStockManagers(stockManagersRes.data);

                const transformedStocks = stocksRes.data.map((stock) => ({
                    id: stock.id,
                    name: `${stock.name} - ${stock.productName}`,
                    productId: stock.productId,
                    price: stock.price,
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

    const handleChange = async (e, index = null) => {
        const { name, value } = e.target;
        let newItems = [...saleData.items];

        if (index !== null) {
            if (name === "stockId") {
                const parsedValue = parseInt(value, 10);
                const selectedStock = displayStocks.find((stock) => stock.id === parsedValue);
                if (selectedStock) {
                    newItems[index].pricePerUnit = selectedStock.price;
                } else {
                    newItems[index].pricePerUnit = 0;
                }
                newItems[index].stockId = parsedValue;
            } else {
                const parsedValue = parseInt(value, 10);
                if (isNaN(parsedValue) || parsedValue < 0) {
                    return;
                }
                newItems[index][name] = parsedValue;
            }

            setSaleData({
                ...saleData,
                items: newItems,
                totalAmount: newItems.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0),
            });
        } else {
            setSaleData({ ...saleData, [name]: value });
        }
    };

    const generateInvoice = (saleData, customers, stockManagers, displayStocks) => {
        const doc = new jsPDF();
        doc.text("Invoice", 10, 10);

        const customer = customers.find((c) => c.id === parseInt(saleData.customer, 10));
        const manager = stockManagers.find((m) => m.id === parseInt(saleData.stockManager, 10));

        doc.text(`Customer: ${customer?.name || "N/A"}`, 10, 20);
        doc.text(`Stock Manager: ${manager?.firstName + " " + manager?.lastName || "N/A"}`, 10, 30);
        doc.text(`Payment Method: ${saleData.paymentMethod}`, 10, 40);
        doc.text(`Payment Status: ${saleData.paymentStatus}`, 10, 50);
        doc.text(`Amount Paid: ${saleData.amountPaid}`, 10, 60);

        let y = 70;
        saleData.items.forEach((item) => {
            const stock = displayStocks.find((s) => s.id === item.stockId);
            doc.text(
                `Stock: ${stock?.name || "N/A"}, Quantity: ${item.quantity}, Price: ${item.pricePerUnit}`,
                10,
                y
            );
            y += 10;
        });

        doc.text(`Total Amount: ${saleData.totalAmount}`, 10, y + 10);
        doc.save("invoice.pdf");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            let parsedAmountPaid = Number(saleData.amountPaid);

            if (isNaN(parsedAmountPaid)) {
                parsedAmountPaid = 0;
            }

            const transactionData = {
                movementType: "SALE",
                customerId: parseInt(saleData.customer, 10),
                stockManagerId: parseInt(saleData.stockManager, 10),
                paymentMethod: saleData.paymentMethod,
                items: saleData.items.map((item) => {
                    const selectedStock = displayStocks.find((stock) => stock.id === item.stockId);
                    return {
                        stockId: item.stockId,
                        productId: selectedStock ? selectedStock.productId : null,
                        quantity: item.quantity,
                        pricePerUnit: item.pricePerUnit,
                    };
                }),
                paymentStatus: saleData.paymentStatus,
                amountPaid: parsedAmountPaid,
            };

            await axios.post(`${API_URL}transactions`, transactionData, getAuthHeaders());
            if (onSubmit) {
                onSubmit();
            }

            generateInvoice(saleData, customers, stockManagers, displayStocks);

            setSaleData({
                customer: "",
                stockManager: "",
                items: [{ stockId: "", quantity: 1, pricePerUnit: 0 }],
                totalAmount: 0,
                paymentMethod: "CASH",
                paymentStatus: "UNPAID",
                amountPaid: 0,
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create sale. Please try again.");
            console.error("Sale submission failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addItem = () => {
        setSaleData({
            ...saleData,
            items: [...saleData.items, { stockId: "", quantity: 1, pricePerUnit: 0 }],
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <form onSubmit={handleSubmit} className="sale-form">
            <h2>Create Sale</h2>
            {error && <div className="error">{error}</div>}
            <div>
                <label>Customer:</label>
                <select name="customer" value={saleData.customer} onChange={handleChange} required>
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Stock Manager:</label>
                <select name="stockManager" value={saleData.stockManager} onChange={handleChange} required>
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
                <select name="paymentMethod" value={saleData.paymentMethod} onChange={handleChange} required>
                    <option value="">Select Payment Method</option>
                    <option value="CASH">CASH</option>
                    <option value="CREDIT">CREDIT</option>
                    <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                </select>
            </div>
            <div>
                <label>Payment Status:</label>
                <select name="paymentStatus" value={saleData.paymentStatus} onChange={handleChange} required>
                    <option value="">Select Payment Status</option>
                    <option value="FULL">FULL</option>
                    <option value="PARTIAL">PARTIAL</option>
                    <option value="UNPAID">UNPAID</option>
                </select>
            </div>

            <div>
                <label>Items:</label>
                {saleData.items.map((item, index) => (
                    <div key={index} className="sale-item">
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
                        <input type="number" name="pricePerUnit" value={item.pricePerUnit} readOnly />
                    </div>
                ))}
                <button type="button" onClick={addItem}>Add Item</button>
            </div>

            <div>
                <label>Amount Paid:</label>
                <input
                    type="number"
                    name="amountPaid"
                    value={saleData.amountPaid}
                    onChange={handleChange}
                    min="0"
                    required
                />
            </div>

            <div>
                <label>Total Amount:</label>
                <input type="number" name="totalAmount" value={saleData.totalAmount} readOnly />
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
};

export default SaleForm;