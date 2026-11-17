import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import Icon from '../components/ui/Icon.jsx'
import BrowserFrame from '../components/frames/BrowserFrame.jsx'
import SourceCard from '../components/screens/SourceCard.jsx'
import UnifiedInbox from '../components/screens/UnifiedInbox.jsx'
import { gsap, useGSAP, media } from '../motion/gsap.js'
import { cx } from '../lib/cx.js'
import styles from './ScatteredToOne.module.css'

// Centre of `el` measured from `ancestor`, using layout offsets so transforms do not skew it
function centreWithin(el, ancestor) {
  let x = el.offsetWidth / 2
  let y = el.offsetHeight / 2
  for (let node = el; node && node !== ancestor; node = node.offsetParent) {
    x += node.offsetLeft
    y += node.offsetTop
  }
  return { x, y }
}

export default function ScatteredToOne({ story }) {
  const root = useRef(null)
  const stage = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      const build = (pinned) => {
        const cards = gsap.utils.toArray('[data-source]')
        const rows = gsap.utils.toArray('[data-row]')

        const travel = (card, row, axis) => {
          const from = centreWithin(card, stage.current)
          const to = centreWithin(row, stage.current)
          return to[axis] - from[axis]
        }

        gsap.set(rows, { autoAlpha: 0, scale: 0.96 })

        const timeline = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: stage.current,
            // phones skip the pin and play it while the stack scrolls through the top of the screen
            start: pinned ? 'center center' : 'top 25%',
            end: pinned ? '+=110%' : 'bottom 85%',
            pin: pinned,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })

        // each message flies into its row, then the row takes over
        cards.forEach((card, i) => {
          const row = rows[i]
          const at = i * 0.3
          timeline
            .to(card, { x: () => travel(card, row, 'x'), y: () => travel(card, row, 'y'), rotate: 0, scale: 0.9, duration: 1 }, at)
            .to(card, { autoAlpha: 0, duration: 0.2 }, at + 0.85)
            .to(row, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, at + 0.8)
        })

        timeline
          .to('[data-before]', { opacity: 0.3, duration: 0.5 }, 0.5)
          .fromTo('[data-after]', { opacity: 0.3 }, { opacity: 1, duration: 0.5 }, 1.2)
      }

      mm.add(media.desktop, () => build(true))
      mm.add(media.mobile, () => build(false))
    },
    { scope: root },
  )

  return (
    <section ref={root} id="platform" className={styles.section} aria-labelledby="story-title">
      <Container>
        <SectionHeading id="story-title" eyebrow={story.eyebrow} title={story.title} accent={story.accent} lead={story.lead} />

        <div ref={stage} className={styles.stage}>
          <div className={styles.column}>
            <p className={styles.label}>{story.labels.before}</p>
            <div className={styles.chaos}>
              {story.items.map((item, i) => (
                <SourceCard key={item.id} item={item} data-source={item.id} className={cx(styles.card, styles[`card${i + 1}`])} />
              ))}
            </div>
          </div>

          <div className={styles.column}>
            <p className={cx(styles.label, styles.labelAfter)}>{story.labels.after}</p>
            <BrowserFrame>
              <UnifiedInbox title={story.inbox.title} subtitle={story.inbox.subtitle} status={story.inbox.status} items={story.items} />
            </BrowserFrame>
          </div>

          <div className={styles.tally}>
            <p className={styles.count} data-before>
              <span className={cx(styles.number, styles.before)}>{story.before.value}</span>
              <span>{story.before.label}</span>
            </p>
            <Icon name="arrowRight" size={22} className={styles.arrow} />
            <p className={styles.count} data-after>
              <GradientText className={styles.number}>{story.after.value}</GradientText>
              <span>{story.after.label}</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
