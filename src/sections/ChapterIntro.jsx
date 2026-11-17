import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import SplitWords, { SplitLine } from '../components/ui/SplitWords.jsx'
import { gsap, ScrollTrigger, useGSAP, media } from '../motion/gsap.js'
import styles from './ChapterIntro.module.css'

// How the chapter's panel arrives. Each section uses a different one so the page keeps surprising.
const entrances = {
  right: { from: 'inset(0% 0% 0% 100%)', to: 'inset(0% 0% 0% 0%)' },
  window: { from: 'inset(32% 30% 32% 30% round 40px)', to: 'inset(0% 0% 0% 0% round 0px)' },
  circle: { from: 'circle(0% at 50% 50%)', to: 'circle(75% at 50% 50%)' },
  up: { from: 'inset(100% 0% 0% 0%)', to: 'inset(0% 0% 0% 0%)' },
}

/**
 * Opens a chapter of the page. The brand grid panel starts wiping in as soon as the
 * section peeks in, then on desktop the scene holds while the title finishes rising
 * and the text drifts, so every bit of scroll moves something on screen.
 * Everything is tied to the scroll, so it plays backwards too.
 */
export default function ChapterIntro({ id, chapter, eyebrow, title, accent, lead, enter = 'right' }) {
  const { number, total } = chapter
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ desktop: media.desktop, mobile: media.mobile }, ({ conditions }) => {
        const shape = entrances[enter]
        const vh = () => window.innerHeight

        /*
          One timeline from the moment the chapter peeks in at the bottom until the end of the hold.
          Positions are in screens of scroll: 0 to 1 is the chapter rising to the top,
          1 to 1.7 is the desktop hold. Something moves at every point, so it never feels stuck.
        */
        const scene = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: conditions.desktop
            ? { trigger: root.current, start: 'top bottom', end: () => `+=${vh() * 1.7}`, scrub: 0.8 }
            : // phones have no hold, so the same story plays over a shorter stretch of scroll
              { trigger: root.current, start: 'top 95%', end: 'bottom 85%', scrub: 0.8 },
        })

        scene
          .fromTo('[data-panel]', { clipPath: shape.from }, { clipPath: shape.to, duration: 0.9 }, 0)
          .fromTo('[data-chapter-grid]', { scale: 1.15 }, { scale: 1, duration: 1.4 }, 0.3)

        // the glowing edge rides along the front of the right hand wipe
        if (enter === 'right') {
          scene
            .fromTo('[data-edge]', { xPercent: 100, autoAlpha: 1 }, { xPercent: 0, duration: 0.9 }, 0)
            .to('[data-edge]', { autoAlpha: 0, duration: 0.1 }, 0.9)
        }

        scene
          .from('[data-chapter-meta]', { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.25, ease: 'power2.out' }, 0.6)
          .from('[data-word]', { yPercent: 115, stagger: 0.04, duration: 0.3, ease: 'power3.out' }, 0.75)
          .from('[data-chapter-lead]', { y: 30, autoAlpha: 0, duration: 0.25, ease: 'power2.out' }, 1.1)
          .fromTo('[data-chapter-content]', { y: 0 }, { y: -50, duration: 0.7 }, 1)

        // desktop only: hold the scene while the title finishes and the text drifts
        if (conditions.desktop) {
          ScrollTrigger.create({ trigger: root.current, start: 'top top', end: () => `+=${vh() * 0.7}`, pin: true })
        }
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={styles.chapter}>
      <div className={styles.panel} data-panel aria-hidden="true">
        <img src="/images/brand/hero-grid.svg" width="1920" height="1223" alt="" loading="lazy" data-chapter-grid />
      </div>
      {enter === 'right' && <span className={styles.edge} data-edge aria-hidden="true" />}

      <Container className={styles.content} data-chapter-content>
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
