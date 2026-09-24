import { useId, useState, type ChangeEvent, type ComponentProps, type ReactNode } from 'react'
import { Link } from 'react-router'
import { cx } from '../../utils/cx.ts'
import { formatPhoneInput, phoneDigits } from '../../utils/phone.ts'
import { ChevronDownIcon, ExclamationCircleIcon } from '../Icon/icons.tsx'
import styles from './Form.module.css'

type FieldOwnProps = {
  label: string
  hint?: string
  error?: string
  optional?: boolean
  className?: string
}

function describedBy(id: string, hint?: string, error?: string) {
  return cx(hint && `${id}-hint`, error && `${id}-error`) || undefined
}

function FieldFrame({
  id,
  label,
  hint,
  error,
  optional,
  className,
  children,
}: FieldOwnProps & { id: string; children: ReactNode }) {
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional ? <span className={styles.optional}> (необязательно)</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          <ExclamationCircleIcon />
          {error}
        </p>
      ) : null}
    </div>
  )
}

type TextFieldProps = FieldOwnProps & Omit<ComponentProps<'input'>, 'className'>

export function TextField({ label, hint, error, optional, className, id, ...props }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <FieldFrame id={inputId} label={label} hint={hint} error={error} optional={optional} className={className}>
      <input
        id={inputId}
        className={styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, hint, error)}
        {...props}
      />
    </FieldFrame>
  )
}

type PhoneFieldProps = FieldOwnProps & Omit<ComponentProps<'input'>, 'className' | 'value' | 'onChange' | 'type'>

export function PhoneField({ label, hint, error, optional, className, id, defaultValue, ...props }: PhoneFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [value, setValue] = useState(() => formatPhoneInput(typeof defaultValue === 'string' ? defaultValue : ''))

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    const isDeletingFormatting = next.length < value.length && phoneDigits(next) === phoneDigits(value)
    setValue(isDeletingFormatting ? formatPhoneInput(phoneDigits(value).slice(0, -1)) : formatPhoneInput(next))
  }

  return (
    <FieldFrame id={inputId} label={label} hint={hint} error={error} optional={optional} className={className}>
      <input
        id={inputId}
        className={styles.control}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+7 (913) 000-00-00"
        value={value}
        onChange={handleChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, hint, error)}
        {...props}
      />
    </FieldFrame>
  )
}

type TextAreaFieldProps = FieldOwnProps & Omit<ComponentProps<'textarea'>, 'className'>

export function TextAreaField({ label, hint, error, optional, className, id, ...props }: TextAreaFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <FieldFrame id={inputId} label={label} hint={hint} error={error} optional={optional} className={className}>
      <textarea
        id={inputId}
        className={cx(styles.control, styles.textarea)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, hint, error)}
        {...props}
      />
    </FieldFrame>
  )
}

type SelectFieldProps = FieldOwnProps &
  Omit<ComponentProps<'select'>, 'className'> & {
    options: Array<{ value: string; label: string }>
  }

export function SelectField({ label, hint, error, optional, className, id, options, ...props }: SelectFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <FieldFrame id={inputId} label={label} hint={hint} error={error} optional={optional} className={className}>
      <div className={styles.selectWrap}>
        <select
          id={inputId}
          className={cx(styles.control, styles.select)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, hint, error)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className={styles.selectIcon} />
      </div>
    </FieldFrame>
  )
}

type ChoiceOption<T extends string> = {
  value: T
  label: string
  description?: string
}

type ChoiceGroupProps<T extends string> = {
  legend: string
  name: string
  options: ChoiceOption<T>[]
  value: T
  onChange: (value: T) => void
  layout?: 'chips' | 'cards'
  className?: string
}

export function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  layout = 'chips',
  className,
}: ChoiceGroupProps<T>) {
  return (
    <fieldset className={cx(styles.fieldset, className)}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={layout === 'cards' ? styles.cards : styles.chips}>
        {options.map((option) => (
          <label key={option.value} className={styles.choice}>
            <input
              className={styles.choiceInput}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.choiceBody}>
              <span className={styles.choiceLabel}>{option.label}</span>
              {option.description ? <span className={styles.choiceDescription}>{option.description}</span> : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

type ConsentCheckboxProps = {
  error?: string
  defaultChecked?: boolean
}

export function ConsentCheckbox({ error, defaultChecked }: ConsentCheckboxProps) {
  const errorId = useId()

  return (
    <div className={styles.consent}>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          name="consent"
          className={styles.checkboxInput}
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <span>
          Согласен на обработку персональных данных по{' '}
          <Link to="/privacy" className={styles.link} target="_blank">
            политике конфиденциальности
          </Link>
        </span>
      </label>
      {error ? (
        <p id={errorId} className={styles.error}>
          <ExclamationCircleIcon />
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className={styles.alert}>
      <ExclamationCircleIcon />
      <div>{children}</div>
    </div>
  )
}
