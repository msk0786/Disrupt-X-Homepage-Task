import { useEffect, useRef } from 'react'
import { content } from './content/index.js'
import { ScrollTrigger } from './motion/gsap.js'
import { useReveal } from './motion/useReveal.js'
import { useParallax } from './motion/useParallax.js'
import { whenSettled } from './motion/schedule.js'
import Header from './sections/Header.jsx'
import Hero from './sections/Hero.jsx'
import Clients from './sections/Clients.jsx'
import ScatteredToOne from './sections/ScatteredToOne.jsx'
import Teams from './sections/Teams.jsx'
import Modules from './sections/Modules.jsx'
import Strengths from './sections/Strengths.jsx'
import News from './sections/News.jsx'
import FinalCta from './sections/FinalCta.jsx'
import Footer from './sections/Footer.jsx'

import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/utilities.css'

export default function App() {
  const root = useRef(null)
  useReveal(root)
  useParallax(root)

  useEffect(() => {
    // tells the fallback timer in index.html that scripts are running
    window.__dxReady = true
    // once every section has built its scroll animations, and the web font has
    // settled the layout, measure all the triggers one final time
    whenSettled(() => document.fonts.ready.then(() => ScrollTrigger.refresh()))
  }, [])

  const { site, clients, story, teams, modules, strengths, news, demo } = content
  const chapter = (number) => ({ number, total: '04' })

  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        {site.a11y.skip}
      </a>
      <Header brand={site.brand} nav={site.nav} demo={site.demo} a11y={site.a11y} />
      <main id="main">
        <Hero hero={site.hero} demo={site.demo} dashboard={demo.portfolio} cards={demo.heroCards} />
        <Clients clients={clients} />
        <ScatteredToOne story={story} chapter={chapter('01')} />
        <Teams teams={teams} demo={demo} apps={site.apps} chapter={chapter('02')} />
        <Modules modules={modules} chapter={chapter('03')} />
        <Strengths strengths={strengths} chapter={chapter('04')} />
        <News news={news} />
        <FinalCta cta={site.finalCta} demo={site.demo} />
      </main>
      <Footer brand={site.brand} footer={site.footer} apps={site.apps} />
    </div>
  )
}
