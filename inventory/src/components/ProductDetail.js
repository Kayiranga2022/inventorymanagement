import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import '../styles/ProductDetail.css'; // Import CSS

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id).then(response => setProduct(response.data));
  }, [id]);

  if (!product) return <div className="product-detail-container">Loading...</div>;

  return (
    <div className="product-detail-container">
      <h1>{product.name}</h1>
      <p><strong>SKU:</strong> {product.sku}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Quantity:</strong> {product.quantity}</p>
      <p><strong>Min Stock Threshold:</strong> {product.minStockThreshold}</p>
    </div>
  );
};

export default ProductDetail;
