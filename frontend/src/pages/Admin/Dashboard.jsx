import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { adminLogout, setUsers, setError } from '../../slices/authSlice'; 
import '../../../css/dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.auth.users); 
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      dispatch(setUsers(data)); 
    } catch (error) {
      dispatch(setError(error.message)); 
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = async () => {
    try {
      let url = searchTerm.trim()
        ? `http://localhost:5000/api/admin/search?searchTerm=${searchTerm}`
        : 'http://localhost:5000/api/admin/dashboard';

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setUsers(data)); 
      setCurrentPage(1);
    } catch (error) {
      dispatch(setError(error.message)); 
    }
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const response = await fetch(`http://localhost:5000/api/admin/delete/${userToDelete}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
      },
    });

    if (response.ok) {
      fetchUsers();
      setShowModal(false);
    } else {
      dispatch(setError('Failed to delete user')); 
      setShowModal(false);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  const handleLogOut = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    dispatch(adminLogout());
    localStorage.removeItem('admin-token');
    navigate('/admin/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="admin-dashboard">z
      <h2>Admin Dashboard</h2>
      <button className="logout-btn" onClick={handleLogOut}>Logout</button>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <img src={user.profileImage || "/default-avatar.jpg"} alt="Profile" />
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td className="action-buttons">
                  <Link to={`/admin/edit/${user._id}`}>
                    <button className="edit-btn">Edit</button>
                  </Link>
                  <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
          <span
            key={index + 1}
            className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </span>
        ))}
      </div>

      <Link to="/admin/create">
        <button className="create-user-btn">Create New User</button>
      </Link>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Are you sure you want to log out?</h3>
            <button onClick={confirmLogout} className="modal-confirm">Yes, Logout</button>
            <button onClick={cancelLogout} className="modal-cancel">Cancel</button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Are you sure you want to delete this user?</h3>
            <button onClick={confirmDelete} className="modal-confirm">Confirm</button>
            <button onClick={cancelDelete} className="modal-cancel">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
