import { useId, useState, type ChangeEvent } from 'react'
import {
  describeValues,
  type CalculatorModel,
  type CalculatorValues,
  type NumberField,
  type ToggleField,
} from '../../data/calculator.ts'
import type { Service } from '../../data/services.ts'
import { cx } from '../../utils/cx.ts'
import { formatNumber, formatPrice } from '../../utils/format.ts'
import { Button } from '../Button/Button.tsx'
import { ChoiceGroup } from '../Form/Form.tsx'
import { ArrowRepeatIcon, ClockIcon, DashIcon, ExclamationCircleIcon, PlusIcon } from '../Icon/icons.tsx'
import { RequestForm } from '../RequestForm/RequestForm.tsx'
import styles from './Calculator.module.css'

const MAX_SLIDER_STEPS = 200

function clamp(field: NumberField, value: number) {
  return Math.min(field.max, Math.max(field.min, value))
}

function roundToStep(field: NumberField, value: number) {
  const decimals = String(field.step).split('.')[1]?.length ?? 0
  return Number((Math.round(value / field.step) * field.step).toFixed(decimals))
}

type NumberControlProps = {
  field: NumberField
  value: number
  onChange: (value: number) => void
}

function NumberControl({ field, value, onChange }: NumberControlProps) {
  const id = useId()
  const [draft, setDraft] = useState<string | null>(null)
  const hasSlider = (field.max - field.min) / field.step <= MAX_SLIDER_STEPS
  const shown = draft ?? String(value).replace('.', ',')

  const commit = (next: number) => {
    setDraft(null)
    onChange(clamp(field, roundToStep(field, next)))
  }

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    setDraft(raw)
    const parsed = Number(raw.replace(',', '.'))
    if (raw.trim() !== '' && Number.isFinite(parsed)) onChange(clamp(field, parsed))
  }

  return (
    <div className={styles.number}>
      <div className={styles.numberHead}>
        <label htmlFor={id} className={styles.fieldLabel}>
          {field.label}
        </label>
        <span className={styles.range}>
          от {formatNumber(field.min)} до {formatNumber(field.max)} {field.unit}
        </span>
      </div>
      <div className={styles.numberRow}>
        <button
          type="button"
          className={styles.step}
          aria-label={`Уменьшить: ${field.label}`}
          disabled={value <= field.min}
          onClick={() => commit(value - field.step)}
        >
          <DashIcon />
        </button>
        <div className={styles.inputWrap}>
          <input
            id={id}
            className={styles.input}
            type="text"
            inputMode="decimal"
            value={shown}
            onChange={handleInput}
            onBlur={() => commit(value)}
          />
          <span className={styles.unit}>{field.unit}</span>
        </div>
        <button
          type="button"
          className={styles.step}
          aria-label={`Увеличить: ${field.label}`}
          disabled={value >= field.max}
          onClick={() => commit(value + field.step)}
        >
          <PlusIcon />
        </button>
      </div>
      {hasSlider ? (
        <input
          className={styles.slider}
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          aria-label={`${field.label}, ${field.unit}`}
          onChange={(event) => commit(Number(event.target.value))}
        />
      ) : null}
    </div>
  )
}

type ToggleControlProps = {
  field: ToggleField
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleControl({ field, checked, onChange }: ToggleControlProps) {
  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        role="switch"
        className={styles.switchInput}
        checked={checked}
        aria-checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.switch} aria-hidden="true" />
      <span className={styles.toggleText}>
        <span className={styles.fieldLabel}>{field.label}</span>
        <span className={styles.toggleDescription}>{field.description}</span>
      </span>
    </label>
  )
}

type CalculatorProps = {
  model: CalculatorModel
  service: Service
  className?: string
}

export function Calculator({ model, service, className }: CalculatorProps) {
  const [values, setValues] = useState<CalculatorValues>(model.defaults)
  const [isSending, setIsSending] = useState(false)
  const estimate = model.estimate(values)

  const update = (name: string, value: string | number | boolean) => {
    setValues((current) => ({ ...current, [name]: value }))
  }

  return (
    <div className={cx(styles.calculator, className)}>
      <div className={styles.fields}>
        {model.fields.map((field) => {
          if (field.type === 'choice') {
            return (
              <ChoiceGroup
                key={field.name}
                legend={field.label}
                name={`${service.slug}-${field.name}`}
                options={field.options.map(({ value, label, description }) => ({ value, label, description }))}
                value={String(values[field.name])}
                onChange={(value) => update(field.name, value)}
              />
            )
          }
          if (field.type === 'number') {
            const raw = values[field.name]
            return (
              <NumberControl
                key={field.name}
                field={field}
                value={typeof raw === 'number' ? raw : field.min}
                onChange={(value) => update(field.name, value)}
              />
            )
          }
          return (
            <ToggleControl
              key={field.name}
              field={field}
              checked={values[field.name] === true}
              onChange={(checked) => update(field.name, checked)}
            />
          )
        })}
        <Button
          variant="text"
          className={styles.reset}
          onClick={() => {
            setValues(model.defaults)
            setIsSending(false)
          }}
        >
          <ArrowRepeatIcon />
          Сбросить параметры
        </Button>
      </div>

      <aside className={styles.summary} aria-label="Результат расчёта">
        <p className={styles.summaryLabel}>Ориентировочная стоимость</p>
        <p className={styles.total} aria-live="polite" aria-atomic="true">
          ≈ {formatPrice(estimate.total)}
        </p>
        <ul className={styles.lines}>
          {estimate.lines.map((line) => (
            <li key={line.label} className={styles.line}>
              <span>{line.label}</span>
              <span className={cx(styles.amount, line.amount < 0 && styles.discount)}>
                {line.amount < 0 ? `−${formatPrice(-line.amount)}` : formatPrice(line.amount)}
              </span>
            </li>
          ))}
          <li className={styles.line}>
            <span>Замер и дизайн-макет</span>
            <span className={styles.free}>бесплатно</span>
          </li>
        </ul>
        <p className={styles.lead}>
          <ClockIcon />
          Изготовление: {estimate.leadTime}
        </p>
        {estimate.warning ? (
          <p className={styles.warning}>
            <ExclamationCircleIcon />
            {estimate.warning}
          </p>
        ) : null}
        <p className={styles.note}>Цена ориентировочная. Точную смету назовём после замера.</p>

        {isSending ? (
          <RequestForm
            kind="estimate"
            defaultService={service.slug}
            topic={service.title}
            estimate={{ details: describeValues(model, values), total: estimate.total, leadTime: estimate.leadTime }}
            message="optional"
            messageLabel="Адрес объекта или комментарий"
            submitLabel="Отправить расчёт"
            className={styles.form}
          />
        ) : (
          <Button fullWidth onClick={() => setIsSending(true)}>
            Отправить расчёт менеджеру
          </Button>
        )}
      </aside>
    </div>
  )
}
