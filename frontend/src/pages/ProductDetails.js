import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`https://bhadohi-aluminium-yczh.vercel.app/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Error fetching product:', err));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <h1>{product.name}</h1>
        <div className="product-details">
          <img 
            src={`https://bhadohi-aluminium-yczh.vercel.app/${product.image}`} 
            alt={product.name} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/250?text=Image+Not+Found'; }} 
          />
          <div className="details-content">
            <h2>Product Details</h2>
            <p>{product.description}</p>
            <h2>Cost Breakdown</h2>
            <p>Material: ₹{product.cost.material}</p>
            <p>Labour: ₹{product.cost.labour}</p>
            <p>Transport: ₹{product.cost.transport}</p>
            <p>Miscellaneous: ₹{product.cost.miscellaneous}</p>
            <p><strong>Total: ₹{product.cost.total}</strong></p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" className="btn btn-home">Go to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

// http://localhost:5000 