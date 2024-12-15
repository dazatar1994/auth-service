const Joi = require('joi');

// Валидация для регистрации
const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required',
    }),
});

// Валидация для логина
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
    }),
});

// Валидация для обновления роли
const updateRoleSchema = Joi.object({
    userId: Joi.number().integer().required().messages({
        'any.required': 'User ID is required',
        'number.base': 'User ID must be a number',
    }),
    role: Joi.string().valid('user', 'admin').required().messages({
        'any.only': 'Role must be either "user" or "admin"',
        'any.required': 'Role is required',
    }),
});

// Middleware для валидации
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map((e) => e.message) });
    }
    next();
};

module.exports = {
    validateRegister: validate(registerSchema),
    validateLogin: validate(loginSchema),
    validateUpdateRole: validate(updateRoleSchema), // Экспортируем валидацию роли
};
