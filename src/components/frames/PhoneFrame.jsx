import { cx } from '../../lib/cx.js'
import styles from './PhoneFrame.module.css'

export default function PhoneFrame({ className, time, children }) {
  return (
    <div className={cx(styles.phone, className)}>
      <div className={styles.screen}>
        <div className={styles.status} aria-hidden="true">
          <span>{time}</span>
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
