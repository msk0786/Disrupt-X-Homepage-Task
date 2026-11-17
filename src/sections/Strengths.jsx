import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import IconBadge from '../components/ui/IconBadge.jsx'
import Card from '../components/ui/Card.jsx'
import CountUp from '../motion/CountUp.jsx'
import ChapterIntro from './ChapterIntro.jsx'
import { gsap, useGSAP, media } from '../motion/gsap.js'
import styles from './Strengths.module.css'

export default function Strengths({ strengths, chapter }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // the cards fly up from below at different speeds and lock into the grid as you scroll
      mm.add({ desktop: media.desktop, mobile: media.mobile }, ({ conditions }) => {
        gsap.utils.toArray('[data-card]').forEach((card, i) => {
          gsap.from(card, {
            y: conditions.desktop ? 260 + i * 90 : 120,
            rotate: conditions.desktop ? (i % 2 ? 7 : -7) : 0,
            scale: 0.88,
            autoAlpha: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: conditions.desktop ? '[data-cards]' : card,
              start: 'top bottom',
              end: conditions.desktop ? 'top 45%' : 'top 70%',
              scrub: 0.8,
            },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="why" className={styles.section} aria-labelledby="why-title">
      <ChapterIntro
        id="why-title"
        chapter={chapter}
        enter="up"
        eyebrow={strengths.eyebrow}
        title={strengths.title}
        accent={strengths.accent}
        lead={strengths.lead}
      />

      <Container>
        <dl className={styles.stats} data-draw>
          {strengths.stats.map((stat) => (
            <div key={stat.label} className={styles.stat} data-reveal>
              <dt>{stat.label}</dt>
              <dd>
                <GradientText>
                  <CountUp value={stat.value} suffix={stat.suffix} duration={1.6} />
                </GradientText>
              </dd>
            </div>
          ))}
        </dl>

        <ul className={styles.cards} data-cards>
          {strengths.cards.map((card) => (
            <li key={card.title} data-card>
              <Card interactive className={styles.card}>
                <IconBadge name={card.icon} />
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p>{card.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
