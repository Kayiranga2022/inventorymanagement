import React from 'react';
import CustomerForm from '../../components/CustomerForm'; // ✅ Default Import
import { createCustomer } from '../../services/customerService';
import { useNavigate } from 'react-router-dom';

const AddCustomer = () => {
  const navigate = useNavigate();

  const handleAdd = async (formData) => {
    await createCustomer(formData);
    navigate('/customers');
  };

  return (
    <div>
      <CustomerForm onSubmit={handleAdd} />
    </div>
  );
};

export default AddCustomer;
