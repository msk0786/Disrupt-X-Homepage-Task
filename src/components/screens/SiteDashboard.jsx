import { useMemo, useState } from 'react'
import BrowserFrame from '../frames/BrowserFrame.jsx'
import StatusPill from '../ui/StatusPill.jsx'
import CountUp from '../../motion/CountUp.jsx'
import { cx } from '../../lib/cx.js'
import styles from './SiteDashboard.module.css'

const sum = (list) => list.reduce((total, n) => total + n, 0)

// Rolls every school up into one "All sites" view
function portfolio(sites, label) {
  return {
    id: 'all',
    name: label,
    openJobs: sum(sites.map((s) => s.openJobs)),
    alerts: sum(sites.map((s) => s.alerts)),
    energy: sites[0].energy.map((_, day) => Math.round(sum(sites.map((s) => s.energy[day])) * 10) / 10),
    compliance: Math.round(sum(sites.map((s) => s.compliance)) / sites.length),
    issues: [...sites].sort((a, b) => b.alerts - a.alerts).map((s) => ({ ...s.issues[0], site: s.name })).slice(0, 2),
  }
}

// Rounds the chart ceiling up so the top gridline lands on a friendly number
const ceiling = (max) => Math.ceil(max / 5) * 5

export default function SiteDashboard({ sites, days, labels }) {
  const [selected, setSelected] = useState('all')
  const all = useMemo(() => portfolio(sites, labels.all), [sites, labels.all])
  const view = selected === 'all' ? all : sites.find((site) => site.id === selected)
  const top = ceiling(Math.max(...view.energy))
  const weekTotal = sum(view.energy)
  const options = [all, ...sites]

  return (
    <BrowserFrame title="ALEF 360° iBMS" className={styles.frame}>
      <div className={styles.dash} role="group" aria-label={labels.sitesLabel}>
        <div className={styles.sites}>
          {options.map((site) => (
            <button
              key={site.id}
              type="button"
              className={cx(styles.site, site.id === selected && styles.selected)}
              aria-pressed={site.id === selected}
              onClick={() => setSelected(site.id)}
            >
              <span className={cx(styles.health, site.alerts === 0 ? styles.ok : site.alerts > 3 ? styles.bad : styles.warn)} aria-hidden="true" />
              {site.name}
            </button>
          ))}
        </div>

        <div className={styles.main}>
          <div className={styles.head}>
            <p className={styles.name}>{view.name}</p>
            <StatusPill tone={view.alerts === 0 ? 'success' : view.alerts > 3 ? 'danger' : 'warning'}>
              {view.alerts === 0 ? labels.healthy : `${view.alerts} ${labels.alertsUnit}`}
            </StatusPill>
          </div>

          <dl className={styles.kpis}>
            <div>
              <dt>{labels.openJobs}</dt>
              <dd>
                <CountUp value={view.openJobs} />
              </dd>
            </div>
            <div>
              <dt>{labels.alerts}</dt>
              <dd>
                <CountUp value={view.alerts} />
              </dd>
            </div>
            <div>
              <dt>{labels.energy}</dt>
              <dd>
                <CountUp value={weekTotal} decimals={1} suffix=" MWh" />
              </dd>
            </div>
            <div>
              <dt>{labels.compliance}</dt>
              <dd>
                <CountUp value={view.compliance} suffix="%" />
              </dd>
            </div>
          </dl>

          <figure className={styles.chartBox}>
            <figcaption className={styles.caption}>{labels.chart}</figcaption>
            <div className={styles.chart} aria-hidden="true">
              <span className={styles.axisTop}>{top}</span>
              <span className={styles.axisMid}>{top / 2}</span>
              {view.energy.map((value, i) => (
                <span key={days[i]} className={styles.column}>
                  <span className={styles.bar} style={{ height: `${(value / top) * 100}%` }} />
                  <span className={styles.tip}>
                    {days[i]} {value} MWh
                  </span>
                  <span className={styles.day}>{days[i]}</span>
                </span>
              ))}
            </div>
            {/* the same numbers as a table for screen readers */}
            <table className="visually-hidden">
              <caption>{labels.chart}</caption>
              <tbody>
                {view.energy.map((value, i) => (
                  <tr key={days[i]}>
                    <th scope="row">{days[i]}</th>
                    <td>{value} MWh</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>

          <div className={styles.issues}>
            <p className={styles.caption}>{labels.issues}</p>
            <ul key={view.id}>
              {view.issues.map((issue) => (
                <li key={issue.text} className={styles.issue}>
                  <StatusPill tone={issue.tone}>{issue.module}</StatusPill>
                  <span>
                    {issue.text}
                    {issue.site && <span className={styles.issueSite}>{issue.site}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="visually-hidden" aria-live="polite">
          {`${view.name}: ${view.openJobs} ${labels.openJobs.toLowerCase()}, ${view.alerts} ${labels.alertsUnit}, ${labels.compliance.toLowerCase()} ${view.compliance}%.`}
        </p>
      </div>
    </BrowserFrame>
  )
}
