import { cx } from '../../lib/cx.js'
import styles from './Card.module.css'

export default function Card({ as: Tag = 'div', interactive = false, className, children, ...rest }) {
  return (
    <Tag className={cx(styles.card, interactive && styles.interactive, className)} {...rest}>
      {children}
    </Tag>
  )
}
