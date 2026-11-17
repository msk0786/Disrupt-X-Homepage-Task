import { useRef, useState } from 'react'
import Container from '../components/ui/Container.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import ChapterIntro from './ChapterIntro.jsx'
import IconBadge from '../components/ui/IconBadge.jsx'
import Icon from '../components/ui/Icon.jsx'
import Button from '../components/ui/Button.jsx'
import StatusPill from '../components/ui/StatusPill.jsx'
import BrowserFrame from '../components/frames/BrowserFrame.jsx'
import Skyline from '../components/screens/Skyline.jsx'
import { gsap, useGSAP, media, motion, smoothing, prefersReducedMotion } from '../motion/gsap.js'
import { afterPaint } from '../motion/schedule.js'
import { onceVisible } from '../motion/observe.js'
import { srcSetOf } from '../lib/image.js'
import styles from './Modules.module.css'

export default function Modules({ modules, chapter }) {
  const root = useRef(null)
  const [active, setActive] = useState(modules.items[0].id)
  const previous = useRef(active)

  useGSAP(
    () => {
      // hidden panels skip their lazy images, so warm them up once the section is close
      const stopWarm = onceVisible(
        root.current,
        () =>
          modules.items.forEach((item) => {
            const image = new Image()
            image.sizes = sizes
            image.srcset = srcSetOf(item.image.srcSet)
            image.src = item.image.src
          }),
        '0px 0px 400px 0px',
      )

      // the explorer rises out of a smaller rounded window and settles at full size,
      // while a dark veil lifts off it (the veil keeps the text itself at full contrast)
      const mm = gsap.matchMedia(root.current)
      const cancel = afterPaint(() =>
        mm.add({ desktop: media.desktop, mobile: media.mobile }, ({ conditions }) => {
          const desktop = conditions.desktop
          gsap.fromTo(
            '[data-explorer]',
            {
              y: desktop ? 160 : 60,
              scale: desktop ? 0.82 : 0.92,
              clipPath: 'inset(0% 6% 12% 6% round 32px)',
              '--veil': 0.7,
            },
            {
              y: 0,
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0% round 0px)',
              '--veil': 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '[data-explorer]',
                start: 'top bottom',
                end: desktop ? 'top 40%' : 'top 70%',
                scrub: desktop ? 0.7 : smoothing.mobile,
              },
            },
          )
        }),
      )

      return () => {
        stopWarm()
        cancel()
      }
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
          <div className={styles.skyline}>
            <Skyline
              items={modules.items}
              active={active}
              onSelect={setActive}
              prefix={modules.skyline.prefix}
              logoAlt={modules.skyline.logoAlt}
            />
            <p className={styles.skylineHint}>{modules.skyline.hint}</p>
          </div>

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
            renderPanel={(item) => (
              <ModulePanel
                item={item}
                kicker={modules.kicker}
                linkLabel={modules.linkLabel}
                productsLabel={modules.productsLabel}
              />
            )}
          />
        </div>
      </Container>
    </section>
  )
}

const sizes = '(max-width: 899px) 92vw, 620px'

function ModulePanel({ item, kicker, linkLabel, productsLabel }) {
  const { image } = item
  const picture = (
    <img
      src={image.src}
      srcSet={srcSetOf(image.srcSet)}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading="lazy"
      decoding="async"
      style={image.focus ? { '--focus': image.focus, '--zoom': image.phoneZoom ?? 1 } : undefined}
    />
  )

  return (
    <div className={styles.panel} data-panel={item.id}>
      <div className={styles.copy}>
        <div className={styles.label} data-swap>
          <IconBadge name={item.icon} size="lg" active />
          <p>
            <span className={styles.kicker}>{kicker}</span>
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
        {item.products && (
          <div className={styles.products} data-swap>
            <p className={styles.productsLabel}>{productsLabel}</p>
            <ul>
              {item.products.map((product) => (
                <li key={product.name}>
                  <a href={product.href}>
                    <strong>{product.name}</strong>
                    <span>{product.detail}</span>
                    <Icon name="arrowUpRight" size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div data-swap>
          <Button href={item.href} variant="link" arrow>
            {linkLabel} {item.name}
          </Button>
        </div>
      </div>

      <div className={styles.media} data-swap>
        {image.frame ? (
          <BrowserFrame title={image.frame} className={styles.framed}>
            {picture}
          </BrowserFrame>
        ) : (
          picture
        )}
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
