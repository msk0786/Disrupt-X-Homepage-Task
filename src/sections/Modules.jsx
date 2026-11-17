import { useRef, useState } from 'react'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import IconBadge from '../components/ui/IconBadge.jsx'
import Icon from '../components/ui/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import StatusPill from '../components/ui/StatusPill.jsx'
import { gsap, ScrollTrigger, useGSAP, motion, prefersReducedMotion } from '../motion/gsap.js'
import styles from './Modules.module.css'

export default function Modules({ modules }) {
  const root = useRef(null)
  const [active, setActive] = useState(modules.items[0].id)
  const previous = useRef(active)

  // hidden panels skip their lazy images, so warm them up once the section is close
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom+=400',
        once: true,
        onEnter: () => modules.items.forEach((item) => (new Image().src = item.image.src)),
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
      <Container>
        <SectionHeading id="modules-title" eyebrow={modules.eyebrow} title={modules.title} accent={modules.accent} lead={modules.lead} />

        <div data-reveal>
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
