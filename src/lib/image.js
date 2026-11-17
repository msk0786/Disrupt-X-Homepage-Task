// Turns [{ src, width }] from the content files into a srcset string
export function srcSetOf(sources) {
  return sources?.map((source) => `${source.src} ${source.width}w`).join(', ')
}

/*
  Sizes a logo by its shape, so a square mark and a long wordmark look equally heavy.
  `area` is the target size of a square logo in px. Very wide logos stop at `maxWidth`.
*/
export function logoSize(logo, { area = 46, maxWidth = 168 } = {}) {
  const ratio = logo.width / logo.height
  const width = Math.min(Math.round(area * Math.sqrt(ratio)), maxWidth)
  return { width, height: Math.round(width / ratio) }
}
