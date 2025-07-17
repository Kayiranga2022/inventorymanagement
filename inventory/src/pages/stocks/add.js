// pages/stocks/add.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StockForm from '../../components/StockForm';

const AddStockPage = () => {
  const navigate = useNavigate();  // ✅ Redirect after saving

  const handleSave = () => {
    navigate('/stocks');  // ✅ Redirect to the stock list page
  };

  return (
    <div>
      <StockForm onSave={handleSave} />  {/* ✅ Pass onSave */}
    </div>
  );
};

export default AddStockPage;
