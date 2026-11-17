// Renders the app to static HTML after the client build, so the first paint
// does not wait for JavaScript. React then hydrates on top of it.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const templatePath = path.join(root, 'dist', 'index.html')
const serverEntry = path.join(root, '.ssr', 'entry-server.js')

const { render } = await import(pathToFileURL(serverEntry).href)
const template = fs.readFileSync(templatePath, 'utf8')

fs.writeFileSync(templatePath, template.replace('<!--app-->', render()))
fs.rmSync(path.join(root, '.ssr'), { recursive: true, force: true })

console.log('Prerendered dist/index.html')
