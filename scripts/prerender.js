// Renders the app to static HTML after the client build, so the first paint
// does not wait for JavaScript. React then hydrates on top of it.
// The stylesheet is small (about 10 KB gzipped), so it is inlined to save a
// render blocking request on slow mobile connections.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const templatePath = path.join(dist, 'index.html')
const serverEntry = path.join(root, '.ssr', 'entry-server.js')

const { render } = await import(pathToFileURL(serverEntry).href)
let html = fs.readFileSync(templatePath, 'utf8').replace('<!--app-->', render())

html = html.replace(/<link rel="stylesheet" crossorigin href="\/(assets\/[^"]+\.css)">/, (_, file) => {
  const css = fs.readFileSync(path.join(dist, file), 'utf8')
  return `<style>${css}</style>`
})

fs.writeFileSync(templatePath, html)
fs.rmSync(path.join(root, '.ssr'), { recursive: true, force: true })

console.log('Prerendered dist/index.html')
