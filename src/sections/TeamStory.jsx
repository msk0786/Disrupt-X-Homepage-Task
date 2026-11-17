import IconBadge from '../components/ui/IconBadge.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import SplitWords, { SplitLine } from '../components/ui/SplitWords.jsx'
import Icon from '../components/ui/Icon.jsx'
import styles from './TeamStory.module.css'

/**
 * One team's story: outcome first, then the screen that proves it.
 * The layout is shared, only the content and the screen change per team.
 */
export default function TeamStory({ team, children }) {
  const titleId = `team-${team.id}`

  return (
    <article className={styles.story} aria-labelledby={titleId}>
      <div className={styles.copy}>
        <span className={styles.node} data-node>
          <IconBadge name={team.icon} size="lg" />
        </span>
        <p className={styles.audience} data-reveal="left">
          {team.audience}
        </p>
        <h3 id={titleId} className={styles.title} data-words>
          <SplitWords text={team.title} />
          <SplitLine>
            <GradientText>{team.accent}</GradientText>
          </SplitLine>
        </h3>
        <p className={styles.lead} data-reveal>
          {team.lead}
        </p>
        <ul className={styles.points}>
          {team.points.map((point) => (
            <li key={point} data-reveal="left">
              <Icon name="check" size={16} strokeWidth={2.5} />
              {point}
            </li>
          ))}
        </ul>
        <p className={styles.hint} data-reveal>
          <Icon name="sparkles" size={16} />
          {team.hint}
        </p>
      </div>

      {/* the outer layer drifts with the scroll, the inner one swings in once */}
      <div className={styles.screen} data-speed="0.35">
        <div className={styles.screenInner} data-reveal="right">
          {children}
        </div>
      </div>
    </article>
  )
}
