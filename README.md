# Disrupt-X homepage rebuild

A rebuild of the [disrupt-x.io](https://disrupt-x.io) homepage as one story: a school group's busy morning, told from the problem to the product. Every section leads with the outcome for a team, then shows the screen that proves it.

**Live site:** https://disrupt-x-homepage-task.vercel.app

## Tools used

- React 19 and Vite 8, animated with GSAP and ScrollTrigger, styled with CSS Modules on shared design tokens, hosted on Vercel and versioned in Git.
- No Figma file: the page was designed in code. Colours, type, logos, the brand grid and the skyline art are taken from disrupt-x.io, and the tokens are measured from its CSS (see Design tokens).
- Quality gates: ESLint (React, hooks and jsx-a11y rules), Prettier, JSON Schema checks on all content, Playwright smoke tests and Lighthouse CI, all run by GitHub Actions.
- AI: Claude Code helped as a coding assistant (scaffolding, refactors, audits and tests). The story, design direction and every review decision were mine.

## Run it locally

```bash
npm install
npm run dev          # local development
npm run build        # checks the content, builds and prerenders to dist/
npm run preview      # serves the production build on port 4173
npm run check        # lint, formatting, build and the smoke tests
```

`npm run build` first validates every content file, then makes a normal Vite build and renders the page to static HTML (`scripts/prerender.js`), so the first paint never waits for JavaScript. React hydrates on top of it.

## The page, section by section

| #   | Section                   | What it does                                                                                                                                                                                |
| --- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hero                      | Outcome headline and the ALEF 360° portfolio dashboard for one school group, with floating cards for a new job, an AI alert and a closed incident                                           |
| 2   | Clients                   | The official facts (since 2022, 50+ enterprise customers, 20+ countries) and all 26 client logos from disrupt-x.io, in white on a slate band, split into MENA and APAC                      |
| 3   | Chapter 01, one place     | The brief's example: a pipe leak on WhatsApp, a failed fire door on paper and a permit in Excel fly into one ALEF 360° inbox as you scroll                                                  |
| 4   | Chapter 02, three teams   | Facility, HSE and operator stories, each with a live demo screen and a site photo behind it                                                                                                 |
| 5   | Chapter 03, five modules  | The skyline from disrupt-x.io lights up the building for each module; tabs show HSEQ, CAFM \| CMMS, iBMS, Connected Operations and Mobility with real product screenshots and product names |
| 6   | Chapter 04, why ALEF 360° | Count up stats, platform strengths, ISO 27001 and two awards, and the eight technology partners                                                                                             |
| 7   | News                      | The latest three press releases, linking to the full stories                                                                                                                                |
| 8   | Call to action and footer | Book a demo, then a footer that matches the live site: socials, app store badges, company, insights and languages                                                                           |

Only the five live modules from the brief appear on the page. Asset Management is left out on purpose.

## Who benefits, and how the page shows it

| Team                           | Outcome first                         | The screen that proves it                                                                                                                                                                            |
| ------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Facility and maintenance teams | Jobs done faster. Fewer breakdowns.   | A work order on the ALEF 360° phone app: start the job, add a photo, close it. An AI note on the asset shows how this repair keeps the next breakdown from happening. App store badges sit beside it |
| HSE and compliance teams       | Safer sites. Audit ready, every time. | An incident moves from reported to investigated, becomes corrective action CA 108 with an owner, a due date and the evidence it needs, then closes with evidence and a full audit trail              |
| Building operators and owners  | Lower costs. Every site in one view.  | A multi site dashboard: pick a school to see open jobs, energy, compliance and energy cost against budget. Lakeside, the school with the leak, is the one over budget                                |

## Interactions

1. **Work order on a phone.** Tap Start job, Add photo and Complete job. The status, timer and checklist update and the job closes in a realistic 14 minutes, even if you tap straight through.
2. **Incident to closed action.** Move the incident through its four steps, forward with the main button or by tapping any step. The action card and audit trail fill in as you go.
3. **Multi site dashboard.** Pick a school or All sites. The numbers count to their new values, the energy chart redraws and the latest alerts change.
4. **Module explorer.** Accessible tabs with arrow keys, Home and End. The skyline above follows the active module, and clicking a building's node is a mouse shortcut to the same tab.
5. **Client regions.** MENA and APAC tabs for the moving logo strip, which stops under the mouse.
6. **Cursor spotlights** on the hero and the strength and news cards, and a mobile menu that locks the page behind it.

All three demos keep the same height at every step, so nothing below them moves when you tap. Every demo uses real buttons and announces changes through an `aria-live` region.

## Scroll motion

Every main section opens with a chapter scene (`ChapterIntro`). Smaller reveals run through shared helpers in `src/motion`, and components opt in with data attributes, so sections stay simple and the timing stays consistent.

| Effect                 | Where                          | How                                                                                                                                                         |
| ---------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focus in intro         | Hero text, dashboard and cards | CSS keyframes from the first paint: lines rise while the blur clears, then the dashboard lands and the cards arrive one after another                       |
| Layered depth          | Hero dashboard and cards       | Scrubbed: the dashboard tilts flat while cards drift at different speeds                                                                                    |
| Scene exit             | Hero                           | Copy eases away and the grid sinks slower than the page                                                                                                     |
| Scroll progress        | Header                         | A gradient line fills with the page, and the nav link for the current section lights up                                                                     |
| Chapter scenes         | Chapters 01 to 04              | A brand grid panel wipes in (an expanding window, a wipe with a glowing edge, a growing circle, a rising curtain) while the number, title and lead rise in  |
| Scattered to one place | Chapter 01                     | Pinned scrub on desktop, unpinned on touch screens                                                                                                          |
| Timeline line          | Chapter 02                     | The brand's glowing line draws down the page and lights each team's node                                                                                    |
| Copy and screen fly in | Team stories                   | Copy slides in from the left, the product screen swings in from the right in 3D, both scrubbed so they reverse on the way back up. Photos drift behind them |
| City rises             | Chapter 03                     | The skyline's towers rise into place, then the module explorer grows out of a rounded window as a dark veil lifts                                           |
| Cards lock in          | Chapter 04                     | Strength cards fly up at different speeds and land in the grid. The divider lines draw themselves                                                           |
| Word by word titles    | Team, news and CTA titles      | `SplitWords` masks each word and `data-words` makes them rise in turn                                                                                       |
| Count up               | Dashboards and stats           | `CountUp` writes straight into the text node, so React does not re-render every frame                                                                       |
| Window opening         | Final call to action           | Clip path scrubs from inset to full size                                                                                                                    |
| Footer reveal          | Desktop                        | The page lifts away and uncovers the footer waiting underneath                                                                                              |

Reveal variants: `data-reveal` (lift), `left`, `right`, `scale`, `flip`, `clip`. Parallax: `data-speed="0.35"`.

### Fast on phones, with every animation kept

Measured on a simulated mid-range phone (Pixel 7, 4x slower CPU, slow 4G), the hero is complete about 2.6 seconds after navigation, and no script task blocks for more than about 300ms. This is how:

- **The hero entrance is plain CSS**, so it plays from the first paint and never waits for JavaScript.
- **Nothing shows and then hides.** While scripts start, CSS holds animated elements in their starting state (the `js` class in `index.html` and `markReady` in `src/motion/gsap.js`). If scripts never run, everything shows after 4 seconds.
- **Touch screens build the scroll scenes after the first paint**, a few milliseconds at a time in page order (`src/motion/schedule.js`). Desktops build them during hydration, because they are fast and they are the only screens with pins.
- **One-off reveals and count ups share IntersectionObservers** (`src/motion/observe.js`) instead of a ScrollTrigger each.
- **Pins and long scrubs only run on wide screens with a mouse.** Phones and tablets get the same animations over shorter ranges with 0.3s smoothing, so they settle while still on screen.
- **Static glows are wide gradients, not blur filters**, and the fixed header has no live blur on touch screens.

**Reduced motion.** Everything animated sits inside `gsap.matchMedia()` with `prefers-reduced-motion: no-preference`, the CSS starting states are wrapped the same way and the CSS loops stop. People who ask for less motion see every final state straight away, and the demos still work. The smoke tests check this.

## Project structure

```
index.html              meta and share tags, structured data, font preload, the js class
vercel.json             security and caching headers
public/
  fonts/                Poppins 400 to 700, self hosted
  images/               brand, clients, partners, awards, news, photos, modules, skyline, badges
scripts/
  validate-content.js   checks the content before every build
  prerender.js          renders static HTML, inlines the CSS, checks the CSP hash
src/
  App.jsx               puts the sections together and passes content in
  content/              every word on the page, as JSON collections
  content/schema/       a JSON Schema for each collection
  styles/               tokens.css, fonts.css, base.css, utilities.css
  motion/               gsap setup, scheduler, observers, reveals, parallax, CountUp
  components/ui/        Button, Card, Container, Eyebrow, GradientText, Icon, IconBadge,
                        SplitWords, StatusPill, Tabs, AppBadges, SocialIcon
  components/frames/    BrowserFrame, PhoneFrame
  components/screens/   HeroDashboard, SourceCard, UnifiedInbox, WorkOrderPhone,
                        IncidentFlow, SiteDashboard, Skyline
  sections/             Header, Hero, Clients, LogoMarquee, ChapterIntro, ScatteredToOne,
                        Teams, TeamStory, Modules, Strengths, News, FinalCta, Footer
tests/smoke.spec.js     Playwright smoke tests (phone and desktop)
docs/lighthouse/        saved Lighthouse reports
```

Each component keeps its styles next to it in a CSS Module that only uses tokens. Sections and components never hold copy. They take it as props from `src/content`.

## Content model (the CMS structure)

The page reads from JSON collections in `src/content`, each with a JSON Schema in `src/content/schema`. `npm run build` runs `scripts/validate-content.js` first, so content problems stop the build with a clear message instead of reaching the page:

- every collection matches its schema: required fields, types and no unknown keys, so a typo in a field name is caught
- every image and font path exists in `public/`
- every icon name is one `Icon.jsx` can draw
- the page shows exactly the five live modules
- the hero portfolio adds up from the four schools in the dashboard (jobs, alerts, energy, compliance), and the CAFM chip matches the work order's finishing time

| Collection       | Holds                                                                | As a CMS model                  |
| ---------------- | -------------------------------------------------------------------- | ------------------------------- |
| `site.json`      | brand, accessibility labels, nav, demo link, apps, hero, CTA, footer | Site settings (singleton)       |
| `clients.json`   | client logos grouped by region                                       | Region (list) with Client logos |
| `story.json`     | the three scattered jobs and what they become                        | Story section with Job items    |
| `teams.json`     | the three team stories, their photo and which demo screen each uses  | Team (list)                     |
| `modules.json`   | the five live modules, features, products, screenshots, links        | Module (list)                   |
| `strengths.json` | stats, strength cards, awards and partners                           | Strengths section               |
| `news.json`      | the latest press releases                                            | Press release (list)            |
| `demo.json`      | demo data for the product screens                                    | Demo data                       |

Moving to Sanity, Contentful or Webflow CMS means creating these models from the schemas and swapping the JSON imports for a fetch at build time. No component has to change.

## Design tokens

Measured from disrupt-x.io and kept in `src/styles/tokens.css`.

| Token              | Value                    | Use                                            |
| ------------------ | ------------------------ | ---------------------------------------------- |
| `--c-bg`           | `#0b0b0b`                | page background                                |
| `--c-surface`      | `rgba(137,137,137,0.05)` | cards, as on the live site                     |
| `--c-mint`         | `#00ffce`                | links, accents, glows                          |
| `--c-purple`       | `#9e69ff`                | end of the brand gradient                      |
| `--gradient-brand` | mint to purple           | second line of every title                     |
| `--c-teal`         | `#19a993`                | brand button colour                            |
| `--c-teal-deep`    | `#0e806e`                | button fill used on this page (see trade offs) |
| `--c-text-muted`   | `#9da4b0`                | body copy                                      |
| `--c-band`         | `#1a1d21`                | the slate band behind the client logos         |
| `--font-sans`      | Poppins                  | all text                                       |

Spacing, radii, type scale and motion timings live in the same file.

## Accessibility

- One `h1`, landmarks, a skip link and visible mint focus rings.
- Tabs follow the WAI-ARIA pattern. Demo screens use real buttons and `aria-live` updates.
- Decorative mockups and the skyline are hidden from screen readers. The energy chart has a table version for them.
- Colour contrast passes WCAG AA everywhere, including while sections scroll in (Lighthouse accessibility 100).
- Buttons, tabs and menu links are at least 44px tall. Text links meet the 24px minimum of WCAG 2.2 AA.
- The moving logo strip stops on hover and keyboard focus, and becomes a still grid with reduced motion. There is no pause button on touch screens, a deliberate design choice that falls short of WCAG 2.2.2.
- The page works without JavaScript and with reduced motion. Both are covered by the smoke tests.

## Performance

Lighthouse 12 on the production build, served with compression. The full reports are in `docs/lighthouse`, and Lighthouse CI checks the same budgets on every push.

|         | Performance | Accessibility | Best practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Mobile  | 95 to 96    | 100           | 100            | 100 |
| Desktop | 100         | 100           | 100            | 100 |

Mobile: total blocking time 80 to 120ms, CLS 0. Desktop: LCP 0.6s, total blocking time 0ms, CLS 0.

What keeps it fast:

- The page is prerendered and the CSS is inlined, so text paints before any JavaScript runs.
- Fonts are self hosted with a size matched fallback, so nothing jumps when Poppins loads.
- Only `transform`, `opacity` and `clip-path` animate. Pulses use a scaled pseudo element instead of `box-shadow`.
- Images have fixed dimensions, come as WebP in two sizes with `srcset`, and load lazily below the fold. SVGs are optimised with SVGO.

## Security and hosting

`vercel.json` sets a strict Content Security Policy (scripts only from the site itself, plus the hash of the one inline script), `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` and HSTS, and caches hashed assets and fonts for a year. `scripts/prerender.js` fails the build if the inline script changes without its hash being updated in the policy. The page has no forms and stores nothing about visitors.

`npm audit --omit=dev` finds no vulnerabilities in the code that ships. `npm audit` reports advisories in `picomatch` inside the Vite build tooling, which only runs on the build machine; the only fix it offers is downgrading Vite to version 6.

## Testing

Automated, on every push (`.github/workflows/ci.yml`):

- ESLint and Prettier
- the content check
- the production build
- 18 Playwright smoke tests on a phone (Pixel 7) and a desktop (1440 wide): no errors, no sideways scrolling, every demo reaching its end state with a steady height, keyboard tabs, menu links landing on finished titles, the mobile menu, the logo strip, reduced motion and JavaScript turned off
- Lighthouse CI budgets on mobile

Checked by hand in Chrome:

- every width from 320 to 1920
- a scroll through the whole page on a phone and on a desktop
- a simulated mid-range phone with a slow network
- the production Content Security Policy with no violations

Still to check before sending:

- Safari and Firefox on desktop
- Real devices: open the live link on an iPhone (Safari) and an Android phone (Chrome), scroll the whole page and tap through each demo

## Decisions and trade offs

- **Client logos in white.** The logos are drawn in their own colours for white backgrounds, and many are dark. On the dark page they are shown as one white mark each on a slate band, so all 26 are equally clear.
- **Button colour.** White text on the brand teal `#19a993` is only 2.9:1, which fails WCAG AA. Buttons use a deeper teal `#0e806e` (4.9:1) with a mint glow on hover, so they still read as Disrupt-X.
- **Coded screens and real screenshots.** The three team demos are coded so they can be interactive and sharp at any size. The module explorer uses real product screenshots from disrupt-x.io.
- **Demo data.** Numbers inside the product screens are sample data for one fictional group of four schools, and they add up across the page.
- **Different motion for touch screens.** Phones and tablets get the same animations without pins and over shorter ranges, because pinned scenes fight the mobile address bar and long scrubs feel laggy under a finger.
- **Prerender instead of a framework.** A short script gives static HTML without bringing in Next.js or Astro.
- **Assets.** Logos, photos and product images belong to Disrupt-X and its clients and partners and are used here only for this exercise. Outline social icons are from Tabler Icons (MIT), all other icons from Lucide (ISC).
