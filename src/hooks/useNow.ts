import { useSyncExternalStore } from 'react'

const TICK = 30_000

let now = new Date()
let timer: number | undefined
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  now = new Date()

  if (timer === undefined) {
    timer = window.setInterval(() => {
      now = new Date()
      for (const notify of listeners) notify()
    }, TICK)
  }

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.clearInterval(timer)
      timer = undefined
    }
  }
}

export function useNow() {
  return useSyncExternalStore(subscribe, () => now)
}
