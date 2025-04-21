import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

function Auth() {
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    role: 'user',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/auth/register', {
        ...formData,
        role: formData.role // Отправляем role как строку
      });
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <select name="role" onChange={handleChange} value={formData.role}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      {message && <p className="message">{message}</p>}
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Auth;
