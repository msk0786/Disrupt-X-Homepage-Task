import { media } from './gsap.js'

/*
  Builds the scroll animations after the first paint, a little at a time and in the
  order they were queued (top of the page first). On a mid-range phone this turns one
  long blocking task during hydration into several short ones, so the page can paint
  and respond to taps while the motion is still being set up.

  Desktops build straight away instead. They are fast enough not to need it, and they
  are the only screens with pinned scenes: pins add scroll space, so building them
  later would shift the page under someone who had already scrolled or reloaded
  half way down.
*/
const queue = []
const settled = []
let scheduled = false

// keep each slice of work short enough that the browser can paint between slices
const BUDGET_MS = 8

function run() {
  const start = performance.now()
  while (queue.length && performance.now() - start < BUDGET_MS) {
    const task = queue.shift()
    try {
      task()
    } catch (error) {
      // one broken scene must never stop the rest of the page from animating
      console.error(error)
    }
  }

  if (queue.length) {
    setTimeout(run, 0)
    return
  }

  scheduled = false
  settled.splice(0).forEach((callback) => callback())
}

/** Queues `task` to run after the next paint (or runs it now on desktop). Returns a function that cancels it. */
export function afterPaint(task) {
  if (window.matchMedia(media.desktop).matches) {
    task()
    return () => {}
  }

  queue.push(task)
  if (!scheduled) {
    scheduled = true
    // the frame callback runs just before a paint, the timeout just after it
    requestAnimationFrame(() => setTimeout(run, 0))
  }
  return () => {
    const index = queue.indexOf(task)
    if (index > -1) queue.splice(index, 1)
  }
}

/** Calls `callback` once everything queued so far has run. */
export function whenSettled(callback) {
  if (!scheduled && queue.length === 0) callback()
  else settled.push(callback)
}
