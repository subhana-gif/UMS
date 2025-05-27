import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { updateUserSuccess } from '../../slices/authSlice'; 
import '../../../css/editUser.css';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const [user, setUser] = useState({ username: '', email: '', role: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('admin-token');
      if (!token) {
        setError('No admin token found. Please log in.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/admin/user/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === 'Email already exists') {
          throw new Error('Email already exists. Please choose a different email.');
        } else {
          throw new Error(errorData.message || 'Failed to update user');
        }
      }

      dispatch(updateUserSuccess(user)); 

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
      <h1>Edit User</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Username"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email"
          />
        </div>
        <div className="button-container">
          <button type="submit">Update</button>
          <button className="go-back-button" onClick={handleGoBack}>
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
