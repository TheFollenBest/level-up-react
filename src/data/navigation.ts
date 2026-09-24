export type NavItem = {
  label: string
  to: string
}

export const mainNavigation: NavItem[] = [
  { label: 'Цены', to: '/prices' },
  { label: 'Калькулятор', to: '/calculator' },
  { label: 'О компании', to: '/about' },
  { label: 'Вопросы и ответы', to: '/faq' },
  { label: 'Контакты', to: '/contacts' },
]

export const companyLinks: NavItem[] = [
  { label: 'О компании', to: '/about' },
  { label: 'Цены', to: '/prices' },
  { label: 'Калькулятор стоимости', to: '/calculator' },
  { label: 'Вопросы и ответы', to: '/faq' },
  { label: 'Контакты', to: '/contacts' },
  { label: 'Мои заявки', to: '/requests' },
]
