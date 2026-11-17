import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from './gsap.js'

function format(n, decimals) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Counts up to `value` the first time it scrolls into view.
 * When `value` changes later (a dashboard filter, say) it tweens from the
 * number on screen to the new one.
 *
 * The tween writes straight into the text node React rendered, so a running
 * count never re-renders the component. It always finishes on the same text
 * React has, so the two never disagree.
 */
export default function CountUp({ value, decimals = 0, duration = 1.2, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const shown = useRef(value)
  const started = useRef(false)
  const tween = useRef(null)
  const text = (n) => `${prefix}${format(n, decimals)}${suffix}`

  useGSAP(
    () => {
      const node = ref.current?.firstChild
      if (!node || prefersReducedMotion()) return

      const first = !started.current
      const counter = { n: first ? 0 : shown.current }
      started.current = true

      // paint the starting number before the browser shows the new one
      node.nodeValue = text(counter.n)

      tween.current?.kill()
      tween.current = gsap.to(counter, {
        n: value,
        duration: first ? duration : duration * 0.6,
        ease: 'power2.out',
        onUpdate: () => {
          shown.current = counter.n
          node.nodeValue = text(counter.n)
        },
        onComplete: () => {
          shown.current = value
          node.nodeValue = text(value)
        },
        scrollTrigger: first ? { trigger: ref.current, start: 'top 92%', once: true } : undefined,
      })
    },
    { dependencies: [value] },
  )

  return <span ref={ref}>{text(value)}</span>
}
