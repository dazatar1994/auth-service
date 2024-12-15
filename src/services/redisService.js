// Сервис работы с Redis 
const redis = require('../config/redisConfig');
const logger = require('../utils/logger');

// Установить значение с TTL
const set = async (key, value, ttl) => {
    try {
        await redis.set(key, value, 'EX', ttl); // Храним с временем жизни
        logger.info(`Redis SET: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
        logger.error(`Redis SET error for key ${key}: ${error.message}`);
        throw new Error('Failed to set value in Redis');
    }
};

// Получить значение
const get = async (key) => {
    try {
        const value = await redis.get(key);
        logger.info(`Redis GET: ${key}`);
        return value;
    } catch (error) {
        logger.error(`Redis GET error for key ${key}: ${error.message}`);
        throw new Error('Failed to get value from Redis');
    }
};

// Удалить значение
const del = async (key) => {
    try {
        await redis.del(key);
        logger.info(`Redis DEL: ${key}`);
    } catch (error) {
        logger.error(`Redis DEL error for key ${key}: ${error.message}`);
        throw new Error('Failed to delete value from Redis');
    }
};

// Проверить существование ключа
const exists = async (key) => {
    try {
        const result = await redis.exists(key);
        logger.info(`Redis EXISTS: ${key}`);
        return result === 1; // Возвращает true, если ключ существует
    } catch (error) {
        logger.error(`Redis EXISTS error for key ${key}: ${error.message}`);
        throw new Error('Failed to check key existence in Redis');
    }
};

module.exports = { set, get, del, exists };
