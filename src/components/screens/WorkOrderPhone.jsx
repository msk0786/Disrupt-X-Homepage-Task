import { useEffect, useState } from 'react'
import PhoneFrame from '../frames/PhoneFrame.jsx'
import StatusPill from '../ui/StatusPill.jsx'
import Icon from '../ui/Icon.jsx'
import { cx } from '../../lib/cx.js'
import styles from './WorkOrderPhone.module.css'

const STARTED = 1
const PHOTO = 2
const DONE = 3

/**
 * A technician's work order you can tap through:
 * assigned, in progress, photo added, completed.
 * The timer runs fast on purpose, one minute per second, so the demo feels real.
 * Each step also brings the clock up to a realistic minimum (content: minutes),
 * so tapping straight through never reports a job closed in 0 minutes.
 */
export default function WorkOrderPhone({ data }) {
  const [step, setStep] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const current = data.steps[step]
  const running = step === STARTED || step === PHOTO

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setMinutes((m) => m + 1), 1000)
    return () => clearInterval(timer)
  }, [running])

  function next() {
    if (step === DONE) {
      setStep(0)
      setMinutes(0)
      return
    }
    const upcoming = step + 1
    if (upcoming === PHOTO) setMinutes((m) => Math.max(m, data.minutes.photo))
    if (upcoming === DONE) setMinutes((m) => Math.max(m, data.minutes.done))
    setStep(upcoming)
  }

  const ticked = (i) => (step === DONE ? true : i < step)

  return (
    <PhoneFrame className={styles.phone} time={data.deviceTime}>
      <div className={styles.app} role="group" aria-label={data.demoLabel}>
        <div className={styles.appBar}>
          <div className={styles.appName}>
            <img src="/images/brand/favicon.svg" width="22" height="22" alt="" />
            <p>
              <span className={styles.appKicker}>{data.appKicker}</span>
              <span className={styles.appTitle}>{data.appTitle}</span>
            </p>
          </div>
          <span className={styles.bell}>
            <Icon name="bell" size={18} />
          </span>
        </div>

        <div className={styles.job}>
          <div className={styles.jobTop}>
            <span className={styles.ref}>{data.ref}</span>
            <StatusPill tone="danger">{data.priority}</StatusPill>
          </div>
          <p className={styles.jobTitle}>{data.title}</p>
          <ul className={styles.facts}>
            <li>
              <Icon name="pin" size={14} />
              {data.site}, {data.location}
            </li>
            <li>
              <Icon name="box" size={14} />
              {data.asset}
            </li>
            <li>
              <Icon name="user" size={14} />
              {data.assignee}
            </li>
          </ul>
          <p className={styles.insight}>
            <Icon name="sparkles" size={14} />
            {data.insight}
          </p>
        </div>

        <div className={styles.statusRow}>
          <StatusPill key={step} tone={current.tone} pulse={running} className={styles.pop}>
            {current.status}
          </StatusPill>
          <span className={styles.timer}>
            <Icon name="clock" size={14} />
            {data.timerLabel}{' '}
            <strong>
              {minutes} {data.timerUnit}
            </strong>
          </span>
        </div>

        <div className={styles.checklist}>
          <p className={styles.label}>{data.checklistTitle}</p>
          <ul>
            {data.checklist.map((item, i) => (
              <li key={item} className={cx(ticked(i) && styles.ticked)}>
                <span className={styles.tick} aria-hidden="true">
                  <Icon name="check" size={12} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* the slot is always there, so the phone never changes height */}
        <div className={styles.photoSlot}>
          {step >= PHOTO && (
            <div className={cx(styles.photo, styles.pop)}>
              <img className={styles.thumb} src={data.photoImage} width="48" height="48" alt="" />
              <span>{data.photo}</span>
              <Icon name="check" size={16} className={styles.photoOk} />
            </div>
          )}
        </div>

        <button type="button" className={cx(styles.action, step === DONE && styles.actionGhost)} onClick={next}>
          {step === DONE && <Icon name="reset" size={16} />}
          {current.action}
        </button>

        {step === DONE && (
          <div className={styles.done}>
            <span className={styles.ring}>
              <Icon name="check" size={34} strokeWidth={2.5} />
            </span>
            <p className={styles.doneTitle}>{data.done.title.replace('{minutes}', minutes)}</p>
            <p className={styles.doneBody}>{data.done.body}</p>
          </div>
        )}

        <p className="visually-hidden" aria-live="polite">
          {step > 0 ? current.announce : ''}
        </p>
      </div>
    </PhoneFrame>
  )
}
