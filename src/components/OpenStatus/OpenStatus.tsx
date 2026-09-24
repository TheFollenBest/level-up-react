import { useNow } from '../../hooks/useNow.ts'
import { cx } from '../../utils/cx.ts'
import { getOpenStatus } from '../../utils/openStatus.ts'
import styles from './OpenStatus.module.css'

type OpenStatusProps = {
  className?: string
}

export function OpenStatus({ className }: OpenStatusProps) {
  const now = useNow()
  const status = getOpenStatus(now)

  return (
    <p className={cx(styles.status, className)} data-open={status.isOpen}>
      <span className={styles.dot} aria-hidden="true" />
      {status.label}
    </p>
  )
}
