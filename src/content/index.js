import site from './site.json'
import clients from './clients.json'
import story from './story.json'
import teams from './teams.json'
import modules from './modules.json'
import strengths from './strengths.json'
import demo from './demo.json'

/*
  Every piece of copy on the page lives in these JSON collections.
  Components never hardcode text, so this folder maps one to one onto
  a headless CMS later (see README, "Content model").
*/
export const content = { site, clients, story, teams, modules, strengths, demo }

// Required fields per collection, and per item inside `items`.
const schema = {
  site: { fields: ['brand', 'nav', 'demo', 'hero', 'finalCta', 'footer'] },
  story: { fields: ['title', 'items'], item: ['id', 'source', 'title', 'result'] },
  teams: { fields: ['title', 'items'], item: ['id', 'audience', 'title', 'points', 'screen'] },
  modules: { fields: ['title', 'items'], item: ['id', 'name', 'outcome', 'features', 'image', 'href'] },
  strengths: { fields: ['title', 'stats', 'cards'] },
}

// A light check while developing, so a missing field shows up in the console
// instead of as a blank space on the page.
if (import.meta.env.DEV) {
  for (const [name, rules] of Object.entries(schema)) {
    const entry = content[name]
    rules.fields.forEach((field) => {
      if (entry[field] == null) console.warn(`[content] ${name} is missing "${field}"`)
    })
    entry.items?.forEach((item, i) => {
      rules.item?.forEach((field) => {
        if (item[field] == null) console.warn(`[content] ${name}.items[${i}] is missing "${field}"`)
      })
    })
  }
}
