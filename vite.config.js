import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      // Твой текущий рабочий прокси для API на порту 8001
      '/api': {
        target: 'http://127.0.0.1:8001', 
        changeOrigin: true,
        secure: false,
      },
      
      // 🎯 СЕНИОР-ФИКС: Добавляем проксирование для ручного входа в админку Django
      '/admin': {
        target: 'http://127.0.0.1:8001', // Направляем строго на тот же порт 8001
        changeOrigin: true,
        secure: false,
      },
      
      // 🎯 СЕНИОР-ФИКС: Проксируем стили, скрипты и иконки самой Django-админки
      '/static/admin': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        secure: false,
      },

      // 🎯 СЕНИОР-ФИКС: Проксируем медиа-файлы (чтобы картинки товаров из админки Django отображались на фронте)
      '/media': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
