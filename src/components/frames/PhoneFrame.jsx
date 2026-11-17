import { cx } from '../../lib/cx.js'
import styles from './PhoneFrame.module.css'

export default function PhoneFrame({ className, children }) {
  return (
    <div className={cx(styles.phone, className)}>
      <div className={styles.screen}>
        <div className={styles.status} aria-hidden="true">
          <span>9:41</span>
          <span className={styles.island} />
          <span className={styles.signal}>
            <i />
            <i />
            <i />
            <b />
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
