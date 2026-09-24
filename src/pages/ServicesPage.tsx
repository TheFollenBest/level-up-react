import { useSearchParams } from 'react-router'
import { Button } from '../components/Button/Button.tsx'
import { ChatDotsIcon } from '../components/Icon/icons.tsx'
import { PageHeader } from '../components/PageHeader/PageHeader.tsx'
import { PageMeta } from '../components/PageMeta/PageMeta.tsx'
import { SectionTitle } from '../components/SectionTitle/SectionTitle.tsx'
import { ServiceCard } from '../components/ServiceCard/ServiceCard.tsx'
import { extraServices } from '../data/extras.ts'
import { serviceTags, services, type ServiceTag } from '../data/services.ts'
import { openRequestDialog } from '../store/requestDialog.ts'
import { cx } from '../utils/cx.ts'
import { formatPriceFrom } from '../utils/format.ts'
import styles from './ServicesPage.module.css'

function isServiceTag(value: string | null): value is ServiceTag {
  return serviceTags.some((tag) => tag.id === value)
}

export function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTag = searchParams.get('for')
  const activeTag = isServiceTag(rawTag) ? rawTag : null
  const visible = activeTag ? services.filter((service) => service.tags.includes(activeTag)) : services

  const selectTag = (tag: ServiceTag | null) => {
    setSearchParams(tag ? { for: tag } : {}, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PageMeta
        title="Услуги"
        description="Объёмные буквы, вывески, световые короба, информационные стенды, таблички и POS-материалы от производителя в Новосибирске."
      />
      <PageHeader
        title="Услуги"
        breadcrumbs={[{ label: 'Услуги' }]}
        lead="Производим наружную и интерьерную рекламу сами: от замера и макета до монтажа. Выберите, для чего нужна реклама, или посмотрите все направления."
      />

      <div className={cx('container', styles.page)}>
        <div className={styles.filters} role="group" aria-label="Для чего нужна реклама">
          <button
            type="button"
            className={cx(styles.filter, activeTag === null && styles.filterActive)}
            aria-pressed={activeTag === null}
            onClick={() => selectTag(null)}
          >
            Все услуги
          </button>
          {serviceTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={cx(styles.filter, activeTag === tag.id && styles.filterActive)}
              aria-pressed={activeTag === tag.id}
              onClick={() => selectTag(tag.id)}
            >
              {tag.label}
            </button>
          ))}
        </div>

        <p className={styles.count} aria-live="polite">
          {activeTag ? `Подходит направлений: ${visible.length}` : `Всего направлений: ${visible.length}`}
        </p>

        <ul className={styles.grid}>
          {visible.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} headingLevel="h2" />
            </li>
          ))}
        </ul>

        <section className={styles.extras} aria-labelledby="extras-title">
          <SectionTitle id="extras-title">Дополнительно</SectionTitle>
          <ul className={styles.extrasList}>
            {extraServices.map((extra) => (
              <li key={extra.id} className={styles.extra}>
                <div>
                  <h3 className={styles.extraTitle}>{extra.title}</h3>
                  <p className={styles.extraText}>{extra.description}</p>
                </div>
                <p className={cx(styles.extraPrice, extra.price === 'free' && styles.free)}>
                  {extra.price === 'free' ? 'Бесплатно' : formatPriceFrom(extra.price)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <aside className={styles.help}>
          <div>
            <h2 className={styles.helpTitle}>Не нашли нужное?</h2>
            <p className={styles.helpText}>
              Делаем и нестандартные изделия: фотозоны, навигацию, оформление витрин. Опишите задачу, подскажем решение и
              цену.
            </p>
          </div>
          <Button onClick={() => openRequestDialog({ kind: 'question' })}>
            <ChatDotsIcon />
            Описать задачу
          </Button>
        </aside>
      </div>
    </>
  )
}
