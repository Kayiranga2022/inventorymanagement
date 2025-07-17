import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { Link } from 'react-router-dom';
import { getSuppliers, deleteSupplier } from '../services/supplierService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/SupplierList.css'; // Import your CSS file

const SuppliersList = () => {
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const data = await getSuppliers();
                setSuppliers(data);
            } catch (error) {
                console.error('Error fetching suppliers', error);
            }
        };

        fetchSuppliers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteSupplier(id);
            setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
        } catch (error) {
            console.error('Error deleting supplier', error);
        }
    };

    const columns = [
        {
            title: 'Supplier Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Link to={`/supplier/${record.id}`} className="suppliers-view-link">
                        <Button type="primary" style={{ marginRight: 8 }} className="suppliers-view-button">
                            <FontAwesomeIcon icon={faEye} className="suppliers-action-icon" /> View
                        </Button>
                    </Link>
                    <Button type="danger" onClick={() => handleDelete(record.id)} className="suppliers-delete-button">
                        <FontAwesomeIcon icon={faTrashAlt} className="suppliers-action-icon" /> Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className="suppliers-list-container">
            <div className="suppliers-list-header">
                <h2>Supplier List</h2>
                <Link to="/suppliers/add" className="suppliers-add-link">
                    <Button type="primary" className="suppliers-add-button">
                        <FontAwesomeIcon icon={faPlus} className="suppliers-action-icon" /> Add Supplier
                    </Button>
                </Link>
            </div>
            <Table columns={columns} dataSource={suppliers} rowKey="id" />
        </div>
    );
};

export default SuppliersList;