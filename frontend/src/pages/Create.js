import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

function Create() {
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    author: '',
    price: 0,
    type: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to login first');
        return;
      }

      await axios.post('http://localhost:8000/paintings/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Create error:', error);
      setError(error.response?.data?.detail || 'Failed to create painting');
    }
  };

  return (
    <div className="auth-container">
      <h2>Add New Painting</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="photo" placeholder="Photo URL" onChange={handleChange} required />
        <input name="author" placeholder="Author" onChange={handleChange} required />
        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          min="0"
          required
        />
        <input name="type" placeholder="Type" onChange={handleChange} required />
        <button type="submit">Add Painting</button>
      </form>
    </div>
  );
}

export default Create;
