import axios from 'axios';

const api = axios.create({
  // Адрес твоего локального сервера Django из config/urls.py
  baseURL: 'http://127.0.0.1:8000/api/', 
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// =========================================================================
// 🎯 МИДЛВАРЬ АВТОРИЗАЦИИ (AXIOS REQUEST INTERCEPTOR)
// =========================================================================
api.interceptors.request.use(
  (config) => {
    // Безопасно перебираем все возможные ключи токена клиники в localStorage
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('ogulov_clinic_token') || 
                  localStorage.getItem('token') ||
                  localStorage.getItem('authToken');

    // 🛡️ ЗАЩИТА FINANCIAL MATRIX: Прикрепляем заголовок только если токен реальный (начинается на eyJ...)
    // Если в localStorage лежит mock-строка, мы её игнорируем, чтобы реальный Django REST Framework не выдавал 403
    if (token && token.startsWith('eyJ')) {
      config.headers.Authorization = `Bearer ${token}`;
      // 🟢 ДИАГНОСТИКА КЛИНИКИ: Сигнализирует, что сессия легитимна и заголовок улетает на бэк
      console.log('🛡️ matrix-guard: Токен валиден, заголовок прикреплен к запросу:', config.url);
    } else {
      // 🔴 ДИАГНОСТИКА КЛИНИКИ: Подсвечивает, если токен пуст, затёрт или является заглушкой
      console.warn('⚠️ matrix-guard: Запрос отправлен БЕЗ токена (токен отсутствует или фейковый):', config.url);
    }
    
    return config;
  },
  (error) => {
    // Логируем системную ошибку отправки запроса, если она возникнет до ухода в сеть
    console.error('Критический сбой Axios перед отправкой запроса:', error);
    return Promise.reject(error);
  }
);

export default api;


