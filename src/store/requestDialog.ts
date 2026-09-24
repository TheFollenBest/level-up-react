import type { ServiceSlug } from '../data/services.ts'
import { createStore } from './createStore.ts'

export type RequestDialogState = {
  kind: 'callback' | 'question'
  title?: string
  topic?: string
  service?: ServiceSlug
}

const dialogStore = createStore<RequestDialogState | null>(null)

export const useRequestDialog = dialogStore.useStore

export function openRequestDialog(state: RequestDialogState) {
  dialogStore.setState(() => state)
}

export function closeRequestDialog() {
  dialogStore.setState(() => null)
}
