import { createStore } from './createStore.ts'

export type Toast = {
  id: string
  message: string
  action?: { label: string; to: string }
}

const TOAST_DURATION = 4000

const toastStore = createStore<Toast[]>([])

export const useToasts = toastStore.useStore

export function dismissToast(id: string) {
  toastStore.setState((toasts) => toasts.filter((toast) => toast.id !== id))
}

export function showToast(toast: Omit<Toast, 'id'>) {
  const id = crypto.randomUUID()
  toastStore.setState((toasts) => [...toasts.slice(-2), { ...toast, id }])
  window.setTimeout(() => dismissToast(id), TOAST_DURATION)
}
