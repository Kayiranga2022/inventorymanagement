import React, { useEffect, useState } from 'react';
import StockManagerForm from '../../components/stockManagerForm';  // ✅ Corrected path
import { getStockManagerById, updateStockManager } from '../../services/stockManagerService';
import { useParams, useNavigate } from 'react-router-dom';

const EditStockManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getStockManagerById(id);
      setInitialData(data);
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (formData) => {
    await updateStockManager(id, formData);
    navigate('/stockmanagers');
  };

  return (
    <div>
      <h1>Edit Stock Manager</h1>
      {initialData ? <StockManagerForm onSubmit={handleUpdate} initialData={initialData} /> : <p>Loading...</p>}
    </div>
  );
};

export default EditStockManager;
