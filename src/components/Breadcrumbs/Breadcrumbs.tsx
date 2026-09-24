import { Link } from 'react-router'
import { cx } from '../../utils/cx.ts'
import styles from './Breadcrumbs.module.css'

export type Crumb = {
  label: string
  to?: string
}

type BreadcrumbsProps = {
  items: Crumb[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Хлебные крошки" className={className}>
      <ol className={styles.list}>
        <li>
          <Link to="/">Главная</Link>
        </li>
        {items.map((crumb) => (
          <li key={crumb.label} className={cx(!crumb.to && styles.current)}>
            {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
