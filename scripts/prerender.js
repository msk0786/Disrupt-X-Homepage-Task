// Renders the app to static HTML after the client build, so the first paint
// does not wait for JavaScript. React then hydrates on top of it.
// The stylesheet is small (about 14 KB gzipped), so it is inlined to save a
// render blocking request on slow mobile connections.
import crypto from 'node:crypto'
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

/*
  The Content Security Policy in vercel.json only lets inline scripts run when their
  hash is listed. If an inline script in index.html changes, the build stops here
  with the new hash, instead of the live site silently losing the script.
*/
const policy = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'))
  .headers.flatMap((rule) => rule.headers)
  .find((header) => header.key === 'Content-Security-Policy').value

const inlineScripts = [
  ...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g),
]
for (const [, body] of inlineScripts) {
  const hash = `'sha256-${crypto.createHash('sha256').update(body).digest('base64')}'`
  if (!policy.includes(hash)) {
    throw new Error(`An inline script is not allowed by the CSP in vercel.json. Add ${hash} to script-src.`)
  }
}

fs.writeFileSync(templatePath, html)
fs.rmSync(path.join(root, '.ssr'), { recursive: true, force: true })

console.log(`Prerendered dist/index.html (${inlineScripts.length} inline script allowed by the CSP)`)
