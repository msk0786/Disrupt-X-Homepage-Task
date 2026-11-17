import { useState } from 'react'
import Container from '../components/ui/Container.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import Icon from '../components/ui/Icon.jsx'
import LogoMarquee from './LogoMarquee.jsx'
import styles from './Clients.module.css'

/*
  Every client from disrupt-x.io, in colour on a light band as on the live site,
  split into MENA and APAC with the same accessible tabs the module explorer uses.
*/
export default function Clients({ clients }) {
  const [region, setRegion] = useState(clients.regions[0].id)
  const [paused, setPaused] = useState(false)

  return (
    <section id="clients" className={styles.section} aria-labelledby="clients-title">
      <Container>
        <div className={styles.head} data-reveal>
          <Eyebrow>{clients.eyebrow}</Eyebrow>
          <h2 id="clients-title" className={styles.title}>
            {clients.title}
          </h2>
          <p className={styles.lead}>{clients.lead}</p>
        </div>

        <div data-reveal="scale">
          <Tabs
            label={clients.tabsLabel}
            items={clients.regions}
            active={region}
            onChange={setRegion}
            className={styles.tabs}
            panelClassName={styles.panel}
            renderPanel={(item) => (
              <div className={styles.band}>
                <LogoMarquee items={item.items} paused={paused} />
                <button
                  type="button"
                  className={styles.pause}
                  aria-label={paused ? clients.play : clients.pause}
                  onClick={() => setPaused((value) => !value)}
                >
                  <Icon name={paused ? 'play' : 'pause'} size={16} />
                </button>
              </div>
            )}
          />
        </div>
      </Container>
    </section>
  )
}
