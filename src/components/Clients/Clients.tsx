import { clients } from '../../data/clients.ts'
import { cx } from '../../utils/cx.ts'
import styles from './Clients.module.css'

type ClientsProps = {
  className?: string
}

export function Clients({ className }: ClientsProps) {
  return (
    <div className={cx(styles.marquee, className)}>
      {[0, 1].map((copy) => (
        <ul key={copy} className={styles.track} aria-hidden={copy === 1 ? true : undefined}>
          {clients.map((client) => (
            <li key={client.id} className={styles.item}>
              <img
                className={styles.logo}
                src={client.logo.src}
                srcSet={client.logo.srcSet}
                width={client.logo.width}
                height={client.logo.height}
                alt={copy === 0 ? client.name : ''}
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}
