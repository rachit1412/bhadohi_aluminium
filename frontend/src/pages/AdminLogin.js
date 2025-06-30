import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
import axios from 'axios';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      alert('Invalid password');
    }
  };

  return (
    <div className="page">
      {/* <Navbar /> */}
      <div className="form-container">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password">Admin Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
          />
          <button type="submit">Login</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" className="btn btn-home">Go to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;