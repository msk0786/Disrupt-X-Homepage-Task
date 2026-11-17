import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import ChapterIntro from './ChapterIntro.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import Icon from '../components/ui/Icon.jsx'
import BrowserFrame from '../components/frames/BrowserFrame.jsx'
import SourceCard from '../components/screens/SourceCard.jsx'
import UnifiedInbox from '../components/screens/UnifiedInbox.jsx'
import { gsap, useGSAP, media, smoothing, markReady } from '../motion/gsap.js'
import { afterPaint } from '../motion/schedule.js'
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

export default function ScatteredToOne({ story, chapter }) {
  const root = useRef(null)
  const stage = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root.current)

      const build = (pinned) => {
        markReady(stage.current)
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
            scrub: pinned ? 0.8 : smoothing.mobile,
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

        // the old way gets struck out, the new number grows in. Text never fades, so it stays readable.
        timeline
          .fromTo('[data-strike]', { scaleX: 0 }, { scaleX: 1, duration: 0.4 }, 0.5)
          .fromTo('[data-after]', { scale: 0.88 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 1.2)
      }

      // built after the first paint, like every other scroll scene on the page
      return afterPaint(() => {
        mm.add(media.desktop, () => build(true))
        mm.add(media.mobile, () => build(false))
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="platform" className={styles.section} aria-labelledby="story-title">
      <ChapterIntro
        id="story-title"
        chapter={chapter}
        enter="window"
        eyebrow={story.eyebrow}
        title={story.title}
        accent={story.accent}
        lead={story.lead}
      />

      <Container>
        <div ref={stage} className={styles.stage}>
          <div className={styles.column}>
            <p className={styles.label} data-reveal="left">
              {story.labels.before}
            </p>
            <div className={styles.chaos}>
              {story.items.map((item, i) => (
                <SourceCard key={item.id} item={item} data-source={item.id} className={cx(styles.card, styles[`card${i + 1}`])} />
              ))}
            </div>
          </div>

          <div className={styles.column} data-reveal="right">
            <p className={cx(styles.label, styles.labelAfter)}>{story.labels.after}</p>
            <BrowserFrame title={story.inbox.window}>
              <UnifiedInbox title={story.inbox.title} subtitle={story.inbox.subtitle} status={story.inbox.status} items={story.items} />
            </BrowserFrame>
          </div>

          <div className={styles.tally} data-reveal>
            <p className={styles.count}>
              <span className={cx(styles.number, styles.before)}>
                {story.before.value}
                <span className={styles.strike} data-strike aria-hidden="true" />
              </span>
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
