import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import AppBadges from '../components/ui/AppBadges.jsx'
import SocialIcon from '../components/ui/SocialIcon.jsx'
import { gsap, useGSAP, media } from '../motion/gsap.js'
import { afterPaint } from '../motion/schedule.js'
import styles from './Footer.module.css'

export default function Footer({ brand, footer, apps }) {
  const root = useRef(null)
  const inner = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    return afterPaint(() => {
      // as the page lifts away, the footer underneath comes up to full size
      mm.add(`${media.desktop} and (min-height: 640px)`, () => {
        gsap.fromTo(
          inner.current,
          { y: -80, scale: 0.94, autoAlpha: 0.2 },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#main',
              start: 'bottom bottom',
              end: () => `+=${root.current.offsetHeight}`,
              scrub: true,
            },
          },
        )
      })

      // phones and tablets simply get the regular reveal
      mm.add(media.mobile, () => {
        gsap.from(inner.current, {
          y: 40,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 90%', once: true },
        })
      })
    })
  })

  return (
    <footer ref={root} className={styles.footer}>
      <Container>
        <div ref={inner}>
          <div className={styles.top}>
            <div className={styles.brand}>
              <img
                src={brand.logo.src}
                width={brand.logo.width * 1.25}
                height={brand.logo.height * 1.25}
                alt={brand.name}
                loading="lazy"
              />
              <p>{footer.tagline}</p>
              <ul className={styles.socials} aria-label={footer.socialLabel}>
                {footer.socials.map((social) => (
                  <li key={social.id}>
                    <a href={social.href} aria-label={social.label}>
                      <SocialIcon name={social.id} />
                    </a>
                  </li>
                ))}
              </ul>
              <AppBadges apps={apps} />
            </div>

            {footer.columns.map((column) => (
              <nav key={column.title} aria-label={column.title} className={styles.column}>
                <h2 className={styles.heading}>{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className={styles.bottom}>
            <p>{footer.copyright}</p>
            <nav aria-label={footer.languages.label} className={styles.languages}>
              <ul>
                {footer.languages.items.map((language) => (
                  <li key={language.lang}>
                    <a
                      href={language.href}
                      lang={language.lang}
                      hrefLang={language.lang}
                      aria-current={language.current ? 'page' : undefined}
                    >
                      {language.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <ul className={styles.legal}>
              {footer.legal.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  )
}
