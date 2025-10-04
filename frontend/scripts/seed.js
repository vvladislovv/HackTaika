const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Создаем администратора
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@hacktaika.com' },
    update: {},
    create: {
      email: 'admin@hacktaika.com',
      password: hashedPassword,
      name: 'Главный администратор',
    },
  })
  console.log('✅ Администратор создан:', admin.email)

  // Создаем социальные сети
  const socials = [
    {
      name: 'Telegram',
      url: 'https://t.me/hacktaika',
      icon: 'telegram',
      order: 1,
    },
    {
      name: 'VK',
      url: 'https://vk.com/hacktaika',
      icon: 'vk',
      order: 2,
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@hacktaika',
      icon: 'youtube',
      order: 3,
    },
  ]

  for (const social of socials) {
    await prisma.social.create({
      data: social,
    })
  }
  console.log('✅ Социальные сети созданы')

  // Создаем примеры работ
  const works = [
    {
      title: 'Интернет-магазин электроники',
      description:
        'Полнофункциональный интернет-магазин с каталогом, корзиной, оплатой и личным кабинетом. Адаптивный дизайн, быстрая загрузка, SEO оптимизация.',
      price: 'от 150 000 ₽',
      images: ['/media/works/ecommerce-shop.jpg'],
      videos: [],
      siteUrl: 'https://example-shop.com',
      clientName: 'Иван Петров',
      clientReview:
        'Отличная работа! Сайт работает быстро, дизайн современный. Продажи выросли на 40%.',
      category: 'E-commerce',
      featured: true,
    },
    {
      title: 'Корпоративный сайт для IT компании',
      description:
        'Современный корпоративный сайт с портфолио, блогом и формой обратной связи. Анимации, темная тема, мультиязычность.',
      price: 'от 80 000 ₽',
      images: ['/media/works/corporate-site.jpg'],
      videos: [],
      siteUrl: 'https://example-corp.com',
      clientName: 'Мария Сидорова',
      clientReview:
        'Профессиональный подход, все сроки соблюдены. Клиенты отмечают удобство сайта.',
      category: 'Корпоративный',
      featured: false,
    },
    {
      title: 'Telegram Mini App для заказов',
      description:
        'Разработка мини-приложения в Telegram для быстрых заказов еды. Интеграция с платежными системами и CRM.',
      price: 'от 120 000 ₽',
      images: ['/media/works/telegram-miniapp.jpg'],
      videos: ['/media/works/telegram-demo.mp4'],
      siteUrl: 'https://t.me/example_bot',
      clientName: 'Александр Иванов',
      clientReview:
        'Отличное решение! Конверсия выросла на 60%, клиенты довольны удобством.',
      category: 'Mini App',
      featured: true,
    },
    {
      title: 'Лендинг для запуска продукта',
      description:
        'Конверсионный лендинг с анимациями, A/B тестированием и интеграцией с аналитикой.',
      price: 'от 60 000 ₽',
      images: ['/media/works/landing-page.jpg'],
      videos: [],
      siteUrl: 'https://product-launch.example.com',
      clientName: 'Елена Смирнова',
      clientReview:
        'Конверсия 15%! Это в 3 раза выше, чем у предыдущего лендинга.',
      category: 'Landing',
      featured: false,
    },
  ]

  for (const work of works) {
    await prisma.work.create({ data: work })
  }
  console.log('✅ Примеры работ созданы')

  // Создаем примеры портфолио
  const portfolioItems = [
    {
      title: 'Telegram Mini App для заказов еды',
      description:
        'Разработка мини-приложения в Telegram для быстрых заказов еды. Интеграция с платежными системами и CRM. Результат: конверсия выросла на 60%.',
      images: ['/media/portfolio/telegram-miniapp-1.jpg', '/media/portfolio/telegram-miniapp-2.jpg'],
      videos: ['/media/portfolio/telegram-demo.mp4'],
      siteUrl: 'https://t.me/example_bot',
      clientName: 'Александр Иванов',
      clientReview:
        'Отличное решение! Конверсия выросла на 60%, клиенты довольны удобством.',
      category: 'miniapp',
      featured: true,
      order: 1,
    },
    {
      title: 'Корпоративный сайт финтех компании',
      description:
        'Полноценный сайт с личным кабинетом, калькулятором кредитов и интеграцией с банковским API. Современный дизайн и высокая безопасность.',
      images: ['/media/portfolio/fintech-site-1.jpg', '/media/portfolio/fintech-site-2.jpg'],
      videos: [],
      siteUrl: 'https://example-fintech.com',
      clientName: 'Мария Петрова',
      clientReview:
        'Профессиональная работа. Сайт повысил доверие клиентов и увеличил количество заявок.',
      category: 'website',
      featured: false,
      order: 2,
    },
    {
      title: 'Чат-бот для поддержки клиентов',
      description:
        'Интеллектуальный чат-бот с AI для автоматизации поддержки. Обрабатывает 80% типовых вопросов. Интеграция с CRM и аналитикой.',
      images: ['/media/portfolio/chatbot-1.jpg', '/media/portfolio/chatbot-2.jpg'],
      videos: ['/media/portfolio/chatbot-demo.mp4'],
      clientName: 'Сергей Николаев',
      clientReview:
        'Бот существенно снизил нагрузку на поддержку. Клиенты получают ответы мгновенно.',
      category: 'chatbot',
      featured: true,
      order: 3,
    },
    {
      title: 'E-commerce платформа',
      description:
        'Полнофункциональный интернет-магазин с каталогом, корзиной, оплатой и личным кабинетом. Адаптивный дизайн, быстрая загрузка, SEO оптимизация.',
      images: ['/media/portfolio/ecommerce-1.jpg', '/media/portfolio/ecommerce-2.jpg', '/media/portfolio/ecommerce-3.jpg'],
      videos: [],
      siteUrl: 'https://example-shop.com',
      clientName: 'Иван Петров',
      clientReview:
        'Отличная работа! Сайт работает быстро, дизайн современный. Продажи выросли на 40%.',
      category: 'ecommerce',
      featured: false,
      order: 4,
    },
    {
      title: 'Мобильное приложение для доставки',
      description:
        'Кроссплатформенное мобильное приложение для службы доставки. React Native, интеграция с картами, push-уведомления, платежи.',
      images: ['/media/portfolio/delivery-app-1.jpg', '/media/portfolio/delivery-app-2.jpg'],
      videos: ['/media/portfolio/delivery-demo.mp4'],
      clientName: 'Елена Смирнова',
      clientReview:
        'Приложение работает стабильно, пользователи довольны. Заказы выросли на 80%.',
      category: 'mobile',
      featured: true,
      order: 5,
    },
    {
      title: 'Лендинг для запуска продукта',
      description:
        'Конверсионный лендинг с анимациями, A/B тестированием и интеграцией с аналитикой. Результат: конверсия 15%.',
      images: ['/media/portfolio/landing-1.jpg', '/media/portfolio/landing-2.jpg'],
      videos: [],
      siteUrl: 'https://product-launch.example.com',
      clientName: 'Анна Козлова',
      clientReview:
        'Конверсия 15%! Это в 3 раза выше, чем у предыдущего лендинга.',
      category: 'landing',
      featured: false,
      order: 6,
    },
  ]

  for (const item of portfolioItems) {
    await prisma.portfolioItem.create({ data: item })
  }
  console.log('✅ Портфолио создано')

  // Создаем примеры статей (DevBlog)
  const blogPosts = [
    {
      title: '🚀 Запуск HackTaika: от идеи до MVP за 2 недели',
      content:
        'Привет! Добро пожаловать в наш DevBlog! 🎉\n\nСегодня расскажу, как мы создали HackTaika - платформу для веб-разработки и дизайна. От первой идеи до работающего MVP прошло всего 2 недели.\n\n**Что мы сделали:**\n- Создали современный сайт на Next.js 15\n- Настроили админ-панель для управления контентом\n- Интегрировали PostgreSQL с Prisma\n- Добавили анимации и адаптивный дизайн\n- Настроили Docker для простого деплоя\n\n**Технологии:**\n- Frontend: Next.js, React 19, TypeScript\n- Styling: Tailwind CSS, Framer Motion\n- Backend: Next.js API Routes\n- Database: PostgreSQL, Prisma ORM\n- Auth: NextAuth.js\n- Deployment: Docker\n\n**Результат:**\nПолучился быстрый, красивый и функциональный сайт, который легко масштабировать и поддерживать.\n\nСледите за обновлениями - в следующих постах расскажу про детали реализации! 💻',
      excerpt:
        'История создания HackTaika: от идеи до MVP за 2 недели. Технологии, подходы и первые результаты.',
      image: '/media/blog/hacktaika-launch.jpg',
      published: true,
    },
    {
      title: '⚡ Оптимизация производительности: как ускорить Next.js в 3 раза',
      content:
        'В этом посте поделюсь секретами оптимизации Next.js приложений. Наш сайт загружается за 0.8 секунды! 🚀\n\n**Что мы оптимизировали:**\n\n1. **Docker BuildKit кэширование**\n   - Время сборки сократилось с 10 до 2 минут\n   - Используем многоступенчатую сборку\n\n2. **Next.js оптимизация**\n   - Standalone output для минимального размера\n   - Webpack bundle splitting\n   - SWC минификация\n   - Image optimization (AVIF/WebP)\n\n3. **HTTP кэширование**\n   - Статика кэшируется на 1 год\n   - Правильные Cache-Control заголовки\n\n4. **Database оптимизация**\n   - Индексы для быстрых запросов\n   - Connection pooling\n\n**Результаты:**\n- Lighthouse Performance: 95/100\n- First Contentful Paint: 0.8s\n- Largest Contentful Paint: 1.2s\n- Time to Interactive: 1.5s\n\n**Инструменты мониторинга:**\n- Health checks для всех сервисов\n- Автоматические бэкапы БД\n- Логирование ошибок\n\nВ следующем посте расскажу про настройку CI/CD пайплайна! 🔧',
      excerpt:
        'Секреты оптимизации Next.js: как ускорить загрузку в 3 раза. Docker, кэширование, мониторинг.',
      image: '/media/blog/nextjs-optimization.jpg',
      published: true,
    },
    {
      title: '🎨 Создание дизайн-системы: от Figma до кода',
      content:
        'Дизайн-система - это основа масштабируемого продукта. Расскажу, как мы создали единую систему для HackTaika.\n\n**Наша дизайн-система включает:**\n\n**Цветовая палитра:**\n- Белый: #FFFFFF\n- Кремовый: #FFF8F0\n- Оранжевый: #FF6B35\n- Рыжий: #D4522A\n- Коричневый: #8B4513\n- Темно-коричневый: #5C3317\n\n**Компоненты:**\n- Button (разные размеры и состояния)\n- Card (для работ и портфолио)\n- Modal (для детального просмотра)\n- Input, Textarea (для форм)\n- Loading (анимация загрузки)\n\n**Типографика:**\n- Заголовки: Inter, 24px-48px\n- Основной текст: Inter, 16px-18px\n- Мелкий текст: Inter, 14px\n\n**Анимации:**\n- Framer Motion для плавных переходов\n- Apple-style появление текста\n- Hover эффекты\n\n**Инструменты:**\n- Figma для дизайна\n- Tailwind CSS для стилей\n- Storybook для документации\n\n**Результат:**\nКонсистентный дизайн, быстрая разработка, легкое поддержание. Время создания новых страниц сократилось в 2 раза! ⚡',
      excerpt:
        'Как создать дизайн-систему для веб-приложения: цвета, компоненты, типографика, анимации.',
      image: '/media/blog/design-system.jpg',
      published: true,
    },
    {
      title: '🐳 Docker для разработчиков: полная автоматизация',
      content:
        'Docker - это не просто контейнеризация, это полная автоматизация разработки! Покажу, как мы настроили идеальный workflow.\n\n**Наша Docker конфигурация:**\n\n**Development (docker-compose.yml):**\n- Hot reload для быстрой разработки\n- Volume mounting для live изменений\n- Health checks для всех сервисов\n- Persistent volumes для кэша\n\n**Production (docker-compose.prod.yml):**\n- Multi-stage build для минимального образа\n- BuildKit кэширование\n- Resource limits\n- Security headers\n\n**Makefile автоматизация:**\n```bash\nmake install    # Полная установка\nmake dev        # Development\nmake prod       # Production\nmake logs       # Логи\nmake health     # Проверка\nmake backup     # Бэкап БД\n```\n\n**CI/CD пайплайн:**\n- GitHub Actions\n- Автоматические тесты\n- Docker layer caching\n- Деплой на staging/production\n\n**Мониторинг:**\n- Health endpoints\n- Автоматические бэкапы\n- Логирование ошибок\n- Метрики производительности\n\n**Результат:**\n- Время настройки проекта: 1 команда\n- Время деплоя: 2 минуты\n- Время восстановления: 30 секунд\n\nDocker + Makefile = идеальный workflow! 🚀',
      excerpt:
        'Полная автоматизация с Docker: development, production, CI/CD, мониторинг. Makefile команды и best practices.',
      image: '/media/blog/docker-automation.jpg',
      published: true,
    },
    {
      title: '📱 Адаптивный дизайн: мобильная версия на 100%',
      content:
        'Мобильная версия - это не просто уменьшенная десктопная версия. Это отдельный продукт! Покажу, как мы создали идеальную мобильную версию HackTaika.\n\n**Принципы мобильного дизайна:**\n\n**1. Mobile First подход**\n- Сначала проектируем для мобильных\n- Потом адаптируем для десктопа\n- Прогрессивное улучшение\n\n**2. Touch-friendly интерфейс**\n- Минимум 44px для кликабельных элементов\n- Большие кнопки и ссылки\n- Удобная навигация\n\n**3. Производительность**\n- Lazy loading изображений\n- Оптимизация для медленных сетей\n- Минимальный JavaScript\n\n**4. UX для мобильных**\n- Быстрый доступ к главным функциям\n- Простые формы\n- Четкие CTA кнопки\n\n**Технические решения:**\n- CSS Grid + Flexbox\n- Media queries для breakpoints\n- Touch события\n- Viewport meta tag\n\n**Breakpoints:**\n- Mobile: 320px-768px\n- Tablet: 768px-1024px\n- Desktop: 1024px+\n\n**Результат:**\n- Mobile Lighthouse: 98/100\n- Время загрузки: 1.2s\n- Конверсия: +25%\n\nМобильная версия - это не опция, это необходимость! 📱',
      excerpt:
        'Создание идеальной мобильной версии: Mobile First, Touch-friendly, производительность, UX.',
      image: '/media/blog/mobile-design.jpg',
      published: true,
    },
    {
      title: '🔐 Безопасность веб-приложений: защищаем данные клиентов',
      content:
        'Безопасность - это не фича, это базовая необходимость! Расскажу, как мы защищаем HackTaika и данные наших клиентов.\n\n**Уровни защиты:**\n\n**1. Аутентификация и авторизация**\n- NextAuth.js для безопасного входа\n- JWT токены с коротким временем жизни\n- Хеширование паролей (bcrypt)\n- Защищенные API routes\n\n**2. Защита данных**\n- HTTPS обязательно\n- Валидация всех входных данных (Zod)\n- SQL injection защита (Prisma)\n- XSS защита (React)\n\n**3. HTTP Security Headers**\n```\nStrict-Transport-Security: max-age=63072000\nX-Frame-Options: SAMEORIGIN\nX-Content-Type-Options: nosniff\nX-XSS-Protection: 1; mode=block\n```\n\n**4. Environment Security**\n- Секреты в переменных окружения\n- Разные ключи для dev/prod\n- Регулярная ротация ключей\n\n**5. Мониторинг безопасности**\n- Логирование подозрительной активности\n- Rate limiting для API\n- Health checks\n- Автоматические бэкапы\n\n**6. Docker Security**\n- Non-root пользователь\n- Минимальные образы\n- Регулярные обновления\n\n**Best Practices:**\n- Принцип минимальных привилегий\n- Регулярные аудиты безопасности\n- Обновление зависимостей\n- Обучение команды\n\n**Результат:**\n- 0 уязвимостей в production\n- A+ рейтинг SSL Labs\n- Соответствие GDPR\n\nБезопасность - это процесс, а не состояние! 🔒',
      excerpt:
        'Комплексная защита веб-приложения: аутентификация, валидация, HTTPS, мониторинг, best practices.',
      image: '/media/blog/web-security.jpg',
      published: true,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post })
  }
  console.log('✅ Статьи блога созданы')

  console.log('🎉 База данных успешно заполнена!')
  console.log('')
  console.log('📝 Данные для входа в админку:')
  console.log('Email: admin@hacktaika.com')
  console.log('Пароль: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

