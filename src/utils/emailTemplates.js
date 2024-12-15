// Шаблоны писем
const confirmEmailTemplate = (link) => `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    color: #ffffff;
                    background-color: #007BFF;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888888;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Добро пожаловать в наш сервис!</h1>
                </div>
                <p>Спасибо за регистрацию. Пожалуйста, подтвердите ваш email, нажав на кнопку ниже:</p>
                <p style="text-align: center;">
                    <a href="${link}" class="button">Подтвердить email</a>
                </p>
                <p>Если вы не регистрировали этот аккаунт, вы можете проигнорировать это письмо.</p>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Наш сервис. Все права защищены.
                </div>
            </div>
        </body>
    </html>
`;

const resetPasswordTemplate = (link) => `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    color: #ffffff;
                    background-color: #28A745;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888888;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Сброс пароля</h1>
                </div>
                <p>Мы получили запрос на сброс вашего пароля. Если это были вы, нажмите на кнопку ниже:</p>
                <p style="text-align: center;">
                    <a href="${link}" class="button">Сбросить пароль</a>
                </p>
                <p>Если вы не отправляли запрос на сброс пароля, вы можете проигнорировать это письмо.</p>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Наш сервис. Все права защищены.
                </div>
            </div>
        </body>
    </html>
`;

module.exports = { confirmEmailTemplate, resetPasswordTemplate };
