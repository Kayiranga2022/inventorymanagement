import React, { useEffect, useState } from 'react';
import CustomerForm from '../../components/CustomerForm';
import { getCustomerById, updateCustomer } from '../../services/customerService';
import { useParams, useNavigate } from 'react-router-dom';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customer = await getCustomerById(id);
        if (customer) {
          setInitialData(customer);
        } else {
          setError("Customer not found");
        }
      } catch (err) {
        setError("Failed to fetch customer");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await updateCustomer(id, formData);
      navigate('/customers');
    } catch (err) {
      console.error("Error updating customer:", err);
    }
  };

  return (
    <div>
      <h1>Edit Customer</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {initialData && (
        <CustomerForm
          onSubmit={handleUpdate}
          initialData={{
            name: initialData.name || '',
            email: initialData.email || '',
            phone: initialData.phone || '',
            address: initialData.address || '',
          }} // Ensures default values
        />
      )}
    </div>
  );
};

export default EditCustomer;
