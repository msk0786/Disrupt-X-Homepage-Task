import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import SplitWords, { SplitLine } from '../components/ui/SplitWords.jsx'
import Button from '../components/ui/Button.jsx'
import { gsap, useGSAP, media, smoothing } from '../motion/gsap.js'
import { afterPaint } from '../motion/schedule.js'
import styles from './FinalCta.module.css'

export default function FinalCta({ cta, demo }) {
  const panel = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    // the panel opens like a window as it scrolls up into view
    return afterPaint(() =>
      mm.add({ desktop: media.desktop, mobile: media.mobile }, ({ conditions }) => {
        const desktop = conditions.desktop
        const inset = desktop ? '7% 9% 7% 9%' : '4% 5% 4% 5%'
        gsap.fromTo(
          panel.current,
          { clipPath: `inset(${inset} round 28px)` },
          {
            clipPath: 'inset(0% 0% 0% 0% round 28px)',
            ease: 'none',
            scrollTrigger: {
              trigger: panel.current,
              start: 'top 95%',
              end: desktop ? 'top 35%' : 'top 60%',
              scrub: desktop ? smoothing.desktop : smoothing.mobile,
            },
          },
        )
      }),
    )
  })

  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <Container>
        <div ref={panel} className={styles.panel}>
          <img className={styles.grid} src="/images/brand/hero-grid.svg" width="1920" height="1223" alt="" loading="lazy" data-speed="-0.5" />
          <img
            className={styles.logo}
            src="/images/brand/alef-360-logo.svg"
            width="112"
            height="87"
            alt={cta.logoAlt}
            loading="lazy"
            data-reveal="scale"
          />
          <Eyebrow data-reveal>{cta.eyebrow}</Eyebrow>
          <h2 id="cta-title" className={styles.title} data-words>
            <SplitWords text={cta.title} />
            <SplitLine>
              <GradientText>{cta.accent}</GradientText>
            </SplitLine>
          </h2>
          <p className={styles.lead} data-reveal>
            {cta.lead}
          </p>
          <div className={styles.actions} data-reveal>
            <Button href={demo.href} arrow>
              {demo.label}
            </Button>
            <Button href={cta.secondary.href} variant="ghost">
              {cta.secondary.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
