import { cx } from '../../lib/cx.js'
import styles from './Skyline.module.css'

/*
  The wireframe skyline from the disrupt-x.io hero, rebuilt as a live map of the five
  modules. The geometry below is the live layout, measured in px on a 980 x 431 stage
  and placed in percentages so it scales with the page.
*/
const STAGE = { width: 980, height: 431 }
const LOGO = { x: 424, y: 62, w: 98, h: 76 }
const HUB = { x: 473, y: 100 }

const towers = [
  { id: 'left', src: '/images/skyline/skyline-left.svg', x: 0, y: 175, w: 295, h: 256 },
  { id: 't1', src: '/images/skyline/tower-1.svg', x: 281, y: 241, w: 104, h: 190 },
  { id: 't2', src: '/images/skyline/tower-2.svg', x: 351, y: 291, w: 50, h: 139 },
  { id: 't3', src: '/images/skyline/tower-3.svg', x: 389, y: 205, w: 47, h: 226 },
  { id: 't4', src: '/images/skyline/tower-4.svg', x: 455, y: 226, w: 34, h: 204 },
  { id: 't5', src: '/images/skyline/tower-5.svg', x: 512, y: 141, w: 57, h: 290 },
  { id: 't6', src: '/images/skyline/tower-6.svg', x: 545, y: 119, w: 86, h: 311 },
  { id: 't7', src: '/images/skyline/tower-7.svg', x: 600, y: 282, w: 39, h: 149 },
  { id: 't8', src: '/images/skyline/tower-8.svg', x: 640, y: 226, w: 59, h: 205 },
  { id: 'right', src: '/images/skyline/skyline-right.svg', x: 699, y: 175, w: 281, h: 256 },
]

// where each module sits on the skyline, and the building it lights up
const nodes = {
  cafm: { x: 114, y: 163, tower: 'left', icon: '/images/skyline/node-stack.svg' },
  ibms: { x: 311, y: 37, tower: 't1', icon: '/images/skyline/node-ibms.svg' },
  connected: { x: 638, y: 37, tower: 't6', icon: '/images/skyline/node-stack.svg' },
  mobility: { x: 669, y: 300, tower: 't8', icon: '/images/skyline/node-stack.svg' },
  hseq: { x: 865, y: 163, tower: 'right', icon: '/images/skyline/node-stack.svg' },
}

const pct = (value, of) => `${(value / of) * 100}%`
const box = ({ x, y, w, h }) => ({
  left: pct(x, STAGE.width),
  top: pct(y, STAGE.height),
  width: pct(w, STAGE.width),
  height: pct(h, STAGE.height),
})

/**
 * items     the modules from content/modules.json
 * active    id of the module shown in the tabs below
 * onSelect  called with a module id when a node is clicked (the tabs stay the keyboard route)
 */
export default function Skyline({ items, active, onSelect, prefix, logoAlt }) {
  const lit = nodes[active]?.tower

  return (
    // decorative: the same choice is made with the accessible tabs right below
    <div className={styles.skyline} aria-hidden="true">
      <svg className={styles.rays} viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}>
        {items.map((item) => {
          const node = nodes[item.id]
          if (!node) return null
          return (
            <line
              key={item.id}
              x1={HUB.x}
              y1={HUB.y}
              x2={node.x}
              y2={node.y}
              className={cx(styles.ray, item.id === active && styles.rayOn)}
            />
          )
        })}
      </svg>

      <img
        className={styles.beam}
        src="/images/skyline/beam.svg"
        alt=""
        loading="lazy"
        style={box({ x: 306, y: 69, w: 334, h: 167 })}
      />

      {towers.map((tower) => (
        <img
          key={tower.id}
          className={cx(styles.tower, tower.id === lit && styles.towerOn)}
          src={tower.src}
          alt=""
          loading="lazy"
          decoding="async"
          style={box(tower)}
          data-reveal
        />
      ))}

      <img
        className={styles.logo}
        src="/images/brand/alef-360-logo.svg"
        alt={logoAlt}
        loading="lazy"
        style={box(LOGO)}
        data-reveal="scale"
      />

      {items.map((item) => {
        const node = nodes[item.id]
        if (!node) return null
        return (
          // a mouse shortcut to the same choice: kept out of the tab order, the tabs below are the keyboard route
          <button
            type="button"
            tabIndex={-1}
            key={item.id}
            className={cx(styles.node, item.id === active && styles.nodeOn)}
            style={{ left: pct(node.x, STAGE.width), top: pct(node.y, STAGE.height) }}
            onClick={() => onSelect(item.id)}
          >
            <img src={node.icon} alt="" width="40" height="34" loading="lazy" />
            <span className={styles.label}>
              {prefix} {item.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
