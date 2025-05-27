import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createUserSuccess } from '../../slices/authSlice';
import '../../../css/createUser.css';

const CreateUser = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }
      dispatch(createUserSuccess(user)); 

      navigate('/admin/dashboard'); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <div className="container">
      <h1>Create New User</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit">Create User</button>
          <button className="go-back-button" onClick={handleGoBack}>
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
