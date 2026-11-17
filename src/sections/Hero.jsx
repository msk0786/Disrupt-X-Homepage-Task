import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import BrowserFrame from '../components/frames/BrowserFrame.jsx'
import HeroDashboard from '../components/screens/HeroDashboard.jsx'
import { gsap, useGSAP, media } from '../motion/gsap.js'
import { cx } from '../lib/cx.js'
import styles from './Hero.module.css'

export default function Hero({ hero, demo, dashboard, cards }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(media.ok, () => {
        // the floating cards arrive one after another once the page is ready
        gsap.to('[data-float]', {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          delay: 0.3,
        })

        // layered depth: the dashboard tilts flat while each card drifts at its own speed
        const depth = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=640', scrub: 0.6 },
        })

        depth.fromTo('[data-tilt]', { rotateX: 14, scale: 0.94 }, { rotateX: 0, scale: 1, ease: 'none' }, 0)
        gsap.utils.toArray('[data-depth]', root.current).forEach((card) => {
          depth.to(card, { yPercent: -Number(card.dataset.depth) * 100, ease: 'none' }, 0)
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.backdrop} aria-hidden="true">
        <img src="/images/brand/hero-grid.svg" alt="" width="1920" height="1223" fetchPriority="low" />
      </div>

      <Container className={styles.copy}>
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <h1 id="hero-title" className={styles.title}>
          {hero.title} <GradientText block>{hero.accent}</GradientText>
        </h1>
        <p className={styles.lead}>{hero.lead}</p>
        <div className={styles.ctas}>
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
          <BrowserFrame>
            <HeroDashboard data={dashboard} />
          </BrowserFrame>
        </div>

        <div className={cx(styles.float, styles.job)} data-float aria-hidden="true">
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

        <div className={cx(styles.float, styles.alert)} data-float aria-hidden="true">
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

        <div className={cx(styles.float, styles.closed)} data-float aria-hidden="true">
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
