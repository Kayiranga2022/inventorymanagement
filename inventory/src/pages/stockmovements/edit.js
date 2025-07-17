import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStockMovementById, updateStockMovement, getAllCustomers, getAllSuppliers } from '../../services/stockMovementService';

const EditStockMovementPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    stockId: '',
    movementType: '',
    quantity: '',
    stockManagerId: '',
    supplierId: '',
    customerId: '',
    isPaid: false
  });
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovement();
    fetchSuppliers();
    fetchCustomers();
  }, [id]);

  const fetchMovement = async () => {
    try {
      const { data } = await getStockMovementById(id);
      setFormData({
        stockId: data.stock.id,
        movementType: data.movementType,
        quantity: data.quantity,
        stockManagerId: data.stockManager.id,
        supplierId: data.supplier ? data.supplier.id : '',
        customerId: data.customer ? data.customer.id : '',
        isPaid: data.isPaid || false
      });
    } catch (error) {
      console.error("Error fetching stock movement:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data } = await getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data } = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStockMovement(id, formData);
      navigate('/stockmovements');
    } catch (error) {
      console.error("Error updating stock movement:", error);
    }
  };

  return (
    <div>
      <h1>Edit Stock Movement</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="stockId" value={formData.stockId} onChange={handleChange} required />
        <select name="movementType" value={formData.movementType} onChange={handleChange}>
          <option value="PURCHASE">Purchase</option>
          <option value="SALE">Sale</option>
          <option value="TRANSFER">Transfer</option>
          <option value="RETURN">Return</option>
        </select>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
        <input type="text" name="stockManagerId" value={formData.stockManagerId} onChange={handleChange} required />
        
        <select name="supplierId" value={formData.supplierId} onChange={handleChange}>
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
          ))}
        </select>
        
        <select name="customerId" value={formData.customerId} onChange={handleChange}>
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>{customer.name}</option>
          ))}
        </select>

        <label>
          <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleChange} />
          Paid
        </label>

        <button type="submit">Update Movement</button>
      </form>
    </div>
  );
};

export default EditStockMovementPage;
