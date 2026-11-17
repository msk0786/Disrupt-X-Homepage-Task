import Container from '../components/ui/Container.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import Button from '../components/ui/Button.jsx'
import styles from './FinalCta.module.css'

export default function FinalCta({ cta, demo }) {
  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <Container>
        <div className={styles.panel} data-reveal="scale">
          <img className={styles.grid} src="/images/brand/hero-grid.svg" width="1920" height="1223" alt="" loading="lazy" />
          <img className={styles.logo} src="/images/brand/alef-360-logo.svg" width="112" height="87" alt="ALEF 360°" loading="lazy" />
          <Eyebrow>{cta.eyebrow}</Eyebrow>
          <h2 id="cta-title" className={styles.title}>
            {cta.title} <GradientText block>{cta.accent}</GradientText>
          </h2>
          <p className={styles.lead}>{cta.lead}</p>
          <div className={styles.actions}>
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
