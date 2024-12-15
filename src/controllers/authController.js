// Контроллер авторизации
const AuthService = require('../services/authService');
const redis = require('../config/redisConfig');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AuthService.register(email, password);

        logger.info(`User registered: ${user.email}`);
        res.status(201).json({
            message: 'User registered successfully. Please check your email to confirm.',
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        logger.error(`Registration failed: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { accessToken, refreshToken, user } = await AuthService.login(email, password);

        logger.info(`User ID: ${user.id} successfully logged in`);
        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user,
        });
    } catch (error) {
        logger.warn(`Failed login attempt for email: ${req.body.email}. Reason: ${error.message}`);
        res.status(401).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = req.headers.authorization.split(' ')[1];
        const { id } = req.user;

        await redis.del(`refreshToken:${id}`);
        await redis.set(`blacklist:${token}`, true, 'EX', 3600);

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        logger.error(`Logout failed: ${error.message}`);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.info(`Refresh token requested for user ID: ${decoded.id}`);

        const { accessToken, refreshToken: newRefreshToken } = await AuthService.refreshToken(token);

        res.status(200).json({
            message: 'Tokens refreshed successfully',
            accessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        logger.error(`Failed to refresh token: ${error.message}`);
        res.status(401).json({ error: error.message });
    }
};

const confirmEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const user = await AuthService.confirmEmail(token);

        logger.info(`Email confirmed for user: ${user.email}`);
        res.status(200).json({ message: 'Email confirmed successfully' });
    } catch (error) {
        logger.error(`Email confirmation failed: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const { userId, role } = req.body;

        const isValidRole = (role) => ['user', 'admin'].includes(role);
        if (!isValidRole(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const updatedUser = await User.updateRole(userId, role);

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found or update failed' });
        }

        logger.info(`Role updated for user ID ${updatedUser.id}: new role is ${updatedUser.role}`);
        res.status(200).json({
            message: 'Role updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        logger.error(`Failed to update role: ${error.message}`);
        res.status(500).json({ error: 'Failed to update role' });
    }
};

module.exports = { confirmEmail, register, login, logout, refreshToken, updateRole };
