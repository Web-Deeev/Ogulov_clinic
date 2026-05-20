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

//=====================================
export const hits = [
  {
    id: '101',
    title: 'Книга "Клиническая анатомия человека"',
    image: '/images/shop/products/hit-1.jpg',
    price: '4 200 сом',
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
    image: '/images/shop/products/hit-2.jpg',
    price: '3 100 сом',
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
    image: '/images/shop/products/hit-3.jpg',
    price: '13 900 сом',
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
    image: '/images/shop/products/hit-4.jpg',
    price: '4 200 сом',
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
    image: '/images/shop/products/hit-5.jpg',
    price: '8 800 сом',
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
    image: '/images/shop/products/hit-6.jpg',
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
    image: '/images/shop/products/new-1.jpg',
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
    image: '/images/shop/products/new-2.jpg',
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
    image: '/images/shop/products/new-3.jpg',
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
    image: '/images/shop/products/new-4.jpg',
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
    image: '/images/shop/products/new-5.jpg',
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
    image: '/images/shop/products/new-6.jpg',
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
    image: '/images/shop/products/sale-1.jpg',
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
    image: '/images/shop/products/sale-2.jpg',
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
    image: '/images/shop/products/sale-3.jpg',
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
    image: '/images/shop/products/sale-4.jpg',
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

export const productsData = [...hits, ...news, ...sales];