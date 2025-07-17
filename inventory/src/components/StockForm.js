// StockForm.jsx
import React, { useState, useEffect } from 'react';
import { getSuppliers } from '../services/supplierService';
import { getAllProducts } from '../services/productService';
import '../styles/StockForm.css';
import PropTypes from 'prop-types';
import { createStock } from '../services/stockService';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

const StockForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        quantity: 0,
        price: 0,
        supplier: '',
        relatedProduct: '',
    });
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [fetchedSuppliers, fetchedProducts] = await Promise.all([
                    getSuppliers(),
                    getAllProducts(),
                ]);
                setSuppliers(fetchedSuppliers);
                setProducts(fetchedProducts);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load product or supplier data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const stockData = {
            name: formData.name,
            sku: formData.sku,
            quantity: formData.quantity,
            price: formData.price,
            supplier: formData.supplier ? parseInt(formData.supplier, 10) : null,
            relatedProduct: formData.relatedProduct ? parseInt(formData.relatedProduct, 10) : null,
        };

        try {
            await createStock(formData.relatedProduct, stockData);
            console.log('Stock added successfully');
            navigate('/stocks');
            setFormData({
                name: '',
                sku: '',
                quantity: 0,
                price: 0,
                supplier: '',
                relatedProduct: '',
            });
        } catch (err) {
            console.error('Error adding stock:', err);
            setError('Failed to add stock. Please try again.');
        }
    };

    if (loading) {
        return <div className="stock-form-container">
            <div className="loading-message">Loading data...</div>
        </div>;
    }

    if (error) {
        return <div className="stock-form-container">
            <div className="error-message">{error}</div>
        </div>;
    }

    return (
        <div className="stock-form-container">
            <form onSubmit={handleSubmit} className="stock-form">
                <h2>Add Stock Here</h2>

                <div className="form-group">
                    <label htmlFor="relatedProduct">Related Product:</label>
                    <select id="relatedProduct" name="relatedProduct" value={formData.relatedProduct} onChange={handleChange} required>
                        <option value="">Select Related Product</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="supplier">Supplier:</label>
                    <select id="supplier" name="supplier" value={formData.supplier} onChange={handleChange} required>
                        <option value="">Select Supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="sku">SKU:</label>
                    <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Quantity:</label>
                    <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
                </div>

                <button type="submit" className="submit-button">
                    <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} /> Save
                </button>
            </form>
        </div>
    );
};

StockForm.propTypes = {
    onStockCreated: PropTypes.func,
};

export default StockForm;