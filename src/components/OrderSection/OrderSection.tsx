import { cx } from '../../utils/cx.ts'
import { RequestForm } from '../RequestForm/RequestForm.tsx'
import styles from './OrderSection.module.css'

type OrderSectionProps = {
  title?: string
  className?: string
}

export function OrderSection({ title = 'Вы хотите сделать заказ или задать вопрос?', className }: OrderSectionProps) {
  return (
    <section id="order" className={cx('container', className)} aria-labelledby="order-title">
      <div className={styles.card}>
        <h2 id="order-title" className={styles.title}>
          {title}
        </h2>
        <p className={styles.text}>Оставьте имя и телефон: перезвоним, уточним задачу и договоримся о бесплатном замере.</p>
        <RequestForm kind="order" layout="inline" />
      </div>
    </section>
  )
}
