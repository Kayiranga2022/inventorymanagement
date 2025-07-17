import React, { useState, useEffect } from 'react';
import ProductList from '../../components/ProductList';  // Correct import
import { getAllProducts } from '../../services/productService'; // Correct service
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Used to navigate to the edit page

  // Fetch products on page load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // Define the onEdit function
  const onEdit = (product) => {
    navigate(`/products/edit/${product.id}`);  // Navigate to the edit page
  };

  return (
    <div>
      <ProductList products={products} fetchProducts={fetchProducts} onEdit={onEdit} /> {/* Pass the onEdit function */}
    </div>
  );
};

export default ProductsPage;
