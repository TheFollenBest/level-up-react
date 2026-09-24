import type { ReactNode } from 'react'
import { cx } from '../../utils/cx.ts'
import { ChevronDownIcon } from '../Icon/icons.tsx'
import styles from './Accordion.module.css'

type AccordionItem = {
  id: string
  title: string
  content: ReactNode
}

type AccordionProps = {
  items: AccordionItem[]
  className?: string
}

export function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cx(styles.accordion, className)}>
      {items.map((item) => (
        <details key={item.id} className={styles.item}>
          <summary className={styles.summary}>
            <span>{item.title}</span>
            <ChevronDownIcon className={styles.icon} />
          </summary>
          <div className={styles.content}>{item.content}</div>
        </details>
      ))}
    </div>
  )
}
