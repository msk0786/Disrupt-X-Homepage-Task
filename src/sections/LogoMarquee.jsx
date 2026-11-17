import { logoSize } from '../lib/image.js'
import { cx } from '../lib/cx.js'
import styles from './LogoMarquee.module.css'

/**
 * A slow, endless row of logos. Short lists are repeated until one pass is wider
 * than a large screen, then the pass is rendered twice so the CSS loop can slide
 * exactly half its width and repeat without a seam. Only the first appearance of
 * each logo is announced to screen readers.
 *
 * Logos load straight away (they are tiny), so none of them is blank as it slides in.
 */
export default function LogoMarquee({ items, paused = false, minPerPass = 14 }) {
  const repeats = Math.max(1, Math.ceil(minPerPass / items.length))
  const pass = Array.from({ length: repeats }, () => items).flat()
  const loop = [...pass, ...pass]

  return (
    <div className={cx(styles.viewport, paused && styles.paused)}>
      <ul className={styles.track} style={{ '--duration': `${pass.length * 2.6}s` }}>
        {loop.map((logo, i) => {
          const copy = i >= items.length
          const size = logoSize(logo, { area: 50, maxWidth: 170 })
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
