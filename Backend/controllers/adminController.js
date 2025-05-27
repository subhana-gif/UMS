const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');


// Admin login function
const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin123') {
    try {
      // Generate a JWT token for the admin
      const token = jwt.sign(
        { username: 'admin', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Send the token back along with the user info
      res.json({
        user: { username: 'admin', role: 'admin' },
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

// Get all users function
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Search users by username or email function
const searchUsers = async (req, res) => {
  const { searchTerm } = req.query; 

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ],
    }).select('-password'); // Don't return password field

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search users' });
  }
};


// Create a new user
const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// Update a user's details function
const updateUser = async (req, res) => {
  const { userId } = req.params; 
  const { username, email, role } = req.body;

  try {
    // Check if the email already exists for another user (excluding the current user)
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Proceed with the update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, role },
      { new: true, runValidators: true }
    ).select('-password'); 

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Delete a user function
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};



module.exports = {
  adminLogin,
  getAllUsers,
  searchUsers,
  createUser,
  updateUser,
  getUserById,
  deleteUser,
};
