import installer1280 from '../assets/images/hero/installer-1280.webp'
import installer1920 from '../assets/images/hero/installer-1920.webp'
import installerMobile1150 from '../assets/images/hero/installer-mobile-1150.webp'
import installerMobile575 from '../assets/images/hero/installer-mobile-575.webp'
import lightbox1280 from '../assets/images/hero/lightbox-1280.webp'
import lightbox1920 from '../assets/images/hero/lightbox-1920.webp'
import lightboxMobile1150 from '../assets/images/hero/lightbox-mobile-1150.webp'
import lightboxMobile575 from '../assets/images/hero/lightbox-mobile-575.webp'
import prices1280 from '../assets/images/hero/prices-1280.webp'
import prices1920 from '../assets/images/hero/prices-1920.webp'
import pricesMobile1150 from '../assets/images/hero/prices-mobile-1150.webp'
import pricesMobile575 from '../assets/images/hero/prices-mobile-575.webp'

export type HeroAction =
  | { type: 'link'; label: string; to: string }
  | { type: 'callback'; label: string; topic: string }

export type HeroSlide = {
  id: string
  title: string
  note?: string
  tone: 'light' | 'dark'
  buttonTone: 'red' | 'accent' | 'navy'
  action: HeroAction
  image: { desktop: string; mobile: string }
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'full-cycle',
    title: 'Согласуем, нарисуем, изготовим, доставим, смонтируем',
    tone: 'light',
    buttonTone: 'red',
    action: { type: 'link', label: 'Сделать заказ', to: '/#order' },
    image: {
      desktop: `${lightbox1280} 1280w, ${lightbox1920} 1920w`,
      mobile: `${lightboxMobile575} 575w, ${lightboxMobile1150} 1150w`,
    },
  },
  {
    id: 'prices',
    title: 'Действительно низкие и прозрачные цены',
    tone: 'dark',
    buttonTone: 'accent',
    action: { type: 'link', label: 'Рассчитать стоимость', to: '/calculator' },
    image: {
      desktop: `${prices1280} 1280w, ${prices1920} 1920w`,
      mobile: `${pricesMobile575} 575w, ${pricesMobile1150} 1150w`,
    },
  },
  {
    id: 'night-install',
    title: 'Всегда идём навстречу нашим клиентам!',
    note: 'в том числе монтируем ночью',
    tone: 'light',
    buttonTone: 'navy',
    action: { type: 'callback', label: 'Вызвать замерщика', topic: 'Выезд замерщика' },
    image: {
      desktop: `${installer1280} 1280w, ${installer1920} 1920w`,
      mobile: `${installerMobile575} 575w, ${installerMobile1150} 1150w`,
    },
  },
]
