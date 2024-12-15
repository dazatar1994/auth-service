const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Создаём лимитеры для каждой роли
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 500, // Лимит для админов
    message: {
        error: 'Too many requests for admin, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded by admin: IP ${req.ip}, route ${req.originalUrl}`);
        res.status(options.statusCode).json(options.message);
    },
});

const userLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // Лимит для пользователей
    message: {
        error: 'Too many requests for user, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded by user: IP ${req.ip}, route ${req.originalUrl}`);
        res.status(options.statusCode).json(options.message);
    },
});

const guestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 50, // Лимит для гостей
    message: {
        error: 'Too many requests for guest, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded by guest: IP ${req.ip}, route ${req.originalUrl}`);
        res.status(options.statusCode).json(options.message);
    },
});

// Динамический выбор лимитера
const dynamicRateLimiter = (req, res, next) => {
    const role = req.user?.role || 'guest'; // Определяем роль

    if (role === 'admin') {
        return adminLimiter(req, res, next);
    } else if (role === 'user') {
        return userLimiter(req, res, next);
    } else {
        return guestLimiter(req, res, next);
    }
};

module.exports = dynamicRateLimiter;
