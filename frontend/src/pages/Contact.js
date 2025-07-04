import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Contact = () => {
  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <h1>Contact Us</h1>
        <p style={{ fontSize: '1.2rem', color: '#4a5568', marginBottom: '1.5rem' }}>
          We'd love to hear from you! Reach out to us for inquiries, custom orders, or support.
        </p>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#1a202c' }}>Get in Touch</h3>
          <p><strong>Phone:</strong> +91 9839147949</p>
          <p><strong>Email:</strong> rachit.rugscarpet@gmail.com</p>
          <p><strong>Address:</strong> Mamdevpur Road, Maryad Patti, Bhadohi, 221401, India </p>
          <p>
            <a href="https://wa.me/9839147949" target="_blank" rel="noopener noreferrer" style={{ color: '#38a169', textDecoration: 'none' }}>
              WhatsApp Us
            </a>
          </p>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#1a202c' }}>Contact Persons</h3>
          <p><strong>Name:</strong> Sanjay Jaiswal <br /><strong>Phone:</strong> +91 9839147949</p>
          <p>
            <a href="https://wa.me/9839147949" target="_blank" rel="noopener noreferrer" style={{ color: '#38a169', textDecoration: 'none' }}>
              WhatsApp Sanjay
            </a>
          </p>
          <p><strong>Name:</strong> Vijay Jaiswal <br /><strong>Phone:</strong> +91 7754004012</p>
          <p>
            <a href="https://wa.me/7754004012" target="_blank" rel="noopener noreferrer" style={{ color: '#38a169', textDecoration: 'none' }}>
              WhatsApp Vijay
            </a>
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="btn btn-home">Go to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;