import Eyebrow from './Eyebrow.jsx'
import GradientText from './GradientText.jsx'
import SplitWords, { SplitLine } from './SplitWords.jsx'
import { cx } from '../../lib/cx.js'
import styles from './SectionHeading.module.css'

/**
 * Eyebrow, a two line title with the brand gradient on the second line, and a lead.
 * The title rises word by word on scroll. Pass `id` so the parent section can
 * point at it with aria-labelledby.
 */
export default function SectionHeading({ id, eyebrow, title, accent, lead, align = 'center', as: Tag = 'h2', className }) {
  return (
    <div className={cx(styles.heading, styles[align], className)}>
      {eyebrow && <Eyebrow data-reveal="scale">{eyebrow}</Eyebrow>}
      <Tag id={id} className={styles.title} data-words>
        <SplitWords text={title} />
        {accent && (
          <SplitLine>
            <GradientText>{accent}</GradientText>
          </SplitLine>
        )}
      </Tag>
      {lead && (
        <p className={styles.lead} data-reveal>
          {lead}
        </p>
      )}
    </div>
  )
}
