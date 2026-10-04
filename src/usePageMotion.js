import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default function usePageMotion(root) {
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.from('.hero-copy > *', { y: 26, autoAlpha: 0, duration: .9, stagger: .1, ease: 'power3.out', clearProps: 'opacity,visibility,transform' })
        gsap.from('.hero-art', { y: 34, autoAlpha: 0, duration: 1.25, delay: .15, ease: 'power3.out', clearProps: 'opacity,visibility,transform' })
        gsap.to('.hero-photo-frame', {
          y: -28, scale: .97, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 },
        })
        for (const element of gsap.utils.toArray('.section-heading, .trade-banner > div:first-child, .about-copy, .final-cta')) {
          gsap.from(element, { y: 38, autoAlpha: 0, duration: .85, ease: 'power3.out', clearProps: 'opacity,visibility,transform', scrollTrigger: { trigger: element, start: 'top 88%', once: true } })
        }
        gsap.from('.product-card', { y: 60, autoAlpha: 0, stagger: .12, duration: .8, ease: 'power3.out', clearProps: 'opacity,visibility,transform', scrollTrigger: { trigger: '.product-track', start: 'top 88%', once: true } })
        gsap.to('.trade-symbol', { rotation: 5, y: -25, ease: 'none', scrollTrigger: { trigger: '.trade-banner', start: 'top bottom', end: 'bottom top', scrub: .8 } })
        gsap.from('.category-card', { y: 40, autoAlpha: 0, stagger: .12, duration: .85, clearProps: 'opacity,visibility,transform', scrollTrigger: { trigger: '.category-grid', start: 'top 85%', once: true } })
      }, root)
      return () => context.revert()
    })
    return () => media.revert()
  }, [root])
}
