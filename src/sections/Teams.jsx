import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import WorkOrderPhone from '../components/screens/WorkOrderPhone.jsx'
import IncidentFlow from '../components/screens/IncidentFlow.jsx'
import SiteDashboard from '../components/screens/SiteDashboard.jsx'
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

export default function Teams({ teams, demo }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(media.ok, () => {
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
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="teams" className={styles.section} aria-labelledby="teams-title">
      <Container>
        <SectionHeading id="teams-title" eyebrow={teams.eyebrow} title={teams.title} accent={teams.accent} lead={teams.lead} />

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
