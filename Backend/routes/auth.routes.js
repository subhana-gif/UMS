const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig')
const { register, login, getUserProfile, updateProfile } = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware,upload.single('profileImage'),updateProfile);

module.exports = router;
