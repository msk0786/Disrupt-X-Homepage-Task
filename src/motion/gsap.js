import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
  // stops the mobile address bar from triggering a full refresh on every scroll
  ScrollTrigger.config({ ignoreMobileResize: true })
}

// Shared timing so every reveal on the page feels like the same hand made it
export const motion = {
  duration: 0.6,
  ease: 'power3.out',
  stagger: 0.08,
}

// Use these with gsap.matchMedia(). Anything animated lives under `ok`,
// so people who ask for reduced motion get the final state straight away.
export const media = {
  ok: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export { gsap, ScrollTrigger, useGSAP }
