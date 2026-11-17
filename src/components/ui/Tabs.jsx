import { useId, useRef } from 'react'
import { cx } from '../../lib/cx.js'
import styles from './Tabs.module.css'

/**
 * Accessible tabs following the WAI-ARIA tabs pattern (arrow keys, Home, End).
 * Inactive panels stay in the DOM with `hidden`, so all copy is still crawlable.
 *
 * items       [{ id, ... }]
 * active      id of the selected item
 * onChange    called with the new id
 * renderTab   (item, selected) => tab label
 * renderPanel (item) => panel body
 */
export default function Tabs({ items, active, onChange, label, renderTab, renderPanel, className, panelClassName }) {
  const baseId = useId()
  const tabs = useRef([])
  const index = items.findIndex((item) => item.id === active)

  function select(i, focus = false) {
    const next = (i + items.length) % items.length
    const tab = tabs.current[next]
    if (focus) tab?.focus()
    // keeps the chosen tab visible when the list scrolls sideways on phones
    tab?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    onChange(items[next].id)
  }

  function onKeyDown(event) {
    const targets = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: items.length - 1 }
    if (!(event.key in targets)) return
    event.preventDefault()
    select(targets[event.key], true)
  }

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className={styles.list}>
        {items.map((item, i) => {
          const selected = item.id === active
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${baseId}tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              className={cx(styles.tab, selected && styles.selected)}
              onClick={() => select(i)}
              onKeyDown={onKeyDown}
            >
              {renderTab ? renderTab(item, selected) : item.label}
            </button>
          )
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}panel-${item.id}`}
          aria-labelledby={`${baseId}tab-${item.id}`}
          hidden={item.id !== active}
          tabIndex={0}
          className={cx(styles.panel, panelClassName)}
        >
          {renderPanel(item)}
        </div>
      ))}
    </div>
  )
}
