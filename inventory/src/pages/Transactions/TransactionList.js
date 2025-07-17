// TransactionList.js
import React, { useEffect, useState } from "react";
import { fetchTransactions } from "../../services/transactionService";
import "../../styles/TransactionList.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedTransactionId, setExpandedTransactionId] = useState(null);

    const [sessionId, setSessionId] = useState("");
    const [sessionStartTime, setSessionStartTime] = useState("");
    const [sessionEndTime, setSessionEndTime] = useState("");

    useEffect(() => {
        const loadTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedTransactions = await fetchTransactions({
                    sessionId,
                    sessionStartTime: sessionStartTime || null,
                    sessionEndTime: sessionEndTime || null,
                });
                if (Array.isArray(fetchedTransactions)) {
                    setTransactions(fetchedTransactions);
                } else {
                    console.error("API did not return an array:", fetchedTransactions);
                    setError("Error: API did not return transaction array.");
                }
            } catch (err) {
                console.error("Error fetching transactions:", err);
                setError("Error fetching transactions. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, [sessionId, sessionStartTime, sessionEndTime]);

    const toggleTransactionItems = (transactionId) => {
        setExpandedTransactionId(
            expandedTransactionId === transactionId ? null : transactionId
        );
    };

    if (loading) {
        return <div className="loading-message">Loading transactions...</div>;
    }

        if (error) {
            return <div className="error-message">{error}</div>;
        }
        
        if (!transactions || transactions.length === 0) {
            return <div>No transactions found.</div>;
        }
        
        return (
            <div className="transaction-list-container">
                <h2 className="transaction-list-title">Transaction History</h2>
        
                <div className="filter-inputs">
                    <input
                        type="text"
                        placeholder="Session ID"
                        value={sessionId}
                        onChange={(e) => setSessionId(e.target.value)}
                    />
                    <input
                        type="datetime-local"
                        placeholder="Session Start Time"
                        value={sessionStartTime}
                        onChange={(e) => setSessionStartTime(e.target.value)}
                    />
                    <input
                        type="datetime-local"
                        placeholder="Session End Time"
                        value={sessionEndTime}
                        onChange={(e) => setSessionEndTime(e.target.value)}
                    />
                </div>
        
                <div className="transaction-buttons">
                    <Link to="/transactions/add/sale" className="sale-button">
                        <FontAwesomeIcon icon={faPlusCircle} className="button-icon" /> Sales
                    </Link>
                    <Link to="/transactions/add/purchase" className="purchase-button">
                        <FontAwesomeIcon icon={faPlusCircle} className="button-icon" /> Purchases
                    </Link>
                </div>
        
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Movement Type</th>
                            <th>Reference Number</th>
                            <th>Supplier</th>
                            <th>Customer</th>
                            <th>Stock Manager</th>
                            <th>Timestamp</th>
                            <th>Payment Status</th>
                            <th>Total Amount</th>
                            <th>Amount Paid</th>
                            <th>Session ID</th>
                            <th>Session Start Time</th>
                            <th>Session End Time</th>
                            <th>Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <React.Fragment key={transaction.id}>
                                <tr>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.movementType}</td>
                                    <td>{transaction.referenceNumber}</td>
                                    <td>{transaction.supplier?.name || "N/A"}</td>
                                    <td>{transaction.customer?.name || "N/A"}</td>
                                    <td>{transaction.stockManager?.username || "N/A"}</td>
                                    <td>{transaction.timestamp}</td>
                                    <td>{transaction.paymentStatus}</td>
                                    <td>{transaction.totalAmount}</td>
                                    <td>{transaction.amountPaid}</td>
                                    <td>{transaction.sessionId}</td>
                                    <td>{transaction.sessionStartTime}</td>
                                    <td>{transaction.sessionEndTime}</td>
                                    <td>
                                        <button
                                            onClick={() => toggleTransactionItems(transaction.id)}
                                            data-expanded={expandedTransactionId === transaction.id}
                                        >
                                            <FontAwesomeIcon
                                                icon={expandedTransactionId === transaction.id ? faEyeSlash : faEye}
                                                className="eye-icon"
                                            />
                                            {expandedTransactionId === transaction.id
                                                ? " Hide Items"
                                                : " View Items"}
                                        </button>
                                    </td>
                                </tr>
                                {expandedTransactionId === transaction.id && (
                                    <tr>
                                        <td colSpan="14">
                                            <table className="transaction-items-table">
                                                <thead>
                                                    <tr>
                                                        <th>Item ID</th>
                                                        <th>Stock ID</th>
                                                        <th>Quantity</th>
                                                        <th>Price Per Unit</th>
                                                        <th>Total Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transaction.items && transaction.items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>{item.id}</td>
                                                            <td>{item.stock.id}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.pricePerUnit}</td>
                                                            <td>{item.pricePerUnit * item.quantity}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        );
        };
        export default TransactionList;