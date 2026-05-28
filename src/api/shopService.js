import api from './axios';

/**
 * Адаптирует объект товара от Django DRF под текущую структуру фронтенда.
 */
const adaptProduct = (djangoProduct) => {
  if (!djangoProduct) return null;

  return {
    id: djangoProduct.id,
    slug_id: djangoProduct.slug_id,
    title: djangoProduct.title,
    price: parseFloat(djangoProduct.price),
    old_price: djangoProduct.old_price ? parseFloat(djangoProduct.old_price) : null,
    formatted_price: djangoProduct.formatted_price,
    formatted_old_price: djangoProduct.formatted_old_price,
    image: djangoProduct.image,
    additional_images: djangoProduct.additional_images || [],
    in_stock: djangoProduct.in_stock,
    label: djangoProduct.label,
    description: djangoProduct.description,
    specs: djangoProduct.specs,
    is_hit: djangoProduct.is_hit,
    is_new: djangoProduct.is_new,
    category: djangoProduct.category?.slug || '',
    category_display: djangoProduct.category?.title || ''
  };
};

const shopService = {
  /**
   * Получить и адаптировать список товаров
   */
  getProducts: async (categorySlug = null) => {
    try {
      const config = {};
      if (categorySlug && categorySlug !== 'all') {
        config.params = { category: categorySlug };
      }
      const response = await api.get('products/', config);
      if (Array.isArray(response.data)) {
        return response.data.map(adaptProduct);
      }
      return [];
    } catch (error) {
      console.error('Ошибка shopService при получении каталога:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Получить и адаптировать один товар для детальной страницы
   */
  getProductDetail: async (slugId) => {
    try {
      const response = await api.get(`products/${slugId}/`);
      return adaptProduct(response.data);
    } catch (error) {
      console.error(`Ошибка shopService per загрузке товара ${slugId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // =========================================================================
  // 🆕 МЕТОД ДЛЯ ЭТАПА 4: ОТПРАВКА ЗАКАЗА НА БЭКЕНД (1 клик / Корзина)
  // =========================================================================
  /**
   * Отправка заказа на бэкенд Django.
   * @param {Object} orderData - { name, phone, address, comments, items: [{ productId, quantity }] }
   */
  createOrder: async (orderData) => {
  try {
    const payload = {
      cust_name: orderData.name,
      // 🎯 МАГИЯ ЗДЕСЬ: удаляем абсолютно все пробелы, дефисы и скобки перед отправкой в Django
      cust_phone: orderData.phone.replace(/[\s\-\(\)]/g, ''), 
      cust_address: orderData.address || "",
      comments: orderData.comments || "Быстрый заказ в 1 клик с витрины",
      items: orderData.items.map(item => ({
        product_id: String(item.productId),
        quantity: Number(item.quantity) || 1
      }))
    };

      // Отправляем POST-запрос на твой эндпоинт заказов /api/v1/orders/
      const response = await api.post('orders/', payload);
      return response.data;
    } catch (error) {
      console.error('Ошибка shopService при оформлении заказа:', error.response?.data || error.message);
      throw error; // Пробрасываем ошибку дальше в компонент для вывода Regex-валидации
    }
  }
};

export default shopService;
