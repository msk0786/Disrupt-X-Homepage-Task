import { Fragment, useRef } from 'react'
import GradientText from '../components/ui/GradientText.jsx'
import { gsap, useGSAP, media } from '../motion/gsap.js'
import styles from './Statement.module.css'

// Each row repeats its content so there is always text on screen while it slides
const REPEAT = 3

/**
 * Oversized type that drifts sideways with the scroll, the two rows in opposite
 * directions. The rows are decorative, so screen readers get one plain sentence.
 */
export default function Statement({ statement }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(media.ok, () => {
        const scroll = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
        gsap.fromTo('[data-drift="left"]', { xPercent: 0 }, { xPercent: -22, ease: 'none', scrollTrigger: scroll })
        gsap.fromTo('[data-drift="right"]', { xPercent: -22 }, { xPercent: 0, ease: 'none', scrollTrigger: scroll })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.band}>
      <p className="visually-hidden">{statement.label}</p>

      <div className={styles.row} data-drift="left" aria-hidden="true">
        {Array.from({ length: REPEAT }, (_, copy) =>
          statement.words.map((word) => (
            <Fragment key={`${copy}-${word}`}>
              <span className={styles.outline}>{word}</span>
              <span className={styles.spark} />
            </Fragment>
          )),
        )}
      </div>

      <div className={styles.row} data-drift="right" aria-hidden="true">
        {Array.from({ length: REPEAT }, (_, copy) => (
          <Fragment key={copy}>
            <span className={styles.solid}>
              {statement.line} <GradientText>{statement.accent}</GradientText>
            </span>
            <span className={styles.spark} />
          </Fragment>
        ))}
      </div>
    </section>
  )
}
