import { useState, useTransition, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import { services, type ServiceSlug } from '../../data/services.ts'
import type { LeadRequest, RequestKind } from '../../store/requests.ts'
import { cx } from '../../utils/cx.ts'
import { formatPhoneInput, isValidPhone, phoneDigits } from '../../utils/phone.ts'
import { submitRequest } from '../../utils/submitRequest.ts'
import { isValidEmail, readText } from '../../utils/validation.ts'
import { Button } from '../Button/Button.tsx'
import { ChoiceGroup, ConsentCheckbox, PhoneField, SelectField, TextAreaField, TextField } from '../Form/Form.tsx'
import { CheckCircleIcon } from '../Icon/icons.tsx'
import styles from './RequestForm.module.css'

const callTimes = [
  { value: 'asap', label: 'Как можно скорее' },
  { value: 'morning', label: 'Утром, 9–12' },
  { value: 'day', label: 'Днём, 12–16' },
  { value: 'evening', label: 'Вечером, 16–19' },
] as const

type CallTime = (typeof callTimes)[number]['value']

const serviceOptions = [
  { value: '', label: 'Пока не знаю, нужна консультация' },
  ...services.map((service) => ({ value: service.slug, label: service.title })),
]

type FieldName = 'name' | 'phone' | 'email' | 'message' | 'consent'
type Errors = Partial<Record<FieldName, string>>

type RequestFormProps = {
  kind: RequestKind
  layout?: 'inline' | 'stacked'
  submitLabel?: string
  withService?: boolean
  withEmail?: boolean
  withCallTime?: boolean
  message?: 'none' | 'optional' | 'required'
  messageLabel?: string
  defaultService?: ServiceSlug
  topic?: string
  estimate?: LeadRequest['estimate']
  onSuccess?: (request: LeadRequest) => void
  footer?: ReactNode
  className?: string
}

export function RequestForm({
  kind,
  layout = 'stacked',
  submitLabel = 'Отправить',
  withService = false,
  withEmail = false,
  withCallTime = false,
  message = 'none',
  messageLabel = 'Комментарий',
  defaultService,
  topic,
  estimate,
  onSuccess,
  footer,
  className,
}: RequestFormProps) {
  const [errors, setErrors] = useState<Errors>({})
  const [callTime, setCallTime] = useState<CallTime>('asap')
  const [sent, setSent] = useState<LeadRequest | null>(null)
  const [formKey, setFormKey] = useState(0)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = readText(data, 'name')
    const phone = readText(data, 'phone')
    const email = readText(data, 'email')
    const text = readText(data, 'message')
    const service = readText(data, 'service')

    const found: Errors = {}
    if (name.length < 2) found.name = 'Укажите, как к вам обращаться'
    if (!isValidPhone(phone)) found.phone = 'Введите номер полностью: +7 и 10 цифр'
    if (withEmail && email && !isValidEmail(email)) found.email = 'Проверьте адрес: например, name@mail.ru'
    if (message === 'required' && text.length < 5) found.message = 'Напишите пару слов о задаче'
    if (data.get('consent') !== 'on') found.consent = 'Без согласия мы не сможем обработать заявку'
    setErrors(found)

    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    startTransition(async () => {
      const saved = await submitRequest({
        kind,
        name,
        phone: formatPhoneInput(phoneDigits(phone)),
        email: email || undefined,
        message: text || undefined,
        topic,
        preferredTime: withCallTime ? callTimes.find((time) => time.value === callTime)?.label : undefined,
        service: (service || defaultService || undefined) as ServiceSlug | undefined,
        estimate,
      })
      if (onSuccess) onSuccess(saved)
      else setSent(saved)
    })
  }

  if (sent) {
    return (
      <div className={cx(styles.success, className)} role="status">
        <CheckCircleIcon className={styles.successIcon} />
        <div className={styles.successBody}>
          <p className={styles.successTitle}>Заявка {sent.number} принята</p>
          <p className={styles.successText}>
            Перезвоним на номер {sent.phone} в рабочее время. Статус заявки видно в разделе{' '}
            <Link to="/requests" className={styles.successLink}>
              «Мои заявки»
            </Link>
            .
          </p>
        </div>
        <Button
          variant="outline"
          size="small"
          onClick={() => {
            setSent(null)
            setErrors({})
            setFormKey((key) => key + 1)
          }}
        >
          Отправить ещё одну
        </Button>
      </div>
    )
  }

  return (
    <form
      key={formKey}
      className={cx(styles.form, layout === 'inline' ? styles.inline : styles.stacked, className)}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={styles.fields}>
        <TextField
          label="Как к вам обращаться"
          name="name"
          autoComplete="name"
          placeholder="Иван Иванович"
          error={errors.name}
        />
        <PhoneField label="Телефон" name="phone" error={errors.phone} />
        {withEmail ? (
          <TextField
            label="Почта"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@mail.ru"
            optional
            error={errors.email}
            className={styles.wide}
          />
        ) : null}
        {withService ? (
          <SelectField
            label="Что нужно изготовить"
            name="service"
            options={serviceOptions}
            defaultValue={defaultService ?? ''}
            className={styles.wide}
          />
        ) : null}
        {withCallTime ? (
          <ChoiceGroup
            legend="Когда удобно поговорить"
            name="time"
            options={[...callTimes]}
            value={callTime}
            onChange={setCallTime}
            className={styles.wide}
          />
        ) : null}
        {message !== 'none' ? (
          <TextAreaField
            label={messageLabel}
            name="message"
            rows={4}
            optional={message === 'optional'}
            placeholder="Размеры, адрес объекта, желаемые сроки"
            error={errors.message}
            className={styles.wide}
          />
        ) : null}
        {layout === 'inline' ? (
          <Button type="submit" className={styles.submit} disabled={isPending}>
            {isPending ? 'Отправляем…' : submitLabel}
          </Button>
        ) : null}
      </div>

      <ConsentCheckbox error={errors.consent} />

      {layout === 'stacked' ? (
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? 'Отправляем…' : submitLabel}
        </Button>
      ) : null}

      {footer}
    </form>
  )
}
