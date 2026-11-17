import { logoSize } from '../lib/image.js'
import styles from './LogoMarquee.module.css'

/**
 * A slow, endless row of logos. Short lists are repeated until one pass is wider
 * than a large screen, then the pass is rendered twice so the CSS loop can slide
 * exactly half its width and repeat without a seam. Only the first appearance of
 * each logo is announced to screen readers.
 *
 * Logos load straight away (they are tiny), so none of them is blank as it slides in.
 * They are shown in white, so every mark stands out equally on a dark surface.
 */
export default function LogoMarquee({ items, minPerPass = 14 }) {
  const repeats = Math.max(1, Math.ceil(minPerPass / items.length))
  const pass = Array.from({ length: repeats }, () => items).flat()
  const loop = [...pass, ...pass]

  return (
    <div className={styles.viewport}>
      <ul className={styles.track} style={{ '--duration': `${pass.length * 2.6}s` }}>
        {loop.map((logo, i) => {
          const copy = i >= items.length
          const size = logoSize(logo, { area: 52, maxWidth: 176 })
          return (
            <li key={`${logo.name}-${i}`} aria-hidden={copy || undefined} className={copy ? styles.copy : undefined}>
              <img
                src={logo.src}
                width={size.width}
                height={size.height}
                alt={copy ? '' : logo.name}
                decoding="async"
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
