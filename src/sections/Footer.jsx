import { useRef } from 'react'
import Container from '../components/ui/Container.jsx'
import { gsap, useGSAP, media } from '../motion/gsap.js'
import styles from './Footer.module.css'

export default function Footer({ brand, footer }) {
  const root = useRef(null)
  const inner = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    // as the page lifts away, the footer underneath comes up to full size
    mm.add('(min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)', () => {
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

    // phones simply get the regular reveal
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

  return (
    <footer ref={root} className={styles.footer}>
      <Container>
        <div ref={inner}>
          <div className={styles.top}>
            <div className={styles.brand}>
              <img src={brand.logo.src} width={brand.logo.width * 1.25} height={brand.logo.height * 1.25} alt={brand.name} loading="lazy" />
              <p>{footer.tagline}</p>
            </div>

            {footer.columns.map((column) => (
              <nav key={column.title} aria-label={column.title} className={styles.column}>
                <h2 className={styles.heading}>{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className={styles.bottom}>
            <p>{footer.copyright}</p>
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
