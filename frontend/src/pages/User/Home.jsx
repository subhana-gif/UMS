import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from '../../slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../../../css/HomeUser.css'

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        dispatch(setUser(data)); 
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchUser();
  }, [token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/user/login');
  };

  return (
    <div className="home-container">
      <h2>Welcome {user ? user.username : 'User'}</h2>

      <div className="profile">
        <Link to="/user/profile" className="icon-link">
          {user && user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt="Profile" 
              className="profile-image" 
            />
          ) : (
            <img 
              src="default-avatar.png" 
              alt="Default Profile" 
              className="profile-image" 
            />
          )}
        </Link>
      </div>

      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};

export default Home;
