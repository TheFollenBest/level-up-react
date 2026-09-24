import { heroSlides, type HeroSlide } from '../../data/hero.ts'
import { useCarousel } from '../../hooks/useCarousel.ts'
import { openRequestDialog } from '../../store/requestDialog.ts'
import { cx } from '../../utils/cx.ts'
import { Button, ButtonLink } from '../Button/Button.tsx'
import { ChevronLeftIcon, ChevronRightIcon } from '../Icon/icons.tsx'
import styles from './HeroSlider.module.css'

const AUTOPLAY_INTERVAL = 6000

function SlideAction({ slide }: { slide: HeroSlide }) {
  const { action, buttonTone: variant } = slide

  if (action.type === 'link') {
    return (
      <ButtonLink to={action.to} variant={variant} className={styles.cta}>
        {action.label}
      </ButtonLink>
    )
  }

  return (
    <Button
      variant={variant}
      className={styles.cta}
      onClick={() => openRequestDialog({ kind: 'callback', title: action.label, topic: action.topic })}
    >
      {action.label}
    </Button>
  )
}

export function HeroSlider() {
  const { index, previousIndex, direction, isPaused, next, prev, goTo, handlers } = useCarousel(
    heroSlides.length,
    AUTOPLAY_INTERVAL,
  )

  return (
    <section
      className={styles.hero}
      data-active-tone={heroSlides[index]?.tone}
      aria-roledescription="карусель"
      aria-label="Главное о Level Up"
      {...handlers}
    >
      <div id="hero-slides" className={styles.slides} aria-live={isPaused ? 'polite' : 'off'}>
        {heroSlides.map((slide, slideIndex) => {
          const isActive = slideIndex === index

          return (
            <div
              key={slide.id}
              className={styles.slide}
              data-state={isActive ? 'active' : slideIndex === previousIndex ? 'leaving' : 'idle'}
              data-direction={direction ?? undefined}
              data-tone={slide.tone}
              role="group"
              aria-roledescription="слайд"
              aria-label={`${slideIndex + 1} из ${heroSlides.length}`}
              inert={!isActive}
            >
              <picture>
                <source media="(min-width: 768px)" srcSet={slide.image.desktop} sizes="100vw" width={1920} height={425} />
                <img
                  className={styles.image}
                  srcSet={slide.image.mobile}
                  sizes="100vw"
                  width={575}
                  height={500}
                  alt=""
                  fetchPriority={slideIndex === 0 ? 'high' : 'auto'}
                />
              </picture>

              <div className={styles.caption}>
                <div className="container">
                  <div className={styles.text}>
                    <p className={styles.title}>{slide.title}</p>
                    {slide.note ? <p className={styles.note}>*{slide.note}</p> : null}
                    <SlideAction slide={slide} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.arrow} aria-label="Предыдущий слайд" aria-controls="hero-slides" onClick={prev}>
          <ChevronLeftIcon />
        </button>
        <ul className={styles.dots}>
          {heroSlides.map((slide, slideIndex) => (
            <li key={slide.id}>
              <button
                type="button"
                className={cx(styles.dot, slideIndex === index && styles.dotActive)}
                aria-label={`Слайд ${slideIndex + 1}`}
                aria-current={slideIndex === index}
                aria-controls="hero-slides"
                onClick={() => goTo(slideIndex)}
              />
            </li>
          ))}
        </ul>
        <button type="button" className={styles.arrow} aria-label="Следующий слайд" aria-controls="hero-slides" onClick={next}>
          <ChevronRightIcon />
        </button>
      </div>
    </section>
  )
}
