import { company } from '../../data/company.ts'
import { cx } from '../../utils/cx.ts'
import styles from './MapEmbed.module.css'

type MapEmbedProps = {
  className?: string
}

export function MapEmbed({ className }: MapEmbedProps) {
  return (
    <div className={cx(styles.map, className)}>
      <iframe
        className={styles.frame}
        src={company.mapWidgetUrl}
        title={`Карта: ${company.address}`}
        loading="lazy"
        allowFullScreen
      />
    </div>
  )
}
