import api from '../axios';

export const orderService = {
  async createOrder(orderData) {
    const rawItems = orderData.items || orderData.cart || [];
    const payload = {
      customer_name: orderData.customer_name || orderData.name || '',
      phone: orderData.phone ? orderData.phone.replace(/[\s\-\(\)]/g, '') : '',
      delivery_method: orderData.delivery_method || 'PICKUP',
      delivery_address: orderData.delivery_address || orderData.address || '',
      delivery_amount: Number(orderData.delivery_amount) || 0,
      total_amount: Number(orderData.total_amount) || 0,
      currency: orderData.currency || 'KGS',
      comment: orderData.comment || orderData.comments || "Без комментария",
      items: rawItems.map(item => ({
        product_id: Number(item.product_id || item.productId || item.id),
        quantity: Number(item.quantity) || 1
      }))
    };

    // 🟢 ЧИСТЫЙ ЗАПРОС: Заголовки подставит интерцептор автоматически!
    const response = await api.post('orders/', payload);
    return response.data;
  },

  async getOrderHistory() {
    // 🟢 ЧИСТЫЙ ЗАПРОС: Никаких getAuthHeader вручную, интерцептор защищает поток
    const response = await api.get('orders/');
    console.log('Успешный ответ СУБД по истории заказов:', response.data);
    return response.data;
  }
};

export default orderService;
