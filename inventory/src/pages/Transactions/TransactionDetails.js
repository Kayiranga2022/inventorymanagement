// src/components/Transactions/TransactionDetails.js
import { useEffect, useState } from "react";
import { getTransactionById } from "../../services/transactionService";

const TransactionDetails = ({ transactionId }) => {
    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
        getTransactionById(transactionId).then((res) => setTransaction(res.data));
    }, [transactionId]);

    if (!transaction) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Transaction Details</h2>
            <p><strong>Reference:</strong> {transaction.referenceNumber}</p>
            <p><strong>Type:</strong> {transaction.movementType}</p>
            <p><strong>Total Amount:</strong> {transaction.totalAmount}</p>
            <p><strong>Payment Status:</strong> {transaction.paymentStatus}</p>
            <h3>Items</h3>
            <ul>
                {transaction.items.map((item) => (
                    <li key={item.id}>
                        {item.productName} - {item.quantity} x {item.pricePerUnit} = {item.totalPrice}
                    </li>
                ))}
            </ul>
            <button>Mark as Paid</button>
        </div>
    );
};

export default TransactionDetails;
