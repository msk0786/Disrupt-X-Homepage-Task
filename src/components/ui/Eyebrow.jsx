import { cx } from '../../lib/cx.js'
import styles from './Eyebrow.module.css'

export default function Eyebrow({ children, className, ...rest }) {
  return (
    <p className={cx(styles.eyebrow, className)} {...rest}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </p>
  )
}
