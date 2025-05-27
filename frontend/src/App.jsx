import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/user/Home';
import UserLogin from './pages/user/Login';
import Register from './pages/user/Register';
import Profile from './pages/user/Profile';
import AdminLogin from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/createUsers';
import ProtectedRoute from './components/protectedRoutes';
import EditUser from './pages/Admin/editUser'; 
import CreateUser from './pages/Admin/createUsers';


function App() {
  return (
    <Router>
      <Routes>

        {/* User Routes */}
        <Route path="/user" element={<Navigate to="/user/login" />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/home" element={<Home />} />
        <Route path="/user/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />
        <Route path="/user/logout" element={<Navigate to="/user/login" />} /> {/* ✅ User Logout */}


        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/manageusers" element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/edit/:id" element={<ProtectedRoute role="admin"><EditUser /></ProtectedRoute>} />
        <Route path="/admin/create" element={<ProtectedRoute role="admin"><CreateUser /></ProtectedRoute>} /> 
        <Route path="/admin/logout" element={<Navigate to="/admin/login" />} /> {/* ✅ Admin Logout */}

      </Routes>
    </Router>
  );
}

export default App;
