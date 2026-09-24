import { useEffect, useEffectEvent, useRef } from 'react'
import { useLocation } from 'react-router'
import { closeRequestDialog, useRequestDialog } from '../../store/requestDialog.ts'
import { XIcon } from '../Icon/icons.tsx'
import { RequestForm } from '../RequestForm/RequestForm.tsx'
import styles from './RequestDialog.module.css'

const copy = {
  callback: {
    title: 'Заказать звонок',
    text: 'Оставьте номер: перезвоним в рабочее время, ответим на вопросы и договоримся о замере.',
  },
  question: {
    title: 'Задать вопрос',
    text: 'Опишите задачу или вопрос. Ответим по телефону или на почту, если укажете её.',
  },
}

export function RequestDialog() {
  const state = useRequestDialog((current) => current)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { pathname } = useLocation()
  const isOpen = state !== null

  const closeOnBackdrop = useEffectEvent((event: MouseEvent) => {
    if (event.target === dialogRef.current) closeRequestDialog()
  })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.addEventListener('click', closeOnBackdrop)
    return () => dialog.removeEventListener('click', closeOnBackdrop)
  }, [])

  useEffect(() => {
    closeRequestDialog()
  }, [pathname])

  const kind = state?.kind ?? 'callback'
  const title = state?.title ?? copy[kind].title

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="request-dialog-title" onClose={closeRequestDialog}>
      {state ? (
        <div className={styles.panel}>
          <div className={styles.header}>
            <h2 id="request-dialog-title" className={styles.title}>
              {title}
            </h2>
            <button type="button" className={styles.close} aria-label="Закрыть" onClick={closeRequestDialog}>
              <XIcon />
            </button>
          </div>
          <p className={styles.text}>{copy[kind].text}</p>
          {kind === 'callback' ? (
            <RequestForm
              kind="callback"
              topic={state.topic}
              defaultService={state.service}
              withCallTime
              submitLabel="Жду звонка"
            />
          ) : (
            <RequestForm
              kind="question"
              defaultService={state.service}
              withEmail
              message="required"
              messageLabel="Ваш вопрос"
              submitLabel="Отправить вопрос"
            />
          )}
        </div>
      ) : null}
    </dialog>
  )
}
