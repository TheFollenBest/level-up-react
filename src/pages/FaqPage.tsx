import { useDeferredValue, useState } from 'react'
import { Accordion } from '../components/Accordion/Accordion.tsx'
import { Button } from '../components/Button/Button.tsx'
import { EmptyState } from '../components/EmptyState/EmptyState.tsx'
import { ChatDotsIcon, SearchIcon } from '../components/Icon/icons.tsx'
import { PageHeader } from '../components/PageHeader/PageHeader.tsx'
import { PageMeta } from '../components/PageMeta/PageMeta.tsx'
import { faq, faqCategories, type FaqCategory } from '../data/faq.ts'
import { openRequestDialog } from '../store/requestDialog.ts'
import { cx } from '../utils/cx.ts'
import styles from './FaqPage.module.css'

function normalize(value: string) {
  return value.toLowerCase().replaceAll('ё', 'е').trim()
}

export function FaqPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<FaqCategory | 'all'>('all')
  const deferredQuery = normalize(useDeferredValue(query))

  const visible = faq.filter((item) => {
    if (category !== 'all' && item.category !== category) return false
    if (!deferredQuery) return true
    return normalize(`${item.question} ${item.answer}`).includes(deferredQuery)
  })

  const groups = faqCategories
    .map((group) => ({ ...group, items: visible.filter((item) => item.category === group.id) }))
    .filter((group) => group.items.length > 0)

  return (
    <>
      <PageMeta
        title="Вопросы и ответы"
        description="Сроки, цены, оплата, замер, монтаж и гарантия: ответы на частые вопросы о заказе рекламы в Level Up."
      />
      <PageHeader
        title="Вопросы и ответы"
        breadcrumbs={[{ label: 'Вопросы и ответы' }]}
        lead="Собрали ответы на то, о чём нас спрашивают чаще всего. Не нашли свой вопрос? Задайте его, ответим в рабочее время."
      />

      <div className={cx('container', styles.page)}>
        <div className={styles.toolbar}>
          <div className={styles.search}>
            <SearchIcon className={styles.searchIcon} />
            <label htmlFor="faq-search" className="visually-hidden">
              Поиск по вопросам
            </label>
            <input
              id="faq-search"
              type="search"
              className={styles.searchInput}
              placeholder="Например: гарантия, ночной монтаж, предоплата"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className={styles.filters} role="group" aria-label="Тема">
            {[{ id: 'all' as const, label: 'Все темы' }, ...faqCategories].map((option) => (
              <button
                key={option.id}
                type="button"
                className={cx(styles.filter, category === option.id && styles.filterActive)}
                aria-pressed={category === option.id}
                onClick={() => setCategory(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <p className={styles.count} aria-live="polite">
          {visible.length > 0 ? `Найдено ответов: ${visible.length}` : 'Ничего не найдено'}
        </p>

        {groups.length > 0 ? (
          <div className={styles.groups}>
            {groups.map((group) => (
              <section key={group.id} aria-labelledby={`faq-${group.id}`} className={styles.group}>
                <h2 id={`faq-${group.id}`} className={styles.groupTitle}>
                  {group.label}
                </h2>
                <Accordion
                  items={group.items.map((item) => ({ id: item.id, title: item.question, content: <p>{item.answer}</p> }))}
                />
              </section>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Такого вопроса ещё нет"
            action={
              <>
                <Button onClick={() => openRequestDialog({ kind: 'question' })}>Задать вопрос</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('')
                    setCategory('all')
                  }}
                >
                  Показать все ответы
                </Button>
              </>
            }
          >
            Попробуйте другое слово или задайте вопрос нам напрямую.
          </EmptyState>
        )}

        <aside className={styles.ask}>
          <ChatDotsIcon className={styles.askIcon} />
          <div>
            <h2 className={styles.askTitle}>Остался вопрос?</h2>
            <p className={styles.askText}>Напишите, и мы ответим по телефону или на почту.</p>
          </div>
          <Button onClick={() => openRequestDialog({ kind: 'question' })}>Задать вопрос</Button>
        </aside>
      </div>
    </>
  )
}
