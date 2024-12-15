// Утилита для хэширования паролей 
const bcrypt = require('bcrypt');

// Хэширование пароля
const hashPassword = async (password) => {
    const saltRounds = 10; // Количество раундов соления
    return await bcrypt.hash(password, saltRounds);
};

// Сравнение паролей
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Валидация пароля
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Минимум 6 символов, минимум одна буква и одна цифра
    if (!passwordRegex.test(password)) {
        throw new Error('Password must be at least 6 characters long and contain at least one letter and one number');
    }
};

module.exports = {
    hashPassword,
    comparePassword,
    validatePassword,
};
