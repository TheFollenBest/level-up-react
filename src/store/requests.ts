import type { ServiceSlug } from '../data/services.ts'
import { createStore } from './createStore.ts'

export type RequestKind = 'callback' | 'question' | 'order' | 'estimate'

export type RequestStatus = 'sent' | 'cancelled'

export type LeadRequest = {
  id: string
  number: string
  kind: RequestKind
  status: RequestStatus
  createdAt: string
  name: string
  phone: string
  email?: string
  message?: string
  topic?: string
  preferredTime?: string
  service?: ServiceSlug
  estimate?: {
    details: string[]
    total: number
    leadTime: string
  }
}

export type NewLeadRequest = Omit<LeadRequest, 'id' | 'number' | 'status' | 'createdAt'>

const requestStore = createStore<LeadRequest[]>([], { key: 'requests', version: 1 })

export const useRequests = requestStore.useStore

export const requestKindLabels: Record<RequestKind, string> = {
  callback: 'Обратный звонок',
  question: 'Вопрос',
  order: 'Заказ',
  estimate: 'Расчёт стоимости',
}

function createNumber() {
  const value = crypto.getRandomValues(new Uint32Array(1))[0] ?? Date.now()
  return `LU-${String(value % 1_000_000).padStart(6, '0')}`
}

export function addRequest(request: NewLeadRequest) {
  const saved: LeadRequest = {
    ...request,
    id: crypto.randomUUID(),
    number: createNumber(),
    status: 'sent',
    createdAt: new Date().toISOString(),
  }
  requestStore.setState((requests) => [saved, ...requests])
  return saved
}

export function cancelRequest(id: string) {
  requestStore.setState((requests) =>
    requests.map((request) => (request.id === id ? { ...request, status: 'cancelled' } : request)),
  )
}

export function removeRequest(id: string) {
  requestStore.setState((requests) => requests.filter((request) => request.id !== id))
}

export function selectActiveCount(requests: LeadRequest[]) {
  return requests.filter((request) => request.status === 'sent').length
}
