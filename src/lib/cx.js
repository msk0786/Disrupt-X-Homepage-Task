// Joins class names and skips anything falsy: cx('a', on && 'b')
export function cx(...names) {
  return names.filter(Boolean).join(' ')
}
