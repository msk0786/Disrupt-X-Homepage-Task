import Icon from '../ui/Icon.jsx'
import { cx } from '../../lib/cx.js'
import styles from './SourceCard.module.css'

const icons = { whatsapp: 'message', paper: 'file', excel: 'table' }

// How the job arrives today: a WhatsApp message, a paper form or a spreadsheet row
export default function SourceCard({ item, className, ...rest }) {
  return (
    <article className={cx(styles.card, styles[item.source], className)} {...rest}>
      <header className={styles.head}>
        <Icon name={icons[item.source]} size={14} />
        {item.sourceLabel}
      </header>
      {item.source === 'whatsapp' && <WhatsApp item={item} />}
      {item.source === 'paper' && <Paper item={item} />}
      {item.source === 'excel' && <Excel item={item} />}
    </article>
  )
}

function WhatsApp({ item }) {
  return (
    <div className={styles.chat}>
      <div className={styles.bubble}>
        <span className={styles.sender}>{item.meta}</span>
        <p>{item.title}</p>
        <span className={styles.time}>{item.time}</span>
      </div>
    </div>
  )
}

function Paper({ item }) {
  return (
    <div className={styles.paperBody}>
      <p className={styles.paperTitle}>{item.title}</p>
      <p className={styles.paperMeta}>{item.meta}</p>
      <span className={styles.lines} aria-hidden="true" />
      <span className={styles.stamp}>{item.stamp}</span>
    </div>
  )
}

function Excel({ item }) {
  return (
    <div className={styles.sheet}>
      <div className={cx(styles.sheetRow, styles.sheetHeader)} aria-hidden="true">
        <span />
        <span>A</span>
        <span>B</span>
      </div>
      <div className={styles.sheetRow}>
        <span className={styles.rowNo}>{item.row}</span>
        <span className={styles.selected}>{item.title}</span>
        <span>{item.note}</span>
      </div>
      <div className={styles.sheetRow} aria-hidden="true">
        <span className={styles.rowNo}>{item.row + 1}</span>
        <span />
        <span />
      </div>
      <p className={styles.sheetFile}>{item.meta}</p>
    </div>
  )
}
