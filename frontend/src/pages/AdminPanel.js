import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    image: null,
    cost: { material: '', labour: '', transport: '', miscellaneous: '' }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/admin/login');
      return;
    }

    axios.get('https://bhadohi-aluminium-yczh.vercel.app/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log('Fetched products:', res.data);
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Error fetching products:', err.response?.data || err.message);
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { id, name, description, cost } = form;
    if (!name || !description || !cost.material || !cost.labour || !cost.transport || !cost.miscellaneous) {
      setError('All fields (name, description, and costs) are required');
      console.log('Form validation failed:', { name, description, cost });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in again');
      navigate('/admin/login');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (form.image) formData.append('image', form.image);
    formData.append('cost', JSON.stringify({
      material: Number(cost.material),
      labour: Number(cost.labour),
      transport: Number(cost.transport),
      miscellaneous: Number(cost.miscellaneous)
    }));

    for (let [key, value] of formData.entries()) {
      console.log(`FormData ${key}:`, value);
    }

    try {
      if (id) {
        const res = await axios.put(`https://bhadohi-aluminium-yczh.vercel.app/api/products/${id}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Product updated successfully!');
        setProducts(products.map(p => (p._id === id ? res.data : p)));
      } else {
        const res = await axios.post('https://bhadohi-aluminium-yczh.vercel.app/api/products', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Product added successfully!');
        setProducts([...products, res.data]);
      }
      setForm({ 
        id: null,
        name: '', 
        description: '', 
        image: null, 
        cost: { material: '', labour: '', transport: '', miscellaneous: '' } 
      });
      document.getElementById('image-input').value = '';
    } catch (err) {
      const errorMsg = err.response?.data?.message || (id ? 'Failed to update product' : 'Failed to add product');
      setError(errorMsg);
      console.error('Error:', err.response?.data || err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product._id,
      name: product.name,
      description: product.description,
      image: null,
      cost: { 
        material: product.cost.material.toString(),
        labour: product.cost.labour.toString(),
        transport: product.cost.transport.toString(),
        miscellaneous: product.cost.miscellaneous.toString()
      }
    });
    setSuccess('');
    setError('');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in again');
      navigate('/admin/login');
      return;
    }

    try {
      await axios.delete(`https://bhadohi-aluminium-yczh.vercel.app/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Product deleted successfully!');
      setProducts(products.filter(p => p._id !== id));
      console.log('Product deleted:', id);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete product';
      setError(errorMsg);
      console.error('Error deleting product:', err.response?.data || err.message);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <h1>Admin Panel</h1>
        {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: '500' }}>{error}</p>}
        {success && <p style={{ color: '#38a169', textAlign: 'center', fontWeight: '500' }}>{success}</p>}
        <form onSubmit={handleSubmit} className="form-container">
          <label htmlFor="name">Product Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter product description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label htmlFor="image-input">Product Image (JPEG/PNG)</label>
          <input
            id="image-input"
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
          <label htmlFor="material-cost">Material Cost (₹)</label>
          <input
            id="material-cost"
            type="number"
            placeholder="Enter material cost"
            value={form.cost.material}
            onChange={(e) => setForm({ ...form, cost: { ...form.cost, material: e.target.value } })}
          />
          <label htmlFor="labour-cost">Labour Cost (₹)</label>
          <input
            id="labour-cost"
            type="number"
            placeholder="Enter labour cost"
            value={form.cost.labour}
            onChange={(e) => setForm({ ...form, cost: { ...form.cost, labour: e.target.value } })}
          />
          <label htmlFor="transport-cost">Transport Cost (₹)</label>
          <input
            id="transport-cost"
            type="number"
            placeholder="Enter transport cost"
            value={form.cost.transport}
            onChange={(e) => setForm({ ...form, cost: { ...form.cost, transport: e.target.value } })}
          />
          <label htmlFor="miscellaneous-cost">Miscellaneous Cost (₹)</label>
          <input
            id="miscellaneous-cost"
            type="number"
            placeholder="Enter miscellaneous cost"
            value={form.cost.miscellaneous}
            onChange={(e) => setForm({ ...form, cost: { ...form.cost, miscellaneous: e.target.value } })}
          />
          <button type="submit">{form.id ? 'Update Product' : 'Add Product'}</button>
        </form>
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <Link to="/" className="btn btn-home">Go to Home</Link>
        </div>
        <div className="product-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img 
                src={`https://bhadohi-aluminium-yczh.vercel.app/${product.image}`} 
                alt={product.name} 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/250?text=Image+Not+Found'; }} 
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Material: ₹{product.cost.material}</p>
              <p>Labour: ₹{product.cost.labour}</p>
              <p>Transport: ₹{product.cost.transport}</p>
              <p>Miscellaneous: ₹{product.cost.miscellaneous}</p>
              <p>Total: ₹{product.cost.total}</p>
              <div className="btn-group">
                <button className="edit" onClick={() => handleEdit(product)}>
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  Edit
                </button>
                <button className="delete" onClick={() => handleDelete(product._id)}>
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;