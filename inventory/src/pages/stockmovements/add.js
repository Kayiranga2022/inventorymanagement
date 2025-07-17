import React from 'react';
import StockMovementForm from '../../components/AddStockMovement';  // ✅ Extract form component
import { createStockMovement } from '../../services/stockMovementService';
import { useNavigate } from 'react-router-dom';

const AddStockMovement = () => {
  const navigate = useNavigate();

  const handleAdd = async (formData) => {
    await createStockMovement(formData); // ✅ Ensure productId is included
    navigate('/stockmovements'); // ✅ Navigate to stock movement list after saving
  };

  return (
    <div>
      <h1>Add Stock Movement</h1>
      <StockMovementForm onSubmit={handleAdd} /> {/* ✅ Use form component */}
    </div>
  );
};

export default AddStockMovement;
