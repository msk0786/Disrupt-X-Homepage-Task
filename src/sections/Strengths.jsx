import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import IconBadge from '../components/ui/IconBadge.jsx'
import Card from '../components/ui/Card.jsx'
import CountUp from '../motion/CountUp.jsx'
import ChapterIntro from './ChapterIntro.jsx'
import { gsap, useGSAP, media, smoothing, markReady } from '../motion/gsap.js'
import { afterPaint } from '../motion/schedule.js'
import { logoSize } from '../lib/image.js'
import styles from './Strengths.module.css'

export default function Strengths({ strengths, chapter }) {
  const root = useRef(null)
  const cards = useRef(null)
  const { awards, partners } = strengths

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root.current)

      // the cards fly up from below at different speeds and lock into the grid as you scroll
      return afterPaint(() =>
        mm.add({ desktop: media.desktop, mobile: media.mobile }, ({ conditions }) => {
          markReady(cards.current)
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
                end: conditions.desktop ? 'top 45%' : 'top 75%',
                scrub: conditions.desktop ? 0.8 : smoothing.mobile,
              },
            })
          })
        }),
      )
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

        <ul ref={cards} className={styles.cards} data-cards>
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

        <div className={styles.trust}>
          <div className={styles.block}>
            <div className={styles.blockHead} data-reveal>
              <h3>{awards.title}</h3>
              <p>{awards.lead}</p>
            </div>
            <ul className={styles.awards}>
              {awards.items.map((award) => (
                <li key={award.name} className={styles.award} data-reveal="flip">
                  <span className={styles.awardMark}>
                    <img
                      src={award.image.src}
                      width={award.image.width}
                      height={award.image.height}
                      alt={award.image.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>
                    <strong>{award.name}</strong>
                    <span>{award.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.block}>
            <div className={styles.blockHead} data-reveal>
              <h3>{partners.title}</h3>
              <p>{partners.lead}</p>
            </div>
            <ul className={styles.partners}>
              {partners.items.map((partner) => {
                const size = logoSize(partner, { area: 40, maxWidth: 132 })
                return (
                  <li key={partner.name} data-reveal="scale">
                    <img
                      src={partner.src}
                      width={size.width}
                      height={size.height}
                      alt={partner.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
