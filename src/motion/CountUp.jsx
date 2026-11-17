import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from './gsap.js'
import { onceVisible, isOnScreen } from './observe.js'

// Building a number formatter is slow, so each precision gets one and keeps it
const formatters = new Map()
function format(n, decimals) {
  if (!formatters.has(decimals)) {
    formatters.set(
      decimals,
      new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    )
  }
  return formatters.get(decimals).format(n)
}

// After this point the page has been readable for a while, so a number that is
// already on screen keeps its value instead of dropping to 0 and counting again
const LATE_START_MS = 1500

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
  const waiting = useRef(null)
  const text = (n) => `${prefix}${format(n, decimals)}${suffix}`

  useGSAP(
    () => {
      const el = ref.current
      const node = el?.firstChild
      if (!node || prefersReducedMotion()) return

      tween.current?.kill()
      waiting.current?.()

      const first = !started.current
      started.current = true

      if (first && performance.now() > LATE_START_MS && isOnScreen(el)) {
        shown.current = value
        return
      }

      const from = first ? 0 : shown.current
      const counter = { n: from }

      // paint the starting number before the browser shows the new one
      node.nodeValue = text(from)
      shown.current = from

      const play = () => {
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
        })
      }

      // the first count waits until the number reaches the lower part of the screen
      if (first) waiting.current = onceVisible(el, play, '0px 0px -8% 0px')
      else play()

      // stop watching if the component goes away before it was seen
      return () => waiting.current?.()
    },
    { dependencies: [value] },
  )

  return <span ref={ref}>{text(value)}</span>
}
