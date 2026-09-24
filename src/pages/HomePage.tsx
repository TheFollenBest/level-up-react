import { Advantages } from '../components/Advantages/Advantages.tsx'
import { ButtonLink } from '../components/Button/Button.tsx'
import { Clients } from '../components/Clients/Clients.tsx'
import { HeroSlider } from '../components/HeroSlider/HeroSlider.tsx'
import { ArrowRightIcon, CalculatorIcon } from '../components/Icon/icons.tsx'
import { OrderSection } from '../components/OrderSection/OrderSection.tsx'
import { PageMeta } from '../components/PageMeta/PageMeta.tsx'
import { Process } from '../components/Process/Process.tsx'
import { SectionTitle } from '../components/SectionTitle/SectionTitle.tsx'
import { ServiceCard } from '../components/ServiceCard/ServiceCard.tsx'
import { company } from '../data/company.ts'
import { services } from '../data/services.ts'
import { cx } from '../utils/cx.ts'
import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <>
      <PageMeta />
      <h1 className="visually-hidden">
        {company.name}: {company.tagline.toLowerCase()} в Новосибирске
      </h1>

      <HeroSlider />

      <section className={cx('container', styles.section)} aria-labelledby="advantages-title">
        <SectionTitle id="advantages-title">Почему именно мы?</SectionTitle>
        <Advantages />
      </section>

      <section className={cx('container', styles.section)} aria-labelledby="services-title">
        <div className={styles.sectionHead}>
          <SectionTitle id="services-title">Наши услуги</SectionTitle>
          <ButtonLink to="/services" variant="text" className={styles.headLink}>
            Все услуги и цены
            <ArrowRightIcon />
          </ButtonLink>
        </div>
        <ul className={styles.services}>
          {services.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </section>

      <section className={cx('container', styles.section)} aria-labelledby="process-title">
        <SectionTitle id="process-title">Как мы работаем</SectionTitle>
        <Process />
        <div className={styles.processCta}>
          <p>Хотите знать бюджет заранее? Посчитайте ориентировочную стоимость за минуту.</p>
          <ButtonLink to="/calculator" variant="outline">
            <CalculatorIcon />
            Рассчитать стоимость
          </ButtonLink>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="clients-title">
        <div className="container">
          <SectionTitle id="clients-title">Наши клиенты</SectionTitle>
        </div>
        <Clients />
      </section>

      <OrderSection className={styles.section} />
    </>
  )
}
