import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import BrowserFrame from '../components/frames/BrowserFrame.jsx'
import HeroDashboard from '../components/screens/HeroDashboard.jsx'
import { gsap, useGSAP, media, smoothing } from '../motion/gsap.js'
import { afterPaint } from '../motion/schedule.js'
import { trackPointer } from '../motion/pointer.js'
import { cx } from '../lib/cx.js'
import styles from './Hero.module.css'

export default function Hero({ hero, demo, dashboard, cards }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root.current)

      // The entrance (text, dashboard and floating cards) is plain CSS, so it plays from the
      // first paint. The scroll effects below join in once the page has painted.
      return afterPaint(() =>
        mm.add({ desktop: media.desktop, mobile: media.mobile }, ({ conditions }) => {
          const scrub = conditions.desktop ? smoothing.desktop : smoothing.mobile

          // layered depth: the dashboard tilts flat while each card drifts at its own speed
          const depth = gsap.timeline({
            scrollTrigger: { trigger: root.current, start: 'top top', end: '+=640', scrub },
          })

          depth.fromTo('[data-tilt]', { rotateX: 14, scale: 0.94 }, { rotateX: 0, scale: 1, ease: 'none' }, 0)
          gsap.utils.toArray('[data-depth]').forEach((card) => {
            depth.to(card, { yPercent: -Number(card.dataset.depth) * 100, ease: 'none' }, 0)
          })

          // leaving the hero: the grid sinks slower than the page and the copy eases away
          const exit = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
          gsap.to('[data-backdrop]', { yPercent: 30, ease: 'none', scrollTrigger: exit })
          gsap.to('[data-hero-copy]', { y: -90, opacity: 0, ease: 'none', scrollTrigger: { ...exit, end: '+=560' } })
        }),
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.hero} aria-labelledby="hero-title" onPointerMove={trackPointer}>
      <div className={styles.backdrop} aria-hidden="true" data-backdrop>
        <img src="/images/brand/hero-grid.svg" alt="" width="1920" height="1223" fetchPriority="low" />
      </div>
      {/* a soft mint light that follows the cursor across the brand grid */}
      <div className={styles.spotlight} aria-hidden="true" />

      {/* The intro is plain CSS, so it plays from the first paint without waiting for JavaScript */}
      <Container className={styles.copy} data-hero-copy>
        <Eyebrow className={styles.intro} style={{ '--i': 0 }}>
          {hero.eyebrow}
        </Eyebrow>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.intro} style={{ '--i': 1 }}>
            {hero.title}
          </span>{' '}
          <GradientText block className={styles.intro} style={{ '--i': 2 }}>
            {hero.accent}
          </GradientText>
        </h1>
        <p className={cx(styles.lead, styles.intro)} style={{ '--i': 3 }}>
          {hero.lead}
        </p>
        <div className={cx(styles.ctas, styles.intro)} style={{ '--i': 4 }}>
          <Button href={demo.href} arrow>
            {demo.label}
          </Button>
          <Button href={hero.secondary.href} variant="ghost">
            {hero.secondary.label}
          </Button>
        </div>
      </Container>

      <div className={styles.stage}>
        <div className={styles.screen} data-tilt>
          <BrowserFrame title={dashboard.window}>
            <HeroDashboard data={dashboard} />
          </BrowserFrame>
        </div>

        <div className={cx(styles.float, styles.job)} style={{ '--n': 0 }} aria-hidden="true">
          <div data-depth="0.9" className={styles.card}>
            <img src="/images/brand/favicon.svg" width="32" height="32" alt="" className={styles.appIcon} />
            <div>
              <p className={styles.cardMeta}>
                {cards.job.app} <span>{cards.job.time}</span>
              </p>
              <p className={styles.cardTitle}>{cards.job.title}</p>
              <p className={styles.cardBody}>{cards.job.body}</p>
            </div>
          </div>
        </div>

        <div className={cx(styles.float, styles.alert)} style={{ '--n': 1 }} aria-hidden="true">
          <div data-depth="0.5" className={cx(styles.card, styles.alertCard)}>
            <span className={styles.alertIcon}>
              <Icon name="sparkles" size={18} />
            </span>
            <div>
              <p className={styles.cardLabel}>{cards.alert.label}</p>
              <p className={styles.cardTitle}>{cards.alert.title}</p>
              <p className={styles.cardBody}>{cards.alert.body}</p>
            </div>
          </div>
        </div>

        <div className={cx(styles.float, styles.closed)} style={{ '--n': 2 }} aria-hidden="true">
          <div data-depth="1.3" className={cx(styles.card, styles.closedCard)}>
            <span className={styles.check}>
              <Icon name="check" size={16} strokeWidth={2.5} />
            </span>
            <p>
              <span className={styles.cardLabel}>{cards.closed.label}</span>
              <span className={styles.cardTitle}>{cards.closed.title}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
