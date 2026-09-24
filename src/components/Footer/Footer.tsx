import { Link, useLocation } from 'react-router'
import logo206 from '../../assets/images/brand/logo-206.webp'
import { company, workingHoursSummary } from '../../data/company.ts'
import { companyLinks } from '../../data/navigation.ts'
import { services } from '../../data/services.ts'
import { cx } from '../../utils/cx.ts'
import { MapEmbed } from '../MapEmbed/MapEmbed.tsx'
import { SocialLinks } from '../SocialLinks/SocialLinks.tsx'
import styles from './Footer.module.css'

const currentYear = new Date().getFullYear()

export function Footer() {
  const { pathname } = useLocation()
  const showMap = pathname !== '/contacts'

  return (
    <footer className={styles.footer}>
      <div className={cx('container', styles.grid)}>
        <div className={styles.about}>
          <Link to="/" className={styles.brand} aria-label="Level Up, на главную">
            <img src={logo206} width={108} height={61} alt="" />
            <span className={styles.legalName}>{company.legalName}</span>
          </Link>

          <dl className={styles.contacts}>
            <div>
              <dt>Где мы находимся:</dt>
              <dd>
                <Link to="/contacts">{company.address}</Link>
              </dd>
            </div>
            <div>
              <dt>Телефон для заказов и вопросов:</dt>
              <dd>
                <a href={company.phone.href}>{company.phone.display}</a>
              </dd>
            </div>
            <div>
              <dt>Почта для связи:</dt>
              <dd>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </dd>
            </div>
            <div>
              <dt>Режим работы:</dt>
              <dd className={styles.hours}>
                {workingHoursSummary.map((entry) => (
                  <span key={entry.days}>
                    {entry.days} {entry.hours}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <SocialLinks withHandles />
        </div>

        <nav className={styles.nav} aria-label="Услуги">
          <p className={styles.heading}>Услуги</p>
          <ul className={styles.links}>
            {services.map((service) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`}>{service.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.nav} aria-label="Компания">
          <p className={styles.heading}>Компания</p>
          <ul className={styles.links}>
            {companyLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {showMap ? <MapEmbed className={styles.map} /> : null}
      </div>

      <div className={styles.bottom}>
        <div className={cx('container', styles.bottomInner)}>
          <p>
            © {currentYear} {company.legalName}, {company.city}
          </p>
          <Link to="/privacy">Политика конфиденциальности</Link>
        </div>
      </div>
    </footer>
  )
}
