import { useRef } from 'react'
import { content } from './content/index.js'
import { useReveal } from './motion/useReveal.js'
import Header from './sections/Header.jsx'
import Footer from './sections/Footer.jsx'

import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/utilities.css'

export default function App() {
  const root = useRef(null)
  useReveal(root)

  const { site } = content

  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header brand={site.brand} nav={site.nav} demo={site.demo} />
      <main id="main"></main>
      <Footer brand={site.brand} footer={site.footer} />
    </div>
  )
}
