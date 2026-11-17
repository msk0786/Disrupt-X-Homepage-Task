import { useRef } from 'react'
import { content } from './content/index.js'
import { useReveal } from './motion/useReveal.js'
import { useParallax } from './motion/useParallax.js'
import Header from './sections/Header.jsx'
import Hero from './sections/Hero.jsx'
import LogoMarquee from './sections/LogoMarquee.jsx'
import ScatteredToOne from './sections/ScatteredToOne.jsx'
import Statement from './sections/Statement.jsx'
import Teams from './sections/Teams.jsx'
import Modules from './sections/Modules.jsx'
import Strengths from './sections/Strengths.jsx'
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

  const { site, clients, story, teams, modules, strengths, demo } = content

  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header brand={site.brand} nav={site.nav} demo={site.demo} />
      <main id="main">
        <Hero hero={site.hero} demo={site.demo} dashboard={demo.portfolio} cards={demo.heroCards} />
        <LogoMarquee title={site.clients.title} clients={clients} />
        <ScatteredToOne story={story} />
        <Statement statement={site.statement} />
        <Teams teams={teams} demo={demo} />
        <Modules modules={modules} />
        <Strengths strengths={strengths} />
        <FinalCta cta={site.finalCta} demo={site.demo} />
      </main>
      <Footer brand={site.brand} footer={site.footer} />
    </div>
  )
}
