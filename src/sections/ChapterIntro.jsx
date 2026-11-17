import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import SplitWords, { SplitLine } from '../components/ui/SplitWords.jsx'
import { gsap, ScrollTrigger, useGSAP, media, smoothing, markReady } from '../motion/gsap.js'
import { afterPaint } from '../motion/schedule.js'
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
 * section peeks in, then on desktop the scene holds while the text drifts, so every
 * bit of scroll moves something on screen. Everything is tied to the scroll, so it
 * plays backwards too.
 */
export default function ChapterIntro({ id, chapter, eyebrow, title, accent, lead, enter = 'right' }) {
  const { number, total } = chapter
  const root = useRef(null)
  const shape = entrances[enter]

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root.current)

      return afterPaint(() =>
        mm.add({ desktop: media.desktop, mobile: media.mobile }, ({ conditions }) => {
          const vh = () => window.innerHeight
          markReady(root.current)

          /*
            One timeline from the moment the chapter peeks in at the bottom until the end of the hold.
            Positions are in screens of scroll: 0 to 1 is the chapter rising to the top, 1 to 1.7 is
            the desktop hold. The title and lead are fully up by 0.85, before the chapter reaches the
            top, so a jump from the menu always lands on a finished heading.
          */
          const scene = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: conditions.desktop
              ? { trigger: root.current, start: 'top bottom', end: () => `+=${vh() * 1.7}`, scrub: smoothing.desktop }
              : // phones have no hold, so the same scene plays over a shorter stretch and settles on screen
                { trigger: root.current, start: 'top 95%', end: 'top 35%', scrub: smoothing.mobile },
          })

          scene
            .fromTo('[data-panel]', { clipPath: shape.from }, { clipPath: shape.to, duration: 0.8 }, 0)
            .fromTo('[data-chapter-grid]', { scale: 1.15 }, { scale: 1, duration: 1.4 }, 0.2)

          // the glowing edge rides along the front of the right hand wipe
          if (enter === 'right') {
            scene
              .fromTo('[data-edge]', { xPercent: 100, autoAlpha: 1 }, { xPercent: 0, duration: 0.8 }, 0)
              .to('[data-edge]', { autoAlpha: 0, duration: 0.1 }, 0.8)
          }

          const words = root.current.querySelectorAll('[data-word]')
          scene
            .from('[data-chapter-meta]', { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.25, ease: 'power2.out' }, 0.3)
            .from(words, { yPercent: 115, stagger: Math.min(0.04, 0.18 / words.length), duration: 0.28, ease: 'power3.out' }, 0.38)
            .from('[data-chapter-lead]', { y: 30, autoAlpha: 0, duration: 0.22, ease: 'power2.out' }, 0.62)
            .fromTo('[data-chapter-content]', { y: 0 }, { y: -50, duration: 0.7 }, 1)

          // desktop only: hold the scene while the text drifts
          if (conditions.desktop) {
            ScrollTrigger.create({ trigger: root.current, start: 'top top', end: () => `+=${vh() * 0.7}`, pin: true })
          }
        }),
      )
    },
    { scope: root },
  )

  return (
    <div ref={root} className={styles.chapter} style={{ '--panel-from': shape.from }}>
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
