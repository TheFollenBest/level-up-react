import { Link } from 'react-router'
import { ButtonLink } from '../components/Button/Button.tsx'
import { PageMeta } from '../components/PageMeta/PageMeta.tsx'
import { services } from '../data/services.ts'
import { cx } from '../utils/cx.ts'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <>
      <PageMeta title="Страница не найдена" />
      <div className={cx('container', styles.page)}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <div className={styles.body}>
          <h1 className={styles.title}>Такой страницы нет</h1>
          <p className={styles.text}>
            Возможно, ссылка устарела или в адресе опечатка. Начните с главной или выберите нужное направление.
          </p>
          <div className={styles.actions}>
            <ButtonLink to="/">На главную</ButtonLink>
            <ButtonLink to="/contacts" variant="outline">
              Связаться с нами
            </ButtonLink>
          </div>
          <ul className={styles.links}>
            {services.map((service) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`}>{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
