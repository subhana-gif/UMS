import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { setError, loginSuccess } from '../../slices/authSlice'; 
import '../../../css/register.css';

function Register() {
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const error = useSelector((state) => state.auth.error); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.endsWith('@gmail.com')) {
      dispatch(setError('Email must be a Gmail address (@gmail.com)'));
      return;
    }

    if (password.length < 6) {
      dispatch(setError('Password must be at least 6 characters long'));
      return;
    }

    if (password !== confirmPassword) {
      dispatch(setError('Passwords do not match'));
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(loginSuccess({ user: data.user, token: data.token })); 
        navigate('/user/login'); 
      } else {
        dispatch(setError(data.message || 'Registration failed'));
      }
    } catch (error) {
      dispatch(setError('Error registering user')); 
      console.error('Error:', error);
    }
  };

  return (
    <div className="register-container">
      <h1>User Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}

        <div className="button-container">
          <button type="submit" className="register-button">Register</button>
        </div>
      </form>
      
      <div className="login-link">
        <p>Already have an account?</p>
        <Link to="/user/login">Login here</Link>
      </div>
    </div>
  );
};

export default Register;
