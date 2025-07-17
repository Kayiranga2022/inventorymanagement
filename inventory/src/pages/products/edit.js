import React, { useEffect, useState } from 'react';
import ProductForm from '../../components/ProductForm';
import { getProductById, updateProduct } from '../../services/productService';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const product = await getProductById(id);
                if (product) {
                    setInitialData({
                        ...product,
                        description: product.description || ''
                    });
                } else {
                    setError("Product not found");
                }
            } catch (err) {
                setError("Failed to fetch product");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleUpdate = async (formData) => {
        try {
            await updateProduct(id, formData);
            navigate('/products');
        } catch (err) {
            console.error("Error updating product:", err);
        }
    };

    return (
        <div>
            <h1>Edit Product</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {initialData && (
                <ProductForm
                    onSubmit={handleUpdate}
                    initialData={{
                        name: initialData.name || '',
                        sku: initialData.sku || '',
                        quantity: initialData.quantity || 0,
                        price: initialData.price || 0,
                        description: initialData.description || ''
                    }}
                />
            )}
        </div>
    );
};

export default EditProduct;