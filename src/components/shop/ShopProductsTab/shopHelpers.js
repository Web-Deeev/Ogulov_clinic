export const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseInt(priceStr.toString().replace(/[^0-9]/g, ''), 10) || 0;
};

/**
 * Универсальный конвейер фильтрации и сортировки товаров
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
  // Защита от пустых данных, если массив товаров ещё не загрузился
  if (!products || !Array.isArray(products)) return [];

  let result = [];

  // 1. Разделение на главную и категории
  if (activeCategory === 'all' || isSearchMode) {
    if (isSearchMode) {
      result = [...products];
    } else {
      // Логика табов на главной
      if (activeTab === 'news') result = products.filter(p => p.is_new === true);
      else if (activeTab === 'sales') result = products.filter(p => p.oldPrice !== null && p.oldPrice !== undefined);
      else result = products.filter(p => p.is_hit === true);
    }
  } else {
    // ИСПРАВЛЕНО: Умная фильтрация родительских категорий (решает баг пустых БАДов)
    result = products.filter(product => {
      // Если кликнули на БАДы (id: 'bad'), пропускаем все товары, категория которых начинается на 'bady-'
      if (activeCategory === 'bad' && product.category?.startsWith('bady-')) {
        return true;
      }
      // Для всех остальных категорий (books, posters, scrapers, banks, microspheres) оставляем твое строгое совпадение
      return product.category === activeCategory;
    });

    // ИСПРАВЛЕНО: Фильтрация по кликам на плитки-окошки (сверяем с конечным полем category)
    if (activeSubcategory && !activeSubcategory.startsWith('all')) {
      result = result.filter(product => product.category === activeSubcategory);
    }
  }

  // 2. Фильтр поиска
  if (searchQuery) {
    result = result.filter(product => 
      product.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // 3. Фильтр цен от/до
  if (minPrice) {
    result = result.filter(product => parsePrice(product.price) >= parseInt(minPrice, 10));
  }
  if (maxPrice) {
    result = result.filter(product => parsePrice(product.price) <= parseInt(maxPrice, 10));
  }

  // 4. Сортировка
  if (sortOrder === 'low-to-high') {
    return [...result].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  }
  if (sortOrder === 'high-to-low') {
    return [...result].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }

  return result;
};
