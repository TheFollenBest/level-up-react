import { useEffect, useEffectEvent, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import logo206 from '../../assets/images/brand/logo-206.webp'
import logo412 from '../../assets/images/brand/logo-412.webp'
import logoMinimal from '../../assets/images/brand/logo-minimal.svg'
import { company } from '../../data/company.ts'
import { mainNavigation } from '../../data/navigation.ts'
import { services } from '../../data/services.ts'
import { openRequestDialog } from '../../store/requestDialog.ts'
import { selectActiveCount, useRequests } from '../../store/requests.ts'
import { cx } from '../../utils/cx.ts'
import { Button } from '../Button/Button.tsx'
import { ArrowRightIcon, ChevronDownIcon, ClipboardCheckIcon, ListIcon, XIcon } from '../Icon/icons.tsx'
import { SocialLinks } from '../SocialLinks/SocialLinks.tsx'
import styles from './Header.module.css'

export function Header() {
  const { pathname } = useLocation()
  const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null)
  const [servicesOpenAt, setServicesOpenAt] = useState<string | null>(null)
  const isMenuOpen = menuOpenAt === pathname
  const isServicesOpen = servicesOpenAt === pathname
  const activeRequests = useRequests(selectActiveCount)
  const servicesRef = useRef<HTMLLIElement>(null)
  const servicesMenuId = useId()
  const mobileMenuId = useId()
  const isServicesActive = pathname.startsWith('/services')

  const handleOutsidePointer = useEffectEvent((event: PointerEvent) => {
    if (!servicesRef.current?.contains(event.target as Node)) setServicesOpenAt(null)
  })

  const handleEscape = useEffectEvent((event: KeyboardEvent) => {
    if (event.key !== 'Escape') return
    if (isServicesOpen) {
      setServicesOpenAt(null)
      servicesRef.current?.querySelector('button')?.focus()
    }
    if (isMenuOpen) setMenuOpenAt(null)
  })

  useEffect(() => {
    if (!isServicesOpen && !isMenuOpen) return
    document.addEventListener('pointerdown', handleOutsidePointer)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isServicesOpen, isMenuOpen])

  const requestsLink =
    activeRequests > 0 ? (
      <Link to="/requests" className={styles.requests}>
        <ClipboardCheckIcon />
        Мои заявки
        <span className={styles.badge}>{activeRequests}</span>
      </Link>
    ) : null

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={cx('container', styles.topBarInner)}>
          <div className={styles.contact}>
            <span className={styles.contactLabel}>Где мы находимся?</span>
            <Link to="/contacts" className={styles.contactValue}>
              {company.address}
            </Link>
          </div>
          <div className={styles.contact}>
            <span className={styles.contactLabel}>Телефон для заказов и вопросов:</span>
            <a href={company.phone.href} className={styles.contactValue}>
              {company.phone.display}
            </a>
          </div>
          <div className={styles.contact}>
            <span className={styles.contactLabel}>Почта для связи:</span>
            <a href={`mailto:${company.email}`} className={styles.contactValue}>
              {company.email}
            </a>
          </div>
          <div className={styles.topBarAside}>
            {requestsLink}
            <SocialLinks />
          </div>
        </div>
      </div>

      <div className={styles.mainRow}>
        <div className={cx('container', styles.mainRowInner)}>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={isMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setMenuOpenAt(isMenuOpen ? null : pathname)}
          >
            {isMenuOpen ? <XIcon /> : <ListIcon />}
          </button>

          <Link to="/" className={styles.logo} aria-label="Level Up, на главную">
            <img
              className={styles.logoFull}
              src={logo206}
              srcSet={`${logo206} 1x, ${logo412} 2x`}
              width={206}
              height={116}
              alt=""
            />
            <img className={styles.logoMinimal} src={logoMinimal} width={70} height={50} alt="" />
          </Link>

          <p className={styles.tagline}>{company.tagline}</p>

          <div className={styles.questions}>
            <span className={styles.questionsLabel}>У вас возникли вопросы?</span>
            <button type="button" className={styles.askButton} onClick={() => openRequestDialog({ kind: 'question' })}>
              Задать вопрос
            </button>
          </div>

          <Button className={styles.callButton} onClick={() => openRequestDialog({ kind: 'callback' })}>
            Заказать звонок
          </Button>
        </div>
      </div>

      <nav className={styles.navBar} aria-label="Основное меню">
        <ul className={cx('container', styles.navList)}>
          <li ref={servicesRef} className={styles.servicesItem}>
            <button
              type="button"
              className={cx(styles.navLink, styles.servicesToggle, isServicesActive && styles.navLinkActive)}
              aria-expanded={isServicesOpen}
              aria-controls={servicesMenuId}
              onClick={() => setServicesOpenAt(isServicesOpen ? null : pathname)}
            >
              Услуги
              <ChevronDownIcon className={styles.chevron} />
            </button>
            <div id={servicesMenuId} className={styles.servicesMenu} hidden={!isServicesOpen}>
              <ul className={styles.servicesGrid}>
                {services.map((service) => (
                  <li key={service.slug}>
                    <NavLink to={`/services/${service.slug}`} className={styles.serviceLink}>
                      <img
                        src={service.image.thumb}
                        width={80}
                        height={57}
                        alt=""
                        loading="lazy"
                        className={styles.serviceThumb}
                      />
                      <span>
                        <span className={styles.serviceTitle}>{service.title}</span>
                        <span className={styles.serviceSummary}>{service.summary}</span>
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
              <Link to="/services" className={styles.allServices}>
                Все услуги и цены
                <ArrowRightIcon />
              </Link>
            </div>
          </li>
          {mainNavigation.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => cx(styles.navLink, isActive && styles.navLinkActive)}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div id={mobileMenuId} className={styles.mobileMenu} data-open={isMenuOpen} inert={!isMenuOpen}>
        <div className={styles.mobileMenuClip}>
          <div className={cx('container', styles.mobileMenuInner)}>
            <div className={styles.mobileGroup}>
              <p className={styles.mobileHeading}>Услуги</p>
              <ul className={styles.mobileList}>
                {services.map((service) => (
                  <li key={service.slug}>
                    <NavLink to={`/services/${service.slug}`} className={styles.mobileLink}>
                      {service.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.mobileGroup}>
              <p className={styles.mobileHeading}>Компания</p>
              <ul className={styles.mobileList}>
                {mainNavigation.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} className={styles.mobileLink}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <NavLink to="/requests" className={styles.mobileLink}>
                    Мои заявки{activeRequests > 0 ? <span className={styles.badge}>{activeRequests}</span> : null}
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className={styles.mobileContacts}>
              <a href={company.phone.href} className={styles.mobilePhone}>
                {company.phone.display}
              </a>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <span className={styles.mobileAddress}>{company.address}</span>
              <div className={styles.mobileActions}>
                <Button onClick={() => openRequestDialog({ kind: 'callback' })}>Заказать звонок</Button>
                <Button variant="outline" onClick={() => openRequestDialog({ kind: 'question' })}>
                  Задать вопрос
                </Button>
              </div>
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
