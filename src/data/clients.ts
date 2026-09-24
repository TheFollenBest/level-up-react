import gis1x from '../assets/images/clients/2gis-179.webp'
import gis2x from '../assets/images/clients/2gis-358.webp'
import cropp1x from '../assets/images/clients/cropp-210.webp'
import cropp2x from '../assets/images/clients/cropp-420.webp'
import mohito1x from '../assets/images/clients/mohito-203.webp'
import mohito2x from '../assets/images/clients/mohito-406.webp'
import sibakademstroy1x from '../assets/images/clients/sibakademstroy-179.webp'
import sibakademstroy2x from '../assets/images/clients/sibakademstroy-358.webp'
import totachi1x from '../assets/images/clients/totachi-179.webp'
import totachi2x from '../assets/images/clients/totachi-358.webp'

export type Client = {
  id: string
  name: string
  logo: { src: string; srcSet: string; width: number; height: number }
}

function logo(src1x: string, src2x: string, width: number, height: number) {
  return { src: src1x, srcSet: `${src1x} 1x, ${src2x} 2x`, width, height }
}

export const clients: Client[] = [
  { id: 'mohito', name: 'Mohito', logo: logo(mohito1x, mohito2x, 203, 58) },
  { id: 'cropp', name: 'Cropp', logo: logo(cropp1x, cropp2x, 210, 50) },
  { id: 'totachi', name: 'Totachi', logo: logo(totachi1x, totachi2x, 179, 66) },
  { id: 'sibakademstroy', name: 'Сибакадемстрой', logo: logo(sibakademstroy1x, sibakademstroy2x, 179, 45) },
  { id: '2gis', name: '2ГИС', logo: logo(gis1x, gis2x, 179, 74) },
]
