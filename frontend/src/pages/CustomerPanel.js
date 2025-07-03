import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const CustomerPanel = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://bhadohi-aluminium-yczh.vercel.app/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <h1>Customer Panel</h1>
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" className="btn btn-home">Go to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerPanel;