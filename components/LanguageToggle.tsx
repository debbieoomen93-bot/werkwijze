'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div
      className="flex items-center gap-1 rounded-full p-1"
      style={{ background: 'var(--line)' }}
    >
      <button
        onClick={() => setLang('nl')}
        className="text-sm font-semibold px-3 py-1.5 rounded-full transition-all min-h-[36px]"
        style={{
          background: lang === 'nl' ? 'var(--card)' : 'transparent',
          color: lang === 'nl' ? 'var(--ink)' : 'var(--muted)',
          boxShadow: lang === 'nl' ? '0 1px 4px rgba(30,26,46,0.12)' : 'none',
        }}
        aria-label="Nederlands"
      >
        NL
      </button>
      <button
        onClick={() => setLang('en')}
        className="text-sm font-semibold px-3 py-1.5 rounded-full transition-all min-h-[36px]"
        style={{
          background: lang === 'en' ? 'var(--card)' : 'transparent',
          color: lang === 'en' ? 'var(--ink)' : 'var(--muted)',
          boxShadow: lang === 'en' ? '0 1px 4px rgba(30,26,46,0.12)' : 'none',
        }}
        aria-label="English"
      >
        EN
      </button>
    </div>
  )
}
