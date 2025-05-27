const jwt = require('jsonwebtoken');

// authMiddleware.js
const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
  
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid token format' });
    }
    
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
