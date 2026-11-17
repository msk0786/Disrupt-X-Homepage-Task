import { cx } from '../../lib/cx.js'
import styles from './StatusPill.module.css'

// tone: success | warning | danger | info | purple | neutral
export default function StatusPill({ tone = 'neutral', pulse = false, className, children }) {
  return (
    <span className={cx(styles.pill, styles[tone], className)}>
      <span className={cx(styles.dot, pulse && styles.pulse)} aria-hidden="true" />
      {children}
    </span>
  )
}
