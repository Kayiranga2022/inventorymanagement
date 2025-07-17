import React, { useState, useEffect } from "react";
import { createSupplier, updateSupplier } from "../services/supplierService";
import "../styles/SupplierForm.css"; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

const SupplierForm = ({ supplier, onSave = () => {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (supplier) {
        await updateSupplier(supplier.id, formData);
      } else {
        await createSupplier(formData);
      }
      onSave(); // Refresh list after save
      setFormData({ name: "", phone: "", email: "", address: "" });
    } catch (error) {
      console.error("Error saving supplier:", error);
    }
  };

  return (
    <div className="supplier-form-container">
      <h2 className="form-title">
        {supplier ? "Edit Supplier" : "Add Supplier"}
      </h2>
      <form onSubmit={handleSubmit} className="supplier-form">
        <div className="input-group">
          <FontAwesomeIcon icon={faUser} className="input-icon" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Supplier Name"
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <FontAwesomeIcon icon={faPhone} className="input-icon" />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-field"
          />
        </div>
        <div className="input-group">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="save-button">
          <FontAwesomeIcon icon={faSave} className="button-icon" />
          Save
        </button>
      </form>
    </div>
  );
};

export default SupplierForm;