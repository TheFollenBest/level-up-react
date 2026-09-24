import { Link, useSearchParams } from 'react-router'
import { Calculator } from '../components/Calculator/Calculator.tsx'
import { ArrowRightIcon } from '../components/Icon/icons.tsx'
import { PageHeader } from '../components/PageHeader/PageHeader.tsx'
import { PageMeta } from '../components/PageMeta/PageMeta.tsx'
import { getCalculatorModel } from '../data/calculator.ts'
import { getService, isServiceSlug, services, type ServiceSlug } from '../data/services.ts'
import styles from './CalculatorPage.module.css'

const DEFAULT_SERVICE: ServiceSlug = 'obemnye-bukvy'

export function CalculatorPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('service')
  const slug = isServiceSlug(requested) ? requested : DEFAULT_SERVICE
  const service = getService(slug) ?? services[0]!
  const model = getCalculatorModel(service.slug)

  return (
    <>
      <PageMeta
        title="Калькулятор стоимости"
        description="Посчитайте ориентировочную стоимость вывески, объёмных букв, светового короба, стенда, табличек или POS-материалов."
      />
      <PageHeader
        title="Калькулятор стоимости"
        breadcrumbs={[{ label: 'Калькулятор' }]}
        lead="Выберите изделие и задайте параметры: цена пересчитывается сразу. Отправьте расчёт менеджеру, и мы назовём точную смету после замера."
      />

      <div className="container">
        <fieldset className={styles.picker}>
          <legend className={styles.legend}>Что считаем</legend>
          <div className={styles.options}>
            {services.map((option) => (
              <label key={option.slug} className={styles.option}>
                <input
                  type="radio"
                  name="calculator-service"
                  className={styles.optionInput}
                  value={option.slug}
                  checked={option.slug === slug}
                  onChange={() => setSearchParams({ service: option.slug }, { replace: true, preventScrollReset: true })}
                />
                <span className={styles.optionBody}>
                  <img src={option.image.thumb} width={80} height={57} alt="" className={styles.optionImage} />
                  <span className={styles.optionTitle}>{option.title}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.head}>
          <h2 className={styles.title}>{service.title}</h2>
          <Link to={`/services/${service.slug}`} className={styles.more}>
            Подробнее об услуге
            <ArrowRightIcon />
          </Link>
        </div>

        <Calculator key={service.slug} model={model} service={service} />
      </div>
    </>
  )
}
