/**
 * Writes the pointer position inside an element to --x and --y, so CSS can
 * draw a spotlight that follows the cursor. No React state, so moving the
 * mouse never re-renders anything.
 *
 * <div onPointerMove={trackPointer}>
 */
export function trackPointer(event) {
  if (event.pointerType !== 'mouse') return
  const el = event.currentTarget
  const box = el.getBoundingClientRect()
  el.style.setProperty('--x', `${event.clientX - box.left}px`)
  el.style.setProperty('--y', `${event.clientY - box.top}px`)
}
