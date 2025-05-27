import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  admin: null,
  adminToken: localStorage.getItem('admin-token') || null,
  adminIsAuthenticated: !!localStorage.getItem('admin-token'),
  users: [], 
  error: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;  
    },

    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
      state.error = ''; 
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      state.error = ''; 
    },


    adminLoginSuccess: (state, action) => {
      state.admin = action.payload.admin;
      state.adminToken = action.payload.token;
      state.adminIsAuthenticated = true;
      localStorage.setItem('admin-token', action.payload.token);
      state.error = ''; 
    },


    adminLogout: (state) => {
      state.admin = null;
      state.adminToken = null;
      state.adminIsAuthenticated = false;
      localStorage.removeItem('admin-token');
      state.error = ''; 
    },

    setUsers: (state, action) => {
      state.users = action.payload; 
    },
    
    updateUserSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },

    createUserSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload }; 
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setUser,
  loginSuccess, 
  logout, 
  adminLoginSuccess, 
  adminLogout, 
  setUsers,
  createUserSuccess,
  updateUserSuccess,
  setError 
} = authSlice.actions;

export default authSlice.reducer;
