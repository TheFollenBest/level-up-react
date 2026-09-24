const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 })

const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
})

const pluralRules = new Intl.PluralRules('ru-RU')

export function formatPrice(value: number) {
  return priceFormatter.format(value)
}

export function formatNumber(value: number) {
  return numberFormatter.format(value)
}

export function formatDateTime(value: string | Date) {
  return dateTimeFormatter.format(typeof value === 'string' ? new Date(value) : value)
}

export function pluralize(count: number, forms: { one: string; few: string; many: string }) {
  const rule = pluralRules.select(count)
  const word = rule === 'one' ? forms.one : rule === 'few' ? forms.few : forms.many
  return `${formatNumber(count)} ${word}`
}

export function roundTo(value: number, step: number) {
  return Math.round(value / step) * step
}

export function formatPriceFrom(price: { from: number; unit: string }) {
  return `от ${formatPrice(price.from)} ${price.unit}`
}
