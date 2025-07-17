import React, { useState, useEffect } from 'react';
import { createStockMovement, getAllCustomers, getAllSuppliers } from '../services/stockMovementService';
import { useNavigate } from 'react-router-dom';
import '../styles/AddStockMovement.css';

const AddStockMovement = () => {
  const [formData, setFormData] = useState({
    productId: "",
    stockId: '',
    movementType: 'PURCHASE',
    quantity: '',
    stockManagerId: '',
    supplierId: '',
    customerId: '',
    isPaid: false
  });

  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
    fetchSuppliers();
  }, []);
  
  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers(); // Updated function name
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  
  const fetchSuppliers = async () => {
    try {
      const data = await getAllSuppliers(); // Updated function name
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStockMovement(formData);
      navigate('/stockmovements');
    } catch (error) {
      console.error("Error saving stock movement:", error.response?.data || error.message);
    }
  };

  return (
    <div className="add-stock-movement-container">
      <h1 className="add-stock-movement-title">Add Stock Movement</h1>
      <form className="add-stock-movement-form" onSubmit={handleSubmit}>
        <input type="text" name="productId" value={formData.productId} onChange={handleChange} placeholder="Enter Product ID" required className="add-stock-movement-input" />
        <input type="text" name="stockId" value={formData.stockId} onChange={handleChange} placeholder="Stock ID" required className="add-stock-movement-input" />
        <select name="movementType" value={formData.movementType} onChange={handleChange} className="add-stock-movement-input">
          <option value="PURCHASE">Purchase</option>
          <option value="SALE">Sale</option>
          <option value="TRANSFER">Transfer</option>
          <option value="RETURN">Return</option>
        </select>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" required className="add-stock-movement-input" />
        <input type="text" name="stockManagerId" value={formData.stockManagerId} onChange={handleChange} placeholder="Stock Manager ID" required className="add-stock-movement-input" />
        <select name="supplierId" value={formData.supplierId} onChange={handleChange} className="add-stock-movement-input">
          <option value="">Select Supplier</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id}>{supplier.username}</option>
          ))}
        </select>
        <select name="customerId" value={formData.customerId} onChange={handleChange} className="add-stock-movement-input">
          <option value="">Select Customer</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>{customer.username}</option>
          ))}
        </select>
        <label>
          <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleChange} /> Is Paid?
        </label>
        <button type="submit" className="add-stock-movement-button">Submit</button>
      </form>
    </div>
  );
};

export default AddStockMovement;