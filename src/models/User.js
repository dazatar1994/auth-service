const pool = require('../config/dbConfig');

class User {
    // Создание пользователя (внутренний метод)
    static async create(email, password) {
        const query = `
            INSERT INTO users (email, password)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values = [email, password];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Найти пользователя по email
    static async findByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1;`;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    // Найти пользователя по ID
    static async findById(userId) {
        const query = `SELECT * FROM users WHERE id = $1`;
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    }

    // Обновить статус верификации
    static async updateVerificationStatus(userId, isVerified) {
        const query = `
            UPDATE users
            SET is_verified = $1
            WHERE id = $2
            RETURNING id, email, is_verified;
        `;
        const values = [isVerified, userId];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0];
    }

    // Регистрация пользователя
    static async register(email, hashedPassword) {
        // Проверяем, существует ли пользователь
        const existingUserQuery = `SELECT * FROM users WHERE email = $1`;
        const existingUser = await pool.query(existingUserQuery, [email]);

        if (existingUser.rows.length > 0) {
            throw new Error('Email is already in use');
        }

        // Создаём нового пользователя
        const insertQuery = `
            INSERT INTO users (email, password, is_verified)
            VALUES ($1, $2, $3)
            RETURNING id, email, is_verified;
        `;
        const values = [email, hashedPassword, false]; // Новый пользователь не подтверждён
        const result = await pool.query(insertQuery, values);

        return result.rows[0];
    }

    // Обновить роль пользователя
    static async updateRole(userId, role) {
        const query = `
            UPDATE users
            SET role = $1
            WHERE id = $2
            RETURNING id, email, role;
        `;
        const values = [role, userId];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return null; // Пользователь не найден
        }

        return result.rows[0];
    }
}

module.exports = User;
