import { cx } from '../../lib/cx.js'
import styles from './GradientText.module.css'

export default function GradientText({ children, block = false, className }) {
  return <span className={cx(styles.gradient, block && styles.block, className)}>{children}</span>
}
