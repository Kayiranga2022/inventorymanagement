const TransactionItem = ({ transaction }) => {
    return (
        <div>
            <p>{transaction.referenceNumber} - {transaction.movementType}</p>
        </div>
    );
};

export default TransactionItem