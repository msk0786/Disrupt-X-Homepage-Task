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
    setStep(step + 1)
  }

  const ticked = (i) => (step === DONE ? true : i < step)

  return (
    <PhoneFrame className={styles.phone}>
      <div className={styles.app} role="group" aria-label={`${data.ref} demo`}>
        <div className={styles.appBar}>
          <p className={styles.appTitle}>{data.appTitle}</p>
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
        </div>

        <div className={styles.statusRow}>
          <StatusPill key={step} tone={current.tone} pulse={running} className={styles.pop}>
            {current.status}
          </StatusPill>
          <span className={styles.timer}>
            <Icon name="clock" size={14} />
            {data.timerLabel} <strong>{minutes} min</strong>
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

        {step >= PHOTO && (
          <div className={cx(styles.photo, styles.pop)}>
            <span className={styles.thumb}>
              <Icon name="camera" size={18} />
            </span>
            <span>{data.photo}</span>
            <Icon name="check" size={16} className={styles.photoOk} />
          </div>
        )}

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
