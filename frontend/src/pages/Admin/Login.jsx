import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminLoginSuccess, setError } from '../../slices/authSlice'; 
import { useNavigate } from 'react-router-dom';
import '../../../css/adminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const error = useSelector((state) => state.auth.error);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      console.log("Admin Login Response:", data);

      dispatch(adminLoginSuccess({ token: data.token, user: data.user }));
      localStorage.setItem('admin-token', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      
      {error && <p className="admin-error-message">{error}</p>}
      
      <form onSubmit={handleLogin} className="admin-login-form">
        <div className="admin-form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="admin-form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="admin-button-container">
          <button type="submit" className="admin-login-button">Login</button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
