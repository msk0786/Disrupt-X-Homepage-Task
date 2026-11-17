import { gsap, useGSAP, media, motion, markReady } from './gsap.js'
import { afterPaint } from './schedule.js'
import { onceVisible } from './observe.js'

/*
  One place for every simple reveal on the page. Components only add attributes:

  data-reveal            fade and lift (default)
  data-reveal="left"     slide in from the left
  data-reveal="right"    swing in from the right with a little depth
  data-reveal="scale"    soft zoom
  data-reveal="flip"     tilt up from below, like a card being stood up
  data-reveal="clip"     wipe open from the bottom edge
  data-words             words of a title rise out of a mask, one after another (see SplitWords)
  data-draw              a line that draws itself, driven by the --draw custom property

  Until the page wakes up, CSS holds these in their starting state (utilities.css).
  Each one plays once, the first time it crosses its trigger line. Things that enter
  together share one short stagger, so a fast scroll never waits on a long queue.
*/

const variants = {
  up: { autoAlpha: 0, y: 32 },
  left: { autoAlpha: 0, x: -48 },
  right: { autoAlpha: 0, x: 72, rotateY: -12, transformPerspective: 1400 },
  scale: { autoAlpha: 0, scale: 0.94, y: 16 },
  flip: { autoAlpha: 0, y: 48, rotateX: -24, transformPerspective: 900, transformOrigin: '50% 100%' },
  clip: { clipPath: 'inset(0% 0% 100% 0%)' },
}

const shown = { autoAlpha: 1, x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0 }
const variantOf = (el) => variants[el.dataset.reveal] ?? variants.up

function revealTo(el) {
  return el.dataset.reveal === 'clip'
    ? { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.inOut', clearProps: 'clipPath' }
    : { ...shown, duration: 0.8, ease: motion.ease, clearProps: 'transform' }
}

export function useReveal(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia(scope.current)

      return afterPaint(() =>
        mm.add(media.ok, () => {
          const stops = []

          // plain reveals: elements that cross the line in the same frame share one stagger
          let batch = []
          let frame = 0
          const flush = () => {
            const step = Math.min(motion.stagger, 0.36 / batch.length)
            batch.forEach((el, i) => gsap.to(el, { ...revealTo(el), delay: i * step, overwrite: true }))
            batch = []
            frame = 0
          }

          // hand each element over before GSAP reads it, so the CSS starting state
          // is gone and GSAP measures the element's real resting position
          gsap.utils.toArray('[data-reveal]').forEach((el) => {
            markReady(el)
            gsap.set(el, variantOf(el))
            stops.push(
              onceVisible(el, (entered) => {
                // already scrolled past it: show it as it is, no entrance
                if (!entered) return gsap.set(el, { ...revealTo(el), duration: 0, delay: 0 })
                batch.push(el)
                frame ||= requestAnimationFrame(flush)
              }),
            )
          })

          // titles: each word rises out of its own mask
          gsap.utils.toArray('[data-words]').forEach((title) => {
            const words = title.querySelectorAll('[data-word]')
            markReady(title)
            gsap.set(words, { yPercent: 115 })
            stops.push(
              onceVisible(
                title,
                (entered) =>
                  gsap.to(words, {
                    yPercent: 0,
                    duration: entered ? 0.9 : 0,
                    ease: 'power4.out',
                    stagger: entered ? Math.min(0.06, 0.5 / words.length) : 0,
                  }),
                '0px 0px -10% 0px',
              ),
            )
          })

          // lines that draw themselves through a CSS custom property
          gsap.utils.toArray('[data-draw]').forEach((el) => {
            markReady(el)
            gsap.set(el, { '--draw': 0 })
            stops.push(
              onceVisible(
                el,
                (entered) => gsap.to(el, { '--draw': 1, duration: entered ? 1.2 : 0, ease: 'power3.inOut' }),
                '0px 0px -15% 0px',
              ),
            )
          })

          return () => {
            stops.forEach((stop) => stop())
            cancelAnimationFrame(frame)
          }
        }),
      )
    },
    { scope },
  )
}
