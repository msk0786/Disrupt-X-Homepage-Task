import IconBadge from '../components/ui/IconBadge.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import SplitWords, { SplitLine } from '../components/ui/SplitWords.jsx'
import Icon from '../components/ui/Icon.jsx'
import styles from './TeamStory.module.css'

/**
 * One team's story: outcome first, then the screen that proves it.
 * The layout is shared, only the content and the screen change per team.
 * Teams.jsx drives the scroll motion through the data attributes.
 */
export default function TeamStory({ team, children }) {
  const titleId = `team-${team.id}`

  return (
    <article className={styles.story} aria-labelledby={titleId} data-story>
      <div className={styles.copy}>
        <span className={styles.node} data-node>
          <IconBadge name={team.icon} size="lg" />
        </span>
        <p className={styles.audience} data-team-copy>
          {team.audience}
        </p>
        <h3 id={titleId} className={styles.title} data-words>
          <SplitWords text={team.title} />
          <SplitLine>
            <GradientText>{team.accent}</GradientText>
          </SplitLine>
        </h3>
        <p className={styles.lead} data-team-copy>
          {team.lead}
        </p>
        <ul className={styles.points}>
          {team.points.map((point) => (
            <li key={point} data-team-copy>
              <Icon name="check" size={16} strokeWidth={2.5} />
              {point}
            </li>
          ))}
        </ul>
        <p className={styles.hint} data-team-copy>
          <Icon name="sparkles" size={16} />
          {team.hint}
        </p>
      </div>

      <div className={styles.screen}>
        <div className={styles.screenInner} data-team-screen>
          {children}
        </div>
      </div>
    </article>
  )
}
