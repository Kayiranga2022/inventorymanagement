import React, { useState, useEffect } from 'react';
import '../styles/StockManagerForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faSave } from '@fortawesome/free-solid-svg-icons';

const StockManagerForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="stock-manager-form-container">
      <h2 className="stock-manager-form-title">{initialData ? 'Edit Stock Manager' : 'Add Stock Manager'}</h2>
      <form className="stock-manager-form" onSubmit={handleSubmit}>
        <div className="stock-manager-input-group">
          <FontAwesomeIcon icon={faUser} className="stock-manager-input-icon" />
          <input
            className="stock-manager-input"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
        </div>
        <div className="stock-manager-input-group">
          <FontAwesomeIcon icon={faUser} className="stock-manager-input-icon" />
          <input
            className="stock-manager-input"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
        </div>
        <div className="stock-manager-input-group">
          <FontAwesomeIcon icon={faUser} className="stock-manager-input-icon" />
          <input
            className="stock-manager-input"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
        </div>
        <div className="stock-manager-input-group">
          <FontAwesomeIcon icon={faLock} className="stock-manager-input-icon" />
          <input
            className="stock-manager-input"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <div className="stock-manager-input-group">
          <FontAwesomeIcon icon={faEnvelope} className="stock-manager-input-icon" />
          <input
            className="stock-manager-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <button className="stock-manager-button" type="submit">
          <FontAwesomeIcon icon={faSave} className="stock-manager-button-icon" />
          Save
        </button>
      </form>
    </div>
  );
};

export default StockManagerForm;