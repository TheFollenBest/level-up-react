import { useEffect, useState } from 'react'
import { ArrowUpIcon } from '../Icon/icons.tsx'
import styles from './BackToTop.module.css'

const VISIBLE_AFTER = 600

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const update = () => setIsVisible(window.scrollY > VISIBLE_AFTER)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    const heading = document.querySelector<HTMLElement>('main h1')
    if (heading) {
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: true })
    }
  }

  return (
    <button
      type="button"
      className={styles.button}
      data-visible={isVisible}
      aria-label="Наверх"
      onClick={scrollToTop}
    >
      <ArrowUpIcon />
    </button>
  )
}
