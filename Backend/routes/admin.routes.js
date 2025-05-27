const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminMiddleware'); 

router.post('/login', adminController.adminLogin);
router.get('/dashboard',adminAuthMiddleware, adminController.getAllUsers);
router.get('/search',adminAuthMiddleware, adminController.searchUsers);
router.post('/create',adminAuthMiddleware, adminController.createUser);
router.put('/update/:userId',adminAuthMiddleware, adminController.updateUser);
router.get('/user/:userId', adminAuthMiddleware, adminController.getUserById);
router.delete('/delete/:userId',adminAuthMiddleware, adminController.deleteUser);

module.exports = router;
