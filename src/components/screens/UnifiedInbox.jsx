import StatusPill from '../ui/StatusPill.jsx'
import styles from './UnifiedInbox.module.css'

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

// The same three jobs once they land in ALEF 360°, each with an owner and a status
export default function UnifiedInbox({ title, subtitle, status, items }) {
  return (
    <div className={styles.inbox}>
      <div className={styles.head}>
        <img src="/images/brand/favicon.svg" width="26" height="26" alt="" />
        <div>
          <p className={styles.title}>{title}</p>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <StatusPill tone="success" pulse className={styles.live}>
          {status}
        </StatusPill>
      </div>

      <ul className={styles.rows}>
        {items.map(({ id, result }) => (
          // the dashed slot shows where each job will land while the row is still hidden
          <li key={id} className={styles.slot}>
            <div className={styles.row} data-row={id}>
              <span className={styles.module}>{result.module}</span>
              <span className={styles.main}>
                <span className={styles.ref}>
                  {result.ref} · {result.type}
                </span>
                <span className={styles.rowTitle}>{result.title}</span>
              </span>
              <span className={styles.owner}>
                <span className={styles.avatar} aria-hidden="true">
                  {initials(result.owner)}
                </span>
                {result.owner}
              </span>
              <StatusPill tone={result.tone}>{result.status}</StatusPill>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
