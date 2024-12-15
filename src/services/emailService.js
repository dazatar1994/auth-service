// Сервис отправки email 
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER, // Ваш Gmail
        pass: process.env.SMTP_PASSWORD, // Пароль приложения (App Password)
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Auth Service" <${process.env.SMTP_USER}>`, // Отправитель
            to, // Получатель
            subject, // Тема письма
            html, // HTML-содержимое
        });
        console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw new Error('Failed to send email');
    }
};

module.exports = { sendEmail };
