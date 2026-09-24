import { EnvelopeIcon, GeoAltIcon, TelephoneIcon } from '../components/Icon/icons.tsx'
import { MapEmbed } from '../components/MapEmbed/MapEmbed.tsx'
import { OpenStatus } from '../components/OpenStatus/OpenStatus.tsx'
import { PageHeader } from '../components/PageHeader/PageHeader.tsx'
import { PageMeta } from '../components/PageMeta/PageMeta.tsx'
import { RequestForm } from '../components/RequestForm/RequestForm.tsx'
import { SocialLinks } from '../components/SocialLinks/SocialLinks.tsx'
import { company, workingHours } from '../data/company.ts'
import { useNow } from '../hooks/useNow.ts'
import { cx } from '../utils/cx.ts'
import { getOpenStatus } from '../utils/openStatus.ts'
import styles from './ContactsPage.module.css'

export function ContactsPage() {
  const today = getOpenStatus(useNow()).today

  return (
    <>
      <PageMeta
        title="Контакты"
        description={`Адрес, телефон и режим работы Level Up: ${company.address}, ${company.phone.display}.`}
      />
      <PageHeader
        title="Контакты"
        breadcrumbs={[{ label: 'Контакты' }]}
        lead="Звоните, пишите или приезжайте в офис на Российской. Покажем образцы материалов и подсветки вживую."
      />

      <div className={cx('container', styles.page)}>
        <div className={styles.channels}>
          <section className={styles.card} aria-labelledby="address-title">
            <GeoAltIcon className={styles.icon} />
            <h2 id="address-title" className={styles.cardLabel}>
              Адрес
            </h2>
            <p className={styles.cardValue}>{company.address}</p>
            <a href={company.routeUrl} target="_blank" rel="noreferrer" className={styles.cardLink}>
              Построить маршрут
            </a>
          </section>

          <section className={styles.card} aria-labelledby="phone-title">
            <TelephoneIcon className={styles.icon} />
            <h2 id="phone-title" className={styles.cardLabel}>
              Телефон для заказов и вопросов
            </h2>
            <a href={company.phone.href} className={styles.cardValue}>
              {company.phone.display}
            </a>
            <OpenStatus />
          </section>

          <section className={styles.card} aria-labelledby="email-title">
            <EnvelopeIcon className={styles.icon} />
            <h2 id="email-title" className={styles.cardLabel}>
              Почта для связи
            </h2>
            <a href={`mailto:${company.email}`} className={styles.cardValue}>
              {company.email}
            </a>
            <p className={styles.cardNote}>Макеты и техзадания присылайте сюда же</p>
          </section>

          <section className={cx(styles.card, styles.hoursCard)} aria-labelledby="hours-title">
            <h2 id="hours-title" className={styles.cardLabel}>
              Режим работы
            </h2>
            <table className={styles.hours}>
              <tbody>
                {workingHours.map((day) => (
                  <tr key={day.day} className={cx(day.day === today && styles.today)}>
                    <th scope="row">
                      {day.label}
                      {day.day === today ? <span className="visually-hidden"> (сегодня)</span> : null}
                    </th>
                    <td>{day.opens && day.closes ? `${day.opens}–${day.closes}` : 'Выходной'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={styles.cardNote}>Время новосибирское. Монтаж делаем и в нерабочее время по договорённости.</p>
          </section>

          <section className={styles.card} aria-labelledby="social-title">
            <h2 id="social-title" className={styles.cardLabel}>
              Мы в соцсетях
            </h2>
            <SocialLinks withHandles />
          </section>
        </div>

        <section className={styles.formCard} aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className={styles.formTitle}>
            Напишите нам
          </h2>
          <p className={styles.formText}>Опишите задачу: что нужно изготовить, размеры и адрес. Ответим в рабочее время.</p>
          <RequestForm
            kind="question"
            withEmail
            withService
            message="required"
            messageLabel="Сообщение"
            submitLabel="Отправить сообщение"
          />
        </section>
      </div>

      <div className={cx('container', styles.mapSection)}>
        <MapEmbed className={styles.map} />
      </div>
    </>
  )
}
