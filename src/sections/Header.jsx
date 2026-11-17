import { useEffect, useState } from 'react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import { cx } from '../lib/cx.js'
import styles from './Header.module.css'

export default function Header({ brand, nav, demo }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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
                <a href={link.href} className={styles.link}>
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
