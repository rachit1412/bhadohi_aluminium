import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import banner from '../assets/banner.jpg'; // Assuming you have a banner image in your assets folder

const Home = () => {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="hero">
        <img 
          src={banner} 
          alt="Company Banner" 
          onError={(e) => { 
            console.error('Banner image failed to load at /assets/banner.jpg');
            e.target.src = 'https://via.placeholder.com/1200x400?text=Banner+Not+Found'; 
          }} 
        />
        <div className="hero-content container">
          <h1>Bhadohi Aluminium Company</h1>
          <p>Premium Aluminium Doors & Panels</p>
          <div>
            <Link to="/customer" className="btn">Explore Products</Link>
          </div>
        </div>
      </div>

      <div className="products container">
        <h2>Our Products</h2>
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <p>© 2025 Bhadohi Aluminum Company. All rights reserved.</p>
          <p>Contact: +91 9839147949</p>
          <a href="https://wa.me/9839147949" target="_blank" rel="noopener noreferrer">
            WhatsApp Us
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;