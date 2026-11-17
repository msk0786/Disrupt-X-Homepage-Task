import Container from '../components/ui/Container.jsx'
import styles from './LogoMarquee.module.css'

// The list is rendered twice so the CSS loop can slide exactly half its width and repeat seamlessly
export default function LogoMarquee({ title, clients }) {
  const loop = [...clients, ...clients]

  return (
    <section className={styles.marquee} aria-labelledby="clients-title">
      <Container>
        <h2 id="clients-title" className={styles.title} data-reveal>
          {title}
        </h2>
      </Container>
      <div className={styles.viewport} data-reveal="scale">
        <ul className={styles.track}>
          {loop.map((client, i) => {
            const copy = i >= clients.length
            return (
              <li key={`${client.name}-${i}`} aria-hidden={copy || undefined} className={copy ? styles.copy : undefined}>
                <img src={client.src} width={client.width} height={client.height} alt={copy ? '' : client.name} loading="lazy" decoding="async" />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
