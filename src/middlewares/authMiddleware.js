const redis = require('../config/redisConfig');
const logger = require('../utils/logger');
const { verifyToken } = require('../utils/jwtUtils');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Ограничение длины токена
    if (token.length > 1024) {
        logger.warn(`Excessively long token detected from IP: ${req.ip}`);
        return res.status(400).json({ error: 'Bad request: Token is too long' });
    }

    try {
        // Проверка в Blacklist
        const isBlacklisted = await redis.get(`blacklist:${token}`);
        if (isBlacklisted) {
            logger.warn(`Blacklisted token used by IP: ${req.ip}, Token: ${token}`);
            return res.status(401).json({ error: 'Unauthorized: Token is blacklisted' });
        }

        // Проверка токена
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Лог успешного запроса
        logger.info(`Authorized request from user ID: ${req.user.id}, IP: ${req.ip}, Route: ${req.originalUrl}`);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            logger.warn(`Expired token used by IP: ${req.ip}`);
            return res.status(401).json({ error: 'Unauthorized: Token has expired' });
        }
        logger.error(`Unauthorized access attempt: ${error.message}`);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;
