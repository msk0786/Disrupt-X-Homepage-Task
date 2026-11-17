import site from './site.json'
import clients from './clients.json'
import story from './story.json'
import teams from './teams.json'
import modules from './modules.json'
import strengths from './strengths.json'
import news from './news.json'
import demo from './demo.json'

/*
  Every piece of copy on the page lives in these JSON collections.
  Components never hardcode text, so this folder maps one to one onto
  a headless CMS later (see README, "Content model").

  The collections are checked against JSON Schemas in ./schema before every
  build (scripts/validate-content.js), so a missing or mistyped field stops
  the build instead of showing up as a blank space on the page.
*/
export const content = { site, clients, story, teams, modules, strengths, news, demo }
