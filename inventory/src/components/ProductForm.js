// ProductForm.js
import React, { useState } from 'react';
import '../styles/ProductForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

const ProductForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        sku: initialData.sku || '',
        quantity: initialData.quantity || 0,
        price: initialData.price || 0,
        description: initialData.description || ''
    });
    const [loading, setLoading] = useState(false); // Added loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Product form data being submitted:", formData);
        setLoading(true); // Set loading to true before submitting
        try {
            await onSubmit(formData);
            console.log("Product form submitted.");
        } catch (error) {
            console.error("Error submitting product form:", error);
            alert("Failed to submit product form. Please try again.");
        } finally {
            setLoading(false); // Set loading to false after submitting
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Display loading indicator
    }

    return (
        <div className="product-form-container">
            <form onSubmit={handleSubmit} className="product-form">
                <h2>Product Form</h2>

                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>SKU:</label>
                    <input type="text" name="sku" value={formData.sku} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Quantity:</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="submit-button">
                    <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} /> Save
                </button>
            </form>
        </div>
    );
};

export default ProductForm;