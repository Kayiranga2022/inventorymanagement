import { useState } from "react";
import { createTransaction } from "../../services/transactionService";

const TransactionForm = ({ onSubmit }) => {
    const [transactionData, setTransactionData] = useState({
        referenceNumber: "",
        movementType: "PURCHASE", // Default
        supplier: "",
        customer: "",
        stockManager: "",
        items: [{ productId: "", quantity: "", pricePerUnit: "" }], // Supports multiple items
        totalAmount: "",
        paymentMethod: "CASH", // Default
        paymentStatus: "UNPAID",
    });

    const handleChange = (e) => {
        setTransactionData({
            ...transactionData,
            [e.target.name]: e.target.value,
        });
    };

    const handleItemChange = (index, e) => {
        const newItems = [...transactionData.items];
        newItems[index][e.target.name] = e.target.value;
        setTransactionData({ ...transactionData, items: newItems });
    };

    const addItem = () => {
        setTransactionData({
            ...transactionData,
            items: [...transactionData.items, { productId: "", quantity: "", pricePerUnit: "" }],
        });
    };

    const removeItem = (index) => {
        const newItems = transactionData.items.filter((_, i) => i !== index);
        setTransactionData({ ...transactionData, items: newItems });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createTransaction(transactionData).then((res) => {
            onSubmit(res.data);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="referenceNumber"
                value={transactionData.referenceNumber}
                onChange={handleChange}
                placeholder="Reference Number"
                required
            />

            <select name="movementType" value={transactionData.movementType} onChange={handleChange}>
                <option value="PURCHASE">Purchase</option>
                <option value="SALE">Sale</option>
            </select>

            <input
                type="text"
                name="supplier"
                value={transactionData.supplier}
                onChange={handleChange}
                placeholder="Supplier (if purchase)"
            />

            <input
                type="text"
                name="customer"
                value={transactionData.customer}
                onChange={handleChange}
                placeholder="Customer (if sale)"
            />

            <input
                type="text"
                name="stockManager"
                value={transactionData.stockManager}
                onChange={handleChange}
                placeholder="Stock Manager"
                required
            />

            <h3>Items</h3>
            {transactionData.items.map((item, index) => (
                <div key={index}>
                    <input
                        type="text"
                        name="productId"
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="Product ID"
                        required
                    />
                    <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="Quantity"
                        required
                    />
                    <input
                        type="number"
                        name="pricePerUnit"
                        value={item.pricePerUnit}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="Price Per Unit"
                        required
                    />
                    <button type="button" onClick={() => removeItem(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={addItem}>Add Item</button>

            <input
                type="number"
                name="totalAmount"
                value={transactionData.totalAmount}
                onChange={handleChange}
                placeholder="Total Amount"
                required
            />

            <select name="paymentMethod" value={transactionData.paymentMethod} onChange={handleChange}>
                <option value="CASH">Cash</option>
                <option value="CREDIT">Credit</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>

            <select name="paymentStatus" value={transactionData.paymentStatus} onChange={handleChange}>
                <option value="FULL">Full</option>
                <option value="PARTIAL">Partial</option>
                <option value="UNPAID">Unpaid</option>
            </select>

            <button type="submit">Submit</button>
        </form>
    );
};

export default TransactionForm;
