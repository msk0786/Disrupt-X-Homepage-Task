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

const ok = '(prefers-reduced-motion: no-preference)'

/*
  Use these with gsap.matchMedia(). Anything animated lives under `ok`,
  so people who ask for reduced motion get the final state straight away.

  desktop  wide screens driven by a mouse: pinned scenes and longer scrubs
  mobile   everything else (phones, tablets, touch laptops): the same animations,
           no pins, shorter ranges so they settle while still in view
  The two never match at the same time.
*/
export const media = {
  ok,
  desktop: `(min-width: 900px) and (hover: hover) and (pointer: fine) and ${ok}`,
  mobile: [
    `(max-width: 899px) and ${ok}`,
    `(hover: none) and ${ok}`,
    `(pointer: coarse) and ${ok}`,
    `(pointer: none) and ${ok}`,
  ].join(', '),
}

// How long a scrubbed animation takes to catch up with the scroll, in seconds.
// Short on touch screens so nothing trails behind the finger.
export const smoothing = { desktop: 0.6, mobile: 0.3 }

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Marks an element as handed over to JavaScript. Until then, CSS keeps animated
 * elements in their starting state (see `.js` in index.html and utilities.css),
 * so nothing appears, vanishes and appears again while the page wakes up.
 */
export function markReady(el) {
  el?.setAttribute('data-motion-ready', '')
}

export { gsap, ScrollTrigger, useGSAP }
