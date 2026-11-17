import { useEffect, useRef, useState } from 'react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import { gsap, ScrollTrigger, useGSAP } from '../motion/gsap.js'
import { afterPaint } from '../motion/schedule.js'
import { cx } from '../lib/cx.js'
import styles from './Header.module.css'

/*
  Locks the page behind the open mobile menu. overflow: hidden alone does not stop
  iOS Safari from scrolling the page underneath, so the body is pinned in place and
  the scroll position is put back exactly when the menu closes.
*/
function useScrollLock() {
  const lockedAt = useRef(null)

  const lock = () => {
    if (lockedAt.current !== null) return
    lockedAt.current = window.scrollY
    Object.assign(document.body.style, { position: 'fixed', top: `-${lockedAt.current}px`, left: '0', right: '0' })
  }

  const unlock = () => {
    if (lockedAt.current === null) return
    const y = lockedAt.current
    lockedAt.current = null
    Object.assign(document.body.style, { position: '', top: '', left: '', right: '' })
    // jump straight back, without the smooth scrolling the page uses for links
    const html = document.documentElement
    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, y)
    html.style.scrollBehavior = ''
  }

  return { lock, unlock }
}

export default function Header({ brand, nav, demo, a11y }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(null)
  const progress = useRef(null)
  const { lock, unlock } = useScrollLock()

  useGSAP(() => {
    const mm = gsap.matchMedia()

    return afterPaint(() =>
      mm.add('all', () => {
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
            // the header mounts before the pinned sections below, so measure after them
            refreshPriority: -1,
            onToggle: (self) => setCurrent((now) => (self.isActive ? link.href : now === link.href ? null : now)),
          })
        })
      }),
    )
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

    lock()
    document.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)

    return () => {
      document.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
      unlock()
    }
    // lock and unlock only touch refs, so they are safe to leave out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // A link in the mobile menu: put the page back first, then go to the section
  function goTo(event, href) {
    event.preventDefault()
    unlock()
    setOpen(false)
    document.querySelector(href)?.scrollIntoView()
    window.history.pushState(null, '', href)
  }

  return (
    <header className={cx(styles.header, (scrolled || open) && styles.solid)}>
      <Container className={styles.inner}>
        <a href="/" className={styles.logo}>
          <img src={brand.logo.src} width={brand.logo.width * 1.25} height={brand.logo.height * 1.25} alt={a11y.home} />
        </a>

        <nav aria-label={a11y.mainNav} className={styles.nav}>
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
            aria-label={open ? a11y.menuClose : a11y.menuOpen}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </Container>

      <span ref={progress} className={styles.progress} aria-hidden="true" />

      <div id="mobile-menu" className={cx(styles.drawer, open && styles.open)} inert={!open}>
        <Container as="nav" aria-label={a11y.mobileNav}>
          <ul className={styles.drawerLinks}>
            {nav.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={(event) => goTo(event, link.href)}>
                  {link.label}
                  <Icon name="arrowRight" size={18} />
                </a>
              </li>
            ))}
          </ul>
          <Button href={demo.href} className={styles.drawerCta} onClick={() => setOpen(false)}>
            {demo.label}
          </Button>
        </Container>
      </div>
    </header>
  )
}
