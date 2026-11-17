import { gsap, ScrollTrigger, useGSAP, media, motion } from './gsap.js'

/*
  One place for every scroll reveal on the page. Components only add attributes:

  data-reveal            fade and lift (default)
  data-reveal="left"     slide in from the left
  data-reveal="right"    swing in from the right with a little depth
  data-reveal="scale"    soft zoom
  data-reveal="flip"     tilt up from below, like a card being stood up
  data-reveal="clip"     wipe open from the bottom edge
  data-words             words of a title rise out of a mask, one after another (see SplitWords)
  data-draw              a line that draws itself, driven by the --draw custom property
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

export function useReveal(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(media.ok, () => {
        // plain reveals, batched so things entering together share one stagger
        const items = gsap.utils.toArray('[data-reveal]')
        items.forEach((el) => gsap.set(el, variantOf(el)))

        ScrollTrigger.batch(items, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) => {
            // big groups share a fixed budget, so a fast scroll never waits on a long queue
            const step = Math.min(motion.stagger, 0.36 / batch.length)
            batch.forEach((el, i) => {
              const vars =
                el.dataset.reveal === 'clip'
                  ? { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.inOut', clearProps: 'clipPath' }
                  : { ...shown, duration: 0.8, ease: motion.ease, clearProps: 'transform' }
              gsap.to(el, { ...vars, delay: i * step, overwrite: true })
            })
          },
        })

        // titles: each word rises out of its own mask
        gsap.utils.toArray('[data-words]').forEach((title) => {
          const words = title.querySelectorAll('[data-word]')
          gsap.set(words, { yPercent: 115 })
          ScrollTrigger.create({
            trigger: title,
            start: 'top 90%',
            once: true,
            onEnter: () =>
              gsap.to(words, {
                yPercent: 0,
                duration: 0.9,
                ease: 'power4.out',
                stagger: Math.min(0.06, 0.5 / words.length),
              }),
          })
        })

        // lines that draw themselves through a CSS custom property
        gsap.utils.toArray('[data-draw]').forEach((el) => {
          gsap.fromTo(
            el,
            { '--draw': 0 },
            { '--draw': 1, duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } },
          )
        })
      })

      // text reflows when Poppins arrives, so measure every trigger again
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
    },
    { scope },
  )
}
