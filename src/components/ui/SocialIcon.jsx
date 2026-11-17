/*
  Outline brand marks for the social links, drawn on the same 24px grid and stroke
  as the Lucide icons used everywhere else. Paths from Tabler Icons (MIT licence).
*/
const paths = {
  linkedin: ['M8 11v5', 'M8 8v.01', 'M12 16v-5', 'M16 16v-3a2 2 0 1 0 -4 0', 'M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10'],
  x: ['M4 4l11.733 16h4.267l-11.733 -16l-4.267 0', 'M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772'],
  instagram: [
    'M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10',
    'M8.5 12a3.5 3.5 0 1 0 7 0a3.5 3.5 0 0 0 -7 0',
    'M17 7v.01',
  ],
  facebook: ['M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3'],
  tiktok: ['M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917'],
  youtube: ['M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8', 'M10 9l5 3l-5 3l0 -6'],
}

// Decorative: the link around it carries the network's name
export default function SocialIcon({ name, size = 20 }) {
  const d = paths[name]
  if (!d) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {d.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  )
}
