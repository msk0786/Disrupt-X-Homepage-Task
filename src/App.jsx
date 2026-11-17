import { useRef } from 'react'
import { content } from './content/index.js'
import { useReveal } from './motion/useReveal.js'
import Header from './sections/Header.jsx'
import Hero from './sections/Hero.jsx'
import LogoMarquee from './sections/LogoMarquee.jsx'
import Footer from './sections/Footer.jsx'

import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/utilities.css'

export default function App() {
  const root = useRef(null)
  useReveal(root)

  const { site, clients, demo } = content

  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header brand={site.brand} nav={site.nav} demo={site.demo} />
      <main id="main">
        <Hero hero={site.hero} demo={site.demo} dashboard={demo.portfolio} cards={demo.heroCards} />
        <LogoMarquee title={site.clients.title} clients={clients} />
      </main>
      <Footer brand={site.brand} footer={site.footer} />
    </div>
  )
}
