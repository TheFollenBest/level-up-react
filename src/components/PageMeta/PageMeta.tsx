type PageMetaProps = {
  title?: string
  description?: string
}

const defaultDescription =
  'Level Up: рекламно-производственная компания в Новосибирске. Объёмные буквы, вывески, световые короба, стенды, таблички и POS-материалы с замером, монтажом и гарантией 2 года.'

export function PageMeta({ title, description = defaultDescription }: PageMetaProps) {
  return (
    <>
      <title>{title ? `${title} | Level Up` : 'Level Up: наружная реклама и вывески в Новосибирске'}</title>
      <meta name="description" content={description} />
    </>
  )
}
