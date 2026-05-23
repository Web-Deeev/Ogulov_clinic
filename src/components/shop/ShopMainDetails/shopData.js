// БОЕВОЙ СЕТЕВОЙ СЕРВИС ДЛЯ БЕСПАРОЛЬНОГО ВХОДА (DJANGO DRF)
const DJANGO_API_URL = 'http://127.0.0.1:8000'; // Уточни порт своей Джанго (обычно 8000)

export const AuthService = {
  // 1. ВХОД ИЛИ РЕГИСТРАЦИЯ ПО EMAIL (POST запрос)
  async loginOrRegister(email) {
    try {
      const response = await fetch(`${DJANGO_API_URL}/api/v1/auth/magic-login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        return { success: false, message: 'Ошибка авторизации на сервере Django' };
      }

      const data = await response.json(); // Бэк создает юзера и сразу возвращает токен и профиль
      localStorage.setItem('access_token', data.access);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.warn("Бэкенд Django не ответил, переключаюсь на локальную эмуляцию:", error);
      
      // Мягкий откат на localStorage для автономной разработки фронта:
      const mockToken = `mock_token_${email}`;
      localStorage.setItem('access_token', mockToken);
      localStorage.setItem('current_logged_user_email', email);
      
      const mockUser = {
        id: 14,
        email: email,
        first_name: "Покупатель",
        phone: "+996 ",
        address: ""
      };
      return { success: true, user: mockUser };
    }
  },

  // 2. ПОЛУЧЕНИЕ ДАННЫХ ПРИ ОБНОВЛЕНИИ СТРАНИЦЫ (F5)
  async getMe() {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    // Если работаем в режиме локальной эмуляции
    if (token.startsWith('mock_token_')) {
      const activeEmail = localStorage.getItem('current_logged_user_email');
      return { id: 14, email: activeEmail, first_name: "Покупатель", phone: "+996 ", address: "" };
    }

    try {
      const response = await fetch(`${DJANGO_API_URL}/api/v1/auth/users/me/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Ошибка сети при получении профиля:", error);
      return null;
    }
  },

  // 3. ОБНОВЛЕНИЕ ДАННЫХ ПРОФИЛЯ В ЛК (PATCH запрос)
  async updateProfile(updatedData) {
    const token = localStorage.getItem('access_token');
    if (!token) return { success: false };

    if (token.startsWith('mock_token_')) {
      console.log('Локальное сохранение профиля:', updatedData);
      return { success: true };
    }

    try {
      const response = await fetch(`${DJANGO_API_URL}/api/v1/auth/users/me/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      return { success: response.ok };
    } catch (error) {
      console.error("Ошибка сохранения на бэкенде:", error);
      return { success: false };
    }
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_logged_user_email');
  }
};

export default AuthService;






// 1. Полный справочник категорий и подкатегорий интернет-магазина
export const shopCategories = [
  { id: 'banks', title: 'Массажные банки', subcategories: [] },
  { 
    id: 'bady', 
    title: 'Пищевые добавки/БАД', 
    subcategories: [
      { id: 'bady-fulvo', title: 'Фульво-гуминовые комплексы' },
      { id: 'bady-vitauct', title: 'VITAUCT' },
      { id: 'bady-herbs-honey', title: 'Травы и мёд' },
      { id: 'bady-health', title: 'Мужское и женское здоровье' },
      { id: 'bady-bee-power', title: 'Сила пчелы' },
      { id: 'bady-tea', title: 'Чай' }
    ]
  }
];

// 2. Полная база данных товаров магазина
export const allProducts = [
  // =========================================================================
  // === МАССАЖНЫЕ БАНКИ (banks) ===
  // =========================================================================
  {
    id: 'banks-1',
    title: 'Вакуумные банки с насосом (набор 6 шт)',
    image: '/product/banki.jpg',
    images: [
      '/product/banki.jpg',
      '/product/banki2.jpg'
    ],
    price: '1 950 сом',
    oldPrice: '2 300 сом',
    label: 'Скидка',
    category: 'banks',
    is_hit: false,
    is_new: false,
    description: 'Профессиональный набор кинетических вакуумных банок для статического и динамического массажа. Насос позволяет точно регулировать давление внутри банки.',
    specs: 'Комплектация: 6 банок, вакуумный насос, шланг; Материал: медицинский поликарбонат'
  },
  {
    id: 'banks-2',
    title: 'Силиконовые банки для лица и шеи',
    image: '/product/banki 3.png',
    images: ['/product/banki 3.png'],
    price: '890 сом',
    oldPrice: null,
    label: 'Хит',
    category: 'banks',
    is_hit: true,
    is_new: false,
    description: 'Мягкие гипоаллергенные банки для деликатного лимфодренажного массажа лица. Эффективно снимают отечность и улучшают тонус кожи.',
    specs: 'Комплектация: 2 штуки (разного диаметра); Материал: медицинский силикон'
  },

  // =========================================================================
  // === МИКРОСФЕРЫ (microspheres) ===
  // =========================================================================
  {
    id: 'microspheres-1',
    title: 'Подушка для структурирования с наполнителем из микросфер (Арт. 2155)',
    image: '/product/podyshka.png',
    images: [
      '/product/podyshka.png',
      '/product/podyshka2.jpg'
    ],
    price: '6 500 сом',
    oldPrice: null,
    label: 'Рекомендуем',
    category: 'microspheres',
    is_hit: false,
    is_new: true,
    description: 'Наполнитель из микросфер натриевоборосиликатного стекла (15 микрон) и аморфного диоксида кремния. Возвращает тепловые волны, обеспечивая глубокую релаксацию.',
    specs: 'Артикул: 2155; Наполнитель: микросферы натриевоборосиликатного стекла и аморфного диоксида кремния; Размер сферы: 15 микрон'
  },
  {
    id: 'microspheres-2',
    title: 'Подушка на сиденье (сидушка) с наполнителем из микросфер (Арт. 1624)',
    image: '/product/podyshkas.png',
    images: ['/product/podyshkas.png'],
    price: '4 800 сом',
    oldPrice: '5 400 сом',
    label: 'Хит',
    category: 'microspheres',
    is_hit: true,
    is_new: false,
    description: 'Анатомическая подушка-сидушка на базе натриевоборосиликатных кремниевых микросфер [1]. Идеально подходит для водителей и офисных сотрудников. Распределяет нагрузку на крестец, улучшает локальную микроциркуляцию и возвращает естественное тепло тела.',
    specs: 'Артикул: 1624; Назначение: для кресел и стульев; Наполнитель: полые стеклянные микросферы [1]; Размер: 40х40 см'
  },

    // --- Устройство очистки ПВВК (pvvk) ---
  {
    id: 'pvvk-1',
    title: 'Бутылка-термос ПВВК (Арт. 2077)',
    image: '/product/pvkk.jpeg', 
    images: [
      '/product/pvkk.jpeg',
      '/product/pvkk2.jpeg',
      '/product/pvkk3.jpeg'
    ],
    price: '4 500 сом',
    oldPrice: null,
    label: 'Хит',
    category: 'equipment',
    is_hit: true,
    is_new: false,
    description: 'Фирменная бутылка-термос ПВВК из высококачественной медицинской нержавеющей пищевой стали марки 18/8. Электрополированные внутренние стенки обеспечивают идеальную гигиеничность и сохраняют структуру очищенной воды.',
    specs: 'Артикул: 2077; Объем: 700 мл (27oz); Вес: 200 г; Размеры: 245x73 мм; Диаметр горлышка: 4.4 см; Материал: медицинская сталь 18/8'
  },



  // =========================================================================
  // === ПИЩЕВЫЕ ДОБАВКИ / БАД (Разделены по подкатегориям с оф. сайта) ===
  // =========================================================================
  
    // --- 1. Фульво-гуминовые комплексы (bady-fulvo) ---
  {
    id: 'bady-f1',
    title: 'Огумин, комплекс фульво-гуминовый с меланином из чаги (Арт. 2206)',
    image: '/product/ogumi.png', 
    images: ['/product/ogumi.png'],
    price: '7 000 сом',
    oldPrice: null,
    label: 'Хит',
    category: 'bady-fulvo',
    is_hit: true,
    is_new: false,
    description: 'Уникальный комплекс на основе фульвовых и гуминовых кислот, обогащенный меланином из сибирской чаги. Обладает мощным антиоксидантным и адаптогенным действием, защищает клетки от свободных радикалов и ускоряет детоксикацию.',
    specs: 'Артикул: 2206; Форма выпуска: 30 монодоз по 2 мл; Назначение: клеточное очищение и иммунитет'
  },
  {
    id: 'bady-f2',
    title: 'Фитогумилад, полезный мармелад без сахара, 200 г (Арт. 2205)',
    image: '/product/fito.png', 
    images: ['/product/fito.png'],
    price: '4 500 сом',
    oldPrice: null,
    label: 'Рекомендуем',
    category: 'bady-fulvo',
    is_hit: false,
    is_new: true,
    description: 'Натуральный функциональный мармелад без добавления сахара. Содержит гуминовый комплекс, способствующий мягкому выводу токсинов и поддержке естественной микрофлоры ЖКТ.',
    specs: 'Артикул: 2205; Вес: 200 г; Особенности: Без сахара'
  },

  // --- 2. VITAUCT (bady-vitauct) ---
  {
    id: 'bady-v1',
    title: 'Расторопша Адванс, полиэкстракт 250мл (Арт. 2114)',
    image: '/product/vict.jpg', 
    images: ['/product/vict.jpg'],
    price: '1 200 сом',
    oldPrice: null,
    label: 'Рекомендуем',
    category: 'bady-vitauct',
    is_hit: false,
    is_new: true,
    description: 'Многокомпонентный растительный полиэкстракт для поддержки печени. Силимарин защищает гепатоциты от токсических воздействий, активирует регенерацию клеток печени и нормализует биохимические показатели желчи.',
    specs: 'Артикул: 2114; Объем: 250 мл; Производитель: VITAUCT (Россия); Особенности: Без спирта и сахара'
  },

  // --- 3. Травы и мёд (bady-herbs-honey) ---
  {
    id: 'bady-hm1',
    title: 'Сбор "Антипаразитарный" 50гр. (Арт. 2166)',
    image: '/product/sbor.jfif', 
    images: ['/product/sbor.jfif'],
    price: '400 сом',
    oldPrice: null,
    label: 'Рекомендуем',
    category: 'bady-herbs-honey',
    is_hit: false,
    is_new: false,
    description: 'Натуральный травяной сбор из пижмы, горькой полыни, гвоздики и тысячелистника. Уничтожает различные виды гельминтов, грибков, бактерий и вирусов. Способствует глубокому очищению организма и подготавливает ЖКТ к висцеральным практикам.',
    specs: 'Артикул: 2166; Вес: 50 г; Состав: Цветки пижмы, полынь горькая, палочки гвоздики, тысячелистник; Назначение: Антипаразитарное очищение'
  },
   {
    id: 'bady-hm2',
    title: 'Сбор "Желчегонный" 50гр. (Арт. 2167)',
    image: '/product/sbor2.jfif', 
    images: ['/product/sbor.jfif'],
    price: '480 сом',
    oldPrice: null,
    label: 'Рекомендуем',
    category: 'bady-herbs-honey',
    is_hit: false,
    is_new: false,
    description: 'Травяной настой сбора оказывает выраженное желчегонное, противовоспалительное и спазмолитическое действие. Ромашка выступает как антисептик, мята успокаивает, бессмертник усиливает секрецию желчи и повышает тонус желчного пузыря, а тысячелистник улучшает общий обмен веществ.',
    specs: 'Артикул: 2167; Вес: 50 г; Состав: Цветки ромашки, лист мяты перечной, бессмертник песчаный, трава тысячелистника, цветы пижмы; Назначение: Усиление секреции желчи и моторики ЖКТ'
  },
  {
    id: 'bady-hm3',
    title: 'Сбор "Мочегонный" 50гр. (Арт. 2168)',
    image: '/product/sbor3.jfif', 
    images: ['/product/sbor3.jfif'],
    price: '320 сом',
    oldPrice: null,
    label: 'Рекомендуем',
    category: 'bady-herbs-honey',
    is_hit: false,
    is_new: false,
    description: 'Натуральный травяной сбор повышает скорость образования мочи, препятствует ее задержке и способствует быстрому выводу лишней жидкости из организма. Лист березы оказывает умеренное мочегонное, желчегонное и спазмолитическое действие, а хвощ полевой проявляет мощные противовоспалительные и дезинтоксикационные свойства.',
    specs: 'Артикул: 2168; Вес: 50 г; Состав: Лист березы, трава хвоща полевого; Назначение: Вывод лишней жидкости и нормализация водно-солевого баланса'
  },
  {
    id: 'bady-hm4',
    title: 'Сбор "При бесплодии" 50гр. (Арт. 2169)',
    image: '/product/sbor4.png', 
    images: ['/product/sbor4.png'],
    price: '320 сом',
    oldPrice: null,
    label: 'Рекомендуем',
    category: 'bady-herbs-honey',
    is_hit: false,
    is_new: false,
    description: 'Специализированный травяной фитосбор, разработанный для комплексной поддержки репродуктивной системы. Оказывает выраженное противовоспалительное, антибактериальное, успокоительное и спазмолитическое действие, а также способствует мягкой нормализации гормонального фона.',
    specs: 'Артикул: 2169; Вес: 50 г; Состав: Трава зверобоя, трава подорожника, трава душицы, шалфей, трава ромашки, трава крапивы, тысячелистник; Назначение: Поддержка репродуктивной системы и гормонального фона'
  },


 // --- 4. Мужское и женское здоровье (bady-health) ---
  {
    id: 'bady-h1',
    title: 'Янгерон комплекс для мужчин и женщин, 60 капс (Арт. 2208)',
    image: '/product/yang.png', 
    images: ['/product/yang.png'],
    price: '5 000 сом',
    oldPrice: null,
    label: 'Хит',
    category: 'bady-health',
    is_hit: true,
    is_new: false,
    description: 'Специализированный натуральный комплекс для гармонизации гормональной и эндокринной систем. Разработан для поддержки репродуктивного здоровья, повышения выносливости, восстановления энергетического баланса и жизненных сил как у мужчин, так и у женщин.',
    specs: 'Артикул: 2208; Количество: 60 капсул; Форма выпуска: Капсулы; Назначение: Репродуктивное здоровье и баланс сил'
  },


  // --- 5. Сила пчелы (bady-bee-power) ---
  {
    id: 'bady-bp1',
    title: 'Пчелиная огнёвка с экстрактом чаги, 60 капсул (Арт. 2035)',
    image: '/product/chagi.jpeg', 
    images: ['/product/chagi.jpeg'],
    price: '850 сом',
    oldPrice: null,
    label: 'Новинка',
    category: 'bady-bee-power',
    is_hit: false,
    is_new: true,
    description: 'Апипродукт направленного действия для регенерации органов ЖКТ. Эффективен при хронических застоях желчи, воспалениях желчного пузыря, способствует снижению уровня холестерина и нормализует метаболические функции печени.',
    specs: 'Артикул: 2035; Вес/Количество: 30 г (60 капсул); Состав: Экстракт личинок восковой моли (огнёвки), экстракт чаги'
  },

  // --- 6. Чай (bady-tea) ---
  {
    id: 'bady-t1',
    title: 'Тысячелистник трава, 50 г (Арт. 1540)',
    image: '/product/tea.jpg', 
    images: ['/product/tea.jpg'],
    price: '400 сом',
    oldPrice: '500 сом',
    label: 'Скидка',
    category: 'bady-tea',
    is_hit: false,
    is_new: false,
    description: 'Натуральное фитосырье высокого качества. Обладает выраженным антибактериальным, противовоспалительным и желчегонным эффектом. Стимулирует работу органов пищеварения и подготавливает ЖКТ к мануальным практикам.',
    specs: 'Артикул: 1540; Вес: 50 г; Форма выпуска: Высушенная измельченная трава'
  }
];





//=====================================
export const hits = [
  {
    id: '101',
    title: 'Книга "Клиническая анатомия человека"',
    image: '/product/clinic anatomy.jpg',
    price: '4 200 сом',
    images: [ 
      '/product/clinic anatomy.jpg',
      '/product/clinic anatomy 2.jpg',
      '/product/clinic anatomy 3.jpg',
      '/product/clinic anatomy 4.jpg',
      '/product/clinic anatomy 5.jpg',
      '/product/clinic anatomy 6.jpg'
          ],
    oldPrice: null, // Нет скидки
    label: 'Хит',
    category: 'books',
    is_hit: true,
    is_new: false,
    description: 'Фундаментальное практическое руководство по клинической анатомии. Содержит подробный разбор взаимосвязей внутренних органов для висцеральных практиков.',
    specs: 'Автор: А.Т. Огулов; Страниц: 464; Переплет: Твердый; Язык: Русский'
  },
  {
    id: '102',
    title: 'Плакат 3 в 1',
    image: '/product/plakat.jpg',
    price: '3 100 сом',
    images: [
      '/product/plakat.jpg',
      '/product/plakat 2.jpg'
    ],
    oldPrice: null, // Нет скидки
    label: 'Хит',
    category: 'posters',
    is_hit: true,
    is_new: false,
    description: 'Информационный наглядный плакат формата А3, отображающий ключевые проекционные зоны и схемы взаимодействия внутренних органов на теле человека.',
    specs: 'Формат: А3; Материал: Плотная ламинация; Тип: Настенный'
  },
  {
    id: '103',
    title: 'Устройство очистки ПВВК',
    image: '/product/pvvk.jpg',
    price: '13 900 сом',
    images: [
      '/product/pvvk.jpg',
      '/product/pvvk.jpg',
      '/product/pvvk.jpg',
      '/product/pvvk.jpg'
    ],
    oldPrice: null, // Нет скидки
    label: 'Хит',
    category: 'equipment',
    is_hit: true,
    is_new: false,
    description: 'Высокотехнологичный аппарат для последовательной молекулярной очистки и структурирования питьевой воды. Эффективно нейтрализует вредные примеси.',
    specs: 'Объем емкости: 3 л; Мощность: 400 Вт; Гарантия производителя: 12 месяцев'
  },
  {
    id: '104',
    title: 'Методы функциональной диагностики',
    image: '/product/metody.jpeg',
    price: '4 200 сом',
    images: [
      '/product/metody.jpeg',
      '/product/metody 2.jpg',
      '/product/metody 3.jpg',
      '/product/metody 4.jpg',
      '/product/metody 5.jpg'
    ],
    oldPrice: null, // Нет скидки
    label: 'Хит',
    category: 'books',
    is_hit: true,
    is_new: false,
    description: 'Учебно-методическое пособие по экспресс-диагностике функционального состояния организма человека через проекционные зоны и внешние признаки.',
    specs: 'Автор: А.Т. Огулов; Страниц: 280; Переплет: Твердый; Год издания: 2025'
  },
  {
    id: '105',
    title: 'Универсальные палочки Ахмат',
    image: '/product/palochki.png',
    images: [
      '/product/palochki.png',
      '/product/palochki 2.jpg',
      '/product/palochki 3.png',
      '/product/palochki 3.jpg',
      '/product/palochki 4.jpg',
      '/product/palochki 5.png'
    ],
    price : '8 800 сом',
    oldPrice: null, // Нет скидки
    label: 'Хит',
    category: 'others',
    is_hit: true,
    is_new: false,
    description: 'Специализированный деревянный инструмент для точечного массажа, проработки глубоких триггерных точек и снятия фасциального напряжения.',
    specs: 'Материал: Натуральный бук; Покрытие: Эко-лак; Комплектация: 2 шт.'
  },
  {
    id: '106',
    title: 'Большой плакат 3 в 1',
    image: '/product/plakat big.jpg',
    images: [
      '/product/plakat big.jpg',
      '/product/plakat big 2.jpg',
      '/product/plakat big 3.jpg',
    ],
    price: '1 700 сом',
    oldPrice: null, // Нет скидки
    label: 'Хит',
    category: 'posters',
    is_hit: true,
    is_new: false,
    description: 'Широкоформатный настенный плакат медицинского качества. Наглядно иллюстрирует проекционные зоны Огулова (вид спереди, сзади и на лице).',
    specs: 'Размер: 60х90 см; База: Износостойкий баннерный винил; Печать: Интерьерная'
  }
];

export const news = [
  {
    id: '201',
    title: 'Массажная рукавица',
    image: '/product/perchat.jpg',
    images: [
      '/product/perchat.jpg',
      '/product/perchat-2.jpg',
      '/product/perchat-3.jpg',
      '/product/perchat-4.jpg'
    ],
    price: '1 850 сом',
    oldPrice: null,
    label: 'Рекомендовано',
    category: 'scrapers',
    is_hit: false,
    is_new: true,
    description: 'Удобная массажная рукавица для интенсивного ухода за телом, улучшения микроциркуляции крови и самомассажа в домашних условиях.',
    specs: 'Материал: гипоаллергенный силикон; Цвет: синий; Размер: универсальный'
  },
  {
    id: '202',
    title: 'Скребок Гуаша для массажа',
    image: '/product/screb1.jpg',
    images: [
      '/product/screb1.jpg',
      '/product/screb1-2.jpg',
      '/product/screb1-3.jpg',
    ],
    price: '1 780 сом',
    oldPrice: null,
    label: 'Рекомендовано',
    category: 'scrapers',
    is_hit: false,
    is_new: true,
    description: 'Классический массажный скребок Гуаша из натурального камня для проработки рефлекторных зон лица и шеи.',
    specs: 'Материал: натуральный нефрит; Форма: сердце; Длина: 8 см'
  },
  {
    id: '203',
    title: 'Скребок для массажа',
    image: '/product/screb2.jpg',
    images: [
      '/product/screb2.jpg',
      '/product/screb2-2.jpg',
      '/product/screb2-3.jpg',
    ],
    price: '1 780 сом',
    oldPrice: null,
    label: 'Рекомендовано',
    category: 'scrapers',
    is_hit: false,
    is_new: true,
    description: 'Универсальный скребок для висцеральных и телесных практик. Помогает снять мышечные спазмы и триггерные узлы.',
    specs: 'Материал: медицинская сталь; Форма: вытянутая; Вес: 120 г'
  },
  {
    id: '204',
    title: 'Скребок для массажа Гуаша',
     image: '/product/screb3.jpg',
    images: [
      '/product/screb3.jpg',
      '/product/screb3-2.jpg',
      '/product/screb3-3.jpg',
    ],
    price: '1 780 сом',
    oldPrice: null,
    label: 'Рекомендовано',
    category: 'scrapers',
    is_hit: false,
    is_new: true,
    description: 'Профессиональный инструмент для традиционного китайского массажа Гуаша. Идеально сглаженные края защищают кожу от повреждений.',
    specs: 'Material: рог буйвола; Толщина: 4 мм; Упаковка: тканевый мешочек'
  },
  {
    id: '205',
    title: 'Скребок для массажа',
    image: '/product/screb4.jpg',
    images: [
      '/product/screb4.jpg',
      '/product/screb4-2.jpg',
      '/product/screb4-3.jpg',
    ],
    price: '1 850 сом',
    oldPrice: null,
    label: 'Рекомендовано',
    category: 'scrapers',
    is_hit: false,
    is_new: true,
    description: 'Эргономичный деревянный скребок для глубокого антицеллюлитного и лимфодренажного массажа крупных мышечных зон.',
    specs: 'Материал: натуральный бук; Покрытие: водостойкий лак; Длина: 15 см'
  },
  {
    id: '206',
    title: 'Скребок для массажа',
    image: '/product/screb5.jpg',
    images: [
      '/product/screb5.jpg',
      '/product/screb5-2.jpg',
      '/product/screb5-3.jpg',
    ],
    price: '1 780 сом',
    oldPrice: null,
    label: 'Рекомендовано',
    category: 'scrapers',
    is_hit: false,
    is_new: true,
    description: 'Гладкий массажер-скребок из полированного кварца. Оказывает приятный охлаждающий эффект и тонизирует кожные покровы.',
    specs: 'Материал: розовый кварц; Назначение: лицо и тело; Габариты: 10х5 см'
  },
  {
    id: '207',
    title: 'Скребок для массажа',
    image: '/product/screb6.jpg',
    images: [
      '/product/screb6.jpg',
      '/product/screb6-2.jpg',
      '/product/screb6-3.jpg',
    ],
    price: '1 780 сом',
    oldPrice: null,
    label: 'Рекомендовано',
    category: 'scrapers',
    is_hit: false,
    is_new: true,
    description: 'Гладкий массажер-скребок из полированного кварца. Оказывает приятный охлаждающий эффект и тонизирует кожные покровы.',
    specs: 'Материал: розовый кварц; Назначение: лицо и тело; Габариты: 10х5 см'
  }
];


export const sales = [
   {
    id: '301',
    title: 'Книга "Анатомия человека"',
    image: '/product/anatomy.jpg',
    images: [
      '/product/anatomy.jpg',
      '/product/anatomy2.jpg',
      '/product/anatomy3.jpg',
      '/product/anatomy4.jpg', 
      '/product/anatomy5.jpg',
      '/product/anatomy6.jpg'
    ],
    price: '2 720 сом',
    oldPrice: '3 200 сом', // По этому полю компонент поймет, что это Акция
    label: 'Скидка 15%',
    category: 'books',
    is_hit: false,
    is_new: false,
    description: 'Фундаментальное учебное пособие по анатомии человека с подробными иллюстрациями органов и проекционных зон.',
    specs: 'Автор: Профессор И.М. Иванов; Страниц: 320; Переплет: Мягкий'
  },
  {
    id: '302',
    title: 'Устройство очистки ПВВК',
    image: '/product/pvvk.jpg',
    images: [
      '/product/pvvk.jpg',
      '/product/pvvk.jpg',
      '/product/pvvk.jpg',
      '/product/pvvk.jpg'
    ],
    price: '11 800 сом',
    oldPrice: '13 900 сом',
    label: 'Скидка 15%',
    category: 'equipment',
    is_hit: false,
    is_new: false,
    description: 'Аппарат для приготовления структурированной питьевой воды высокой степени очистки. Нейтрализует хлор и тяжелые металлы.',
    specs: 'Объем: 2.5 л; Напряжение: 220 В; Срок службы фильтра: 6 месяцев'
  },
  {
    id: '303',
    title: 'Пластырь "Витон"',
    image: '/product/plastr.jpg',
    images: [
      '/product/plastr.jpg'
    ],
    price: '550 сом',
    oldPrice: '650 сом',
    label: 'Скидка 15%',
    category: 'others',
    id: '303',
    is_hit: false,
    is_new: false,
    description: 'Оздоровительный био-пластырь на основе экстрактов целебных трав. Снимает локальные болевые ощущения в суставах.',
    specs: 'В комплекте: 8 шт; Время действия: до 12 часов; Состав: растительный'
  },
  {
    id: '304',
    title: 'Поясница не могу ходить',
    image: '/product/poyas.jpeg',
    images: [
      '/product/poyas.jpeg',
    ],
    price: '1 020 сом',
    oldPrice: '1 200 сом',
    label: 'Скидка 15%',
    category: 'books',
    is_hit: false,
    is_new: false,
    description: 'Учебно-практическое руководство по самопомощи и разгрузке поясничного отдела позвоночника при острых болевых синдромах.',
    specs: 'Автор: А.Т. Огулов; Страниц: 180; Год издания: 2025'
  }
];

export const productsData = [...hits, ...news, ...sales, ...allProducts];


