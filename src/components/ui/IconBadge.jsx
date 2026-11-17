import Icon from './Icon.jsx'
import { cx } from '../../lib/cx.js'
import styles from './IconBadge.module.css'

const iconSize = { sm: 16, md: 20, lg: 26 }

// The glowing round node that sits next to module names on disrupt-x.io
export default function IconBadge({ name, size = 'md', active = false, className }) {
  return (
    <span className={cx(styles.badge, styles[size], active && styles.active, className)}>
      <Icon name={name} size={iconSize[size]} />
    </span>
  )
}
