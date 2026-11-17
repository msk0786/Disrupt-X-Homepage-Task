import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import IconBadge from '../components/ui/IconBadge.jsx'
import Card from '../components/ui/Card.jsx'
import CountUp from '../motion/CountUp.jsx'
import styles from './Strengths.module.css'

export default function Strengths({ strengths }) {
  return (
    <section id="why" className={styles.section} aria-labelledby="why-title">
      <Container>
        <SectionHeading id="why-title" eyebrow={strengths.eyebrow} title={strengths.title} accent={strengths.accent} lead={strengths.lead} />

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

        <ul className={styles.cards}>
          {strengths.cards.map((card) => (
            <li key={card.title} data-reveal="flip">
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
