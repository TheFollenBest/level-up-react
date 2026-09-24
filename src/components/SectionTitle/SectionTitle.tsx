import type { ComponentProps } from 'react'
import { cx } from '../../utils/cx.ts'
import styles from './SectionTitle.module.css'

export function SectionTitle({ className, children, ...props }: ComponentProps<'h2'>) {
  return (
    <h2 className={cx(styles.title, className)} {...props}>
      {children}
    </h2>
  )
}
