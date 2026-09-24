import { PageHeader } from '../components/PageHeader/PageHeader.tsx'
import { PageMeta } from '../components/PageMeta/PageMeta.tsx'
import { privacySections, privacyUpdatedAt } from '../data/privacy.ts'
import { cx } from '../utils/cx.ts'
import styles from './PrivacyPage.module.css'

const updatedFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export function PrivacyPage() {
  return (
    <>
      <PageMeta title="Политика конфиденциальности" description="Как Level Up обрабатывает персональные данные посетителей сайта." />
      <PageHeader
        title="Политика конфиденциальности"
        breadcrumbs={[{ label: 'Политика конфиденциальности' }]}
        lead={
          <>
            Редакция от <time dateTime={privacyUpdatedAt}>{updatedFormatter.format(new Date(privacyUpdatedAt))}</time>
          </>
        }
      />
      <div className={cx('container', styles.page)}>
        <nav className={styles.toc} aria-label="Содержание">
          <ol className={styles.tocList}>
            {privacySections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.content}>
          {privacySections.map((section, index) => (
            <section key={section.id} id={section.id} className={styles.section} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`} className={styles.title}>
                {index + 1}. {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
