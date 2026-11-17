import { useEffect, useRef, useState } from 'react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import { gsap, ScrollTrigger, useGSAP } from '../motion/gsap.js'
import { cx } from '../lib/cx.js'
import styles from './Header.module.css'

export default function Header({ brand, nav, demo }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(null)
  const progress = useRef(null)

  useGSAP(() => {
    // a thin line under the header that fills as you read the page
    gsap.fromTo(
      progress.current,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3, refreshPriority: -1 } },
    )

    // the nav link for the section in the middle of the screen stays lit
    nav.forEach((link) => {
      const section = document.querySelector(link.href)
      if (!section) return
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        // the header mounts before the pinned story below, so measure after it
        refreshPriority: -1,
        onToggle: (self) => setCurrent((now) => (self.isActive ? link.href : now === link.href ? null : now)),
      })
    })
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the mobile menu is open: lock the page, close on Escape or on resize to desktop
  useEffect(() => {
    if (!open) return
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    const desktop = window.matchMedia('(min-width: 900px)')
    const onResize = () => desktop.matches && setOpen(false)

    document.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={cx(styles.header, (scrolled || open) && styles.solid)}>
      <Container className={styles.inner}>
        <a href="/" className={styles.logo}>
          <img src={brand.logo.src} width={brand.logo.width * 1.25} height={brand.logo.height * 1.25} alt={`${brand.name} home`} />
        </a>

        <nav aria-label="Main" className={styles.nav}>
          <ul className={styles.links}>
            {nav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cx(styles.link, current === link.href && styles.current)}
                  aria-current={current === link.href ? 'location' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Button href={demo.href} size="sm" className={styles.demo}>
            {demo.label}
          </Button>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </Container>

      <span ref={progress} className={styles.progress} aria-hidden="true" />

      <div id="mobile-menu" className={cx(styles.drawer, open && styles.open)} inert={!open}>
        <Container as="nav" aria-label="Mobile">
          <ul className={styles.drawerLinks}>
            {nav.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={close}>
                  {link.label}
                  <Icon name="arrowRight" size={18} />
                </a>
              </li>
            ))}
          </ul>
          <Button href={demo.href} className={styles.drawerCta} onClick={close}>
            {demo.label}
          </Button>
        </Container>
      </div>
    </header>
  )
}
