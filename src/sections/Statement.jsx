import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import { gsap, useGSAP, media } from '../motion/gsap.js'
import { cx } from '../lib/cx.js'
import styles from './Statement.module.css'

/**
 * One big sentence that lights up word by word as you scroll through it,
 * so the reader's eye moves with the page. Accent phrases light up in the
 * brand gradient. Every word is always on screen and readable, and the
 * unlit colour still passes contrast.
 */
export default function Statement({ statement }) {
  const root = useRef(null)
  // plain text lights word by word, an accent phrase lights as one piece so its gradient runs unbroken
  const words = statement.parts.flatMap((part) =>
    part.accent ? [{ word: part.text, accent: true }] : part.text.split(' ').map((word) => ({ word })),
  )

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(media.ok, () => {
        const lit = gsap.utils.toArray('[data-lit]')
        gsap.set(lit, { '--lit': 0 })

        gsap.to(lit, {
          '--lit': 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-statement]', start: 'top 78%', end: 'bottom 42%', scrub: 0.4 },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.section} aria-labelledby="statement-text">
      <Container className={styles.inner}>
        <Eyebrow data-reveal="scale">{statement.eyebrow}</Eyebrow>
        <p id="statement-text" className={styles.text} data-statement>
          {words.map(({ word, accent }, i) => (
            <span key={i}>
              <span className={cx(styles.word, accent && styles.accent)} data-lit>
                {word}
              </span>{' '}
            </span>
          ))}
        </p>
      </Container>
    </section>
  )
}
