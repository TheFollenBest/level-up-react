import { Link } from 'react-router'
import { ButtonLink } from '../components/Button/Button.tsx'
import { ArrowRightIcon, CalculatorIcon } from '../components/Icon/icons.tsx'
import { PageHeader } from '../components/PageHeader/PageHeader.tsx'
import { PageMeta } from '../components/PageMeta/PageMeta.tsx'
import { SectionTitle } from '../components/SectionTitle/SectionTitle.tsx'
import { extraServices } from '../data/extras.ts'
import { services } from '../data/services.ts'
import { cx } from '../utils/cx.ts'
import { formatPriceFrom } from '../utils/format.ts'
import styles from './PricesPage.module.css'

const discounts = [
  { title: 'Постоянным клиентам', value: 'до 30%', text: 'Размер скидки зависит от объёма заказов, уточните у менеджера.' },
  { title: 'Тираж POS-материалов', value: '10–25%', text: 'От 100 штук скидка 10%, от 500 штук 20%, от 1000 штук 25%.' },
  { title: 'Партия табличек', value: '10–20%', text: 'От 10 штук скидка 10%, от 50 штук 20%.' },
  { title: 'Срочный заказ', value: '+25%', text: 'Изготовим примерно вдвое быстрее обычного срока.' },
]

export function PricesPage() {
  return (
    <>
      <PageMeta
        title="Цены"
        description="Цены на объёмные буквы, вывески, световые короба, стенды, таблички и POS-материалы в Новосибирске."
      />
      <PageHeader
        title="Цены"
        breadcrumbs={[{ label: 'Цены' }]}
        lead="Здесь минимальные цены по каждому виду изделий. Итог зависит от размеров, материалов и монтажа: точную смету называем после бесплатного замера."
      >
        <ButtonLink to="/calculator" className={styles.headerAction}>
          <CalculatorIcon />
          Рассчитать стоимость
        </ButtonLink>
      </PageHeader>

      <div className={cx('container', styles.page)}>
        <nav className={styles.toc} aria-label="Разделы прайса">
          <ul className={styles.tocList}>
            {services.map((service) => (
              <li key={service.slug}>
                <a href={`#${service.slug}`} className={styles.tocLink}>
                  {service.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#extras" className={styles.tocLink}>
                Дополнительно
              </a>
            </li>
          </ul>
        </nav>

        <div className={styles.sections}>
          {services.map((service) => (
            <section key={service.slug} id={service.slug} className={styles.block} aria-labelledby={`${service.slug}-title`}>
              <div className={styles.blockHead}>
                <h2 id={`${service.slug}-title`} className={styles.blockTitle}>
                  {service.title}
                </h2>
                <Link to={`/services/${service.slug}`} className={styles.blockLink}>
                  Об услуге
                  <ArrowRightIcon />
                </Link>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Вид</th>
                    <th scope="col">Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {service.types.map((type) => (
                    <tr key={type.title}>
                      <th scope="row">
                        <span className={styles.rowTitle}>{type.title}</span>
                        <span className={styles.rowText}>{type.description}</span>
                      </th>
                      <td>{formatPriceFrom(type.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={styles.lead}>Срок изготовления: {service.leadTime}</p>
            </section>
          ))}

          <section id="extras" className={styles.block} aria-labelledby="extras-title">
            <div className={styles.blockHead}>
              <h2 id="extras-title" className={styles.blockTitle}>
                Дополнительно
              </h2>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Услуга</th>
                  <th scope="col">Цена</th>
                </tr>
              </thead>
              <tbody>
                {extraServices.map((extra) => (
                  <tr key={extra.id}>
                    <th scope="row">
                      <span className={styles.rowTitle}>{extra.title}</span>
                      <span className={styles.rowText}>{extra.description}</span>
                    </th>
                    <td className={cx(extra.price === 'free' && styles.free)}>
                      {extra.price === 'free' ? 'Бесплатно' : formatPriceFrom(extra.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <section className={styles.discounts} aria-labelledby="discounts-title">
          <SectionTitle id="discounts-title">Скидки и наценки</SectionTitle>
          <ul className={styles.discountList}>
            {discounts.map((discount) => (
              <li key={discount.title} className={styles.discount}>
                <p className={styles.discountValue}>{discount.value}</p>
                <h3 className={styles.discountTitle}>{discount.title}</h3>
                <p className={styles.discountText}>{discount.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
