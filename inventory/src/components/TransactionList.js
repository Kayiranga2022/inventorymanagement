{/*
import { useEffect, useState } from "react";
import { fetchTransactions } from "../../services/TransactionService";
import TransactionItem from "../pages/Transactions/TransactionItem";

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchTransactions().then(setTransactions);
    }, []);

    return (
        <div>
            {transactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
        </div>
    );
};

export default TransactionList;
*/}