import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'
import API from '../../api';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      // Store username in localStorage
      localStorage.setItem('username', formData.username);

      alert('Login successful!');
      if (data.redirectTo) {
        window.location.href = data.redirectTo;
      } else {
        window.location.href = '/';
      }
    } else {
      alert(data.message || 'Invalid credentials');
    }
  } catch (err) {
    console.error('Error logging in:', err);
    alert('Server error. Please try again.');
  }
};


  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Welcome back! Please sign in to continue.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <div className="login-links">
          <Link to="/signup" className="login-link">
            Don't have an account? <span className="login-link-highlight">Register</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
