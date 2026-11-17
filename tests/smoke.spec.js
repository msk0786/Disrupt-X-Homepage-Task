import { test, expect } from '@playwright/test'

/*
  Smoke tests for the production build, on a phone (Pixel 7) and a desktop (1440 x 900).
  They check what a visitor would notice first: errors, sideways scrolling, each demo
  reaching its end state, menu links, the logo strip, and that nothing stays hidden
  for people who turn motion or JavaScript off.
*/

const isPhone = (testInfo) => testInfo.project.name === 'phone'

async function bringIntoView(page, selector) {
  await page.evaluate(
    (s) => document.querySelector(s).scrollIntoView({ block: 'center', behavior: 'instant' }),
    selector,
  )
  // the scroll scenes settle within their smoothing time
  await page.waitForTimeout(900)
}

function watchErrors(page) {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  return errors
}

test('loads without errors and never scrolls sideways', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/')
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('h1')).toContainText('Fewer breakdowns')

  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((top) => window.scrollTo(0, top), y)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, `sideways overflow at ${y}px`).toBeLessThanOrEqual(0)
  }
  expect(errors).toEqual([])
})

test('work order closes with a realistic time and keeps its height', async ({ page }) => {
  await page.goto('/')
  await bringIntoView(page, '[aria-label="WO 1042 demo"]')
  const phone = page.getByRole('group', { name: 'WO 1042 demo' })
  await expect(phone).toBeVisible()

  // layout height, so the screen's own scroll entrance (a transform) does not count
  const height = () => phone.evaluate((el) => el.offsetHeight)
  const start = await height()
  for (const name of ['Start job', 'Add photo', 'Complete job']) {
    await phone.getByRole('button', { name }).click()
    expect(await height()).toBe(start)
  }
  await expect(phone).toContainText('Job closed in 14 min')

  await phone.getByRole('button', { name: 'Run it again' }).click()
  await expect(phone.getByRole('button', { name: 'Start job' })).toBeVisible()
})

test('incident turns into a closed corrective action', async ({ page }) => {
  await page.goto('/')
  await bringIntoView(page, '[aria-label="INC 2291 demo"]')
  const flow = page.getByRole('group', { name: 'INC 2291 demo' })
  await expect(flow).toBeVisible()

  await expect(flow).toContainText('No corrective action yet')
  for (const name of [/Start investigation/, /Assign corrective action/, /Verify and close/]) {
    await flow.getByRole('button', { name }).click()
  }
  for (const text of ['Closed', 'Audit ready', 'CA 108', 'retest_FD12.jpg attached', 'Verified by Sara M.']) {
    await expect(flow).toContainText(text)
  }
})

test('dashboard shows energy cost against budget for every school', async ({ page }) => {
  await page.goto('/')
  await bringIntoView(page, '[aria-label="Choose a site"]')
  const dashboard = page.getByRole('group', { name: 'Choose a site' })
  await expect(dashboard).toBeVisible()

  const expected = {
    'All sites': ['AED 53.2k', '2% under budget'],
    'Lakeside School': ['AED 18.8k', '7% over budget'],
    'Northgate College': ['AED 10.9k', '8% under budget'],
  }
  for (const [site, values] of Object.entries(expected)) {
    await dashboard.getByRole('button', { name: site }).click()
    for (const value of values) await expect(dashboard).toContainText(value)
  }
})

test('module tabs work by keyboard and the skyline follows', async ({ page }, testInfo) => {
  await page.goto('/')
  await bringIntoView(page, '#modules [role="tablist"]')
  const tabs = page.getByRole('tablist', { name: 'ALEF 360° modules' })
  await expect(tabs).toBeVisible()

  await tabs.getByRole('tab', { name: 'HSEQ' }).click()
  await page.keyboard.press('ArrowRight')
  await expect(tabs.getByRole('tab', { name: 'CAFM | CMMS' })).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('End')
  await expect(tabs.getByRole('tab', { name: 'Mobility' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('#modules').getByRole('tabpanel')).toContainText('TechNex')

  if (!isPhone(testInfo)) {
    // a node on the skyline is a mouse shortcut to the same choice
    await page.locator('[data-explorer] [aria-hidden="true"] button', { hasText: 'iBMS' }).click()
    await expect(tabs.getByRole('tab', { name: 'iBMS' })).toHaveAttribute('aria-selected', 'true')
  }
})

test('menu links land on finished chapter titles', async ({ page }, testInfo) => {
  test.skip(isPhone(testInfo), 'desktop menu')
  await page.goto('/')
  for (const [label, id] of [
    ['Teams', 'teams-title'],
    ['Modules', 'modules-title'],
    ['Why ALEF 360°', 'why-title'],
  ]) {
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: label }).click()
    await expect
      .poll(() =>
        page.evaluate(
          (titleId) =>
            [...document.getElementById(titleId).querySelectorAll('[data-word]')].every(
              (word) => Math.abs(new DOMMatrix(getComputedStyle(word).transform).m42) < 1,
            ),
          id,
        ),
      )
      .toBe(true)
  }
})

test('mobile menu locks the page and jumps to a section', async ({ page }, testInfo) => {
  test.skip(!isPhone(testInfo), 'phone menu')
  await page.goto('/')
  await expect(page.getByRole('banner').getByRole('link', { name: 'Book a demo' })).toBeVisible()

  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect.poll(() => page.evaluate(() => document.body.style.position)).toBe('fixed')

  await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Modules' }).click()
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
  await expect.poll(() => page.evaluate(() => document.body.style.position)).toBe('')
  await expect
    .poll(() => page.evaluate(() => Math.round(document.getElementById('modules').getBoundingClientRect().top)))
    .toBeLessThan(120)
})

test('logo strip switches to APAC and stops under the mouse', async ({ page }, testInfo) => {
  await page.goto('/')
  await bringIntoView(page, '#clients')
  const strip = page.locator('#clients [role="tabpanel"]:not([hidden])')
  await expect(strip.locator('img[alt="Taaleem"]')).toHaveCount(1)

  await page.getByRole('tab', { name: 'APAC' }).click()
  await expect(strip.locator('img[alt="UEM Edgenta"]')).toHaveCount(1)
  await expect(strip.locator('img[alt="Taaleem"]')).toHaveCount(0)

  if (!isPhone(testInfo)) {
    await strip.hover()
    await expect
      .poll(() => strip.locator('ul').evaluate((list) => getComputedStyle(list).animationPlayState))
      .toBe('paused')
  }
})

test('reduced motion shows every section straight away', async ({ browser }, testInfo) => {
  const context = await browser.newContext({
    ...testInfo.project.use,
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto('/')
  await page.waitForTimeout(500)
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('[data-reveal], [data-word], [data-team-copy], [data-team-screen], [data-card]')]
      .filter((el) => {
        const style = getComputedStyle(el)
        return style.visibility === 'hidden' || Number(style.opacity) < 1
      })
      .map((el) => el.outerHTML.slice(0, 80)),
  )
  expect(hidden).toEqual([])
  await context.close()
})

test('without JavaScript the content is still there', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ ...testInfo.project.use, javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('#team-facility')).toBeVisible()
  const hiddenWords = await page.evaluate(
    () =>
      [...document.querySelectorAll('[data-word]')].filter(
        (word) => new DOMMatrix(getComputedStyle(word).transform).m42 !== 0,
      ).length,
  )
  expect(hiddenWords).toBe(0)
  await context.close()
})
