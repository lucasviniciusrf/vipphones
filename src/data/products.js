import iphone16 from '../assets/products/iphone-16-hero.jpg'
import iphone16Lineup from '../assets/products/iphone-16-lineup.jpg'
import iphone16Pro from '../assets/products/iphone-16-pro-hero.jpg'

// Modelos para consulta, sem afirmação de estoque.
export const products = [
  {
    id: 'iphone-16', name: 'iPhone 16', eyebrow: 'UM NOVO OLHAR', image: iphone16,
    imageAlt: 'Imagem oficial do iPhone 16 em ultramarino',
    description: 'Design marcante, câmera Fusion de 48 MP e chip A18.',
    specs: [['Tela', '6,1 polegadas'], ['Câmera principal', '48 MP'], ['Chip', 'A18']],
    storage: ['128 GB', '256 GB', '512 GB'], colors: ['Ultramarino', 'Preto', 'Branco', 'Rosa', 'Verde-acinzentado'],
    gallery: [{ src: iphone16, alt: 'iPhone 16 em ultramarino, frente e traseira', label: 'Ultramarino' }, { src: iphone16Lineup, alt: 'Cores da linha iPhone 16', label: 'Cores' }],
  },
  {
    id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max', eyebrow: 'UMA EXPERIÊNCIA PRO', image: iphone16Pro, dark: true,
    imageAlt: 'Imagem oficial da linha iPhone 16 Pro em titânio-deserto',
    description: 'Tela ampla, estrutura em titânio e câmeras pensadas para criar mais.',
    specs: [['Tela', '6,9 polegadas'], ['Câmeras', 'Sistema Pro'], ['Chip', 'A18 Pro']],
    storage: ['256 GB', '512 GB', '1 TB'], colors: ['Titânio-deserto', 'Titânio-natural', 'Titânio-branco', 'Titânio-preto'],
    gallery: [{ src: iphone16Pro, alt: 'Imagem oficial da linha iPhone 16 Pro em titânio-deserto', label: 'Destaque' }],
  },
  {
    id: 'iphone-16-plus', name: 'iPhone 16 Plus', eyebrow: 'MAIS ESPAÇO PARA TUDO', image: iphone16Lineup,
    imageAlt: 'Imagem oficial das cores da linha iPhone 16',
    description: 'A experiência da linha iPhone 16 em uma tela maior.',
    specs: [['Tela', '6,7 polegadas'], ['Câmera principal', '48 MP'], ['Chip', 'A18']],
    storage: ['128 GB', '256 GB', '512 GB'], colors: ['Ultramarino', 'Preto', 'Branco', 'Rosa', 'Verde-acinzentado'],
    gallery: [{ src: iphone16Lineup, alt: 'Imagem oficial da família iPhone 16 em diferentes cores', label: 'Cores' }, { src: iphone16, alt: 'Imagem oficial da linha iPhone 16 em ultramarino', label: 'Detalhe' }],
  },
]
