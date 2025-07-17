import React, { useEffect, useState } from 'react';
import SupplierForm from '../../components/SupplierForm'; // Import the supplier form component
import { getSupplierById, updateSupplier } from '../../services/supplierService'; // Assuming you have a service for suppliers
import { useParams, useNavigate } from 'react-router-dom';

const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplier = await getSupplierById(id); // Fetch the supplier data
        if (supplier) {
          setInitialData(supplier); // Set initial data if the supplier exists
        } else {
          setError("Supplier not found");
        }
      } catch (err) {
        setError("Failed to fetch supplier");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await updateSupplier(id, formData); // Update the supplier
      navigate('/suppliers'); // Redirect to the suppliers list page after successful update
    } catch (err) {
      console.error("Error updating supplier:", err);
    }
  };

  return (
    <div>
      <h1>Edit Supplier</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {initialData && (
        <SupplierForm
          onSubmit={handleUpdate}
          initialData={{
            name: initialData.name || '',
            email: initialData.email || '',
            phone: initialData.phone || '',
            address: initialData.address || '',
          }} // Ensures default values for the form
        />
      )}
    </div>
  );
};

export default EditSupplier;
