import type { CSSProperties } from 'react'
import { processSteps } from '../../data/process.ts'
import { cx } from '../../utils/cx.ts'
import styles from './Process.module.css'

type ProcessProps = {
  className?: string
}

export function Process({ className }: ProcessProps) {
  return (
    <ol className={cx(styles.stairs, className)}>
      {processSteps.map((step, index) => (
        <li key={step.id} className={styles.step} style={{ '--level': index } as CSSProperties}>
          <span className={styles.level}>Уровень {index + 1}</span>
          <h3 className={styles.title}>{step.title}</h3>
          <p className={styles.text}>{step.description}</p>
        </li>
      ))}
    </ol>
  )
}
