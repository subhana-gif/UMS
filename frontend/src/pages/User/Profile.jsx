import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserSuccess } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import '../../../css/profile.css';

const Profile = () => {
    const user = useSelector((state) => state.auth.user);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user }); 
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const dispatch = useDispatch(); 
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            const fetchUserProfile = async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) throw new Error('No token found');

                    const response = await fetch('http://localhost:5000/api/auth/profile', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!response.ok) throw new Error('Failed to fetch profile');
                    const data = await response.json();
                    dispatch(updateUserSuccess(data)); 
                    setEditedUser(data);  
                } catch (err) {
                    setError(err.message);
                }
            };
            fetchUserProfile();
        } else {
            setEditedUser(user);  
        }
    }, [dispatch, user]);  

    const handleInputChange = (e) => {
        setEditedUser({
            ...editedUser,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setProfileImageFile(e.target.files[0]);
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('username', editedUser.username);
            formData.append('email', editedUser.email);

            if (profileImageFile) {
                formData.append('profileImage', profileImageFile);
            }

            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.message === 'Email already exists') {
                    setEmailError('Email already exists. Please use a different email.');
                } else {
                    setError('Update failed. Please try again.');
                }
                return;
            }

            dispatch(updateUserSuccess(data));
            setProfileImageFile(null);
            setIsEditing(false);
            setEmailError('');
        } catch (err) {
            setError('An error occurred while updating. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setEditedUser(user);
        setProfileImageFile(null);
        setIsEditing(false);
    };

    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <div className="profile-container">
            <h2>User Profile</h2>

            <div className="profile-image-section">
                {isEditing ? (
                    <div className="image-upload-container">
                        <img
                            src={profileImageFile ? URL.createObjectURL(profileImageFile) : user.profileImage ? user.profileImage
                                : 'default-avatar.png'}
                            alt="Profile"
                            width="100"
                        />
                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                ) : (
                    <img src={user.profileImage || 'default-avatar.png'} alt="Profile" width="100" />
                )}
            </div>

            <div className="profile-details">
                <div className="form-group">
                    <label>Username:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="username"
                            value={editedUser.username || ''}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{user.username}</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    {isEditing ? (
                        <div className="input-wrapper">
                            <input
                                type="email"
                                name="email"
                                value={editedUser.email || ''}
                                onChange={handleInputChange}
                            />
                            {emailError && <p className="error-message">{emailError}</p>}
                        </div>
                    ) : (
                        <p>{user.email}</p>
                    )}
                </div>

                <div className="profile-actions">
                    {!isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                            <button onClick={() => navigate('/user/home')}>Go to Home</button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={handleCancel} disabled={isLoading}>
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
