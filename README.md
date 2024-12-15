Authentication Service

Описание

Этот сервис предоставляет систему аутентификации и авторизации с подтверждением email, управлением ролями (RBAC) и возможностью восстановления пароля. Подходит для использования в проектах с микросервисной архитектурой.

Основные функции

Регистрация пользователя:

Новый пользователь регистрируется с указанием email и пароля.

На указанный email отправляется письмо для подтверждения адреса.

Подтверждение email:

Ссылка с токеном отправляется на email пользователя.

После перехода по ссылке email подтверждается.

Логин:

Пользователь вводит email и пароль.

При успешной авторизации возвращаются accessToken и refreshToken.

Обновление токенов:

refreshToken используется для получения нового accessToken.

Выход из системы (Logout):

Токены добавляются в Blacklist, предотвращая их повторное использование.

Сброс пароля:

Пользователь может запросить сброс пароля, указав email.

На email отправляется ссылка для сброса пароля.

Управление ролями:

Администраторы могут назначать пользователям роли (user, admin).

Установка и настройка

1. Клонирование репозитория

git clone <URL репозитория>
cd <название папки>

2. Установка зависимостей

Убедитесь, что у вас установлен Node.js. Затем выполните:

npm install

3. Настройка .env

Создайте файл .env в корневой директории проекта и укажите следующие переменные:

# Сервер
PORT=3000
APP_URL=http://localhost:3000

# JWT
JWT_SECRET=ваш_секретный_ключ
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# База данных PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=ваш_пользователь
DB_PASSWORD=ваш_пароль
DB_NAME=auth_service

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# SMTP (почта)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=ваш_email
SMTP_PASSWORD=ваш_пароль

4. Запуск сервера

npm start

Сервер будет доступен по адресу http://localhost:3000.

API Документация

1. Регистрация

POST /api/auth/register

Тело запроса:

{
  "email": "test@example.com",
  "password": "password123"
}

Ответ:

{
  "message": "User registered successfully. Please check your email to confirm."
}

2. Подтверждение email

GET /api/auth/confirm-email

Параметры:

token: токен подтверждения (передаётся в URL).

Пример запроса:http://localhost:3000/api/auth/confirm-email?token=<ваш_токен>

Ответ:

{
  "message": "Email confirmed successfully"
}

3. Логин

POST /api/auth/login

Тело запроса:

{
  "email": "test@example.com",
  "password": "password123"
}

Ответ:

{
  "message": "Login successful",
  "accessToken": "<ваш_access_token>",
  "refreshToken": "<ваш_refresh_token>"
}

4. Обновление токенов

POST /api/auth/refresh-token

Тело запроса:

{
  "refreshToken": "<ваш_refresh_token>"
}

Ответ:

{
  "accessToken": "<новый_access_token>",
  "refreshToken": "<новый_refresh_token>"
}

5. Сброс пароля

POST /api/auth/reset-password-request

Тело запроса:

{
  "email": "test@example.com"
}

Ответ:

{
  "message": "Password reset link sent to your email"
}

6. Обновление роли

PUT /api/auth/update-role

Тело запроса:

{
  "userId": 1,
  "role": "admin"
}

Ответ:

{
  "message": "Role updated successfully",
  "user": {
      "id": 1,
      "email": "test@example.com",
      "role": "admin"
  }
}

Тестирование

Для тестирования можно использовать Postman или любой другой инструмент для HTTP-запросов.

Лицензия

Этот проект распространяется под лицензией MIT. Вы можете использовать его как угодно, но без каких-либо гарантий.

