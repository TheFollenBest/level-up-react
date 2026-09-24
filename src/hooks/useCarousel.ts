import { useEffect, useEffectEvent, useRef, useState, type FocusEvent, type PointerEvent } from 'react'

export type SlideDirection = 'next' | 'prev'

type CarouselState = {
  index: number
  previousIndex: number | null
  direction: SlideDirection | null
}

const SWIPE_THRESHOLD = 40

export function useCarousel(count: number, interval: number) {
  const [{ index, previousIndex, direction }, setState] = useState<CarouselState>({
    index: 0,
    previousIndex: null,
    direction: null,
  })
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const swipeStartX = useRef<number | null>(null)

  const isPaused = isHovered || isFocused

  const go = (nextDirection: SlideDirection) => {
    setState((current) => ({
      index: (current.index + (nextDirection === 'next' ? 1 : -1) + count) % count,
      previousIndex: current.index,
      direction: nextDirection,
    }))
  }

  const goTo = (target: number) => {
    setState((current) =>
      target === current.index
        ? current
        : { index: target, previousIndex: current.index, direction: target > current.index ? 'next' : 'prev' },
    )
  }

  const onAutoplayTick = useEffectEvent(() => {
    if (!document.hidden) go('next')
  })

  useEffect(() => {
    if (isPaused || count < 2) return

    const timer = setInterval(onAutoplayTick, interval)
    return () => clearInterval(timer)
  }, [isPaused, count, interval, index])

  const handlers = {
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setIsHovered(true)
    },
    onPointerLeave: (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setIsHovered(false)
    },
    onPointerDown: (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') swipeStartX.current = event.clientX
    },
    onPointerUp: (event: PointerEvent) => {
      if (swipeStartX.current === null) return

      const delta = event.clientX - swipeStartX.current
      swipeStartX.current = null

      if (Math.abs(delta) >= SWIPE_THRESHOLD) go(delta < 0 ? 'next' : 'prev')
    },
    onPointerCancel: () => {
      swipeStartX.current = null
    },
    onFocus: (event: FocusEvent) => {
      if (event.target.matches(':focus-visible')) setIsFocused(true)
    },
    onBlur: (event: FocusEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false)
    },
  }

  return {
    index,
    previousIndex,
    direction,
    isPaused,
    next: () => go('next'),
    prev: () => go('prev'),
    goTo,
    handlers,
  }
}
