import Container from '../components/ui/Container.jsx'
import styles from './Footer.module.css'

export default function Footer({ brand, footer }) {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand} data-reveal>
            <img src={brand.logo.src} width={brand.logo.width * 1.25} height={brand.logo.height * 1.25} alt={brand.name} loading="lazy" />
            <p>{footer.tagline}</p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className={styles.column} data-reveal>
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
      </Container>
    </footer>
  )
}
