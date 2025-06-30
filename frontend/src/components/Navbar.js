import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">Bhadohi Aluminium</Link>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          &#9776;
        </div>
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" onClick={toggleMenu}>Home</Link>
          <Link to="/about" onClick={toggleMenu}>About</Link>
          <Link to="/contact" onClick={toggleMenu}>Contact</Link>
          <Link to="/customer" onClick={toggleMenu}>Customer Panel</Link>
          <Link to="/admin/login" onClick={toggleMenu}>Switch to Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;