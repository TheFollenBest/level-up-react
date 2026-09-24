import type { ComponentType, SVGProps } from 'react'
import {
  DiscountIcon,
  DraftingIcon,
  HeadsetIcon,
  StopwatchIcon,
  ThumbUpIcon,
  WarrantyIcon,
} from '../components/Icon/icons.tsx'

export type Advantage = {
  id: string
  title: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const advantages: Advantage[] = [
  { id: 'quality', title: 'Качество от производителя, из первых рук', icon: ThumbUpIcon },
  { id: 'speed', title: 'Оперативное выполнение заказов любой сложности', icon: StopwatchIcon },
  { id: 'consulting', title: 'Бесплатная консультация по любому типу рекламных материалов', icon: HeadsetIcon },
  { id: 'measure', title: 'Бесплатный вызов замерщика', icon: DraftingIcon },
  { id: 'warranty', title: 'Гарантия на изделия и монтаж 2 года', icon: WarrantyIcon },
  { id: 'discount', title: 'Скидки постоянным клиентам до 30%', icon: DiscountIcon },
]
