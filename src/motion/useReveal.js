import { gsap, ScrollTrigger, useGSAP, media, motion } from './gsap.js'

/**
 * Fades and lifts every [data-reveal] element inside `scope` as it scrolls into view.
 * Elements that enter together are staggered as one group.
 * Add data-reveal="scale" for a soft zoom instead of a lift.
 */
export function useReveal(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(media.ok, () => {
        const items = gsap.utils.toArray('[data-reveal]')
        const from = (el) => (el.dataset.reveal === 'scale' ? { autoAlpha: 0, scale: 0.96 } : { autoAlpha: 0, y: 28 })

        items.forEach((el) => gsap.set(el, from(el)))

        ScrollTrigger.batch(items, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: motion.duration,
              ease: motion.ease,
              // big groups share a fixed budget, so a fast scroll never waits on a long queue
              stagger: Math.min(motion.stagger, 0.36 / batch.length),
              overwrite: true,
            }),
        })
      })
    },
    { scope },
  )
}
