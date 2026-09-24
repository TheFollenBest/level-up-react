import { pluralize, roundTo } from '../utils/format.ts'
import type { ServiceSlug } from './services.ts'

export type ChoiceOption = {
  value: string
  label: string
  description?: string
  rate: number
}

export type ChoiceField = {
  type: 'choice'
  name: string
  label: string
  options: ChoiceOption[]
}

export type NumberField = {
  type: 'number'
  name: string
  label: string
  unit: string
  min: number
  max: number
  step: number
}

export type ToggleField = {
  type: 'toggle'
  name: string
  label: string
  description: string
}

export type CalculatorField = ChoiceField | NumberField | ToggleField

export type CalculatorValues = Record<string, string | number | boolean>

export type EstimateLine = {
  label: string
  amount: number
}

export type Estimate = {
  lines: EstimateLine[]
  total: number
  leadTime: string
  warning?: string
}

export type CalculatorModel = {
  slug: ServiceSlug
  fields: CalculatorField[]
  defaults: CalculatorValues
  estimate: (values: CalculatorValues) => Estimate
}

const URGENT_MARKUP = 0.25

const urgentField: ToggleField = {
  type: 'toggle',
  name: 'urgent',
  label: 'Срочное изготовление',
  description: 'Примерно вдвое быстрее, +25% к стоимости изготовления',
}

function mountingField(description: string): ToggleField {
  return { type: 'toggle', name: 'mounting', label: 'Монтаж', description }
}

function numberValue(values: CalculatorValues, field: NumberField) {
  const raw = values[field.name]
  const value = typeof raw === 'number' && Number.isFinite(raw) ? raw : field.min
  return Math.min(field.max, Math.max(field.min, value))
}

function choiceValue(values: CalculatorValues, field: ChoiceField) {
  return field.options.find((option) => option.value === values[field.name]) ?? field.options[0]!
}

function isOn(values: CalculatorValues, name: string) {
  return values[name] === true
}

function workingDays(min: number, max: number, urgent: boolean) {
  const from = urgent ? Math.max(1, Math.ceil(min / 2)) : min
  const to = urgent ? Math.max(from, Math.ceil(max / 2)) : max
  const days = pluralize(to, { one: 'рабочий день', few: 'рабочих дня', many: 'рабочих дней' })
  return from === to ? days : `${from}–${days}`
}

function finalize(lines: EstimateLine[], leadTime: string, warning?: string): Estimate {
  const rounded = lines.map((line) => ({ ...line, amount: roundTo(line.amount, 10) }))
  return {
    lines: rounded,
    total: rounded.reduce((sum, line) => sum + line.amount, 0),
    leadTime,
    warning,
  }
}

function withUrgency(lines: EstimateLine[], production: number, urgent: boolean) {
  return urgent ? [...lines, { label: 'Срочность', amount: production * URGENT_MARKUP }] : lines
}

function quantityDiscount(quantity: number, tiers: Array<[number, number]>) {
  return tiers.find(([minimum]) => quantity >= minimum)?.[1] ?? 0
}

const lettersLighting: ChoiceField = {
  type: 'choice',
  name: 'lighting',
  label: 'Подсветка',
  options: [
    { value: 'none', label: 'Без подсветки', rate: 40 },
    { value: 'front', label: 'Лицевая', rate: 110 },
    { value: 'halo', label: 'Контражурная', rate: 130 },
    { value: 'bulbs', label: 'Открытые с лампами', rate: 170 },
  ],
}
const lettersHeight: NumberField = { type: 'number', name: 'height', label: 'Высота букв', unit: 'см', min: 10, max: 150, step: 5 }
const lettersCount: NumberField = {
  type: 'number',
  name: 'count',
  label: 'Количество букв и знаков',
  unit: 'шт',
  min: 1,
  max: 60,
  step: 1,
}

const signKind: ChoiceField = {
  type: 'choice',
  name: 'kind',
  label: 'Тип вывески',
  options: [
    { value: 'flat', label: 'Плоская', description: 'Композит с печатью', rate: 6500 },
    { value: 'lit', label: 'Световая', description: 'С подсветкой', rate: 16000 },
    { value: 'bracket', label: 'Панель-кронштейн', description: 'Двусторонняя', rate: 24000 },
  ],
}
const signWidth: NumberField = { type: 'number', name: 'width', label: 'Ширина', unit: 'м', min: 0.5, max: 15, step: 0.1 }
const signHeight: NumberField = { type: 'number', name: 'height', label: 'Высота', unit: 'м', min: 0.3, max: 3, step: 0.1 }

const standMaterial: ChoiceField = {
  type: 'choice',
  name: 'material',
  label: 'Основа',
  options: [
    { value: 'pvc', label: 'ПВХ 3 мм', rate: 4500 },
    { value: 'composite', label: 'Композит 3 мм', rate: 6000 },
  ],
}
const standWidth: NumberField = { type: 'number', name: 'width', label: 'Ширина', unit: 'см', min: 30, max: 300, step: 5 }
const standHeight: NumberField = { type: 'number', name: 'height', label: 'Высота', unit: 'см', min: 30, max: 200, step: 5 }
const pocketsA4: NumberField = { type: 'number', name: 'pocketsA4', label: 'Карманы А4', unit: 'шт', min: 0, max: 24, step: 1 }
const pocketsA5: NumberField = { type: 'number', name: 'pocketsA5', label: 'Карманы А5', unit: 'шт', min: 0, max: 24, step: 1 }

const boxFace: ChoiceField = {
  type: 'choice',
  name: 'face',
  label: 'Лицевая часть',
  options: [
    { value: 'acrylic', label: 'Акрил', rate: 14000 },
    { value: 'textile', label: 'Ткань', rate: 11000 },
    { value: 'shaped', label: 'Фигурный короб', rate: 18000 },
  ],
}
const boxSides: ChoiceField = {
  type: 'choice',
  name: 'sides',
  label: 'Стороны',
  options: [
    { value: 'one', label: 'Односторонний', rate: 1 },
    { value: 'two', label: 'Двусторонний', rate: 1.6 },
  ],
}
const boxWidth: NumberField = { type: 'number', name: 'width', label: 'Ширина', unit: 'м', min: 0.3, max: 6, step: 0.1 }
const boxHeight: NumberField = { type: 'number', name: 'height', label: 'Высота', unit: 'м', min: 0.3, max: 3, step: 0.1 }

const posItem: ChoiceField = {
  type: 'choice',
  name: 'item',
  label: 'Изделие',
  options: [
    { value: 'wobbler', label: 'Воблеры', rate: 35 },
    { value: 'shelftalker', label: 'Шелфтокеры', rate: 60 },
    { value: 'tabletop', label: 'Настольные дисплеи', rate: 1200 },
    { value: 'floor', label: 'Напольные стойки', rate: 4500 },
  ],
}
const posQuantity: NumberField = { type: 'number', name: 'quantity', label: 'Тираж', unit: 'шт', min: 1, max: 10000, step: 1 }

const plateMaterial: ChoiceField = {
  type: 'choice',
  name: 'material',
  label: 'Материал',
  options: [
    { value: 'pvc', label: 'ПВХ с печатью', rate: 350 },
    { value: 'acrylic', label: 'Акрил', rate: 900 },
    { value: 'metal', label: 'Металл с гравировкой', rate: 1800 },
    { value: 'tactile', label: 'Тактильная', rate: 2500 },
  ],
}
const plateSize: ChoiceField = {
  type: 'choice',
  name: 'size',
  label: 'Размер',
  options: [
    { value: 's', label: '100×300 мм', rate: 1 },
    { value: 'm', label: '200×300 мм', rate: 1.5 },
    { value: 'l', label: '300×500 мм', rate: 2.5 },
  ],
}
const plateQuantity: NumberField = { type: 'number', name: 'quantity', label: 'Количество', unit: 'шт', min: 1, max: 500, step: 1 }

export const calculatorModels: CalculatorModel[] = [
  {
    slug: 'obemnye-bukvy',
    fields: [
      lettersLighting,
      lettersHeight,
      lettersCount,
      mountingField('Установка и подключение на объекте'),
      urgentField,
    ],
    defaults: { lighting: 'front', height: 40, count: 8, mounting: true, urgent: false },
    estimate: (values) => {
      const lighting = choiceValue(values, lettersLighting)
      const height = numberValue(values, lettersHeight)
      const count = numberValue(values, lettersCount)
      const urgent = isOn(values, 'urgent')
      const production = lighting.rate * height * count
      const lines = [{ label: 'Изготовление букв', amount: production }]
      if (isOn(values, 'mounting')) lines.push({ label: 'Монтаж и подключение', amount: Math.max(3500, production * 0.12) })
      const lead = lighting.value === 'none' ? workingDays(5, 7, urgent) : workingDays(7, 10, urgent)
      return finalize(withUrgency(lines, production, urgent), lead)
    },
  },
  {
    slug: 'vyveski',
    fields: [signKind, signWidth, signHeight, mountingField('Установка на фасад, крепёж и подключение'), urgentField],
    defaults: { kind: 'lit', width: 3, height: 0.8, mounting: true, urgent: false },
    estimate: (values) => {
      const kind = choiceValue(values, signKind)
      const area = numberValue(values, signWidth) * numberValue(values, signHeight)
      const urgent = isOn(values, 'urgent')
      const production = Math.max(5000, area * kind.rate)
      const lines = [{ label: `Изготовление, ${area.toFixed(2).replace('.', ',')} м²`, amount: production }]
      if (isOn(values, 'mounting')) lines.push({ label: 'Монтаж', amount: 3500 + area * 600 })
      const lead = kind.value === 'flat' ? workingDays(3, 5, urgent) : workingDays(7, 10, urgent)
      return finalize(withUrgency(lines, production, urgent), lead)
    },
  },
  {
    slug: 'informacionnye-stendy',
    fields: [
      standMaterial,
      standWidth,
      standHeight,
      pocketsA4,
      pocketsA5,
      mountingField('Крепление стенда на стену'),
      urgentField,
    ],
    defaults: { material: 'pvc', width: 100, height: 75, pocketsA4: 4, pocketsA5: 0, mounting: false, urgent: false },
    estimate: (values) => {
      const material = choiceValue(values, standMaterial)
      const area = (numberValue(values, standWidth) * numberValue(values, standHeight)) / 10_000
      const a4 = numberValue(values, pocketsA4)
      const a5 = numberValue(values, pocketsA5)
      const urgent = isOn(values, 'urgent')
      const production = Math.max(1500, area * material.rate)
      const lines = [{ label: 'Основа стенда с печатью', amount: production }]
      if (a4 + a5 > 0) lines.push({ label: 'Карманы', amount: a4 * 250 + a5 * 200 })
      if (isOn(values, 'mounting')) lines.push({ label: 'Монтаж', amount: 1500 })
      const pocketsArea = a4 * 0.0748 + a5 * 0.0391
      const warning =
        pocketsArea > area * 0.85 ? 'Столько карманов не поместится на стенд: увеличьте размер или уберите часть карманов.' : undefined
      return finalize(withUrgency(lines, production, urgent), workingDays(2, 3, urgent), warning)
    },
  },
  {
    slug: 'svetovye-koroba',
    fields: [boxFace, boxSides, boxWidth, boxHeight, mountingField('Установка и подключение на объекте'), urgentField],
    defaults: { face: 'acrylic', sides: 'one', width: 1.5, height: 0.6, mounting: true, urgent: false },
    estimate: (values) => {
      const face = choiceValue(values, boxFace)
      const sides = choiceValue(values, boxSides)
      const area = numberValue(values, boxWidth) * numberValue(values, boxHeight)
      const urgent = isOn(values, 'urgent')
      const production = Math.max(6000, area * face.rate * sides.rate)
      const lines = [{ label: `Изготовление, ${area.toFixed(2).replace('.', ',')} м²`, amount: production }]
      if (isOn(values, 'mounting')) lines.push({ label: 'Монтаж и подключение', amount: 3000 + area * 500 })
      const lead = face.value === 'shaped' ? workingDays(7, 10, urgent) : workingDays(5, 7, urgent)
      return finalize(withUrgency(lines, production, urgent), lead)
    },
  },
  {
    slug: 'pos-materialy',
    fields: [
      posItem,
      posQuantity,
      { type: 'toggle', name: 'delivery', label: 'Доставка', description: 'Привезём тираж по Новосибирску' },
      urgentField,
    ],
    defaults: { item: 'wobbler', quantity: 100, delivery: true, urgent: false },
    estimate: (values) => {
      const item = choiceValue(values, posItem)
      const quantity = numberValue(values, posQuantity)
      const urgent = isOn(values, 'urgent')
      const production = item.rate * quantity
      const discount = quantityDiscount(quantity, [
        [1000, 0.25],
        [500, 0.2],
        [100, 0.1],
      ])
      const lines = [{ label: `Изготовление, ${pluralize(quantity, { one: 'штука', few: 'штуки', many: 'штук' })}`, amount: production }]
      if (discount > 0) lines.push({ label: `Скидка за тираж ${Math.round(discount * 100)}%`, amount: -production * discount })
      if (isOn(values, 'delivery')) lines.push({ label: 'Доставка', amount: 700 })
      const isSmall = item.value === 'wobbler' || item.value === 'shelftalker'
      const lead = isSmall ? workingDays(3, 5, urgent) : workingDays(7, 10, urgent)
      const warning = isSmall && production < 3000 ? 'Минимальная сумма заказа на воблеры и шелфтокеры 3 000 ₽.' : undefined
      return finalize(withUrgency(lines, production, urgent), lead, warning)
    },
  },
  {
    slug: 'tablichki',
    fields: [plateMaterial, plateSize, plateQuantity, mountingField('Установка табличек на объекте'), urgentField],
    defaults: { material: 'acrylic', size: 's', quantity: 5, mounting: false, urgent: false },
    estimate: (values) => {
      const material = choiceValue(values, plateMaterial)
      const size = choiceValue(values, plateSize)
      const quantity = numberValue(values, plateQuantity)
      const urgent = isOn(values, 'urgent')
      const production = material.rate * size.rate * quantity
      const discount = quantityDiscount(quantity, [
        [50, 0.2],
        [10, 0.1],
      ])
      const lines = [{ label: `Изготовление, ${pluralize(quantity, { one: 'штука', few: 'штуки', many: 'штук' })}`, amount: production }]
      if (discount > 0) lines.push({ label: `Скидка за количество ${Math.round(discount * 100)}%`, amount: -production * discount })
      if (isOn(values, 'mounting')) lines.push({ label: 'Монтаж', amount: 300 * quantity })
      const isComplex = material.value === 'metal' || material.value === 'tactile'
      return finalize(withUrgency(lines, production, urgent), isComplex ? workingDays(3, 5, urgent) : workingDays(2, 3, urgent))
    },
  },
]

const modelIndex = new Map(calculatorModels.map((model) => [model.slug, model]))

export function getCalculatorModel(slug: ServiceSlug) {
  const model = modelIndex.get(slug)
  if (!model) throw new Error(`Missing calculator model for ${slug}`)
  return model
}

export function describeValues(model: CalculatorModel, values: CalculatorValues) {
  return model.fields.flatMap((field) => {
    if (field.type === 'choice') return [`${field.label}: ${choiceValue(values, field).label.toLowerCase()}`]
    if (field.type === 'number') return [`${field.label}: ${String(numberValue(values, field)).replace('.', ',')} ${field.unit}`]
    return isOn(values, field.name) ? [field.label] : []
  })
}
