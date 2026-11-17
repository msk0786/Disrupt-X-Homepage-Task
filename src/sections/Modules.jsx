import { useRef, useState } from 'react'
import Container from '../components/ui/Container.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import ChapterIntro from './ChapterIntro.jsx'
import IconBadge from '../components/ui/IconBadge.jsx'
import Icon from '../components/ui/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import StatusPill from '../components/ui/StatusPill.jsx'
import { gsap, ScrollTrigger, useGSAP, media, motion, prefersReducedMotion } from '../motion/gsap.js'
import styles from './Modules.module.css'

export default function Modules({ modules, chapter }) {
  const root = useRef(null)
  const [active, setActive] = useState(modules.items[0].id)
  const previous = useRef(active)

  useGSAP(
    () => {
      // hidden panels skip their lazy images, so warm them up once the section is close
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom+=400',
        once: true,
        onEnter: () => modules.items.forEach((item) => (new Image().src = item.image.src)),
      })

      // the explorer rises out of a smaller rounded window and settles at full size
      const mm = gsap.matchMedia()
      mm.add({ desktop: media.desktop, mobile: media.mobile }, ({ conditions }) => {
        gsap.fromTo(
          '[data-explorer]',
          {
            y: conditions.desktop ? 160 : 60,
            scale: conditions.desktop ? 0.82 : 0.92,
            clipPath: 'inset(0% 6% 12% 6% round 32px)',
            autoAlpha: 0.3,
          },
          {
            y: 0,
            scale: 1,
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            autoAlpha: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: '[data-explorer]', start: 'top bottom', end: 'top 30%', scrub: 0.7 },
          },
        )
      })
    },
    { scope: root },
  )

  // soft swap when the tab changes, never on first render
  useGSAP(
    () => {
      if (previous.current === active || prefersReducedMotion()) return
      previous.current = active
      gsap.fromTo(
        `[data-panel="${active}"] [data-swap]`,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: motion.ease, stagger: 0.05, clearProps: 'transform' },
      )
    },
    { scope: root, dependencies: [active] },
  )

  return (
    <section ref={root} id="modules" className={styles.section} aria-labelledby="modules-title">
      <ChapterIntro
        id="modules-title"
        chapter={chapter}
        enter="circle"
        eyebrow={modules.eyebrow}
        title={modules.title}
        accent={modules.accent}
        lead={modules.lead}
      />

      <Container>
        <div className={styles.explorer} data-explorer>
          <Tabs
            label={modules.tabsLabel}
            items={modules.items}
            active={active}
            onChange={setActive}
            className={styles.tabs}
            renderTab={(item) => (
              <>
                <Icon name={item.icon} size={18} />
                {item.name}
              </>
            )}
            renderPanel={(item) => <ModulePanel item={item} linkLabel={modules.linkLabel} />}
          />
        </div>
      </Container>
    </section>
  )
}

function ModulePanel({ item, linkLabel }) {
  return (
    <div className={styles.panel} data-panel={item.id}>
      <div className={styles.copy}>
        <div className={styles.label} data-swap>
          <IconBadge name={item.icon} size="lg" active />
          <p>
            <span className={styles.kicker}>ALEF 360°</span>
            <span className={styles.name}>{item.name}</span>
          </p>
        </div>
        <h3 className={styles.outcome} data-swap>
          {item.outcome}
        </h3>
        <ul className={styles.features}>
          {item.features.map((feature) => (
            <li key={feature} data-swap>
              <Icon name="check" size={16} strokeWidth={2.5} />
              {feature}
            </li>
          ))}
        </ul>
        <div data-swap>
          <Button href={item.href} variant="link" arrow>
            {linkLabel} {item.name}
          </Button>
        </div>
      </div>

      <div className={styles.media} data-swap>
        <img
          src={item.image.src}
          width={item.image.width}
          height={item.image.height}
          alt={item.image.alt}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.chip}>
          <StatusPill tone={item.chip.tone} pulse>
            {item.chip.label}
          </StatusPill>
          <span>{item.chip.value}</span>
        </div>
      </div>
    </div>
  )
}
