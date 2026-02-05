import 'react'

declare module 'react' {
  // augment the existing CSSProperties interface to support CSS variables in inline styles
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}
