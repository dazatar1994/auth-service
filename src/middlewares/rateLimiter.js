const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');
const client = require('prom-client');

// Создаём метрику для количества превышений лимитов
const rateLimitCounter = new client.Counter({
    name: 'rate_limit_exceeded',
    help: 'Number of times rate limit was exceeded',
    labelNames: ['ip', 'route'], // Метки для IP и маршрута
});

// Настраиваем лимит запросов
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // Максимум 100 запросов
    message: {
        error: 'Too many requests from this IP, please try again later',
    },
    standardHeaders: true, // Включить заголовки `RateLimit-*`
    legacyHeaders: false, // Отключить заголовки `X-RateLimit-*`
    handler: (req, res, next, options) => {
        // Увеличиваем метрику для Prometheus
        rateLimitCounter.inc({ ip: req.ip, route: req.originalUrl });

        // Логируем превышение лимита
		logger.warn(`Rate limit exceeded by IP: ${req.ip}, route: ${req.originalUrl}, User-Agent: ${req.headers['user-agent']}`);

        // Отправляем сообщение пользователю
        res.status(options.statusCode).json(options.message);
    },
});

module.exports = apiLimiter;
