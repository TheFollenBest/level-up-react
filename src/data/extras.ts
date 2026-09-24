import type { Price } from './services.ts'

export type ExtraService = {
  id: string
  title: string
  description: string
  price: Price | 'free'
}

export const extraServices: ExtraService[] = [
  {
    id: 'measure',
    title: 'Выезд замерщика',
    description: 'Замер, фотографии фасада, консультация на месте',
    price: 'free',
  },
  {
    id: 'design',
    title: 'Дизайн-макет и визуализация',
    description: 'При заказе изготовления в Level Up',
    price: 'free',
  },
  {
    id: 'install',
    title: 'Монтаж вывески',
    description: 'Установка и подключение, крепёж входит в стоимость',
    price: { from: 3500, unit: 'за объект' },
  },
  {
    id: 'dismantle',
    title: 'Демонтаж старой конструкции',
    description: 'С вывозом и утилизацией',
    price: { from: 2000, unit: 'за объект' },
  },
  {
    id: 'lift',
    title: 'Автовышка',
    description: 'Для работ выше 3 метров',
    price: { from: 2500, unit: 'за час' },
  },
  {
    id: 'repair',
    title: 'Ремонт подсветки',
    description: 'Диагностика и замена модулей или блока питания',
    price: { from: 1500, unit: 'за выезд' },
  },
]
