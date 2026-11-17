import Icon from '../ui/Icon.jsx'
import StatusPill from '../ui/StatusPill.jsx'
import CountUp from '../../motion/CountUp.jsx'
import { cx } from '../../lib/cx.js'
import styles from './HeroDashboard.module.css'

const sidebar = ['dashboard', 'wrench', 'shield', 'building', 'radio', 'truck']

// A dark take on the ALEF 360° portfolio dashboard. Decorative, so it is hidden from screen readers.
export default function HeroDashboard({ data }) {
  const peak = Math.max(...data.energy)

  return (
    <div className={styles.dashboard} aria-hidden="true">
      <aside className={styles.sidebar}>
        <img src="/images/brand/favicon.svg" width="22" height="22" alt="" className={styles.mark} />
        {sidebar.map((name, i) => (
          <span key={name} className={cx(styles.navIcon, i === 0 && styles.navActive)}>
            <Icon name={name} size={16} />
          </span>
        ))}
      </aside>

      <div className={styles.body}>
        <div className={styles.top}>
          <div>
            <p className={styles.kicker}>{data.kicker}</p>
            <p className={styles.title}>{data.title}</p>
          </div>
          <div className={styles.topRight}>
            <StatusPill tone="success" pulse>
              {data.scope} {data.liveLabel}
            </StatusPill>
            <span className={styles.avatar}>{data.user}</span>
          </div>
        </div>

        <div className={styles.kpis}>
          {data.kpis.map((kpi) => (
            <div key={kpi.label} className={styles.kpi}>
              <p className={styles.kpiLabel}>{kpi.label}</p>
              <p className={styles.kpiValue}>
                <CountUp value={kpi.value} decimals={kpi.decimals} suffix={kpi.suffix} duration={1.6} />
              </p>
              <p className={cx(styles.kpiDelta, styles[kpi.trend])}>{kpi.delta}</p>
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          <div className={styles.panel}>
            <p className={styles.panelTitle}>{data.energyTitle}</p>
            <div className={styles.chart}>
              {data.energy.map((value, i) => (
                <span key={i} className={styles.bar} style={{ '--h': value / peak }} />
              ))}
            </div>
          </div>

          <div className={cx(styles.panel, styles.attention)}>
            <p className={styles.panelTitle}>{data.attentionTitle}</p>
            <ul>
              {data.attention.map((site) => (
                <li key={site.name} className={styles.site}>
                  <span>
                    <span className={styles.siteName}>{site.name}</span>
                    <span className={styles.siteDetail}>{site.detail}</span>
                  </span>
                  <StatusPill tone={site.tone}>{site.status}</StatusPill>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
