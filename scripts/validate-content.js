// Checks every content collection before a build, so a missing field, a mistyped key,
// a broken image path or numbers that no longer add up stop the build with a clear
// message instead of reaching the live page.
//
//   npm run validate
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv from 'ajv'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = path.join(root, 'src', 'content')
const schemaDir = path.join(contentDir, 'schema')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))

const collections = ['site', 'clients', 'story', 'teams', 'modules', 'strengths', 'news', 'demo']
const content = Object.fromEntries(collections.map((name) => [name, read(path.join(contentDir, `${name}.json`))]))
const problems = []

// 1. Shape: each collection against its JSON Schema
const ajv = new Ajv({ allErrors: true })
ajv.addSchema(read(path.join(schemaDir, 'shared.schema.json')))
for (const name of collections) {
  const validate = ajv.compile(read(path.join(schemaDir, `${name}.schema.json`)))
  if (!validate(content[name])) {
    validate.errors.forEach((error) => {
      const extra = error.params?.additionalProperty ? ` "${error.params.additionalProperty}"` : ''
      problems.push(`${name}.json${error.instancePath || ''}: ${error.message}${extra}`)
    })
  }
}

// 2. Every image and font the content points at exists in public/
function walk(value, where, visit) {
  if (typeof value === 'string') visit(value, where)
  else if (Array.isArray(value)) value.forEach((item, i) => walk(item, `${where}[${i}]`, visit))
  else if (value && typeof value === 'object')
    Object.entries(value).forEach(([key, item]) => walk(item, `${where}.${key}`, visit))
}
for (const name of collections) {
  walk(content[name], name, (value, where) => {
    if (/^\/(images|fonts)\//.test(value) && !fs.existsSync(path.join(root, 'public', value))) {
      problems.push(`${where}: ${value} does not exist in public/`)
    }
  })
}

// 3. Icon names in the schema match the ones Icon.jsx can draw
const iconSource = fs.readFileSync(path.join(root, 'src', 'components', 'ui', 'Icon.jsx'), 'utf8')
const iconNames = new Set([...iconSource.matchAll(/^\s{2}(\w+): \w+,$/gm)].map((match) => match[1]))
const schemaIcons = read(path.join(schemaDir, 'shared.schema.json')).definitions.icon.enum
schemaIcons.filter((icon) => !iconNames.has(icon)).forEach((icon) => problems.push(`icon "${icon}" is not in Icon.jsx`))

// 4. The brief: only the five live modules, each once
const liveModules = ['hseq', 'cafm', 'ibms', 'connected', 'mobility']
const moduleIds = content.modules.items.map((item) => item.id)
if (moduleIds.length !== liveModules.length || !liveModules.every((id) => moduleIds.includes(id))) {
  problems.push(
    `modules.json must list exactly the five live modules (${liveModules.join(', ')}), found ${moduleIds.join(', ')}`,
  )
}

// 5. One source of truth: the hero portfolio adds up from the schools in the dashboard
const { portfolio, sites, workOrder } = content.demo
const sum = (list) => list.reduce((total, n) => total + n, 0)
const round1 = (n) => Math.round(n * 10) / 10
const [jobs, alerts, energy, compliance] = portfolio.kpis
const expect = (label, actual, wanted) => {
  if (actual !== wanted) problems.push(`demo.json: ${label} is ${actual}, but the schools add up to ${wanted}`)
}
expect('portfolio open work orders', jobs.value, sum(sites.map((site) => site.openJobs)))
expect('portfolio active alerts', alerts.value, sum(sites.map((site) => site.alerts)))
expect('portfolio energy this week', energy.value, round1(sum(sites.flatMap((site) => site.energy))))
expect('the last energy bar', portfolio.energy.at(-1), energy.value)
expect('portfolio compliance', compliance.value, Math.round(sum(sites.map((site) => site.compliance)) / sites.length))
expect(
  'alerts in "Sites needing attention"',
  sum(portfolio.attention.map((site) => Number.parseInt(site.status, 10) || 0)),
  alerts.value,
)
expect('the number of schools in the portfolio scope', Number.parseInt(portfolio.scope, 10), sites.length)

// the CAFM chip quotes the time the work order demo finishes on
const cafmChip = content.modules.items.find((item) => item.id === 'cafm')?.chip.value ?? ''
if (!cafmChip.includes(`${workOrder.minutes.done} min`)) {
  problems.push(`modules.json: the CAFM chip "${cafmChip}" should match the work order's ${workOrder.minutes.done} min`)
}

if (problems.length) {
  console.error(`Content check failed (${problems.length}):\n${problems.map((p) => `  - ${p}`).join('\n')}`)
  process.exit(1)
}
console.log(`Content check passed: ${collections.length} collections, every asset found, numbers add up.`)
