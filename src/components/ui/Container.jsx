import { cx } from '../../lib/cx.js'
import styles from './Container.module.css'

export default function Container({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag className={cx(styles.container, className)} {...rest}>
      {children}
    </Tag>
  )
}
