import { advantages } from '../../data/advantages.ts'
import { cx } from '../../utils/cx.ts'
import styles from './Advantages.module.css'

type AdvantagesProps = {
  className?: string
}

export function Advantages({ className }: AdvantagesProps) {
  return (
    <ul className={cx(styles.grid, className)}>
      {advantages.map(({ id, title, icon: AdvantageIcon }) => (
        <li key={id} className={styles.card}>
          <AdvantageIcon className={styles.icon} />
          <p className={styles.text}>{title}</p>
        </li>
      ))}
    </ul>
  )
}
