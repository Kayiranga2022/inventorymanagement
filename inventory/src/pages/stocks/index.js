import React from 'react';
import StockList from '../../components/StockList';
 // ✅ Check if this import exists
import AddStockPage from '../../pages/stocks/add'; // Default import


const StockPage = () => {
  return (
    <div>
      <StockList /> {/* ✅ Check this component */}
    </div>
  );
};

export default StockPage;
