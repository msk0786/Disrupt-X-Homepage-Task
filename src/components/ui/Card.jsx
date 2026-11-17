import { trackPointer } from '../../motion/pointer.js'
import { cx } from '../../lib/cx.js'
import styles from './Card.module.css'

// Interactive cards get a border and glow that follow the cursor
export default function Card({ as: Tag = 'div', interactive = false, className, children, ...rest }) {
  return (
    <Tag
      className={cx(styles.card, interactive && styles.interactive, className)}
      onPointerMove={interactive ? trackPointer : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
