import React from 'react';
import { useNavigate } from 'react-router-dom';
import SupplierForm from '../../components/SupplierForm';

const AddSupplierPage = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate('/suppliers'); // Redirect to supplier list after saving
  };

  return (
    <div>
      <SupplierForm onSave={handleSave} />
    </div>
  );
};

export default AddSupplierPage;