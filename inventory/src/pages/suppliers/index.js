import React from 'react';
import SuppliersList from "../../components/SuppliersList";
 // ✅ Check if this import exists
import AddStockPage from '../../pages/suppliers/add'; // Default import


const SuppliersPage = () => {
  return (
    <div>
      <SuppliersList /> {/* ✅ Check this component */}
    </div>
  );
};

export default SuppliersPage;
