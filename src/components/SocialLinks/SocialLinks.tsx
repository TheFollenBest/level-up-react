import { company } from '../../data/company.ts'
import { cx } from '../../utils/cx.ts'
import { InstagramIcon, VkIcon } from '../Icon/icons.tsx'
import styles from './SocialLinks.module.css'

const icons = { vk: VkIcon, instagram: InstagramIcon }

type SocialLinksProps = {
  withHandles?: boolean
  className?: string
}

export function SocialLinks({ withHandles = false, className }: SocialLinksProps) {
  return (
    <ul className={cx(withHandles ? styles.stacked : styles.row, className)}>
      {company.socials.map((social) => {
        const SocialIcon = icons[social.id]
        return (
          <li key={social.id}>
            <a
              href={social.href}
              className={styles.link}
              target="_blank"
              rel="noreferrer"
              aria-label={withHandles ? undefined : `${social.label}: ${social.handle}`}
            >
              <SocialIcon className={styles.icon} />
              {withHandles ? <span>{social.handle}</span> : null}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
