import { addRequest, type NewLeadRequest } from '../store/requests.ts'
import { showToast } from '../store/toasts.ts'

export async function submitRequest(request: NewLeadRequest) {
  const saved = addRequest(request)
  showToast({
    message: `Заявка ${saved.number} отправлена. Перезвоним в рабочее время.`,
    action: { label: 'Мои заявки', to: '/requests' },
  })
  return saved
}
