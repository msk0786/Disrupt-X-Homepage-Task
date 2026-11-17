import { cx } from '../../lib/cx.js'
import styles from './AppBadges.module.css'

// The official App Store and Google Play badges, as used on disrupt-x.io
export default function AppBadges({ apps, className }) {
  return (
    <div className={cx(styles.apps, className)}>
      <p className={styles.title}>{apps.title}</p>
      <ul className={styles.list}>
        {apps.items.map((app) => (
          <li key={app.store}>
            <a href={app.href} className={styles.badge}>
              <img
                src={app.image.src}
                width={app.image.width}
                height={app.image.height}
                alt={app.image.alt}
                loading="lazy"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
