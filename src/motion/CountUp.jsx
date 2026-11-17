import { useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from './gsap.js'

function format(n, decimals) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Counts up to `value` the first time it scrolls into view.
 * When `value` changes later (for example a dashboard filter), it tweens
 * from the number on screen to the new one.
 */
export default function CountUp({ value, decimals = 0, duration = 1.2, prefix = '', suffix = '', onView = true }) {
  const ref = useRef(null)
  const shown = useRef(value)
  const started = useRef(false)
  const tween = useRef(null)
  const [display, setDisplay] = useState(value)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        setDisplay(value)
        return
      }

      const first = !started.current
      const counter = { n: first ? 0 : shown.current }
      started.current = true

      tween.current?.kill()
      tween.current = gsap.to(counter, {
        n: value,
        duration: first ? duration : duration * 0.6,
        ease: 'power2.out',
        onUpdate: () => {
          shown.current = counter.n
          setDisplay(counter.n)
        },
        scrollTrigger: first && onView ? { trigger: ref.current, start: 'top 92%', once: true } : undefined,
      })

      if (first) setDisplay(0)
    },
    { dependencies: [value] },
  )

  return (
    <span ref={ref}>
      {prefix}
      {format(display, decimals)}
      {suffix}
    </span>
  )
}
