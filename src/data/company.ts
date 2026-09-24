export type WorkingDay = {
  day: number
  label: string
  opens: string | null
  closes: string | null
}

export const company = {
  name: 'Level Up',
  legalName: 'ООО «Левел Ап»',
  tagline: 'Рекламно-производственная компания',
  city: 'Новосибирск',
  address: 'г. Новосибирск, ул. Российская, 15',
  shortAddress: 'ул. Российская, 15',
  timeZone: 'Asia/Novosibirsk',
  phone: {
    display: '+7 (913) 917-07-82',
    href: 'tel:+79139170782',
  },
  email: 'boss_level_up@bk.ru',
  socials: [
    { id: 'vk', label: 'ВКонтакте', handle: 'boss_level_up', href: 'https://vk.com/boss_level_up' },
    { id: 'instagram', label: 'Instagram', handle: 'boss_level_up', href: 'https://instagram.com/boss_level_up' },
  ],
  mapWidgetUrl: 'https://yandex.ru/map-widget/v1/?mode=search&z=16&text=%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA%2C%20%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%B0%D1%8F%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%2C%2015',
  routeUrl: 'https://yandex.ru/maps/?rtext=~%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA%2C%20%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%B0%D1%8F%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%2C%2015&rtt=auto',
} as const

export const workingHours: WorkingDay[] = [
  { day: 1, label: 'Понедельник', opens: '09:00', closes: '19:00' },
  { day: 2, label: 'Вторник', opens: '09:00', closes: '19:00' },
  { day: 3, label: 'Среда', opens: '09:00', closes: '19:00' },
  { day: 4, label: 'Четверг', opens: '09:00', closes: '19:00' },
  { day: 5, label: 'Пятница', opens: '09:00', closes: '19:00' },
  { day: 6, label: 'Суббота', opens: '10:00', closes: '16:00' },
  { day: 0, label: 'Воскресенье', opens: null, closes: null },
]

export const workingHoursSummary = [
  { days: 'Пн–Пт', hours: '09:00–19:00' },
  { days: 'Сб', hours: '10:00–16:00' },
  { days: 'Вс', hours: 'выходной' },
]
