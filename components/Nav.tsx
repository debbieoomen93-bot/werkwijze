'use client'

import Link from 'next/link'
import LanguageToggle from './LanguageToggle'

export default function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 h-16"
      style={{
        background: 'rgba(240,235,248,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1.5px solid var(--line)',
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <span
          className="text-lg sm:text-xl font-heading font-bold"
          style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
        >
          WerkWijzer
        </span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'var(--rose)', color: '#fff', fontSize: '10px' }}
        >
          Beta
        </span>
      </Link>
      <LanguageToggle />
    </nav>
  )
}
