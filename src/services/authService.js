// Сервис авторизации
const User = require('../models/User');
const { sendEmail } = require('./emailService');
const { generateToken, verifyToken } = require('../utils/jwtUtils');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { set, get } = require('../services/redisService'); // Работа с Redis через redisService
const { confirmEmailTemplate, resetPasswordTemplate } = require('../utils/emailTemplates');

class AuthService {
    // Регистрация пользователя
    static async register(email, password) {
        // Хэшируем пароль
        const hashedPassword = await hashPassword(password);

        // Создаём пользователя
        const user = await User.register(email, hashedPassword);

        // Генерация токена подтверждения
        const emailToken = generateToken(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            '1d' // Токен действителен 1 день
        );

        // Ссылка для подтверждения
        const confirmationLink = `${process.env.APP_URL}/api/auth/confirm-email?token=${emailToken}`;

        // Отправка письма
        await sendEmail(
            user.email,
            'Confirm your email',
            confirmEmailTemplate(confirmationLink)
        );

        return user;
    }
    //Сброс пароля
    static async requestPasswordReset(email) {
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
    
        const resetToken = generateToken({ id: user.id }, process.env.JWT_SECRET, '1h'); // Токен действителен 1 час
        const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    
        await sendEmail(
            user.email,
            'Reset your password',
            resetPasswordTemplate(resetLink)
        );
    
        return { message: 'Password reset link sent to your email' };
    }

    // Подтверждение email
    static async confirmEmail(token) {
        try {
            // Проверяем токен
            const decoded = verifyToken(token, process.env.JWT_SECRET);

            // Получаем пользователя
            const user = await User.findById(decoded.id);
            if (!user) throw new Error('User not found');
            if (user.is_verified) throw new Error('Email already verified');

            // Обновляем статус подтверждения
            await User.updateVerificationStatus(user.id, true);
            return user;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    // Логин пользователя
    static async login(email, password) {
        // Ищем пользователя
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Сравниваем пароли
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Генерируем Access токен
        const accessToken = generateToken(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            process.env.JWT_EXPIRES_IN
        );

        // Генерируем Refresh токен
        const refreshToken = generateToken(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            process.env.REFRESH_TOKEN_EXPIRES_IN
        );

        // Сохраняем Refresh токен в Redis через redisService
        await set(`refreshToken:${user.id}`, refreshToken, 7 * 24 * 60 * 60); // Храним 7 дней

        return { accessToken, refreshToken, user: { id: user.id, email: user.email } };
    }

    // Обновление токенов
    static async refreshToken(refreshToken) {
        try {
            // Проверяем валидность Refresh токена
            const decoded = verifyToken(refreshToken, process.env.JWT_SECRET);

            // Проверяем Refresh токен в Redis через redisService
            const storedToken = await get(`refreshToken:${decoded.id}`);
            if (storedToken !== refreshToken) {
                throw new Error('Invalid or expired refresh token');
            }

            // Генерируем новый Access токен
            const newAccessToken = generateToken(
                { id: decoded.id, email: decoded.email, role: decoded.role },
                process.env.JWT_SECRET,
                process.env.JWT_EXPIRES_IN
            );

            // Генерируем новый Refresh токен
            const newRefreshToken = generateToken(
                { id: decoded.id, email: decoded.email },
                process.env.JWT_SECRET,
                process.env.REFRESH_TOKEN_EXPIRES_IN
            );

            // Обновляем Refresh токен в Redis через redisService
            await set(`refreshToken:${decoded.id}`, newRefreshToken, 7 * 24 * 60 * 60);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }
}

module.exports = AuthService;
