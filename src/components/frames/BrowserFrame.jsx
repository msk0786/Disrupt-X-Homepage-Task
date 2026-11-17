import { cx } from '../../lib/cx.js'
import styles from './BrowserFrame.module.css'

// Dark browser chrome, the same treatment disrupt-x.io uses around product screens
// `title` is the text in the address bar, from the content files
export default function BrowserFrame({ title, className, screenClassName, children }) {
  return (
    <div className={cx(styles.frame, className)}>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.url}>
          <svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor">
            <path d="M4.5 0A2.75 2.75 0 0 0 1.75 2.75V4H1a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-.75V2.75A2.75 2.75 0 0 0 4.5 0Zm1.5 4H3V2.75a1.5 1.5 0 1 1 3 0V4Z" />
          </svg>
          {title}
        </span>
        <span className={styles.spacer} />
      </div>
      <div className={cx(styles.screen, screenClassName)}>{children}</div>
    </div>
  )
}
