import { Fragment } from 'react'
import styles from './SplitWords.module.css'

/**
 * Wraps each word in a mask so it can rise into view (see data-words in useReveal).
 * Split at render time instead of in the browser, so the prerendered HTML and the
 * hydrated page match and screen readers still read one normal sentence.
 */
export default function SplitWords({ text }) {
  const words = text.split(' ')

  return words.map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span className={styles.mask}>
        <span className={styles.word} data-word>
          {word}
        </span>
      </span>
      {i < words.length - 1 && ' '}
    </Fragment>
  ))
}

// A whole line that rises as one piece, used for the gradient line of a title
export function SplitLine({ children }) {
  return (
    <span className={`${styles.mask} ${styles.line}`}>
      <span className={styles.word} data-word>
        {children}
      </span>
    </span>
  )
}
