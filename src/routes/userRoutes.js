// Маршруты управления пользователями 
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Пример защищённого маршрута
router.get('/profile', authMiddleware, (req, res) => {
    res.status(200).json({
        message: 'Access to protected route',
        user: req.user, // Данные пользователя из токена
    });
});

router.get('/admin-only', authMiddleware, roleMiddleware('admin'), (req, res) => {
    res.status(200).json({ message: 'Welcome, Admin!' });
});

module.exports = router;
