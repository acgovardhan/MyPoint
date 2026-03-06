import React, { useState } from 'react';
import "./SignUp.css"
import API from '../../api';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
    branch: '',
    yearOfPassout: '',
  });

  const [pwStrength, setPwStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      setPwStrength(calculateStrength(value));
    }
  };

  const calculateStrength = (pw) => {
    let score = 0;
    if (!pw) return 0;
    if (pw.length >= 6) score += 30;
    if (/[A-Z]/.test(pw)) score += 20;
    if (/[a-z]/.test(pw)) score += 10;
    if (/\d/.test(pw)) score += 20;
    if (/[^A-Za-z0-9]/.test(pw)) score += 10;
    return Math.min(score, 100);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    const res = await fetch(`${API}/registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      // Store username in localStorage
      localStorage.setItem('username', formData.username);

      alert('Registration successful!');
      if (data.redirectTo) {
        window.location.href = data.redirectTo;
      } else {
        window.location.href = '/login';
      }
    } else {
      alert(data.message || 'Registration failed.');
    }
  } catch (err) {
    console.error(err);
    alert('Server error. Try again.');
  }
};


  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-heading">Registration</h1>

        <form onSubmit={handleSubmit} className="signup-form">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="signup-input"
          >
            <option value="Student">Student</option>
            <option value="Admin">Admin</option>
          </select>

          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="signup-input"
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="name@college.edu"
            required
            value={formData.email}
            onChange={handleChange}
            className="signup-input"
          />

          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="alphanumeric_4-16"
            required
            value={formData.username}
            onChange={handleChange}
            className="signup-input"
          />

          <label>Branch</label>
          <input
            type="text"
            name="branch"
            placeholder="Branch"
            required
            value={formData.branch}
            onChange={handleChange}
            className="signup-input"
          />

          <label>Year of Pass Out</label>
          <input
            type="number"
            name="yearOfPassout"
            placeholder="2027"
            required
            value={formData.yearOfPassout}
            onChange={handleChange}
            className="signup-input"
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="At least 6 chars, 1 uppercase, 1 digit"
            required
            value={formData.password}
            onChange={handleChange}
            className="signup-input"
          />
          <div className="strength-bar">
            <div
              className="strength-fill"
              style={{ width: pwStrength + '%' }}
            ></div>
          </div>

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="signup-input"
          />

          <button type="submit" className="signup-submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
