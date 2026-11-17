/*
  One shared IntersectionObserver per trigger line, for things that only need to
  happen once when they come into view (a reveal, a count up). This replaces a
  ScrollTrigger per element, so the page measures far less while it scrolls.
*/
const observers = new Map()

function observerFor(rootMargin) {
  if (observers.has(rootMargin)) return observers.get(rootMargin)

  const callbacks = new Map()
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // fire when it enters, or straight away if the page was already scrolled past it
        if (!entry.isIntersecting && entry.boundingClientRect.bottom >= 0) return
        const callback = callbacks.get(entry.target)
        callbacks.delete(entry.target)
        observer.unobserve(entry.target)
        callback?.(entry.isIntersecting)
      })
    },
    { rootMargin },
  )

  const entry = { observer, callbacks }
  observers.set(rootMargin, entry)
  return entry
}

/**
 * Calls `callback(entered)` once, the first time `el` crosses the trigger line.
 * `entered` is false when the element was already above the screen.
 * `rootMargin` '0px 0px -12% 0px' is the same as a ScrollTrigger start of 'top 88%'.
 * Returns a function that stops watching.
 */
export function onceVisible(el, callback, rootMargin = '0px 0px -12% 0px') {
  if (!el) return () => {}
  if (typeof IntersectionObserver === 'undefined') {
    callback(true)
    return () => {}
  }

  const { observer, callbacks } = observerFor(rootMargin)
  callbacks.set(el, callback)
  observer.observe(el)

  return () => {
    callbacks.delete(el)
    observer.unobserve(el)
  }
}

export function isOnScreen(el) {
  const box = el.getBoundingClientRect()
  return box.top < window.innerHeight && box.bottom > 0
}
