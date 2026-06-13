export const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseInt(priceStr.toString().replace(/[^0-9]/g, ''), 10) || 0;
};

/**
 * Безопасное извлечение слага категории из данных Django DRF (строка или объект)
 */
const extractCategorySlug = (category) => {
  if (!category) return '';
  if (typeof category === 'string') return category.toLowerCase();
  if (typeof category === 'object') {
    // Проверяем стандартные поля Django-сериализатора: slug, затем title, затем id
    const slug = category.slug || category.title || category.name || category.id || '';
    return String(slug).toLowerCase();
  }
  return String(category).toLowerCase();
};

/**
 * Универсальный продакшн-конвейер фильтрации и сортировки товаров клиники Огулова
 */
export const filterAndSortProducts = ({
  products,
  activeCategory,
  activeSubcategory,
  activeTab,
  searchQuery,
  minPrice,
  maxPrice,
  sortOrder,
  isSearchMode
}) => {
  // Защита от пустых данных на этапе асинхронного ответа Django DRF
  if (!products || !Array.isArray(products)) return [];

  let result = [];

  // 1. Разделение на главную (витрину) и страницы категорий/поиска
  if (activeCategory === 'all' || isSearchMode) {
    if (isSearchMode) {
      result = [...products];
    } else {
      // Логика табов на главной странице
      if (activeTab === 'news') {
        result = products.filter(p => p.is_new === true);
      } else if (activeTab === 'sales') {
        // КРИТИЧЕСКИЙ ФИКС: подстраиваемся под snake_case ключ 'old_price' из Django
        result = products.filter(p => p.old_price !== null && p.old_price !== undefined);
      } else {
        result = products.filter(p => p.is_hit === true);
      }
    }
  } else {
    // 2. СТРОГАЯ ФИЛЬТРАЦИЯ СТРАНИЦ КАТЕГОРИЙ (С учетом архитектуры Django)
    result = products.filter(product => {
      // Применяем безопасный экстрактор слага
      const prodCat = extractCategorySlug(product.category);
      const actCat = String(activeCategory || '').toLowerCase();

      // ЖЕЛЕЗОБЕТОННЫЙ ФИКС БАДОВ: 
      if (actCat === 'bad') {
        return prodCat === 'bad' || prodCat.includes('bad') || ['vitauct', 'fulvo', 'tea', 'herbs-honey', 'bee-power', 'health'].includes(prodCat);
      }

      // ЖЕЛЕЗОБЕТОННЫЙ ФИКС ДЛЯ ОСТАЛЬНЫХ КАТЕГОРИЙ (Учитываем дочерние слаги Django):
      return prodCat === actCat || prodCat.startsWith(actCat) || actCat.startsWith(prodCat);
    });

    // 3. ФИЛЬТРАЦИЯ ПО КЛИКАМ НА ПЛИТКИ-ОКОШКИ БАДОВ
    if (activeSubcategory && !activeSubcategory.startsWith('all')) {
      result = result.filter(product => {
        // Применяем безопасный экстрактор слага
        const prodCat = extractCategorySlug(product.category);
        const activeSub = String(activeSubcategory || '').toLowerCase();

        // Синхронизируем фронтенд-префиксы 'bady-' с чистыми слагами Django на лету (Паттерн Адаптер)
        return prodCat === activeSub || prodCat === activeSub.replace('bady-', '');
      });
    }
  }

  // 4. Фильтр глобального поиска по каталогу
  if (searchQuery) {
    result = result.filter(product => 
      product.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // 5. Фильтр ценового диапазона от/до
  if (minPrice) {
    result = result.filter(product => parsePrice(product.price) >= parseInt(minPrice, 10));
  }
  if (maxPrice) {
    result = result.filter(product => parsePrice(product.price) <= parseInt(maxPrice, 10));
  }

  // 6. Сортировка по стоимости
  if (sortOrder === 'low-to-high') {
    return [...result].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  }
  if (sortOrder === 'high-to-low') {
    return [...result].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }

  return result;
};
