import React, { useState, useEffect } from 'react';
import { createCustomer, updateCustomer } from '../services/customerService';
import '../styles/CustomerForm.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faSave } from '@fortawesome/free-solid-svg-icons';

const CustomerForm = ({ customer, onSave = () => {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (customer) {
        await updateCustomer(customer.id, formData);
      } else {
        await createCustomer(formData);
      }
      onSave(); // Refresh list after save
      setFormData({ name: '', email: '', phone: '', address: '' });
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  return (
    <div className="customer-form-container">
      <h2 className="form-title">{customer ? 'Edit Customer' : 'Add Customer'}</h2>
      <form onSubmit={handleSubmit} className="customer-form">
        <div className="input-group">
          <FontAwesomeIcon icon={faUser} className="input-icon" />
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Customer Name" required className="input-field" />
        </div>
        <div className="input-group">
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="input-field" />
        </div>
        <div className="input-group">
          <FontAwesomeIcon icon={faPhone} className="input-icon" />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required className="input-field" />
        </div>
        <div className="input-group">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required className="input-field" />
        </div>
        <button type="submit" className="save-button">
          <FontAwesomeIcon icon={faSave} className="button-icon" />
          Save
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;