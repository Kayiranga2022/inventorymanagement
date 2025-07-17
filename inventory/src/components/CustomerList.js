import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { Link } from 'react-router-dom';
import { getCustomers } from '../services/customerService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import '../styles/CustomerList.css'; // Import your CSS file

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            const data = await getCustomers();
            setCustomers(data);
        };

        fetchCustomers();
    }, []);

    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Link to={`/customer/${record.id}`} className="customers-view-link">
                    <Button type="primary" className="customers-view-button">
                        <FontAwesomeIcon icon={faEye} className="customers-action-icon" /> View
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <div className="customers-list-container">
            <div className="customers-list-header">
                <h2>Customer List</h2>
                <Link to="/customers/add" className="customers-add-link">
                    <Button type="primary" className="customers-add-button">
                        <FontAwesomeIcon icon={faPlus} className="customers-action-icon" /> Add Customer
                    </Button>
                </Link>
            </div>
            <Table columns={columns} dataSource={customers} rowKey="id" />
        </div>
    );
};

export default CustomerList;