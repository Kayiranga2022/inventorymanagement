// ProductList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteProduct, getProductBySku, getAllProducts } from '../services/productService';
import '../styles/ProductList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const ProductList = ({ fetchProducts, onEdit }) => {
    const navigate = useNavigate();
    const [searchSku, setSearchSku] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true); // Set loading to true before fetching
                const products = await getAllProducts();
                setAllProducts(products);
                setFilteredProducts(products);
            } catch (error) {
                console.error('Error fetching all products', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchAllProducts();
    }, []);

    const handleDelete = async (id) => {
        try {
            setLoading(true); // Set loading to true before deleting
            await deleteProduct(id);
            fetchProducts();
            const updatedProducts = allProducts.filter(product => product.id !== id);
            setAllProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
        } catch (error) {
            console.error('Error deleting product', error);
        } finally {
            setLoading(false); // Set loading to false after deleting
        }
    };

    const handleSearch = async () => {
        if (searchSku.trim() === '') {
            setFilteredProducts(allProducts);
            return;
        }

        try {
            setLoading(true); // Set loading to true before searching
            const product = await getProductBySku(searchSku);
            if (product) {
                setFilteredProducts([product]);
            } else {
                setFilteredProducts([]);
                alert('Product not found.');
            }
        } catch (error) {
            console.error('Error searching product by SKU', error);
            setFilteredProducts([]);
            alert('Error occurred during search.');
        } finally {
            setLoading(false); // Set loading to false after searching
        }
    };

    const handleReset = () => {
        setSearchSku('');
        setFilteredProducts(allProducts);
    };

    const handleAddProductClick = () => {
        console.log("Add Product button clicked.");
        navigate('/products/add');
    };

    if (loading) {
        return <div>Loading...</div>; // Display loading indicator
    }

    return (
        <div className="productListContainer">
            <h1>Products</h1>

            <div className="searchContainer">
                <input
                    type="text"
                    placeholder="Search by SKU"
                    value={searchSku}
                    onChange={(e) => setSearchSku(e.target.value)}
                />
                <button className="searchButton" onClick={handleSearch}>
                    <FontAwesomeIcon icon={faSearch} className="icon" />
                    Search
                </button>
                <button className="resetButton" onClick={handleReset}>
                    <FontAwesomeIcon icon={faTimes} className="icon" />
                    Reset
                </button>
            </div>

            <button className="addProductButton" onClick={handleAddProductClick}>
                <FontAwesomeIcon icon={faPlus} className="icon" />
                Add Product
            </button>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.sku}</td>
                                <td>{product.quantity}</td>
                                <td>{product.price}</td>
                                <td>{product.description}</td>
                                <td>
                                    <button className="editButton" onClick={() => onEdit(product)}>
                                        <FontAwesomeIcon icon={faEdit} className="icon" />
                                        Edit
                                    </button>
                                    <button className="deleteButton" onClick={() => handleDelete(product.id)}>
                                        <FontAwesomeIcon icon={faTrash} className="icon" />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No products found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;