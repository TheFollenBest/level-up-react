import type { ReactNode } from 'react'
import { cx } from '../../utils/cx.ts'
import styles from './EmptyState.module.css'

type EmptyStateProps = {
  title: string
  children?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, children, action, className }: EmptyStateProps) {
  return (
    <div className={cx(styles.empty, className)}>
      <h2 className={styles.title}>{title}</h2>
      {children ? <div className={styles.text}>{children}</div> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  )
}
