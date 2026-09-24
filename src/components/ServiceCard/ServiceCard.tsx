import { Link } from 'react-router'
import type { Service } from '../../data/services.ts'
import { cx } from '../../utils/cx.ts'
import { formatPriceFrom } from '../../utils/format.ts'
import { ArrowRightIcon } from '../Icon/icons.tsx'
import styles from './ServiceCard.module.css'

type ServiceCardProps = {
  service: Service
  headingLevel?: 'h2' | 'h3'
  className?: string
}

export function ServiceCard({ service, headingLevel: Heading = 'h3', className }: ServiceCardProps) {
  return (
    <article className={cx(styles.card, className)}>
      <div className={styles.media}>
        <img
          className={styles.image}
          src={service.image.src}
          srcSet={service.image.srcSet}
          sizes="(width < 768px) calc(100vw - 4rem), (width < 992px) 45vw, 340px"
          width={service.image.width}
          height={service.image.height}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <Heading className={styles.title}>
        <Link to={`/services/${service.slug}`} className={styles.link}>
          {service.title}
        </Link>
      </Heading>
      <p className={styles.summary}>{service.summary}</p>
      <p className={styles.price}>{formatPriceFrom(service.price)}</p>
      <span className={styles.more} aria-hidden="true">
        Подробнее
        <ArrowRightIcon />
      </span>
    </article>
  )
}
