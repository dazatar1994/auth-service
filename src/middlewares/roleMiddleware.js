// Middleware проверки ролей 
const logger = require('../utils/logger');

const roleMiddleware = (requiredRole) => (req, res, next) => {
    const { role } = req.user; // Роль пользователя из токена

    if (!role) {
        logger.warn(`Access denied: no role found for user ID ${req.user.id}`);
        return res.status(403).json({ error: 'Access denied: role not assigned' });
    }

    if (role !== requiredRole) {
        logger.warn(`Access denied for user ID ${req.user.id}: insufficient permissions`);
        return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }

    next();
};

module.exports = roleMiddleware;
