// Утилита для работы с JWT токенами 
const jwt = require('jsonwebtoken');

// Генерация токена
const generateToken = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
};

// Проверка токена
const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

// Декодирование токена без проверки
const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
};
