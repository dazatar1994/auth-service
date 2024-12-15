# Authentication Service

## Описание
Этот сервис предоставляет систему аутентификации и авторизации с подтверждением email, управлением ролями (RBAC) и возможностью восстановления пароля. Подходит для использования в проектах с микросервисной архитектурой.

---

## Основные функции
1. **Регистрация пользователя**:
   - Новый пользователь регистрируется с указанием email и пароля.
   - На указанный email отправляется письмо для подтверждения адреса.

2. **Подтверждение email**:
   - Ссылка с токеном отправляется на email пользователя.
   - После перехода по ссылке email подтверждается.

3. **Логин**:
   - Пользователь вводит email и пароль.
   - При успешной авторизации возвращаются `accessToken` и `refreshToken`.

4. **Обновление токенов**:
   - `refreshToken` используется для получения нового `accessToken`.

5. **Выход из системы (Logout)**:
   - Токены добавляются в Blacklist, предотвращая их повторное использование.

6. **Сброс пароля**:
   - Пользователь может запросить сброс пароля, указав email.
   - На email отправляется ссылка для сброса пароля.

7. **Управление ролями**:
   - Администраторы могут назначать пользователям роли (`user`, `admin`).

---

## Установка и настройка

### 1. Клонирование репозитория
```bash
git clone <URL репозитория>
cd <название папки>
```

### 2. Установка зависимостей
Убедитесь, что у вас установлен Node.js. Затем выполните:
```bash
npm install
```

### 3. Настройка `.env`
Создайте файл `.env` в корневой директории проекта и укажите следующие переменные:
```plaintext
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
```

### 4. Запуск сервера
```bash
npm start
```

Сервер будет доступен по адресу `http://localhost:3000`.

---

## API Документация

### **1. Регистрация**
**POST** `/api/auth/register`

- **Тело запроса:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

- **Ответ:**
```json
{
  "message": "User registered successfully. Please check your email to confirm."
}
```

---

### **2. Подтверждение email**
**GET** `/api/auth/confirm-email`

- **Параметры:**
  - `token`: токен подтверждения (передаётся в URL).

- **Пример запроса:**  
`http://localhost:3000/api/auth/confirm-email?token=<ваш_токен>`

- **Ответ:**
```json
{
  "message": "Email confirmed successfully"
}
```

---

### **3. Логин**
**POST** `/api/auth/login`

- **Тело запроса:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

- **Ответ:**
```json
{
  "message": "Login successful",
  "accessToken": "<ваш_access_token>",
  "refreshToken": "<ваш_refresh_token>"
}
```

---

### **4. Обновление токенов**
**POST** `/api/auth/refresh-token`

- **Тело запроса:**
```json
{
  "refreshToken": "<ваш_refresh_token>"
}
```

- **Ответ:**
```json
{
  "accessToken": "<новый_access_token>",
  "refreshToken": "<новый_refresh_token>"
}
```

---

### **5. Сброс пароля**
**POST** `/api/auth/reset-password-request`

- **Тело запроса:**
```json
{
  "email": "test@example.com"
}
```

- **Ответ:**
```json
{
  "message": "Password reset link sent to your email"
}
```

---

### **6. Обновление роли**
**PUT** `/api/auth/update-role`

- **Тело запроса:**
```json
{
  "userId": 1,
  "role": "admin"
}
```

- **Ответ:**
```json
{
  "message": "Role updated successfully",
  "user": {
      "id": 1,
      "email": "test@example.com",
      "role": "admin"
  }
}
```

---

## Тестирование
Для тестирования можно использовать **Postman** или любой другой инструмент для HTTP-запросов.

---

## Лицензия
Этот проект распространяется под лицензией MIT. Вы можете использовать его как угодно, но без каких-либо гарантий.

