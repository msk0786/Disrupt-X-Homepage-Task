import Icon from './Icon.jsx'
import { cx } from '../../lib/cx.js'
import styles from './Button.module.css'

/**
 * One button for the whole site. Renders a link when given `href`.
 * variant: primary | ghost | link
 */
export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  arrow = false,
  className,
  children,
  ...rest
}) {
  const classes = cx(styles.button, styles[variant], styles[size], className)
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <Icon name="arrowRight" size={16} className={styles.arrow} />}
    </>
  )

  if (href) {
    return (
      <a className={classes} href={href} {...rest}>
        {inner}
      </a>
    )
  }

  return (
    <button className={classes} type="button" {...rest}>
      {inner}
    </button>
  )
}
