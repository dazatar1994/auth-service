const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Подключаем защищённые маршруты
const client = require('prom-client');

const app = express();

// Настройка Prometheus
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Маршруты авторизации
app.use('/api/users', userRoutes); // Защищённые маршруты

// Маршрут для метрик
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.send(await register.metrics());
    } catch (err) {
        res.status(500).send('Error collecting metrics');
    }
});

module.exports = app;
