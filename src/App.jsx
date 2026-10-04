import React, { lazy, Suspense, useEffect, useId, useRef, useState } from 'react'
import logo from './assets/brand/vip-phones-logo.png'
import heroPhone from './assets/products/iphone-16-hero.jpg'
import lineup from './assets/products/iphone-16-lineup.jpg'
import { products } from './data/products'
import { store, whatsappUrl } from './config/store'
import ScrollExperience from './components/ScrollExperience'
import usePageMotion from './usePageMotion'
const HeroOpeningScene = lazy(() => import('./components/HeroOpeningScene'))

function Brand({ compact = false }) {
  const filterId = useId()
  return <a className={'brand' + (compact ? ' brand-compact' : '')} href="#inicio" aria-label="Vip Phones — início">
    <svg viewBox="8 255 680 190" aria-label="Vip Phones — Celulares & Acessórios" role="img">
      <defs><filter id={filterId} colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.25 0 0 0 -.25" result="brandAlpha" />
        <feFlood floodColor="currentColor" />
        <feComposite in2="brandAlpha" operator="in" />
      </filter></defs>
      <image href={logo} width="690" height="693" filter={`url(#${filterId})`} />
    </svg>
  </a>
}

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="site-header"><div className="shell header-inner">
    <Brand />
    <button className="menu-toggle" type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
    <nav className={'main-nav' + (open ? ' is-open' : '')} aria-label="Navegação principal">
      <a href="#iphones" onClick={() => setOpen(false)}>iPhones</a>
      <a href="#como-funciona" onClick={() => setOpen(false)}>Como comprar</a>
      <a href="#sobre" onClick={() => setOpen(false)}>Sobre a Vip</a>
      <a href="#experiencia" onClick={() => setOpen(false)}>Em detalhe</a>
      <a className="header-cta" href={whatsappUrl('Olá! Vim pelo site da Vip Phones e gostaria de falar com a equipe.')} target="_blank" rel="noreferrer">Falar com a Vip</a>
    </nav>
  </div></header>
}

function Hero() {
  return <section id="inicio" className="hero"><div className="shell hero-inner">
    <div className="hero-copy">
      <p className="eyebrow"><span className="eyebrow-line" /> VIP PHONES · CAMPINA GRANDE</p>
      <h1>Seu próximo iPhone <em>está na Vip.</em></h1>
      <p className="hero-lead">Escolha com calma, veja os detalhes e converse com quem entende. Uma experiência de compra tão boa quanto o seu próximo aparelho.</p>
      <div className="hero-actions"><a href="#iphones" className="button button-primary">Explorar iPhones</a><a href={whatsappUrl('Olá! Vim pelo site da Vip Phones e gostaria de conhecer os iPhones disponíveis.')} className="button button-ghost" target="_blank" rel="noreferrer">Falar no WhatsApp</a></div>
      <p className="hero-caption">Celulares & acessórios • atendimento em Campina Grande</p>
    </div>
    <div className="hero-art"><span className="hero-depth-ring" aria-hidden="true" /><div className="hero-photo-frame hero-3d-frame"><Suspense fallback={<img className="hero-loading-image" src={heroPhone} alt="iPhone em azul ultramarino, de frente e de costas" fetchPriority="high" />}><HeroOpeningScene /></Suspense></div></div>
  </div></section>
}

function TrustBar() {
  return <div className="trust-bar"><div className="shell trust-inner"><span><b>01</b> Atendimento pelo WhatsApp</span><span><b>02</b> Seu usado pode entrar na negociação</span><span><b>03</b> Celulares & acessórios</span></div></div>
}

function ProductCard({ product, onSelect }) {
  const tilt = (event) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--tilt-x', ((event.clientY - box.top) / box.height - .5) * -5 + 'deg')
    event.currentTarget.style.setProperty('--tilt-y', ((event.clientX - box.left) / box.width - .5) * 6 + 'deg')
  }
  const reset = (event) => { event.currentTarget.style.setProperty('--tilt-x', '0deg'); event.currentTarget.style.setProperty('--tilt-y', '0deg') }
  return <button type="button" className={'product-card' + (product.dark ? ' product-card-dark' : '')} onPointerMove={tilt} onPointerLeave={reset} onClick={() => onSelect(product)} aria-label={'Ver detalhes do ' + product.name}>
    <span className="product-card-top"><span>{product.eyebrow}</span></span>
    <span className="product-card-image"><img src={product.image} alt={product.imageAlt} loading="lazy" /></span>
    <span className="product-card-bottom"><strong>{product.name}</strong><span>Conhecer modelo</span></span>
  </button>
}

function ProductGallery({ product }) {
  const [imageIndex, setImageIndex] = useState(0)
  useEffect(() => setImageIndex(0), [product])
  return <div className="modal-gallery"><div className={'modal-main-image' + (product.dark && imageIndex === 0 ? ' dark' : '')}><img src={product.gallery[imageIndex].src} alt={product.gallery[imageIndex].alt} /></div><div className="modal-thumbs" aria-label="Imagens do aparelho">{product.gallery.map((item, index) => <button key={item.label} type="button" className={imageIndex === index ? 'is-active' : ''} onClick={() => setImageIndex(index)} aria-label={'Ver imagem: ' + item.label} aria-pressed={imageIndex === index}><img src={item.src} alt="" /><span>{item.label}</span></button>)}</div></div>
}

function ProductModal({ product, onClose }) {
  const [storage, setStorage] = useState('')
  const [color, setColor] = useState('')
  const closeRef = useRef(null)
  useEffect(() => {
    if (!product) return undefined
    setStorage(''); setColor('')
    const previous = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); previous?.focus?.() }
  }, [product, onClose])
  if (!product) return null
  const message = 'Olá! Vi o ' + product.name + (storage ? ', ' + storage : '') + (color ? ', na cor ' + color : '') + ' no site da Vip Phones. Gostaria de confirmar disponibilidade e valor.'
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button ref={closeRef} type="button" className="modal-close" onClick={onClose} aria-label="Fechar detalhes">×</button>
    <ProductGallery product={product} />
    <div className="modal-details"><p className="eyebrow">CONHEÇA O MODELO</p><h2 id="modal-title">{product.name}</h2><p className="modal-intro">{product.description}</p>
      <dl className="spec-list">{product.specs.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
      <div className="option-group"><span>Capacidade de interesse</span><div>{product.storage.map((value) => <button key={value} type="button" className={storage === value ? 'selected' : ''} onClick={() => setStorage(value)} aria-pressed={storage === value}>{value}</button>)}</div></div>
      <div className="option-group"><span>Cor de interesse</span><div>{product.colors.map((value) => <button key={value} type="button" className={color === value ? 'selected' : ''} onClick={() => setColor(value)} aria-pressed={color === value}>{value}</button>)}</div></div>
      <a className="button button-primary modal-cta" href={whatsappUrl(message)} target="_blank" rel="noreferrer">Consultar disponibilidade e valor</a>
      <p className="fine-print">Capacidades e cores mostram opções da linha. Estoque, preço e condição do aparelho são confirmados pela equipe.</p>
    </div>
  </div></div>
}

function Products() {
  const trackRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const move = (direction) => trackRef.current?.scrollBy({ left: direction * ((trackRef.current.querySelector('.product-card')?.offsetWidth || 340) + 20), behavior: 'smooth' })
  return <><section id="iphones" className="products-section section-space"><div className="shell">
    <div className="section-heading products-heading"><div><p className="eyebrow">VITRINE VIP</p><h2>Escolha seu iPhone.</h2><p>Um olhar mais próximo antes de conversar com a Vip.</p></div><div className="carousel-controls"><button type="button" onClick={() => move(-1)} aria-label="Ver modelos anteriores">‹</button><button type="button" onClick={() => move(1)} aria-label="Ver próximos modelos">›</button></div></div>
    <div className="product-track" ref={trackRef}>{products.map((product) => <ProductCard key={product.id} product={product} onSelect={setSelected} />)}</div>
    <p className="catalog-note">Seleção visual de modelos para consulta. Confirme quais aparelhos estão disponíveis hoje pelo WhatsApp.</p>
  </div></section><ProductModal product={selected} onClose={() => setSelected(null)} /></>
}

function TradeBanner() {
  return <section className="trade-banner shell" id="como-funciona"><div><p className="eyebrow">SEU PRÓXIMO UPGRADE</p><h2>Seu usado pode fazer parte da próxima escolha.</h2><p>Conte para a equipe qual aparelho você tem e qual deseja conhecer. A Vip orienta você na conversa.</p><a href={whatsappUrl('Olá! Gostaria de saber como usar meu celular atual na negociação de outro aparelho.')} className="button button-white" target="_blank" rel="noreferrer">Conversar com a Vip</a></div><div className="trade-visual" aria-hidden="true"><span className="trade-circle trade-circle-one" /><span className="trade-circle trade-circle-two" /><div className="trade-symbol trade-brand"><img src={logo} alt="" /></div></div></section>
}

function Categories() {
  return <section className="categories section-space shell"><div className="section-heading"><div><p className="eyebrow">ENCONTRE O QUE PROCURA</p><h2>Mais do que um aparelho.</h2></div></div><div className="category-grid"><a href="#iphones" className="category-card category-iphone"><span>01 / IPHONES</span><h3>iPhones</h3><p>Descubra os modelos e escolha o próximo.</p><img src={lineup} alt="Linha iPhone 16 em diferentes cores" loading="lazy" /></a><a href={whatsappUrl('Olá! Gostaria de conhecer os acessórios disponíveis na Vip Phones.')} className="category-card category-accessory" target="_blank" rel="noreferrer"><span>02 / ACESSÓRIOS</span><h3>Acessórios</h3><p>Complete sua experiência. Consulte as opções com a equipe.</p><div className="accessory-pattern" aria-hidden="true"><i /><i /><i /></div></a></div></section>
}

function About() {
  return <section id="sobre" className="about-section section-space"><div className="shell about-grid"><div className="about-mark"><Brand compact /><span>CELULARES & ACESSÓRIOS</span></div><div className="about-copy"><p className="eyebrow">SOBRE A VIP PHONES</p><h2>Uma loja para encontrar o seu próximo celular com atendimento próximo.</h2><p>A Vip Phones apresenta celulares e acessórios em Campina Grande. Pelo site, você conhece modelos e leva sua escolha para uma conversa direta com a equipe.</p><a href={store.instagram} target="_blank" rel="noreferrer" className="text-link">Conhecer a Vip no Instagram</a></div></div></section>
}

function FinalCTA() {
  return <section className="final-cta shell"><p className="eyebrow">A PRÓXIMA CONVERSA COMEÇA AQUI</p><h2>Encontrou um modelo que combina com você?</h2><p>Chame a Vip para confirmar disponibilidade, valor e opções atuais.</p><a className="button button-primary" href={whatsappUrl('Olá! Vim pelo site da Vip Phones e gostaria de consultar os modelos disponíveis.')} target="_blank" rel="noreferrer">Falar no WhatsApp</a></section>
}

function Footer() {
  return <footer className="site-footer"><div className="shell footer-inner"><Brand compact /><div><p>Vip Phones · Celulares & Acessórios</p><span>Campina Grande, PB</span></div><div className="footer-links"><a href={store.instagram} target="_blank" rel="noreferrer">Instagram</a><a href={whatsappUrl('Olá! Vim pelo site da Vip Phones.')} target="_blank" rel="noreferrer">WhatsApp</a></div></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} Vip Phones</span><a className="model-credit" href="https://sketchfab.com/3d-models/iphone-15-pro-max-5b7b35513a154ac69619dc2b2fe15686" target="_blank" rel="noreferrer">Modelo 3D: MpPower · CC BY 4.0</a><a href="#inicio">Voltar ao início</a></div></footer>
}

export default function App() {
  const root = useRef(null)
  usePageMotion(root)
  return <div ref={root}><Header /><main><Hero /><TrustBar /><Products /><ScrollExperience /><TradeBanner /><Categories /><About /><FinalCTA /></main><Footer /></div>
}
