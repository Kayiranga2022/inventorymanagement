import React, { useState, useEffect } from 'react';
import { Descriptions, Spin, notification } from 'antd';
import { useParams } from 'react-router-dom';
import customerService from './customerService';

const CustomerDetail = () => {
  const [customer, setCustomer] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customerService.getCustomer(id);
        setCustomer(data);
      } catch (error) {
        notification.error({ message: 'Failed to fetch customer details!' });
      }
    };
    fetchCustomer();
  }, [id]);

  if (!customer) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <h2>Customer Details</h2>
      <Descriptions bordered>
        <Descriptions.Item label="Name">{customer.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default CustomerDetail;