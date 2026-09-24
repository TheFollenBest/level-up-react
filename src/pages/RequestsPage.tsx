import { Link } from 'react-router'
import { Button, ButtonLink } from '../components/Button/Button.tsx'
import { EmptyState } from '../components/EmptyState/EmptyState.tsx'
import { TrashIcon, XIcon } from '../components/Icon/icons.tsx'
import { PageHeader } from '../components/PageHeader/PageHeader.tsx'
import { PageMeta } from '../components/PageMeta/PageMeta.tsx'
import { company } from '../data/company.ts'
import { getService } from '../data/services.ts'
import { cancelRequest, removeRequest, requestKindLabels, useRequests, type LeadRequest } from '../store/requests.ts'
import { openRequestDialog } from '../store/requestDialog.ts'
import { cx } from '../utils/cx.ts'
import { formatDateTime, formatPrice } from '../utils/format.ts'
import styles from './RequestsPage.module.css'

function RequestCard({ request }: { request: LeadRequest }) {
  const service = getService(request.service)
  const isCancelled = request.status === 'cancelled'

  return (
    <article className={cx(styles.card, isCancelled && styles.cancelled)} aria-labelledby={`request-${request.id}`}>
      <header className={styles.cardHead}>
        <div>
          <h2 id={`request-${request.id}`} className={styles.number}>
            {requestKindLabels[request.kind]} № {request.number}
          </h2>
          <p className={styles.date}>
            <time dateTime={request.createdAt}>{formatDateTime(request.createdAt)}</time>
          </p>
        </div>
        <p className={styles.status} data-status={request.status}>
          {isCancelled ? 'Отменена' : 'Отправлена'}
        </p>
      </header>

      <dl className={styles.details}>
        <div>
          <dt>Контакт</dt>
          <dd>
            {request.name}, {request.phone}
            {request.email ? `, ${request.email}` : ''}
          </dd>
        </div>
        {request.topic ? (
          <div>
            <dt>Тема</dt>
            <dd>{request.topic}</dd>
          </div>
        ) : null}
        {service ? (
          <div>
            <dt>Услуга</dt>
            <dd>
              <Link to={`/services/${service.slug}`}>{service.title}</Link>
            </dd>
          </div>
        ) : null}
        {request.preferredTime ? (
          <div>
            <dt>Когда позвонить</dt>
            <dd>{request.preferredTime}</dd>
          </div>
        ) : null}
        {request.message ? (
          <div>
            <dt>Сообщение</dt>
            <dd className={styles.message}>{request.message}</dd>
          </div>
        ) : null}
      </dl>

      {request.estimate ? (
        <div className={styles.estimate}>
          <p className={styles.estimateTotal}>
            Расчёт: ≈ {formatPrice(request.estimate.total)}, {request.estimate.leadTime}
          </p>
          <ul className={styles.estimateList}>
            {request.estimate.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={styles.actions}>
        {isCancelled ? (
          <Button variant="text" onClick={() => removeRequest(request.id)}>
            <TrashIcon />
            Удалить из списка
          </Button>
        ) : (
          <Button variant="text" onClick={() => cancelRequest(request.id)}>
            <XIcon />
            Отменить заявку
          </Button>
        )}
      </div>
    </article>
  )
}

export function RequestsPage() {
  const requests = useRequests((state) => state)
  const active = requests.filter((request) => request.status === 'sent').length

  return (
    <>
      <PageMeta title="Мои заявки" description="Заявки, отправленные с этого устройства." />
      <PageHeader
        title="Мои заявки"
        breadcrumbs={[{ label: 'Мои заявки' }]}
        lead={
          requests.length > 0
            ? `Здесь заявки, отправленные с этого устройства. Активных: ${active}. Если планы изменились, отмените заявку или позвоните нам.`
            : 'Здесь появятся заявки, которые вы отправите с этого устройства.'
        }
      />

      <div className={cx('container', styles.page)}>
        {requests.length === 0 ? (
          <EmptyState
            title="Заявок пока нет"
            action={
              <>
                <ButtonLink to="/calculator">Рассчитать стоимость</ButtonLink>
                <Button variant="outline" onClick={() => openRequestDialog({ kind: 'callback' })}>
                  Заказать звонок
                </Button>
              </>
            }
          >
            Посчитайте стоимость в калькуляторе и отправьте расчёт или закажите звонок. Также можно позвонить нам:{' '}
            <a href={company.phone.href}>{company.phone.display}</a>.
          </EmptyState>
        ) : (
          <ul className={styles.list}>
            {requests.map((request) => (
              <li key={request.id}>
                <RequestCard request={request} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
