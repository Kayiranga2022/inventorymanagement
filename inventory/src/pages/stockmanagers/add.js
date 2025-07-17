import React from 'react';
import StockManagerForm from '../../components/stockManagerForm';
  // ✅ Corrected path
import { createStockManager } from '../../services/stockManagerService';
import { useNavigate } from 'react-router-dom';

const AddStockManager = () => {
  const navigate = useNavigate();

  const handleAdd = async (formData) => {
    await createStockManager(formData);
    navigate('/stockmanagers');
  };

  return (
    <div>
      <StockManagerForm onSubmit={handleAdd} />
    </div>
  );
};

export default AddStockManager;
