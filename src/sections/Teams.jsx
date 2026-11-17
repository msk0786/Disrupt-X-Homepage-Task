import { useEffect, useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import WorkOrderPhone from '../components/screens/WorkOrderPhone.jsx'
import IncidentFlow from '../components/screens/IncidentFlow.jsx'
import SiteDashboard from '../components/screens/SiteDashboard.jsx'
import ChapterIntro from './ChapterIntro.jsx'
import TeamStory from './TeamStory.jsx'
import { gsap, ScrollTrigger, useGSAP, media, smoothing, markReady } from '../motion/gsap.js'
import { afterPaint } from '../motion/schedule.js'
import styles from './Teams.module.css'

// Each team names its screen in content/teams.json
function screenFor(name, demo) {
  if (name === 'workOrder') return <WorkOrderPhone data={demo.workOrder} />
  if (name === 'incident') return <IncidentFlow data={demo.incident} />
  if (name === 'dashboard') return <SiteDashboard sites={demo.sites} days={demo.days} labels={demo.dashboard} />
  return null
}

export default function Teams({ teams, demo, apps, chapter }) {
  const root = useRef(null)
  const track = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root.current)

      return afterPaint(() =>
        mm.add({ desktop: media.desktop, mobile: media.mobile }, ({ conditions }) => {
          const desktop = conditions.desktop
          const reach = desktop ? 1 : 0.4
          markReady(track.current)

          // the brand's glowing line draws down the page with the scroll
          gsap.fromTo(
            '[data-line]',
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: '[data-track]', start: 'top 55%', end: 'bottom 55%', scrub: 0.4 },
            },
          )

          // each team's node lights up as the line reaches it
          gsap.utils.toArray('[data-node]').forEach((node) => {
            ScrollTrigger.create({
              trigger: node,
              start: 'top 55%',
              onEnter: () => node.setAttribute('data-lit', ''),
              onLeaveBack: () => node.removeAttribute('data-lit'),
            })
          })

          // copy slides in from the left and the product screen swings in from the right,
          // both tied to the scroll so they play backwards when you scroll up.
          // On phones they settle while still low on the screen, so you never tap a ghost.
          gsap.utils.toArray('[data-story]').forEach((story) => {
            const copy = story.querySelectorAll('[data-team-copy]')
            const screen = story.querySelector('[data-team-screen]')

            gsap.from(copy, {
              x: -120 * reach,
              autoAlpha: 0,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: story,
                start: desktop ? 'top 85%' : 'top 95%',
                end: desktop ? 'top 45%' : 'top 72%',
                scrub: desktop ? smoothing.desktop : smoothing.mobile,
              },
            })

            gsap.from(screen, {
              x: 260 * reach,
              y: 80,
              rotateY: -32 * reach,
              rotateX: 12,
              scale: 0.8,
              autoAlpha: 0,
              transformPerspective: 1400,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: screen,
                start: desktop ? 'top 95%' : 'top 98%',
                end: desktop ? 'top 45%' : 'top 70%',
                scrub: desktop ? 0.8 : smoothing.mobile,
              },
            })
          })
        }),
      )
    },
    { scope: root },
  )

  // The demos can change height when someone taps through them (a longer note, a new
  // line in the dashboard). Measure the scroll triggers again once the layout settles,
  // so everything below still starts at the right moment.
  useEffect(() => {
    const el = track.current
    if (!el || typeof ResizeObserver === 'undefined') return
    let height = el.offsetHeight
    let timer
    const observer = new ResizeObserver(() => {
      if (el.offsetHeight === height) return
      height = el.offsetHeight
      clearTimeout(timer)
      timer = setTimeout(() => ScrollTrigger.refresh(), 250)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [])

  return (
    <section ref={root} id="teams" className={styles.section} aria-labelledby="teams-title">
      <ChapterIntro
        id="teams-title"
        chapter={chapter}
        enter="right"
        eyebrow={teams.eyebrow}
        title={teams.title}
        accent={teams.accent}
        lead={teams.lead}
      />

      <Container>
        <div ref={track} className={styles.track} data-track>
          <span className={styles.rail} aria-hidden="true">
            <span className={styles.line} data-line />
          </span>
          {teams.items.map((team) => (
            <TeamStory key={team.id} team={team} apps={team.showApps ? apps : null}>
              {screenFor(team.screen, demo)}
            </TeamStory>
          ))}
        </div>
      </Container>
    </section>
  )
}
