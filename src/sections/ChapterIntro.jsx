import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import SplitWords, { SplitLine } from '../components/ui/SplitWords.jsx'
import { gsap, useGSAP, media } from '../motion/gsap.js'
import styles from './ChapterIntro.module.css'

// How the chapter's panel arrives. Each section uses a different one so the page keeps surprising.
const entrances = {
  right: { from: 'inset(0% 0% 0% 100%)', to: 'inset(0% 0% 0% 0%)' },
  window: { from: 'inset(32% 30% 32% 30% round 40px)', to: 'inset(0% 0% 0% 0% round 0px)' },
  circle: { from: 'circle(0% at 50% 50%)', to: 'circle(75% at 50% 50%)' },
  up: { from: 'inset(100% 0% 0% 0%)', to: 'inset(0% 0% 0% 0%)' },
}

/**
 * Opens a chapter of the page. On desktop the scene pins while a brand grid panel
 * wipes in, then the chapter number, title and lead rise into place, all tied to
 * the scroll so it plays backwards too. Phones get the same wipe without the pin.
 */
export default function ChapterIntro({ id, chapter, eyebrow, title, accent, lead, enter = 'right' }) {
  const { number, total } = chapter
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ desktop: media.desktop, mobile: media.mobile }, ({ conditions }) => {
        const shape = entrances[enter]
        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: conditions.desktop
            ? { trigger: root.current, start: 'top top', end: '+=85%', pin: true, scrub: 0.7 }
            : { trigger: root.current, start: 'top 90%', end: 'center 40%', scrub: 0.7 },
        })

        timeline.fromTo('[data-panel]', { clipPath: shape.from }, { clipPath: shape.to, duration: 1 }, 0)

        // the glowing edge rides along the front of the right hand wipe
        if (enter === 'right') {
          timeline
            .fromTo('[data-edge]', { xPercent: 100, autoAlpha: 1 }, { xPercent: 0, duration: 1 }, 0)
            .to('[data-edge]', { autoAlpha: 0, duration: 0.15 }, 1)
        }

        timeline
          .from('[data-chapter-meta]', { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.3, ease: 'power2.out' }, 0.55)
          .from('[data-word]', { yPercent: 115, stagger: 0.04, duration: 0.35, ease: 'power3.out' }, 0.65)
          .from('[data-chapter-lead]', { y: 30, autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, 0.95)
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={styles.chapter}>
      <div className={styles.panel} data-panel aria-hidden="true">
        <img src="/images/brand/hero-grid.svg" width="1920" height="1223" alt="" loading="lazy" />
      </div>
      {enter === 'right' && <span className={styles.edge} data-edge aria-hidden="true" />}

      <Container className={styles.content}>
        <p className={styles.number} data-chapter-meta>
          {number}
          <span> / {total}</span>
        </p>
        <Eyebrow data-chapter-meta>{eyebrow}</Eyebrow>
        <h2 id={id} className={styles.title}>
          <SplitWords text={title} />
          {accent && (
            <SplitLine>
              <GradientText>{accent}</GradientText>
            </SplitLine>
          )}
        </h2>
        {lead && (
          <p className={styles.lead} data-chapter-lead>
            {lead}
          </p>
        )}
      </Container>
    </div>
  )
}
