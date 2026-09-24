import { useSyncExternalStore } from 'react'

type Persistence = {
  key: string
  version: number
}

export function createStore<T>(initialState: T, persistence?: Persistence) {
  const storageKey = persistence ? `levelup:${persistence.key}:v${persistence.version}` : null
  const listeners = new Set<() => void>()

  const load = (): T => {
    if (!storageKey) return initialState
    try {
      const raw = localStorage.getItem(storageKey)
      return raw === null ? initialState : (JSON.parse(raw) as T)
    } catch {
      return initialState
    }
  }

  let state = load()

  const emit = () => {
    for (const listener of listeners) listener()
  }

  const persist = () => {
    if (!storageKey) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      return
    }
  }

  const setState = (update: (current: T) => T) => {
    const next = update(state)
    if (Object.is(next, state)) return
    state = next
    persist()
    emit()
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  if (storageKey) {
    window.addEventListener('storage', (event) => {
      if (event.key !== storageKey) return
      state = load()
      emit()
    })
  }

  function useStore<S>(selector: (current: T) => S) {
    return useSyncExternalStore(
      subscribe,
      () => selector(state),
      () => selector(initialState),
    )
  }

  return { getState: () => state, setState, useStore }
}
