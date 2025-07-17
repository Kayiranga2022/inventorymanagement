import React from 'react';
import ProductForm from '../../components/ProductForm';
import { createProduct } from '../../services/productService';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();

  const handleAdd = async (formData) => {
    await createProduct(formData);
    navigate('/products');
  };

  return (
    <div>
      <ProductForm onSubmit={handleAdd} />
    </div>
  );
};

export default AddProduct;
