import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-bricolage)', 'sans-serif'],
        body: ['var(--font-mulish)', 'sans-serif'],
      },
      colors: {
        bg: 'var(--bg)',
        card: 'var(--card)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        rose: {
          DEFAULT: 'var(--rose)',
          light: 'var(--rose-light)',
          pale: 'var(--rose-pale)',
        },
        sage: {
          DEFAULT: 'var(--sage)',
          light: 'var(--sage-light)',
          pale: 'var(--sage-pale)',
        },
        peach: {
          DEFAULT: 'var(--peach)',
          light: 'var(--peach-light)',
          pale: 'var(--peach-pale)',
        },
        sky: {
          DEFAULT: 'var(--sky)',
          light: 'var(--sky-light)',
        },
        yellow: {
          DEFAULT: 'var(--yellow)',
          pale: 'var(--yellow-pale)',
        },
      },
    },
  },
  plugins: [],
}
export default config
