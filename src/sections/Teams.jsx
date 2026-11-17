import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import WorkOrderPhone from '../components/screens/WorkOrderPhone.jsx'
import IncidentFlow from '../components/screens/IncidentFlow.jsx'
import SiteDashboard from '../components/screens/SiteDashboard.jsx'
import ChapterIntro from './ChapterIntro.jsx'
import TeamStory from './TeamStory.jsx'
import { gsap, ScrollTrigger, useGSAP, media } from '../motion/gsap.js'
import styles from './Teams.module.css'

// Each team names its screen in content/teams.json
function screenFor(name, demo) {
  if (name === 'workOrder') return <WorkOrderPhone data={demo.workOrder} />
  if (name === 'incident') return <IncidentFlow data={demo.incident} />
  if (name === 'dashboard') return <SiteDashboard sites={demo.sites} days={demo.days} labels={demo.dashboard} />
  return null
}

export default function Teams({ teams, demo, chapter }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ desktop: media.desktop, mobile: media.mobile }, ({ conditions }) => {
        const reach = conditions.desktop ? 1 : 0.4

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
        // both tied to the scroll so they play backwards when you scroll up
        gsap.utils.toArray('[data-story]').forEach((story) => {
          const copy = story.querySelectorAll('[data-team-copy]')
          const screen = story.querySelector('[data-team-screen]')

          gsap.from(copy, {
            x: -120 * reach,
            autoAlpha: 0,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: { trigger: story, start: 'top 85%', end: 'top 35%', scrub: 0.6 },
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
            scrollTrigger: { trigger: screen, start: 'top 95%', end: 'top 40%', scrub: 0.8 },
          })
        })
      })
    },
    { scope: root },
  )

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
        <div className={styles.track} data-track>
          <span className={styles.rail} aria-hidden="true">
            <span className={styles.line} data-line />
          </span>
          {teams.items.map((team) => (
            <TeamStory key={team.id} team={team}>
              {screenFor(team.screen, demo)}
            </TeamStory>
          ))}
        </div>
      </Container>
    </section>
  )
}
