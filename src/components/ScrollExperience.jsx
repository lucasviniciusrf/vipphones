import React, { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
const PhoneScene = lazy(() => import('./PhoneScene'))
gsap.registerPlugin(ScrollTrigger)

const chapters = [
  { title: 'Olhe mais de perto.', text: 'Uma nova perspectiva para a sua próxima escolha. Role para explorar o aparelho por todos os ângulos.' },
  { title: 'Detalhes em foco.', text: 'Tela, câmeras e acabamento. Continue rolando para observar o aparelho por inteiro.' },
  { title: 'A escolha é sua.', text: 'Encontrou o que procura? Conheça os modelos da vitrine e converse com a Vip sobre disponibilidade e valor.' },
]

export default function ScrollExperience() {
  const sectionRef = useRef(null)
  const motion = useRef({ progress: 0, manual: null })
  const [phase, setPhase] = useState(0)
  const [view, setView] = useState(null)
  const [enabled, setEnabled] = useState(false)
  const [sceneStatus, setSceneStatus] = useState('loading')
  const [reducedMotion, setReducedMotion] = useState(false)
  useLayoutEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setEnabled(true); observer.disconnect() } }, { rootMargin: '650px' })
    observer.observe(sectionRef.current)
    const media = gsap.matchMedia()
    media.add({ reduced: '(prefers-reduced-motion: reduce)', desktop: '(min-width: 821px)' }, (context) => {
      const { reduced, desktop } = context.conditions
      setReducedMotion(reduced)
      motion.current.progress = 0
      motion.current.manual = null
      setPhase(0)
      setView(null)
      if (reduced) return
      gsap.to(motion.current, {
        progress: 1, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top ' + (desktop ? 92 : 70), end: 'bottom bottom', scrub: .55, invalidateOnRefresh: true },
        onUpdate: () => { const p = motion.current.progress; setPhase(p < .34 ? 0 : p < .72 ? 1 : 2); motion.current.manual = null; setView(null) },
      })
    })
    return () => { observer.disconnect(); media.revert() }
  }, [])
  const chooseView = (name, angle) => { motion.current.manual = angle; setView(name) }
  return <section id="experiencia" className={'scroll-experience' + (reducedMotion ? ' motion-reduced' : '')} ref={sectionRef}>
    <div className="scene-sticky shell">
      <div className="experience-copy">
        <p className="eyebrow">VIP, POR TODOS OS ÂNGULOS</p>
        <div className="chapter-copy">{chapters.map((chapter, index) => <div key={chapter.title} className={'chapter' + (phase === index ? ' is-active' : '')} aria-hidden={phase !== index}><span className="chapter-number">0{index + 1} / 03</span><h2>{chapter.title}</h2><p>{chapter.text}</p></div>)}</div>
        <a className="button button-primary" href="#iphones">Voltar à vitrine</a>
        <div className="scene-chapters" aria-label={'Etapa ' + (phase + 1) + ' de 3'}>{chapters.map((chapter, index) => <span key={chapter.title} className={phase === index ? 'is-active' : ''} />)}</div>
      </div>
      <div className="experience-stage">
        <span className="scene-halo" aria-hidden="true" />
        <div className="scene-watermark" aria-hidden="true">Vip.</div>
        {enabled ? <Suspense fallback={<div className="phone-scene"><span className="scene-loading">Preparando os detalhes</span></div>}><PhoneScene motion={motion} reducedMotion={reducedMotion} onStatusChange={setSceneStatus} /></Suspense> : <div className="phone-scene" />}
        {sceneStatus === 'ready' && <div className="scene-controls" aria-label="Escolher ângulo do iPhone">{[['Frente', -.25], ['Lateral', Math.PI / 2], ['Traseira', Math.PI + .2]].map(([name, angle]) => <button key={name} type="button" onClick={() => chooseView(name, angle)} aria-pressed={view === name}>{name}</button>)}</div>}
        <p className="scene-model-label">{sceneStatus === 'fallback' ? 'Linha iPhone Pro · imagem de referência' : 'iPhone 15 Pro Max'}<span>{sceneStatus === 'fallback' ? 'Conheça os modelos na vitrine' : reducedMotion ? 'Escolha um ângulo ou arraste para explorar' : 'Role ou arraste para explorar'}</span></p>
      </div>
      <div className="experience-scroll-cue" aria-hidden="true"><span /> Continue para descobrir</div>
    </div>
  </section>
}
