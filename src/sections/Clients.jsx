import { useState } from 'react'
import Container from '../components/ui/Container.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import LogoMarquee from './LogoMarquee.jsx'
import styles from './Clients.module.css'

/*
  Every client from disrupt-x.io on a full width slate band, split into MENA and APAC
  with the same accessible tabs the module explorer uses. The logos are shown in white,
  so dark and colourful marks are equally clear on the dark page.
*/
export default function Clients({ clients }) {
  const [region, setRegion] = useState(clients.regions[0].id)

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
      </Container>

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
              <LogoMarquee items={item.items} />
            </div>
          )}
        />
      </div>
    </section>
  )
}
