import IconBadge from '../components/ui/IconBadge.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import SplitWords, { SplitLine } from '../components/ui/SplitWords.jsx'
import Icon from '../components/ui/Icon.jsx'
import AppBadges from '../components/ui/AppBadges.jsx'
import { srcSetOf } from '../lib/image.js'
import styles from './TeamStory.module.css'

/**
 * One team's story: outcome first, then the screen that proves it.
 * The layout is shared, only the content and the screen change per team.
 * Teams.jsx drives the scroll motion through the data attributes.
 */
export default function TeamStory({ team, apps, children }) {
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
        {apps && (
          <div data-team-copy>
            <AppBadges apps={apps} className={styles.apps} />
          </div>
        )}
        <p className={styles.hint} data-team-copy>
          <Icon name="sparkles" size={16} />
          {team.hint}
        </p>
      </div>

      <div className={styles.screen}>
        {team.photo && (
          // a real site photo behind the product screen, darkened so the screen stays the hero
          <div className={styles.photo} aria-hidden="true">
            <img
              src={team.photo.src}
              srcSet={srcSetOf(team.photo.srcSet)}
              sizes="(max-width: 899px) 100vw, 640px"
              width={team.photo.width}
              height={team.photo.height}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ objectPosition: team.photo.focus }}
              data-speed="0.25"
            />
          </div>
        )}
        <div className={styles.screenInner} data-team-screen>
          {children}
        </div>
      </div>
    </article>
  )
}
