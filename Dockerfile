# Этап 1: Сборка React/Vite приложения
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем списки зависимостей
COPY package*.json ./

# Устанавливаем зависимости чисто для продакшена
RUN npm ci

# Копируем весь оставшийся код фронтенда
COPY . .

# Собираем проект через Vite в папку dist
RUN npm run build

# Этап 2: Изолированная раздача статики
FROM nginx:stable-alpine

# Копируем собранный фронт из первого этапа в папку Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Открываем стандартный порт веб-сервера
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
