import api from '../axios';

export const adaptProduct = (djangoProduct) => {
  if (!djangoProduct) return null;
  return {
    id: djangoProduct.id,
    slug_id: djangoProduct.slug_id,
    title: djangoProduct.title,
    price: parseFloat(djangoProduct.price) || 0,
    old_price: djangoProduct.old_price ? parseFloat(djangoProduct.old_price) : null,
    image: djangoProduct.image,
    in_stock: djangoProduct.in_stock,
    description: djangoProduct.description,
    category: djangoProduct.category?.slug || '',
    category_display: djangoProduct.category?.title || '',
    
    // 🛡️ ДОБАВЛЕНО РАЗРАБОТЧИКОМ: Прокидываем флаги на фронтенд, приводя к чистому Boolean
    is_hit: Boolean(djangoProduct.is_hit),
    is_new: Boolean(djangoProduct.is_new),
    label: djangoProduct.label || ''
  };
};

export const productService = {
  async getProducts(categorySlug = null) {
    const config = {};
    if (categorySlug && categorySlug !== 'all') {
      config.params = { category: categorySlug };
    }
    const response = await api.get('products/', config);
    return Array.isArray(response.data) ? response.data.map(adaptProduct) : [];
  },

  async getProductDetail(slugId) {
    const response = await api.get(`products/${slugId}/`);
    return adaptProduct(response.data);
  }
};
