import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { company } from '../data/company.ts'
import styles from './RouteErrorPage.module.css'

export function RouteErrorPage() {
  const error = useRouteError()
  const status = isRouteErrorResponse(error) ? error.status : null

  return (
    <div className={styles.page}>
      <title>Ошибка | Level Up</title>
      <p className={styles.code}>{status ?? 'Ошибка'}</p>
      <h1 className={styles.title}>Страница не загрузилась</h1>
      <p className={styles.text}>
        Обновите страницу. Если не поможет, позвоните нам: <a href={company.phone.href}>{company.phone.display}</a>.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={() => window.location.reload()}>
          Обновить страницу
        </button>
        <Link to="/" className={styles.link}>
          На главную
        </Link>
      </div>
    </div>
  )
}
