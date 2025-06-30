import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <h1>About Bhadohi Aluminium</h1>
        <p style={{ fontSize: '1.2rem', color: '#4a5568', marginBottom: '1.5rem' }}>
          Bhadohi Aluminium Company is a leading provider of high-quality aluminium doors and panels. 
          With over a decade of expertise, we are committed to delivering durable, aesthetically pleasing, 
          and innovative solutions tailored to your needs. Our mission is to combine craftsmanship with 
          modern design to enhance the beauty and functionality of your spaces.
        </p>
        <p style={{ fontSize: '1.2rem', color: '#4a5568' }}>
          Our team of skilled professionals ensures every product meets the highest standards of quality 
          and precision. Whether you're looking for sleek doors or custom panels, we have the perfect 
          solution for you. Contact us today to learn more about our offerings!
        </p>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" className="btn btn-home">Go to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default About;