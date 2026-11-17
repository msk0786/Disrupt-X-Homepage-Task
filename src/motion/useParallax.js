import { gsap, useGSAP, media } from './gsap.js'
import { afterPaint } from './schedule.js'

/**
 * Gives depth to anything with data-speed. The element drifts against the scroll
 * while it crosses the screen: 0.5 moves about 60px each way, negative values drift the other way.
 * Phones get half the distance so nothing feels floaty on a small screen.
 */
export function useParallax(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia(scope.current)

      return afterPaint(() =>
        mm.add({ desktop: media.desktop, mobile: media.mobile }, ({ conditions }) => {
          const range = conditions.desktop ? 120 : 60

          gsap.utils.toArray('[data-speed]').forEach((el) => {
            const distance = Number(el.dataset.speed) * range
            gsap.fromTo(
              el,
              { y: distance },
              {
                y: -distance,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
              },
            )
          })
        }),
      )
    },
    { scope },
  )
}
