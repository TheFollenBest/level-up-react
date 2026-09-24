import { Link } from 'react-router'
import { dismissToast, useToasts } from '../../store/toasts.ts'
import { CheckCircleIcon, XIcon } from '../Icon/icons.tsx'
import styles from './Toaster.module.css'

export function Toaster() {
  const toasts = useToasts((state) => state)

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={styles.toast}>
          <CheckCircleIcon className={styles.icon} />
          <p className={styles.message}>{toast.message}</p>
          {toast.action ? (
            <Link to={toast.action.to} className={styles.action} onClick={() => dismissToast(toast.id)}>
              {toast.action.label}
            </Link>
          ) : null}
          <button type="button" className={styles.close} aria-label="Закрыть уведомление" onClick={() => dismissToast(toast.id)}>
            <XIcon />
          </button>
        </div>
      ))}
    </div>
  )
}
