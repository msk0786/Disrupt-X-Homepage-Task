import { useState } from 'react'
import BrowserFrame from '../frames/BrowserFrame.jsx'
import StatusPill from '../ui/StatusPill.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'
import { cx } from '../../lib/cx.js'
import styles from './IncidentFlow.module.css'

/**
 * An HSEQ incident you can move from reported to closed.
 * Every step adds a line to the audit trail, which is the point of the story.
 */
export default function IncidentFlow({ data }) {
  const [step, setStep] = useState(0)
  const last = data.steps.length - 1
  const current = data.steps[step]
  const closed = step === last

  return (
    <BrowserFrame title="ALEF 360° HSEQ" className={styles.frame}>
      <div className={styles.flow} role="group" aria-label={`${data.ref} demo`}>
        <header className={styles.head}>
          <div>
            <p className={styles.ref}>
              {data.ref} · {data.site} · {data.severity}
            </p>
            <p className={styles.title}>{data.title}</p>
          </div>
          <StatusPill key={step} tone={current.tone} className={styles.pop}>
            {current.status}
          </StatusPill>
        </header>

        <ol className={styles.stepper} style={{ '--progress': step / last }}>
          {data.steps.map((item, i) => (
            <li key={item.key}>
              <button
                type="button"
                className={cx(styles.step, i < step && styles.complete, i === step && styles.current)}
                aria-current={i === step ? 'step' : undefined}
                onClick={() => setStep(i)}
              >
                <span className={styles.dot} aria-hidden="true">
                  {i < step || (closed && i === step) ? <Icon name="check" size={12} strokeWidth={3} /> : i + 1}
                </span>
                <span className={styles.stepLabel}>{item.label}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className={styles.body}>
          <div key={step} className={cx(styles.detail, styles.pop)}>
            <span className={styles.avatar} aria-hidden="true">
              {current.who
                .split(' ')
                .map((part) => part[0])
                .join('')}
            </span>
            <div>
              <p className={styles.meta}>
                {current.who} · {current.time}
              </p>
              <p className={styles.note}>{current.note}</p>
            </div>
            {closed && (
              <span className={styles.badge}>
                <Icon name="shieldCheck" size={16} />
                {data.closedBadge}
              </span>
            )}
          </div>

          <div className={styles.trail}>
            <p className={styles.trailTitle}>{data.trailTitle}</p>
            <ul>
              {data.steps.slice(0, step + 1).map((item) => (
                <li key={item.key} className={styles.pop}>
                  <span className={styles.time}>{item.time}</span>
                  <span>
                    {item.label}, {item.who}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className={styles.foot}>
          {step > 0 && !closed && (
            <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
              {data.back}
            </Button>
          )}
          {closed ? (
            <Button variant="ghost" size="sm" onClick={() => setStep(0)}>
              {data.restart}
            </Button>
          ) : (
            <Button size="sm" arrow onClick={() => setStep(step + 1)}>
              {current.action}
            </Button>
          )}
        </footer>

        <p className="visually-hidden" aria-live="polite">
          {`${data.ref} is now ${current.status}. ${current.note}.`}
        </p>
      </div>
    </BrowserFrame>
  )
}
