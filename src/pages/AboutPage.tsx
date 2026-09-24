import { Link } from 'react-router'
import { Advantages } from '../components/Advantages/Advantages.tsx'
import { Clients } from '../components/Clients/Clients.tsx'
import { HeadsetIcon, StopwatchIcon, WarrantyIcon } from '../components/Icon/icons.tsx'
import { OrderSection } from '../components/OrderSection/OrderSection.tsx'
import { PageHeader } from '../components/PageHeader/PageHeader.tsx'
import { PageMeta } from '../components/PageMeta/PageMeta.tsx'
import { Process } from '../components/Process/Process.tsx'
import { SectionTitle } from '../components/SectionTitle/SectionTitle.tsx'
import { company } from '../data/company.ts'
import { services } from '../data/services.ts'
import { cx } from '../utils/cx.ts'
import styles from './AboutPage.module.css'

const guarantees = [
  {
    id: 'warranty',
    icon: WarrantyIcon,
    title: 'Гарантия 2 года',
    text: 'На изделия и монтаж. Если в гарантийный срок погаснет подсветка или ослабнет крепление, приедем и исправим бесплатно.',
  },
  {
    id: 'night',
    icon: StopwatchIcon,
    title: 'Монтаж в удобное время',
    text: 'Работаем и ночью, чтобы не закрывать магазин и не перекрывать вход покупателям.',
  },
  {
    id: 'service',
    icon: HeadsetIcon,
    title: 'Сервис после гарантии',
    text: 'Ремонтируем и обновляем вывески, в том числе сделанные другими компаниями: меняем подсветку, лицевые части, блоки питания.',
  },
]

export function AboutPage() {
  return (
    <>
      <PageMeta
        title="О компании"
        description="Level Up: рекламно-производственная компания в Новосибирске. Собственное производство, бесплатный замер, гарантия 2 года."
      />
      <PageHeader
        title="О компании"
        breadcrumbs={[{ label: 'О компании' }]}
        lead={`${company.name}: ${company.tagline.toLowerCase()} из Новосибирска. Сами проектируем, производим и монтируем наружную и интерьерную рекламу.`}
      />

      <div className="container">
        <section className={cx(styles.section, styles.intro)} aria-labelledby="what-title">
          <div>
            <SectionTitle id="what-title">Чем мы занимаемся</SectionTitle>
            <div className={styles.text}>
              <p>
                Делаем всё, что помогает бизнесу быть заметным: вывески и объёмные буквы на фасад, световые короба,
                информационные стенды, таблички и материалы для точек продаж.
              </p>
              <p>
                У нас своё производство, поэтому мы отвечаем за результат целиком, от первого замера до подключения
                подсветки. Не перепродаём чужую работу и не делаем наценку посредника: отсюда низкие и прозрачные цены.
              </p>
              <p>
                Работаем с магазинами, кафе, офисами, производителями и управляющими компаниями. Берём и разовые заказы, и
                регулярное обслуживание сетей.
              </p>
            </div>
          </div>
          <aside className={styles.directions} aria-label="Направления">
            <p className={styles.directionsTitle}>Направления</p>
            <ul className={styles.directionsList}>
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={`/services/${service.slug}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className={styles.section} aria-labelledby="advantages-title">
          <SectionTitle id="advantages-title">Почему именно мы?</SectionTitle>
          <Advantages />
        </section>

        <section className={styles.section} aria-labelledby="process-title">
          <SectionTitle id="process-title">Как мы работаем</SectionTitle>
          <Process />
        </section>

        <section className={styles.section} aria-labelledby="guarantees-title">
          <SectionTitle id="guarantees-title">Гарантии и сервис</SectionTitle>
          <ul className={styles.guarantees}>
            {guarantees.map(({ id, icon: GuaranteeIcon, title, text }) => (
              <li key={id} className={styles.guarantee}>
                <GuaranteeIcon className={styles.guaranteeIcon} />
                <h3 className={styles.guaranteeTitle}>{title}</h3>
                <p className={styles.guaranteeText}>{text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className={styles.section} aria-labelledby="clients-title">
        <div className="container">
          <SectionTitle id="clients-title">Нам доверяют</SectionTitle>
        </div>
        <Clients />
      </section>

      <OrderSection className={styles.section} title="Обсудим ваш проект?" />
    </>
  )
}
