import Container from '../components/ui/Container.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import SplitWords, { SplitLine } from '../components/ui/SplitWords.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Icon from '../components/ui/Icon.jsx'
import styles from './News.module.css'

// The latest press releases from disrupt-x.io. Each card opens the full story there.
export default function News({ news }) {
  return (
    <section id="news" className={styles.section} aria-labelledby="news-title">
      <Container>
        <div className={styles.head}>
          <div className={styles.headCopy}>
            <Eyebrow data-reveal>{news.eyebrow}</Eyebrow>
            <h2 id="news-title" className={styles.title} data-words>
              <SplitWords text={news.title} />{' '}
              <SplitLine>
                <GradientText>{news.accent}</GradientText>
              </SplitLine>
            </h2>
            <p className={styles.lead} data-reveal>
              {news.lead}
            </p>
          </div>
          <div data-reveal>
            <Button href={news.viewAll.href} variant="ghost" arrow>
              {news.viewAll.label}
            </Button>
          </div>
        </div>

        <ul className={styles.list}>
          {news.items.map((item, i) => (
            <li key={item.id} data-reveal="flip">
              <Card as="article" interactive className={styles.card}>
                <div className={styles.media}>
                  <img
                    src={item.image.src}
                    width={item.image.width}
                    height={item.image.height}
                    alt={item.image.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className={styles.tag}>{item.tag}</span>
                </div>
                <div className={styles.body}>
                  <time dateTime={item.date} className={styles.date}>
                    {item.dateLabel}
                  </time>
                  <h3 className={styles.cardTitle}>
                    {/* the whole card is clickable through this link (see .link::after) */}
                    <a href={item.href} className={styles.link} aria-describedby={`news-read-${i}`}>
                      {item.title}
                    </a>
                  </h3>
                  <span id={`news-read-${i}`} className={styles.read}>
                    {news.readLabel}
                    <Icon name="arrowUpRight" size={16} />
                  </span>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
