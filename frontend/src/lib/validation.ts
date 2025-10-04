import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен быть минимум 6 символов'),
})

export const workSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  description: z.string().min(10, 'Описание должно быть минимум 10 символов'),
  price: z.string().min(1, 'Цена обязательна'),
  images: z.array(z.string().url('Неверный URL изображения')),
  videos: z.array(z.string().url('Неверный URL видео')).optional(),
  siteUrl: z.string().url('Неверный URL сайта').optional().or(z.literal('')),
  clientName: z.string().min(1, 'Имя клиента обязательно'),
  clientReview: z.string().min(10, 'Отзыв должен быть минимум 10 символов'),
  category: z.string().min(1, 'Категория обязательна'),
  featured: z.boolean().optional(),
})

export const portfolioSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  description: z.string().min(10, 'Описание должно быть минимум 10 символов'),
  images: z.array(z.string().url('Неверный URL изображения')),
  videos: z.array(z.string().url('Неверный URL видео')).optional(),
  siteUrl: z.string().url('Неверный URL сайта').optional().or(z.literal('')),
  clientName: z.string().min(1, 'Имя клиента обязательно'),
  clientReview: z.string().min(10, 'Отзыв должен быть минимум 10 символов'),
  category: z.string().min(1, 'Категория обязательна'),
  featured: z.boolean().optional(),
  order: z.number().optional(),
})

export const blogSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен'),
  content: z.string().min(50, 'Контент должен быть минимум 50 символов'),
  excerpt: z.string().min(10, 'Краткое описание должно быть минимум 10 символов'),
  image: z.string().url('Неверный URL изображения').optional().or(z.literal('')),
  published: z.boolean().optional(),
})

export const socialSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  url: z.string().url('Неверный URL'),
  icon: z.string().min(1, 'Иконка обязательна'),
  order: z.number().optional(),
})

export const adminSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен быть минимум 6 символов'),
  name: z.string().min(1, 'Имя обязательно'),
})

export const orderSchema = z.object({
  name: z.string().min(2, 'Имя должно быть минимум 2 символа'),
  email: z.string().email('Неверный формат email'),
  phone: z.string().min(10, 'Неверный формат телефона'),
  message: z.string().min(10, 'Сообщение должно быть минимум 10 символов'),
  workId: z.string().optional(),
})

// Новая схема для подробной заявки
export const detailedApplicationSchema = z.object({
  // Блок 1: Контактная информация
  fullName: z.string().min(2, 'Введите ваше полное имя'),
  email: z.string().email('Неверный формат email'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  
  // Блок 2: О проекте
  projectType: z.string().min(1, 'Выберите тип проекта'),
  budget: z.string().min(1, 'Выберите бюджет'),
  deadline: z.string().min(1, 'Укажите сроки'),
  
  // Блок 3: Детали
  description: z.string().min(20, 'Опишите проект подробнее (минимум 20 символов)'),
  additionalInfo: z.string().optional(),
})
