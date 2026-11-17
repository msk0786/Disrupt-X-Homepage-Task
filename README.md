# Disrupt-X homepage rebuild

A rebuild of the [disrupt-x.io](https://disrupt-x.io) homepage as one story: a school group's busy morning, told from the problem to the product. It leads with the outcome for each team, then shows the screen that proves it.

**Live site:** _add the Vercel link here_
**Design file:** _add the Figma link here_

## Tools used

* Built in React 19 with Vite 8, animated with GSAP ScrollTrigger, styled with CSS Modules on shared design tokens, versioned in Git and hosted on Vercel.
* Brand colours, type and assets come from disrupt-x.io. The Figma file holds the page frames and a small design system.
* AI: Claude Code helped as a coding assistant (scaffolding, refactors, audits). The story, design direction and every review decision were mine.

## Run it locally

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

`npm run build` makes a normal Vite build, then renders the page to static HTML (`scripts/prerender.js`), so the first paint never waits for JavaScript. React hydrates on top of it.

## The page, section by section

| # | Section | What it does |
|---|---------|--------------|
| 1 | Hero | Outcome headline, the ALEF 360° portfolio dashboard with floating cards for a new job, an AI alert and a closed incident |
| 2 | Client logos | Real client logos from disrupt-x.io in a slow loop |
| 3 | Scattered to one place | The brief's example: a pipe leak on WhatsApp, a failed fire door on paper and a permit in Excel fly into one ALEF 360° inbox as you scroll |
| 4 | Statement | One big sentence that lights up word by word as you scroll, with the key phrases in the brand gradient |
| 5 | Three teams | Facility, HSE and operator stories. Each one has a live demo screen |
| 6 | Five live modules | HSEQ, CAFM \| CMMS, iBMS, Connected Operations and Mobility in tabs, with real product screenshots |
| 7 | Why ALEF 360° | Platform strengths with count up numbers |
| 8 | Final call to action and footer | Book a demo |

Only the five live modules from the brief appear on the page.

## Interactions

1. **Work order on a phone** (facility teams). Tap Start job, Add photo and Complete job. The status, timer and checklist update, then the job closes.
2. **Incident to closed action** (HSE teams). Move an incident from Reported to Investigated, Action assigned and Closed. The audit trail fills in as you go.
3. **Multi site dashboard** (operators and owners). Pick a school or All sites. KPIs count to the new values, the energy chart redraws and the alerts change.
4. **Module explorer.** Accessible tabs with arrow key, Home and End support. On phones the tab bar scrolls sideways.

Every demo uses real buttons and announces changes through an `aria-live` region.

## Scroll motion

All motion runs through two hooks in `src/motion`. Components opt in with data attributes, so sections stay simple and the timing stays consistent.

| Effect | Where | How |
|--------|-------|-----|
| Focus in intro | Hero text | CSS keyframes (blur clears while lines rise), plays from the first paint |
| Layered depth | Hero dashboard and cards | GSAP scrub: the dashboard tilts flat while cards drift at different speeds |
| Scene exit | Hero | Copy eases away and the grid sinks slower than the page |
| Scroll progress and active section | Header | A gradient line fills with the page, and the nav link for the current section lights up |
| Word by word title reveal | Every section title | `SplitWords` masks each word, `data-words` makes them rise in turn |
| Scattered to one place | Story section | Pinned scrub on desktop, unpinned on phones, so nothing fights the address bar |
| Scroll lit statement | Statement | Each word goes from dim to white as you scroll, accent phrases light up in the gradient. Every word stays on screen and the dim colour still passes contrast |
| Cursor spotlight | Hero and strength cards | `trackPointer` writes the cursor position to CSS variables, so a mint light follows the mouse across the grid and around card borders. No re-renders |
| Timeline line | Teams | The brand's glowing line draws down the page and lights each team's node |
| Swing in and parallax | Team screens | `data-reveal="right"` plus `data-speed` on a wrapper |
| Curtain wipe | Module explorer | `data-reveal="clip"` |
| Line draw and card flip | Why ALEF 360° | `data-draw` and `data-reveal="flip"` |
| Count up | Dashboards and stats | `CountUp` writes straight into the text node, so React does not re-render every frame |
| Window opening | Final call to action | Clip path scrubs from inset to full size |

Reveal variants: `data-reveal` (lift), `left`, `right`, `scale`, `flip`, `clip`. Parallax: `data-speed="0.35"`.

**Reduced motion.** Everything animated sits inside `gsap.matchMedia()` with `prefers-reduced-motion: no-preference`, and the CSS loops stop. People who ask for less motion get every final state straight away, and the demos still work. Checked by rendering the page in Chrome with `--force-prefers-reduced-motion`.

**Mobile.** The pin turns off below 900px, parallax distance halves, and `main` clips sideways overflow so nothing that slides in can widen the page.

## Project structure

```
index.html              meta tags, font preload
public/
  fonts/                Poppins 400 to 700, self hosted
  images/brand/         logo, favicon, hero grid, ALEF 360° logo (from disrupt-x.io)
  images/modules/       one real product screenshot per module
  images/clients/       client logos
scripts/prerender.js    renders static HTML and inlines the CSS after the build
src/
  App.jsx               puts the sections together and passes content in
  content/              every word on the page, as JSON collections
  styles/               tokens.css, fonts.css, base.css, utilities.css
  motion/               gsap setup, useReveal, useParallax, CountUp
  components/ui/        Button, Card, Container, Eyebrow, GradientText, Icon, IconBadge,
                        SectionHeading, SplitWords, StatusPill, Tabs
  components/frames/    BrowserFrame, PhoneFrame
  components/screens/   HeroDashboard, SourceCard, UnifiedInbox, WorkOrderPhone,
                        IncidentFlow, SiteDashboard
  sections/             Header, Hero, LogoMarquee, ScatteredToOne, Statement, Teams,
                        TeamStory, Modules, Strengths, FinalCta, Footer
docs/lighthouse/        saved Lighthouse reports
```

Each component keeps its styles next to it in a CSS Module that only uses tokens. Sections never hold copy. They take it as props from `src/content`.

## Content model (the CMS structure)

The page reads from typed JSON collections in `src/content`. `src/content/index.js` checks required fields while developing, so a missing field shows in the console instead of as a blank space.

| Collection | Holds | As a CMS model |
|------------|-------|----------------|
| `site.json` | brand, nav, demo link, hero, statement, final CTA, footer | Site settings (singleton) |
| `clients.json` | client logos | Client (list) |
| `story.json` | the three scattered jobs and what they become | Story section with Job items |
| `teams.json` | the three team stories and which demo screen each uses | Team (list) |
| `modules.json` | the five live modules, features, screenshot, link | Module (list) |
| `strengths.json` | stats and strength cards | Strengths section |
| `demo.json` | demo data for the product screens | Demo data |

Moving to Sanity, Contentful or Webflow CMS means creating these models with the same fields and swapping the JSON imports for a fetch at build time. No component has to change.

## Design tokens

Measured from disrupt-x.io and kept in `src/styles/tokens.css`.

| Token | Value | Use |
|-------|-------|-----|
| `--c-bg` | `#0b0b0b` | page background |
| `--c-surface` | `rgba(137,137,137,0.05)` | cards, as on the live site |
| `--c-mint` | `#00ffce` | links, accents, glows |
| `--c-purple` | `#9e69ff` | end of the brand gradient |
| `--gradient-brand` | mint to purple | second line of every title |
| `--c-teal` | `#19a993` | brand button colour |
| `--c-teal-deep` | `#0e806e` | button fill used on this page (see trade offs) |
| `--c-text-muted` | `#9da4b0` | body copy |
| `--font-sans` | Poppins | all text |

Spacing, radii, type scale and motion timings live in the same file.

## Accessibility

* One `h1`, landmarks, a skip link and visible mint focus rings.
* Tabs follow the WAI-ARIA pattern. Demo screens use real buttons and `aria-live` updates.
* Decorative mockups are hidden from screen readers. The energy chart has a table version for screen readers.
* Colour contrast passes WCAG AA, including the small labels inside the mock WhatsApp, paper and Excel cards.
* Tap targets are at least 44px.

## Performance

Lighthouse on the production build (`npm run build && npm run preview`). The full reports are in `docs/lighthouse`.

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Mobile | 97 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Mobile: LCP 2.3s, total blocking time 50ms, CLS 0. Desktop: LCP 0.6s, total blocking time 0ms, CLS 0.

What keeps it fast:

* The page is prerendered and the CSS is inlined, so text paints before any JavaScript runs.
* Fonts are self hosted with a size matched fallback, so nothing jumps when Poppins loads.
* Only `transform` and `opacity` animate. Pulses use a scaled pseudo element instead of `box-shadow`.
* Images have fixed dimensions and load lazily below the fold. Hidden tab images are warmed up when the section gets close.

## Testing

Checked so far, in Chrome:

* Desktop at 1440 wide, tablet at 768 and phone at 375, with no sideways scroll at any point.
* Every demo by mouse and by keyboard (skip link, mobile menu, tabs with arrow keys).
* Reduced motion forced on.
* Lighthouse mobile and desktop on the production build.

Still to check before sending:

* Safari and Firefox on desktop.
* Real devices: open the live link on an iPhone (Safari) and an Android phone (Chrome), scroll the whole page and tap through each demo.

## Decisions and trade offs

* **Button colour.** White text on the brand teal `#19a993` is only 2.9:1, which fails WCAG AA. Buttons use a deeper teal `#0e806e` (4.9:1) with a mint glow on hover, so they still read as Disrupt-X.
* **Coded screens and real screenshots.** The three team demos are coded so they can be interactive and razor sharp. The module explorer uses the real product screenshots from disrupt-x.io.
* **Demo data.** Numbers inside the product screens are sample data for a fictional school group.
* **Prerender instead of a framework.** A short script gives static HTML without bringing in Next.js or Astro.
* **Assets.** Logos and product images belong to Disrupt-X and are used here only for this exercise.
