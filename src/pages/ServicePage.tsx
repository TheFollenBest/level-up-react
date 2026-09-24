import { useParams } from 'react-router'
import { Accordion } from '../components/Accordion/Accordion.tsx'
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs.tsx'
import { Button, ButtonLink } from '../components/Button/Button.tsx'
import { Calculator } from '../components/Calculator/Calculator.tsx'
import { ArrowRightIcon, CalculatorIcon, CheckIcon, RulersIcon } from '../components/Icon/icons.tsx'
import { PageMeta } from '../components/PageMeta/PageMeta.tsx'
import { Process } from '../components/Process/Process.tsx'
import { SectionTitle } from '../components/SectionTitle/SectionTitle.tsx'
import { ServiceCard } from '../components/ServiceCard/ServiceCard.tsx'
import { getCalculatorModel } from '../data/calculator.ts'
import { getService, services, type Service } from '../data/services.ts'
import { openRequestDialog } from '../store/requestDialog.ts'
import { cx } from '../utils/cx.ts'
import { formatPriceFrom } from '../utils/format.ts'
import { NotFoundPage } from './NotFoundPage.tsx'
import styles from './ServicePage.module.css'

function relatedServices(service: Service) {
  return services
    .filter((candidate) => candidate.slug !== service.slug)
    .map((candidate) => ({
      candidate,
      shared: candidate.tags.filter((tag) => service.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3)
    .map(({ candidate }) => candidate)
}

export function ServicePage() {
  const { slug } = useParams()
  const service = getService(slug)

  if (!service) return <NotFoundPage />

  const model = getCalculatorModel(service.slug)

  return (
    <>
      <PageMeta title={service.title} description={service.summary} />

      <div className={cx('container', styles.page)}>
        <Breadcrumbs items={[{ label: 'Услуги', to: '/services' }, { label: service.title }]} className={styles.breadcrumbs} />

        <div className={styles.hero}>
          <div className={styles.media}>
            <img
              src={service.image.src}
              srcSet={service.image.srcSet}
              sizes="(width < 992px) calc(100vw - 1.5rem), 570px"
              width={service.image.width}
              height={service.image.height}
              alt={service.image.alt}
              fetchPriority="high"
            />
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{service.title}</h1>
            {service.intro.map((paragraph) => (
              <p key={paragraph} className={styles.intro}>
                {paragraph}
              </p>
            ))}

            <dl className={styles.facts}>
              <div>
                <dt>Цена</dt>
                <dd>{formatPriceFrom(service.price)}</dd>
              </div>
              <div>
                <dt>Срок</dt>
                <dd>{service.leadTime}</dd>
              </div>
              <div>
                <dt>Гарантия</dt>
                <dd>2 года</dd>
              </div>
            </dl>

            <div className={styles.actions}>
              <ButtonLink to={{ hash: 'calculator' }}>
                <CalculatorIcon />
                Рассчитать стоимость
              </ButtonLink>
              <Button
                variant="outline"
                onClick={() =>
                  openRequestDialog({
                    kind: 'callback',
                    title: 'Вызвать замерщика',
                    topic: `Замер: ${service.title}`,
                    service: service.slug,
                  })
                }
              >
                <RulersIcon />
                Вызвать замерщика
              </Button>
            </div>
          </div>
        </div>

        <section className={styles.section} aria-labelledby="types-title">
          <SectionTitle id="types-title">Виды и цены</SectionTitle>
          <ul className={styles.types}>
            {service.types.map((type) => (
              <li key={type.title} className={styles.type}>
                <h3 className={styles.typeTitle}>{type.title}</h3>
                <p className={styles.typeText}>{type.description}</p>
                <p className={styles.typePrice}>{formatPriceFrom(type.price)}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className={cx(styles.section, styles.columns)}>
          <section aria-labelledby="included-title" className={styles.panel}>
            <h2 id="included-title" className={styles.panelTitle}>
              Что входит в работу
            </h2>
            <ul className={styles.checklist}>
              {service.included.map((item) => (
                <li key={item}>
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="materials-title" className={styles.panel}>
            <h2 id="materials-title" className={styles.panelTitle}>
              Материалы
            </h2>
            <ul className={styles.materials}>
              {service.materials.map((material) => (
                <li key={material}>{material}</li>
              ))}
            </ul>
          </section>
        </div>

        <section id="calculator" className={styles.section} aria-labelledby="calculator-title">
          <SectionTitle id="calculator-title">Калькулятор стоимости</SectionTitle>
          <Calculator key={service.slug} model={model} service={service} />
        </section>

        <section className={styles.section} aria-labelledby="process-title">
          <SectionTitle id="process-title">Как мы работаем</SectionTitle>
          <Process />
        </section>

        <section className={cx(styles.section, styles.faq)} aria-labelledby="faq-title">
          <div>
            <SectionTitle id="faq-title">Частые вопросы</SectionTitle>
            <ButtonLink to="/faq" variant="text">
              Все вопросы и ответы
              <ArrowRightIcon />
            </ButtonLink>
          </div>
          <Accordion
            items={service.faq.map((item) => ({ id: item.question, title: item.question, content: <p>{item.answer}</p> }))}
          />
        </section>

        <section className={styles.section} aria-labelledby="related-title">
          <SectionTitle id="related-title">Другие услуги</SectionTitle>
          <ul className={styles.related}>
            {relatedServices(service).map((related) => (
              <li key={related.slug}>
                <ServiceCard service={related} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
