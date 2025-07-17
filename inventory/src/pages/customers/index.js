import React, { useState, useEffect } from 'react';
import CustomerList from '../../components/CustomerList';  // Correct import
import { getCustomers } from '../../services/customerService'; // Correct service
import { useNavigate } from 'react-router-dom';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate(); // Used to navigate to the edit page

  // Fetch customers on page load
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  // Define the onEdit function
  const onEdit = (customer) => {
    navigate(`/customers/edit/${customer.id}`);  // Navigate to the edit page
  };

  return (
    <div>
      <CustomerList customers={customers} fetchCustomers={fetchCustomers} onEdit={onEdit} /> {/* Pass the onEdit function */}
    </div>
  );
};

export default CustomersPage;
