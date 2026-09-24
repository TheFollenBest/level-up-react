import type { ReactNode } from 'react'
import { cx } from '../../utils/cx.ts'
import { Breadcrumbs, type Crumb } from '../Breadcrumbs/Breadcrumbs.tsx'
import styles from './PageHeader.module.css'

type PageHeaderProps = {
  title: string
  lead?: ReactNode
  breadcrumbs: Crumb[]
  children?: ReactNode
  className?: string
}

export function PageHeader({ title, lead, breadcrumbs, children, className }: PageHeaderProps) {
  return (
    <header className={cx(styles.header, className)}>
      <div className="container">
        <Breadcrumbs items={breadcrumbs} className={styles.breadcrumbs} />
        <h1 className={styles.title}>{title}</h1>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
        {children}
      </div>
    </header>
  )
}
