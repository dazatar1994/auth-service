const express = require('express');
const { register, login, logout, refreshToken, confirmEmail, updateRole } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidators');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const rateLimit = require('express-rate-limit');
const { validateUpdateRole } = require('../validators/authValidators'); // Импорт валидации
const AuthService = require('../services/authService');

const router = express.Router();

// Лимит для логина
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many login attempts, please try again later' },
});

// Лимит для регистрации
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: { error: 'Too many registration attempts, please try again later' },
});

// Маршруты
router.post('/register', registerLimiter, validateRegister, register);
router.post('/login', loginLimiter, validateLogin, login);
router.post('/logout', authMiddleware, logout);
router.post('/refresh-token', authMiddleware, refreshToken);
router.get('/confirm-email', confirmEmail);
router.put('/update-role', authMiddleware, roleMiddleware('admin'), validateUpdateRole, updateRole); // Добавлена валидация
router.post('/reset-password-request', async (req, res) => {
    try {
        const { email } = req.body;
        const response = await AuthService.requestPasswordReset(email);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
