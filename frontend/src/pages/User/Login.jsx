import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../../css/userLogin.css'

function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(loginSuccess(data)); 
        navigate('/user/home'); 
      } else {
        setError(data.message || 'Login failed'); 
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred. Please try again later.'); 
    }
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit" className="login-button">Login</button>
        </div>
        </form>

      {error && <p className="error-message">{error}</p>}

      <div className="register-section">
        <p>Don't have an account?</p>
        <Link to="/user/register" className="register-link">Register here</Link>
      </div>
    </div>
  );
};

export default UserLogin;