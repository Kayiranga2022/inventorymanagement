import React, { useState, useEffect } from "react";
import { getStocks, deleteStock } from "../services/stockService";
import '../styles/StockList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCheckCircle, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

const API_URL = "http://localhost:8080/api/";

const StockList = ({ stocksUpdated, setStocksUpdated = () => {} }) => {
    const [stocks, setStocks] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [customers, setCustomers] = useState([]);
    const [stockManagers, setStockManagers] = useState([]);
    const [customer, setCustomer] = useState("");
    const [stockManager, setStockManager] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [paymentStatus, setPaymentStatus] = useState("UNPAID");
    const [amountPaid, setAmountPaid] = useState(0);

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
                const [customersRes, stockManagersRes] = await Promise.all([
                    axios.get(`${API_URL}customers/all`, getAuthHeaders()),
                    axios.get(`${API_URL}stock-managers/all`, getAuthHeaders()),
                ]);
                setCustomers(customersRes.data);
                console.log("Stock Managers Data:", stockManagersRes.data);
                setStockManagers(stockManagersRes.data);
                await fetchStocks();
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [stocksUpdated]);

    const fetchStocks = async () => {
        try {
            const data = await getStocks();
            console.log("Fetched stocks:", data);
            setStocks(data);
            setStocksUpdated(false);
        } catch (error) {
            console.error("Error fetching stocks", error);
            setError("Failed to load stocks. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteStock(id);
            fetchStocks();
        } catch (error) {
            console.error("Error deleting stock", error);
            setError("Failed to delete stock.");
        }
    };

    const addToCart = (stock) => {
        const existingItem = cart.find((item) => item.id === stock.id);
        if (existingItem) {
            const updatedCart = cart.map((item) =>
                item.id === stock.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...stock, quantity: 1 }]);
        }
    };

    const removeFromCart = (stockId) => {
        const updatedCart = cart.filter((item) => item.id !== stockId);
        setCart(updatedCart);
    };

    const changeQuantity = (stockId, newQuantity) => {
        const updatedCart = cart.map((item) =>
            item.id === stockId ? { ...item, quantity: parseInt(newQuantity, 10) } : item
        );
        setCart(updatedCart);
    };

    useEffect(() => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setCartTotal(total);
    }, [cart]);

    const generateInvoicePDF = (cart, cartTotal, customer, stockManager, paymentMethod, paymentStatus, amountPaid) => {
        const doc = new jsPDF();
        doc.text("Invoice", 10, 10);

        doc.text(`Customer: ${customer?.name || "N/A"}`, 10, 20);
        doc.text(`Stock Manager: ${stockManager?.firstName + " " + stockManager?.lastName || "N/A"}`, 10, 30);
        doc.text(`Payment Method: ${paymentMethod}`, 10, 40);
        doc.text(`Payment Status: ${paymentStatus}`, 10, 50);
        doc.text(`Amount Paid: rwf${amountPaid.toFixed(2)}`, 10, 60);

        let y = 70;
        cart.forEach((item) => {
            doc.text(
                `Item: ${item.name}, Quantity: <span class="math-inline">\{item\.quantity\}, Price\: rwf</span>{item.price.toFixed(2)}`,
                10,
                y
            );
            y += 10;
        });

        doc.text(`Total Amount: rwf${cartTotal.toFixed(2)}`, 10, y + 10);
        doc.save("invoice.pdf");
    };

    const handleCheckout = async () => {
        try {
            const customerData = customers.find(c => c.id === parseInt(customer, 10));
            const stockManagerData = stockManagers.find(sm => sm.id === parseInt(stockManager, 10));

            const transactionData = {
                movementType: "SALE",
                customerId: parseInt(customer, 10),
                stockManagerId: parseInt(stockManager, 10),
                paymentMethod,
                items: cart.map((item) => ({
                    stockId: item.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    pricePerUnit: item.price,
                })),
                paymentStatus,
                amountPaid: parseFloat(amountPaid),
            };
            await axios.post(`${API_URL}transactions`, transactionData, getAuthHeaders());
            generateInvoicePDF(cart, cartTotal, customerData, stockManagerData, paymentMethod, paymentStatus, parseFloat(amountPaid));

            setCart([]);
            setCartTotal(0);
            setCustomer("");
            setStockManager("");
            setPaymentMethod("CASH");
            setPaymentStatus("UNPAID");
            setAmountPaid(0);
        } catch (error) {
            console.error("Error creating sale:", error);
            setError("Failed to create sale. Please try again.");
        }
    };

    if (loading) {
        return <div className="loading-message"><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="stock-list-container">
            <div className="stock-list-header">
                <h1>Stock List</h1>
                <Link to="/stocks/add" className="add-stock-link">Add Stock</Link>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Supplier</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.length > 0 ? (
                        stocks.map((stock) => (
                            <tr key={stock.id}>
                                <td>{stock.name}</td>
                                <td>{stock.sku}</td>
                                <td>{stock.quantity}</td>
                                <td>{stock.price}</td>
                                <td>{stock.supplier}</td>
                                <td>
                                    <button className="cart-btn" onClick={() => addToCart(stock)}>Add to Cart</button>
                                    <button className="delete-btn" onClick={() => handleDelete(stock.id)}>
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>No stocks available</td>
                        </tr>
                    )}
                </tbody>
                </table>

                <div className="cart-icon" onClick={() => setIsCartOpen(!isCartOpen)}> <FontAwesomeIcon icon={faShoppingCart} size="2x" />
                </div>

                {isCartOpen && (
                    <div className="cart-container expanded">
                        <h2>Cart</h2>
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <span>{item.name}</span>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => changeQuantity(item.id, e.target.value)}
                                    min="1"
                                />
                                <span>rwf{(item.price * item.quantity).toFixed(2)}</span>
                                <button className="remove-cart-btn" onClick={() => removeFromCart(item.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))}
                        <p className="cart-total">Total: rwf{cartTotal.toFixed(2)}</p>
                        <div className="checkout-fields">
                            <select value={customer} onChange={(e) => setCustomer(e.target.value)}>
                                <option value="">Select Customer</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <select value={stockManager} onChange={(e) => setStockManager(e.target.value)}>
                                <option value="">Select Stock Manager</option>
                                {stockManagers.length > 0 && stockManagers.map((sm) => (
                                    <option key={sm.id} value={sm.id}>
                                        {`${sm.firstName} ${sm.lastName}`}
                                    </option>
                                ))}
                            </select>
                            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="CASH">Cash</option>
                                <option value="CREDIT">Credit</option>
                                <option value="DEBIT">Debit</option>
                            </select>
                            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                                <option value="FULL">Full</option>
                                <option value="UNPAID">UnPaid</option>
                                <option value="PARTIAL">Partially Paid</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Amount Paid"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                            />
                        </div>
                        <button className="checkout-btn" onClick={handleCheckout}>
                            <FontAwesomeIcon icon={faCheckCircle} /> Checkout
                        </button>
                    </div>
                )}
            </div>
        );
    };

    export default StockList;